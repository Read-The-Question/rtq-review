import type {
  ContentSearchQuery,
  ContentSearchScope,
  ReviewPaperNode,
} from './model.ts';

export const CONTENT_SEARCH_SCOPES = [
  'all',
  'question',
  'answer',
  'working',
] as const satisfies readonly ContentSearchScope[];

export const DEFAULT_CONTENT_SEARCH_SCOPE: ContentSearchScope = 'all';

type SearchableField = Readonly<{
  scope: Exclude<ContentSearchScope, 'all'>;
  value: string;
}>;

export type ContentSearchRange = Readonly<{
  end: number;
  start: number;
}>;

export type CompiledContentSearch = Readonly<{
  expression: RegExp;
  pattern: string;
  scope: ContentSearchScope;
}>;

export type ContentSearchCompilation =
  | Readonly<{ search: CompiledContentSearch; state: 'ready' }>
  | Readonly<{ message: string; state: 'invalid' }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function isContentSearchScope(
  value: string,
): value is ContentSearchScope {
  return CONTENT_SEARCH_SCOPES.some((scope) => scope === value);
}

export function normalizeContentSearchScope(
  value: string | null | undefined,
): ContentSearchScope {
  return value && isContentSearchScope(value)
    ? value
    : DEFAULT_CONTENT_SEARCH_SCOPE;
}

export function normalizeContentSearchQuery(
  query: ContentSearchQuery | undefined,
): ContentSearchQuery | undefined {
  const pattern = query?.pattern.trim() ?? '';
  return pattern
    ? { pattern, scope: normalizeContentSearchScope(query?.scope) }
    : undefined;
}

export function compileContentSearch(
  query: ContentSearchQuery,
): ContentSearchCompilation {
  const normalized = normalizeContentSearchQuery(query);
  if (!normalized) {
    return {
      message: 'Enter a regular expression to search.',
      state: 'invalid',
    };
  }
  if (normalized.pattern.length > 500) {
    return {
      message: 'The regular expression must be 500 characters or fewer.',
      state: 'invalid',
    };
  }

  try {
    return {
      search: {
        expression: new RegExp(normalized.pattern, 'imu'),
        ...normalized,
      },
      state: 'ready',
    };
  } catch (error) {
    return {
      message:
        error instanceof SyntaxError
          ? error.message.replace(/^Invalid regular expression:\s*/i, '')
          : 'The regular expression is invalid.',
      state: 'invalid',
    };
  }
}

function fieldMatches(
  field: SearchableField,
  search: CompiledContentSearch,
): boolean {
  return (
    (search.scope === 'all' || search.scope === field.scope) &&
    search.expression.test(field.value)
  );
}

export function contentSearchRanges(
  value: string,
  scope: Exclude<ContentSearchScope, 'all'>,
  search: CompiledContentSearch,
): readonly ContentSearchRange[] {
  if (search.scope !== 'all' && search.scope !== scope) return [];

  const expression = new RegExp(
    search.expression.source,
    search.expression.flags.includes('g')
      ? search.expression.flags
      : `${search.expression.flags}g`,
  );
  return Array.from(value.matchAll(expression)).flatMap((match) => {
    const start = match.index;
    const end = start + match[0].length;
    return end > start ? [{ end, start }] : [];
  });
}

function nodeFields(node: ReviewPaperNode): SearchableField[] {
  return [
    { scope: 'question', value: node.content.question.raw },
    ...node.content.answers.flatMap((answer) => [
      { scope: 'answer' as const, value: answer.option.raw },
      { scope: 'answer' as const, value: answer.key.raw },
      { scope: 'answer' as const, value: answer.answer.raw },
    ]),
    ...node.content.workings.flatMap((working) => [
      { scope: 'working' as const, value: working.working.raw },
      ...working.formulas.map((formula) => ({
        scope: 'working' as const,
        value: formula.raw,
      })),
      ...working.tips.map((tip) => ({
        scope: 'working' as const,
        value: tip.raw,
      })),
    ]),
  ];
}

export function reviewQuestionTreeMatchesContentSearch(
  question: ReviewPaperNode,
  search: CompiledContentSearch,
): boolean {
  return reviewQuestionTreeContentMatchNodeIds(question, search).length > 0;
}

export function reviewQuestionTreeContentMatchNodeIds(
  question: ReviewPaperNode,
  search: CompiledContentSearch,
): readonly string[] {
  return [
    ...(nodeFields(question).some((field) => fieldMatches(field, search))
      ? [question.id]
      : []),
    ...question.children.flatMap((child) =>
      reviewQuestionTreeContentMatchNodeIds(child, search),
    ),
  ];
}

function recordFields(record: Record<string, unknown>): SearchableField[] {
  return [
    { scope: 'question', value: text(record.question) },
    ...records(record.answers).flatMap((answer) => [
      { scope: 'answer' as const, value: text(answer.option) },
      { scope: 'answer' as const, value: text(answer.key) },
      { scope: 'answer' as const, value: text(answer.answer) },
    ]),
    ...records(record.workings).flatMap((working) => [
      { scope: 'working' as const, value: text(working.working) },
      ...records(working.formulas).map((formula) => ({
        scope: 'working' as const,
        value: text(formula.formula),
      })),
      ...records(working.tips).map((tip) => ({
        scope: 'working' as const,
        value: text(tip.tip),
      })),
    ]),
  ];
}

export function parsedQuestionTreeMatchesContentSearch(
  question: Record<string, unknown>,
  search: CompiledContentSearch,
): boolean {
  return (
    parsedQuestionTreeContentMatchNodeIds(question, search, 'question').length >
    0
  );
}

export function parsedQuestionTreeContentMatchNodeIds(
  question: Record<string, unknown>,
  search: CompiledContentSearch,
  nodeId: string,
  depth = 0,
): readonly string[] {
  return [
    ...(recordFields(question).some((field) => fieldMatches(field, search))
      ? [nodeId]
      : []),
    ...records(question.subquestions).flatMap((child, index) =>
      parsedQuestionTreeContentMatchNodeIds(
        child,
        search,
        `${nodeId}.${depth === 0 ? 'sq' : 'ssq'}${index}`,
        depth + 1,
      ),
    ),
  ];
}
