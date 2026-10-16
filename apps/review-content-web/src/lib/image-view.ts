import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperImageVariant,
  DisplayPaperNode,
} from './display-model.ts';

export const IMAGE_COMPARISON_VERSIONS = [
  'original',
  'v1',
  'debug-v1',
  'v2',
  'debug-v2',
] as const;

export type ImageComparisonVersion = (typeof IMAGE_COMPARISON_VERSIONS)[number];

export const IMAGE_COMPARISON_VERSION_LABELS: Readonly<
  Record<ImageComparisonVersion, string>
> = {
  original: 'Original',
  v1: 'V1',
  'debug-v1': 'Debug V1',
  v2: 'V2',
  'debug-v2': 'Debug V2',
};

export const DEFAULT_IMAGE_COMPARISON_VERSIONS = [
  'original',
  'v1',
  'v2',
] as const satisfies readonly ImageComparisonVersion[];

export const DEFAULT_IMAGE_COMPARISON_VERSION_SET: ReadonlySet<ImageComparisonVersion> =
  new Set(DEFAULT_IMAGE_COMPARISON_VERSIONS);

export function imageComparisonVersionForProvenance(
  provenance: DisplayPaperImageVariant['provenance'],
): ImageComparisonVersion {
  if (provenance === 'manual' || provenance === 'retired') return 'original';
  if (provenance === 'debug-v1') return 'debug-v1';
  if (provenance === 'debug-v2') return 'debug-v2';
  if (provenance === 'v2') return 'v2';
  return 'v1';
}

export function paperImageHasComparisonVersion(
  image: DisplayPaperImage,
  version: ImageComparisonVersion,
): boolean {
  return [...image.variants, ...(image.retiredVariants ?? [])].some(
    (variant) =>
      imageComparisonVersionForProvenance(variant.provenance) === version,
  );
}

export function normalizeImageComparisonVersions(
  versions: readonly unknown[],
): readonly ImageComparisonVersion[] {
  const requested = new Set(
    versions.map((version) => (version === 'prepared' ? 'v1' : version)),
  );
  if (requested.has('debug')) {
    requested.add('debug-v1');
    requested.add('debug-v2');
  }
  return IMAGE_COMPARISON_VERSIONS.filter((version) => requested.has(version));
}

export function parseImageComparisonVersions(
  value: null | string,
): readonly ImageComparisonVersion[] {
  if (!value) return DEFAULT_IMAGE_COMPARISON_VERSIONS;
  const versions = normalizeImageComparisonVersions(value.split(','));
  return versions.length ? versions : DEFAULT_IMAGE_COMPARISON_VERSIONS;
}

export function serializeImageComparisonVersions(
  versions: readonly ImageComparisonVersion[],
): string | undefined {
  const normalized = normalizeImageComparisonVersions(versions);
  return normalized.length === DEFAULT_IMAGE_COMPARISON_VERSIONS.length &&
    normalized.every(
      (version, index) => version === DEFAULT_IMAGE_COMPARISON_VERSIONS[index],
    )
    ? undefined
    : normalized.join(',');
}

export type VisualOccurrence = Readonly<{
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
        fieldLabel: 'Original',
        image: entry.image,
        key: `retired:${entry.scope}:${index}:${entry.image.referenceSrc}`,
        scope: entry.scope,
      })),
  ];
}
