import fs from 'node:fs/promises';

import { readPaperDocument } from '@/lib/paper-data';
import { isReadOnlyFolder, resolvePaperFilePath } from '@/lib/paper-paths';
import type { FolderKey, PaperDocument } from '@/lib/paper-types';
import { applyTagMutationToRaw } from '@/lib/paper-write-lines';
import {
  getTagCatalog,
  sortPersistedTags,
  validateExplicitTags,
} from '@/lib/tag-taxonomy';

const writeQueues = new Map<string, Promise<PaperDocument>>();

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

    const updatedRaw = applyTagMutationToRaw({
      explicitInherit: input.explicitInherit,
      explicitTags: validatedTags,
      nodePath: input.nodePath,
      raw,
    });

    await fs.writeFile(absolutePath, updatedRaw, 'utf8');
    return readPaperDocument(input.folderKey, input.relativePath);
  });
}
