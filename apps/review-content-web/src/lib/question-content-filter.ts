import type {
  DisplayContentField,
  DisplayPaperNode,
  DisplayReviewPaper,
} from './display-model.ts';

export type QuestionContentFilter =
  | 'all'
  | 'image'
  | 'image-question'
  | 'image-working'
  | 'table'
  | 'table-question'
  | 'table-working';

type QuestionContentKind = 'image' | 'table';
type QuestionContentLocation = 'any' | 'question' | 'working';

export type QuestionContentFilterMatches = Readonly<{
  directNodeIds: readonly string[];
  questionTreeIds: readonly string[];
  visibleNodeIds: readonly string[];
}>;

function questionFields(
  node: DisplayPaperNode,
): readonly DisplayContentField[] {
  return [node.content.question];
}

function workingFields(
  node: DisplayPaperNode,
  includeSolutions = true,
): readonly DisplayContentField[] {
  if (!includeSolutions) return [];
  return [
    ...node.content.workings.flatMap((working) => [
      working.working,
      ...working.formulas,
      ...working.tips,
    ]),
    ...node.content.answers.flatMap((answer) => [
      answer.answer,
      answer.key,
      answer.option,
    ]),
  ];
}

function filterDefinition(filter: Exclude<QuestionContentFilter, 'all'>): {
  kind: QuestionContentKind;
  location: QuestionContentLocation;
} {
  const [kind, location = 'any'] = filter.split('-') as [
    QuestionContentKind,
    QuestionContentLocation?,
  ];
  return { kind, location };
}

function fieldMatches(
  field: DisplayContentField,
  kind: QuestionContentKind,
): boolean {
  if (kind === 'table') return field.hasTable;
  return field.preparations.some(
    (preparation) => preparation.kind === 'paper-image',
  );
}

export function nodeMatchesQuestionContentFilter(
  node: DisplayPaperNode,
  filter: QuestionContentFilter,
  includeRetiredImages = false,
  includeSolutions = true,
): boolean {
  if (filter === 'all') return true;
  const { kind, location } = filterDefinition(filter);
  const fields = [
    ...(location === 'working' ? [] : questionFields(node)),
    ...(location === 'question' ? [] : workingFields(node, includeSolutions)),
  ];

  return (
    (kind === 'image' &&
      includeRetiredImages &&
      Boolean(
        node.retiredPaperImages?.some(
          (entry) =>
            (includeSolutions || entry.scope === 'question') &&
            (location === 'any' ||
              (location === 'question'
                ? entry.scope === 'question'
                : entry.scope !== 'question')),
        ),
      )) ||
    fields.some((field) => fieldMatches(field, kind))
  );
}

export function questionContentFilterMatches(
  paper: DisplayReviewPaper,
  filter: QuestionContentFilter,
  options: Readonly<{
    includeRetiredImages?: boolean;
    includeSolutions?: boolean;
  }> = {},
): QuestionContentFilterMatches {
  const directNodeIds: string[] = [];
  const questionTreeIds: string[] = [];
  const visibleNodeIds: string[] = [];

  function visit(node: DisplayPaperNode): boolean {
    const direct = nodeMatchesQuestionContentFilter(
      node,
      filter,
      options.includeRetiredImages,
      options.includeSolutions,
    );
    const descendant = node.children.map(visit).some(Boolean);
    if (direct) directNodeIds.push(node.id);
    if (direct || descendant) visibleNodeIds.push(node.id);
    return direct || descendant;
  }

  for (const section of paper.sections) {
    for (const question of section.questions) {
      if (visit(question)) questionTreeIds.push(question.id);
    }
  }

  return { directNodeIds, questionTreeIds, visibleNodeIds };
}
