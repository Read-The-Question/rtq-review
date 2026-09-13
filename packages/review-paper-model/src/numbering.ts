export type QuestionNumberingConfig = Readonly<{
  listType: string;
  subListType: string;
  subSubListType: string;
}>;

export const DEFAULT_QUESTION_NUMBERING: QuestionNumberingConfig = {
  listType: 'decimal',
  subListType: 'lower-alpha',
  subSubListType: 'lower-roman',
};

type QuestionNumberingSource = Readonly<Record<string, unknown>>;

function resolvedListType(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized || fallback;
}

export function resolveQuestionNumberingConfig(
  source: QuestionNumberingSource,
  inherited: QuestionNumberingConfig = DEFAULT_QUESTION_NUMBERING,
): QuestionNumberingConfig {
  return {
    listType: resolvedListType(source['list-type'], inherited.listType),
    subListType: resolvedListType(
      source['sub-list-type'],
      inherited.subListType,
    ),
    subSubListType: resolvedListType(
      source['sub-sub-list-type'],
      inherited.subSubListType,
    ),
  };
}

export function questionListTypeForDepth(
  config: QuestionNumberingConfig,
  depth: number,
): string {
  if (depth <= 0) return config.listType;
  if (depth === 1) return config.subListType;
  return config.subSubListType;
}

function alphabetLabel(index: number): string {
  if (!Number.isInteger(index) || index < 1) return String(index);

  let remainder = index;
  let label = '';

  while (remainder > 0) {
    remainder -= 1;
    label = String.fromCharCode(97 + (remainder % 26)) + label;
    remainder = Math.floor(remainder / 26);
  }

  return label;
}

function romanLabel(index: number): string {
  if (!Number.isInteger(index) || index < 1 || index > 3999) {
    return String(index);
  }

  const numerals: Array<readonly [number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remainder = index;
  let label = '';

  for (const [value, symbol] of numerals) {
    while (remainder >= value) {
      label += symbol;
      remainder -= value;
    }
  }

  return label;
}

export function formatQuestionIndexLabel(
  index: number,
  listType: string,
): string {
  const normalized = listType.trim().toLowerCase();

  if (
    normalized === 'lower-alpha' ||
    normalized === 'alpha' ||
    normalized === 'alphabetic'
  ) {
    return alphabetLabel(index);
  }
  if (normalized === 'upper-alpha') return alphabetLabel(index).toUpperCase();
  if (normalized === 'lower-roman' || normalized === 'roman') {
    return romanLabel(index).toLowerCase();
  }
  if (normalized === 'upper-roman') return romanLabel(index).toUpperCase();

  return String(index);
}

export function formatQuestionPathLabel(labels: readonly string[]): string {
  return labels.join('.');
}

export function resolveSectionQuestionStart(
  section: QuestionNumberingSource,
): number {
  const value = section['question-start'];
  if (value === undefined) return 1;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new Error('Section question-start must be a positive integer.');
  }
  return value;
}
