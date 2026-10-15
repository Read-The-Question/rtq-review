import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperImageVariant,
  DisplayPaperNode,
} from './display-model.ts';

export const IMAGE_COMPARISON_VERSIONS = [
  'original',
  'prepared',
  'debug',
] as const;

export type ImageComparisonVersion = (typeof IMAGE_COMPARISON_VERSIONS)[number];

export const IMAGE_COMPARISON_VERSION_LABELS: Readonly<
  Record<ImageComparisonVersion, string>
> = {
  original: 'Original',
  prepared: 'Prepared',
  debug: 'Debug',
};

export const DEFAULT_IMAGE_COMPARISON_VERSIONS = [
  'original',
  'prepared',
] as const satisfies readonly ImageComparisonVersion[];

export function imageComparisonVersionForProvenance(
  provenance: DisplayPaperImageVariant['provenance'],
): ImageComparisonVersion {
  if (provenance === 'manual' || provenance === 'retired') return 'original';
  if (provenance === 'debug') return 'debug';
  return 'prepared';
}

export function parseImageComparisonVersions(
  value: null | string,
): readonly ImageComparisonVersion[] {
  if (!value) return DEFAULT_IMAGE_COMPARISON_VERSIONS;
  const requested = new Set(value.split(','));
  const versions = IMAGE_COMPARISON_VERSIONS.filter((version) =>
    requested.has(version),
  );
  return versions.length ? versions : DEFAULT_IMAGE_COMPARISON_VERSIONS;
}

export function serializeImageComparisonVersions(
  versions: readonly ImageComparisonVersion[],
): string | undefined {
  const selected = new Set(versions);
  const normalized = IMAGE_COMPARISON_VERSIONS.filter((version) =>
    selected.has(version),
  );
  return normalized.length === DEFAULT_IMAGE_COMPARISON_VERSIONS.length &&
    normalized.every(
      (version, index) => version === DEFAULT_IMAGE_COMPARISON_VERSIONS[index],
    )
    ? undefined
    : normalized.join(',');
}

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
  options: Readonly<{ includeSolutions?: boolean }> = {},
): readonly VisualOccurrence[] {
  const includeSolutions = options.includeSolutions ?? true;

  return [
    ...fieldOccurrences(node.content.question, 'Question'),
    ...(includeSolutions
      ? node.content.workings.flatMap((working, workingIndex) => [
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
        ])
      : []),
    ...(includeSolutions
      ? node.content.answers.flatMap((answer, answerIndex) => [
          ...fieldOccurrences(
            answer.option,
            `Answer ${answerIndex + 1} · Option`,
          ),
          ...fieldOccurrences(answer.key, `Answer ${answerIndex + 1} · Key`),
          ...fieldOccurrences(answer.answer, `Answer ${answerIndex + 1}`),
        ])
      : []),
    ...(node.retiredPaperImages ?? [])
      .filter((entry) => includeSolutions || entry.scope === 'question')
      .map((entry, index) => ({
        archiveReason: entry.reason,
        fieldLabel: 'Retired original',
        image: entry.image,
        key: `retired:${entry.scope}:${index}:${entry.image.referenceSrc}`,
        scope: entry.scope,
      })),
  ];
}
