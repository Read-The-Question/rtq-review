import fs from 'node:fs/promises';

import { readPaperDocument } from '@/lib/paper-data';
import { isReadOnlyFolder, resolvePaperFilePath } from '@/lib/paper-paths';
import type { FolderKey, PaperDocument } from '@/lib/paper-types';
import {
  getTagCatalog,
  sortPersistedTags,
  validateExplicitTags,
} from '@/lib/tag-taxonomy';

type NodeLineRef = {
  inheritLineIndex: number | null;
  tagsLineIndex: number | null;
};

const writeQueues = new Map<string, Promise<PaperDocument>>();

function splitEditableLines(raw: string) {
  const lineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
  const hasTrailingNewline = raw.endsWith(lineEnding);
  const content = hasTrailingNewline
    ? raw.slice(0, raw.length - lineEnding.length)
    : raw;

  return {
    hasTrailingNewline,
    lineEnding,
    lines: content.length > 0 ? content.split(/\r?\n/) : [''],
  };
}

function scanNodeLineRefs(raw: string) {
  const refs = new Map<string, NodeLineRef>();
  const { lines } = splitEditableLines(raw);
  let sectionIndex = -1;
  let questionIndex = -1;
  let subquestionIndex = -1;
  let subsubquestionIndex = -1;
  let subquestionCounters = new Map<number, number>();
  let subsubquestionCounters = new Map<string, number>();
  let currentPath: string | null = null;

  const pathFor = (
    nextSectionIndex: number,
    nextQuestionIndex: number,
    nextSubquestionIndex: number | null = null,
    nextSubsubquestionIndex: number | null = null,
  ) => {
    const parts = [`s${nextSectionIndex}`, `q${nextQuestionIndex}`];

    if (nextSubquestionIndex !== null) {
      parts.push(`sq${nextSubquestionIndex}`);
    }

    if (nextSubsubquestionIndex !== null) {
      parts.push(`ssq${nextSubsubquestionIndex}`);
    }

    return parts.join('.');
  };

  for (const [lineIndex, line] of lines.entries()) {
    if (/^\[\[sections\]\]\s*$/.test(line)) {
      sectionIndex += 1;
      questionIndex = -1;
      subquestionIndex = -1;
      subsubquestionIndex = -1;
      subquestionCounters = new Map<number, number>();
      subsubquestionCounters = new Map<string, number>();
      currentPath = null;
      continue;
    }

    if (/^\[\[sections\.questions\]\]\s*$/.test(line)) {
      questionIndex += 1;
      subquestionIndex = -1;
      subsubquestionIndex = -1;
      currentPath = pathFor(sectionIndex, questionIndex);
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (/^\[\[sections\.questions\.subquestions\]\]\s*$/.test(line)) {
      const nextSubquestionIndex = subquestionCounters.get(questionIndex) ?? 0;
      subquestionCounters.set(questionIndex, nextSubquestionIndex + 1);
      subquestionIndex = nextSubquestionIndex;
      subsubquestionIndex = -1;
      currentPath = pathFor(sectionIndex, questionIndex, subquestionIndex);
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (
      /^\[\[sections\.questions\.subquestions\.subquestions\]\]\s*$/.test(line)
    ) {
      const key = `${questionIndex}:${subquestionIndex}`;
      const nextSubsubquestionIndex = subsubquestionCounters.get(key) ?? 0;
      subsubquestionCounters.set(key, nextSubsubquestionIndex + 1);
      subsubquestionIndex = nextSubsubquestionIndex;
      currentPath = pathFor(
        sectionIndex,
        questionIndex,
        subquestionIndex,
        subsubquestionIndex,
      );
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (!currentPath) {
      continue;
    }

    const currentRef = refs.get(currentPath);

    if (!currentRef) {
      continue;
    }

    if (/^rtq-tags\s*=/.test(line)) {
      currentRef.tagsLineIndex = lineIndex;
    } else if (/^rtq-inherit-tags\s*=/.test(line)) {
      currentRef.inheritLineIndex = lineIndex;
    }
  }

  return { lines, refs };
}

function formatTagLine(tags: string[]) {
  return `rtq-tags = [${tags.map(tag => JSON.stringify(tag)).join(', ')}]`;
}

function formatInheritLine(value: boolean) {
  return `rtq-inherit-tags = ${value ? 'true' : 'false'}`;
}

function preserveTrailingNewline(raw: string, lines: string[]) {
  const { hasTrailingNewline, lineEnding } = splitEditableLines(raw);
  const normalized = lines.join(lineEnding);
  return hasTrailingNewline ? `${normalized}${lineEnding}` : normalized;
}

function enqueueFileWrite(fileKey: string, task: () => Promise<PaperDocument>) {
  const previous =
    writeQueues.get(fileKey) ??
    Promise.resolve(undefined as unknown as PaperDocument);
  const next = previous
    .catch(() => undefined as unknown as PaperDocument)
    .then(task);
  writeQueues.set(fileKey, next);

  return next.finally(() => {
    if (writeQueues.get(fileKey) === next) {
      writeQueues.delete(fileKey);
    }
  });
}

export async function persistNodeMutation(input: {
  explicitInherit: boolean | null;
  explicitTags: string[];
  folderKey: FolderKey;
  nodePath: string;
  relativePath: string;
  versionHash: string;
}) {
  if (isReadOnlyFolder(input.folderKey)) {
    throw new Error('This TOML folder is read-only.');
  }

  const absolutePath = resolvePaperFilePath(
    input.folderKey,
    input.relativePath,
  );

  return enqueueFileWrite(absolutePath, async () => {
    const raw = await fs.readFile(absolutePath, 'utf8');
    const currentDocument = await readPaperDocument(
      input.folderKey,
      input.relativePath,
    );

    if (currentDocument.versionHash !== input.versionHash) {
      throw new Error(
        'The file changed outside the editor. Reload to continue.',
      );
    }

    const currentNode = currentDocument.nodesFlat.find(
      node => node.path === input.nodePath,
    );

    if (!currentNode) {
      throw new Error(`Could not find node ${input.nodePath}.`);
    }

    const allowedLegacyTags = currentNode.explicitTags.filter(
      tag => !tag.includes('.'),
    );
    const validatedTags = validateExplicitTags(
      sortPersistedTags(input.explicitTags),
      allowedLegacyTags,
      await getTagCatalog(),
    );

    const { lines, refs } = scanNodeLineRefs(raw);
    const targetRef = refs.get(input.nodePath);

    if (!targetRef?.tagsLineIndex && targetRef?.tagsLineIndex !== 0) {
      throw new Error(`Could not locate rtq-tags for ${input.nodePath}.`);
    }

    lines[targetRef.tagsLineIndex] = formatTagLine(validatedTags);

    if (input.explicitInherit !== null) {
      if (targetRef.inheritLineIndex === null) {
        lines.splice(
          targetRef.tagsLineIndex + 1,
          0,
          formatInheritLine(input.explicitInherit),
        );
      } else {
        lines[targetRef.inheritLineIndex] = formatInheritLine(
          input.explicitInherit,
        );
      }
    }

    await fs.writeFile(
      absolutePath,
      preserveTrailingNewline(raw, lines),
      'utf8',
    );
    return readPaperDocument(input.folderKey, input.relativePath);
  });
}
