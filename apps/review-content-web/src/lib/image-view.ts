import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperNode,
} from './display-model.ts';

export type VisualOccurrence = Readonly<{
  archiveReason?: string;
  fieldLabel: string;
  image: DisplayPaperImage;
  key: string;
  scope: DisplayContentField['context']['scope'];
}>;

function fieldOccurrences(
  field: DisplayContentField,
  fieldLabel: string,
): VisualOccurrence[] {
  return (field.paperImages ?? []).map((image, index) => ({
    fieldLabel,
    image,
    key: `${field.context.scope}:${fieldLabel}:${index}:${image.referenceSrc}`,
    scope: field.context.scope,
  }));
}

export function visualOccurrencesForNode(
  node: DisplayPaperNode,
): readonly VisualOccurrence[] {
  return [
    ...fieldOccurrences(node.content.question, 'Question'),
    ...node.content.workings.flatMap((working, workingIndex) => [
      ...working.formulas.flatMap((field, fieldIndex) =>
        fieldOccurrences(
          field,
          `Working ${workingIndex + 1} · Formula ${fieldIndex + 1}`,
        ),
      ),
      ...working.tips.flatMap((field, fieldIndex) =>
        fieldOccurrences(
          field,
          `Working ${workingIndex + 1} · Tip ${fieldIndex + 1}`,
        ),
      ),
      ...fieldOccurrences(working.working, `Working ${workingIndex + 1}`),
    ]),
    ...node.content.answers.flatMap((answer, answerIndex) => [
      ...fieldOccurrences(answer.option, `Answer ${answerIndex + 1} · Option`),
      ...fieldOccurrences(answer.key, `Answer ${answerIndex + 1} · Key`),
      ...fieldOccurrences(answer.answer, `Answer ${answerIndex + 1}`),
    ]),
    ...(node.retiredPaperImages ?? []).map((entry, index) => ({
      archiveReason: entry.reason,
      fieldLabel: 'Retired original',
      image: entry.image,
      key: `retired:${entry.scope}:${index}:${entry.image.referenceSrc}`,
      scope: entry.scope,
    })),
  ];
}
