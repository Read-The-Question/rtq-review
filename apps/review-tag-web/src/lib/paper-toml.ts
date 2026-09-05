import { parse } from '@iarna/toml';

export type ParsedPaper = {
  meta?: Record<string, unknown>;
  sections?: Array<Record<string, unknown>>;
};

type LooseNodeRecord = Record<string, unknown> & {
  answers?: Record<string, unknown>[];
  subquestions?: LooseNodeRecord[];
  workings?: Record<string, unknown>[];
};

type LooseSectionRecord = Record<string, unknown> & {
  questions?: LooseNodeRecord[];
};

function parseTomlValue(valueSource: string) {
  return (parse(`value = ${valueSource}`) as { value?: unknown }).value;
}

export function parseLoosePaperToml(raw: string): ParsedPaper {
  const parsed: ParsedPaper = { meta: {}, sections: [] };
  const lines = raw.split(/\r?\n/);
  let currentSection: LooseSectionRecord | null = null;
  let currentQuestion: LooseNodeRecord | null = null;
  let currentSubquestion: LooseNodeRecord | null = null;
  let currentSubsubquestion: LooseNodeRecord | null = null;
  let currentWorking: Record<string, unknown> | null = null;
  let currentWorkingScope: string | null = null;
  let currentTarget: Record<string, unknown> | null = null;

  const activeNodeFor = (scope: string) => {
    if (scope === 'sections.questions') return currentQuestion;
    if (scope === 'sections.questions.subquestions') return currentSubquestion;
    if (scope === 'sections.questions.subquestions.subquestions') {
      return currentSubsubquestion;
    }
    return null;
  };

  const pushChild = <T extends Record<string, unknown>>(
    parent: Record<string, unknown>,
    key: string,
    child: T,
  ) => {
    const current = parent[key];

    if (Array.isArray(current)) {
      current.push(child);
    } else {
      parent[key] = [child];
    }
  };

  const clearWorking = () => {
    currentWorking = null;
    currentWorkingScope = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const tableMatch = /^\[\[?([^\]]+)\]\]?$/.exec(trimmed);

    if (tableMatch) {
      const tablePath = tableMatch[1];
      const collectionMatch = /^(.*)\.workings\.(formulas|tips)$/.exec(
        tablePath,
      );

      if (tablePath === 'meta') {
        clearWorking();
        currentTarget = parsed.meta ?? {};
        parsed.meta = currentTarget;
      } else if (tablePath === 'sections') {
        clearWorking();
        currentSection = { questions: [] };
        parsed.sections?.push(currentSection);
        currentQuestion = null;
        currentSubquestion = null;
        currentSubsubquestion = null;
        currentTarget = currentSection;
      } else if (tablePath === 'sections.questions' && currentSection) {
        clearWorking();
        currentQuestion = { subquestions: [] };
        pushChild(currentSection, 'questions', currentQuestion);
        currentSubquestion = null;
        currentSubsubquestion = null;
        currentTarget = currentQuestion;
      } else if (
        tablePath === 'sections.questions.subquestions' &&
        currentQuestion
      ) {
        clearWorking();
        currentSubquestion = { subquestions: [] };
        pushChild(currentQuestion, 'subquestions', currentSubquestion);
        currentSubsubquestion = null;
        currentTarget = currentSubquestion;
      } else if (
        tablePath === 'sections.questions.subquestions.subquestions' &&
        currentSubquestion
      ) {
        clearWorking();
        currentSubsubquestion = {};
        pushChild(currentSubquestion, 'subquestions', currentSubsubquestion);
        currentTarget = currentSubsubquestion;
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
        const ownerScope = tablePath.replace(/\.workings$/, '');
        const node = activeNodeFor(ownerScope);
        const working: Record<string, unknown> = {};
        if (node) {
          pushChild(node, 'workings', working);
          currentWorking = working;
          currentWorkingScope = ownerScope;
        } else {
          clearWorking();
        }
        currentTarget = working;
      } else if (tablePath.endsWith('.answers')) {
        clearWorking();
        const node = activeNodeFor(tablePath.replace(/\.answers$/, ''));
        const answer: Record<string, unknown> = {};
        if (node) {
          pushChild(node, 'answers', answer);
        }
        currentTarget = answer;
      } else {
        clearWorking();
        currentTarget = null;
      }

      continue;
    }

    if (!currentTarget) {
      continue;
    }

    const keyValueMatch = /^([A-Za-z0-9_-]+)\s*=\s*(.*)$/.exec(rawLine);

    if (!keyValueMatch) {
      continue;
    }

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

        if (lines[index].trimEnd().endsWith(delimiter)) {
          break;
        }
      }
    }

    currentTarget[key] = parseTomlValue(valueSource);
  }

  return parsed;
}

function looksLikeExemplarPaperToml(raw: string) {
  return (
    raw.includes('school              = "%school%"') &&
    raw.includes('[[sections.questions]]')
  );
}

export function parsePaperToml(raw: string, allowLoose: boolean): ParsedPaper {
  try {
    return parse(raw) as ParsedPaper;
  } catch (error) {
    if (allowLoose || looksLikeExemplarPaperToml(raw)) {
      return parseLoosePaperToml(raw);
    }

    throw error;
  }
}

export function workingCollectionValues(
  record: Record<string, unknown>,
  collectionKey: 'formulas' | 'tips',
  valueKey: 'formula' | 'tip',
) {
  const collection = record[collectionKey];

  if (!Array.isArray(collection)) {
    return [];
  }

  return collection.flatMap(item => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const value = (item as Record<string, unknown>)[valueKey];
    if (typeof value !== 'string' || value.trim() === '%empty%') {
      return [];
    }

    return [value];
  });
}
