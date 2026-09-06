import { parse } from '@iarna/toml';

import { isExemplarPaperCollectionId } from './collections.ts';
import type { PaperCollectionId } from './model.ts';

export type ParsedPaper = Readonly<{
  meta: Record<string, unknown>;
  sections: Array<Record<string, unknown>>;
}>;

type LooseNodeRecord = Record<string, unknown> & {
  answers?: Record<string, unknown>[];
  subquestions?: LooseNodeRecord[];
  workings?: Record<string, unknown>[];
};

type LooseSectionRecord = Record<string, unknown> & {
  questions?: LooseNodeRecord[];
};

export class PaperTomlParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PaperTomlParseError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeParsedPaper(value: unknown): ParsedPaper {
  if (!isRecord(value) || !Array.isArray(value.sections)) {
    throw new PaperTomlParseError(
      'The TOML file is not a reviewable paper document.',
    );
  }

  return {
    meta: isRecord(value.meta) ? value.meta : {},
    sections: value.sections.filter(isRecord),
  };
}

function parseTomlValue(valueSource: string): unknown {
  try {
    return (parse(`value = ${valueSource}`) as { value?: unknown }).value;
  } catch (error) {
    if (/^%[^%\r\n]+%$/.test(valueSource.trim())) {
      return valueSource.trim();
    }

    throw error;
  }
}

function pushChild<T extends Record<string, unknown>>(
  parent: Record<string, unknown>,
  key: string,
  child: T,
): void {
  const current = parent[key];

  if (Array.isArray(current)) {
    current.push(child);
  } else {
    parent[key] = [child];
  }
}

function parseLooseExemplarToml(raw: string): ParsedPaper {
  const parsed: {
    meta: Record<string, unknown>;
    sections: LooseSectionRecord[];
  } = { meta: {}, sections: [] };
  const lines = raw.split(/\r?\n/);
  let currentQuestion: LooseNodeRecord | null = null;
  let currentSection: LooseSectionRecord | null = null;
  let currentSubquestion: LooseNodeRecord | null = null;
  let currentSubSubquestion: LooseNodeRecord | null = null;
  let currentTarget: Record<string, unknown> | null = null;
  let currentWorking: Record<string, unknown> | null = null;
  let currentWorkingScope: string | null = null;

  const activeNodeFor = (scope: string): LooseNodeRecord | null => {
    if (scope === 'sections.questions') return currentQuestion;
    if (scope === 'sections.questions.subquestions') return currentSubquestion;
    if (scope === 'sections.questions.subquestions.subquestions') {
      return currentSubSubquestion;
    }
    return null;
  };

  const clearWorking = (): void => {
    currentWorking = null;
    currentWorkingScope = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const tableMatch = /^\[\[?([^\]]+)\]\]?$/.exec(trimmed);

    if (tableMatch) {
      const tablePath = tableMatch[1];
      const collectionMatch = /^(.*)\.workings\.(formulas|tips)$/.exec(
        tablePath,
      );

      if (tablePath === 'meta') {
        clearWorking();
        currentTarget = parsed.meta;
      } else if (tablePath === 'sections') {
        clearWorking();
        currentSection = { questions: [] };
        parsed.sections.push(currentSection);
        currentQuestion = null;
        currentSubquestion = null;
        currentSubSubquestion = null;
        currentTarget = currentSection;
      } else if (tablePath === 'sections.questions' && currentSection) {
        clearWorking();
        currentQuestion = { subquestions: [] };
        pushChild(currentSection, 'questions', currentQuestion);
        currentSubquestion = null;
        currentSubSubquestion = null;
        currentTarget = currentQuestion;
      } else if (
        tablePath === 'sections.questions.subquestions' &&
        currentQuestion
      ) {
        clearWorking();
        currentSubquestion = { subquestions: [] };
        pushChild(currentQuestion, 'subquestions', currentSubquestion);
        currentSubSubquestion = null;
        currentTarget = currentSubquestion;
      } else if (
        tablePath === 'sections.questions.subquestions.subquestions' &&
        currentSubquestion
      ) {
        clearWorking();
        currentSubSubquestion = {};
        pushChild(currentSubquestion, 'subquestions', currentSubSubquestion);
        currentTarget = currentSubSubquestion;
      } else if (collectionMatch) {
        const [, ownerScope, collectionKey] = collectionMatch;
        const owner = activeNodeFor(ownerScope);
        const item: Record<string, unknown> = {};

        if (
          owner &&
          currentWorking &&
          currentWorkingScope === ownerScope &&
          Array.isArray(owner.workings) &&
          owner.workings.at(-1) === currentWorking
        ) {
          pushChild(currentWorking, collectionKey, item);
          currentTarget = item;
        } else {
          currentTarget = null;
        }
      } else if (tablePath.endsWith('.workings')) {
        const ownerScope = tablePath.slice(0, -'.workings'.length);
        const owner = activeNodeFor(ownerScope);
        const working: Record<string, unknown> = {};

        if (owner) {
          pushChild(owner, 'workings', working);
          currentWorking = working;
          currentWorkingScope = ownerScope;
          currentTarget = working;
        } else {
          clearWorking();
          currentTarget = null;
        }
      } else if (tablePath.endsWith('.answers')) {
        clearWorking();
        const owner = activeNodeFor(tablePath.slice(0, -'.answers'.length));
        const answer: Record<string, unknown> = {};

        if (owner) pushChild(owner, 'answers', answer);
        currentTarget = owner ? answer : null;
      } else {
        clearWorking();
        currentTarget = null;
      }

      continue;
    }

    if (!currentTarget) continue;

    const keyValueMatch = /^([A-Za-z0-9_-]+)\s*=\s*(.*)$/.exec(rawLine);
    if (!keyValueMatch) continue;

    const [, key, valueStart] = keyValueMatch;
    let valueSource = valueStart.trim();

    if (
      (valueSource.startsWith("'''") &&
        !valueSource.slice(3).includes("'''")) ||
      (valueSource.startsWith('"""') && !valueSource.slice(3).includes('"""'))
    ) {
      const delimiter = valueSource.slice(0, 3);

      while (index + 1 < lines.length) {
        index += 1;
        valueSource += `\n${lines[index]}`;
        if (lines[index].trimEnd().endsWith(delimiter)) break;
      }
    }

    try {
      currentTarget[key] = parseTomlValue(valueSource);
    } catch (error) {
      throw new PaperTomlParseError(
        `The exemplar placeholder TOML contains an unsupported value for ${key}.`,
        { cause: error },
      );
    }
  }

  return normalizeParsedPaper(parsed);
}

function looksLikePlaceholderExemplar(raw: string): boolean {
  return (
    /^\s*school\s*=\s*["']?%school%["']?\s*$/m.test(raw) &&
    /^\s*\[\[sections\.questions\]\]\s*$/m.test(raw)
  );
}

export function parsePaperToml(
  raw: string,
  collectionId: PaperCollectionId,
): ParsedPaper {
  try {
    return normalizeParsedPaper(parse(raw));
  } catch (error) {
    if (
      isExemplarPaperCollectionId(collectionId) &&
      looksLikePlaceholderExemplar(raw)
    ) {
      return parseLooseExemplarToml(raw);
    }

    if (error instanceof PaperTomlParseError) throw error;

    throw new PaperTomlParseError('The paper TOML could not be parsed.', {
      cause: error,
    });
  }
}
