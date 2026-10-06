import type {
  DisplayContentField,
  DisplayPaperNode,
  DisplayReviewPaper,
} from './display-model.ts';

export type QuestionContentFilter = 'all' | 'image' | 'table';

export type QuestionContentFilterMatches = Readonly<{
  directNodeIds: readonly string[];
  questionTreeIds: readonly string[];
  visibleNodeIds: readonly string[];
}>;

function nodeFields(node: DisplayPaperNode): readonly DisplayContentField[] {
  return [
    node.content.question,
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

function fieldMatches(
  field: DisplayContentField,
  filter: QuestionContentFilter,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'table') return field.hasTable;
  return field.preparations.some(
    (preparation) => preparation.kind === 'paper-image',
  );
}

export function nodeMatchesQuestionContentFilter(
  node: DisplayPaperNode,
  filter: QuestionContentFilter,
): boolean {
  return nodeFields(node).some((field) => fieldMatches(field, filter));
}

export function questionContentFilterMatches(
  paper: DisplayReviewPaper,
  filter: QuestionContentFilter,
): QuestionContentFilterMatches {
  const directNodeIds: string[] = [];
  const questionTreeIds: string[] = [];
  const visibleNodeIds: string[] = [];

  function visit(node: DisplayPaperNode): boolean {
    const direct = nodeMatchesQuestionContentFilter(node, filter);
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
