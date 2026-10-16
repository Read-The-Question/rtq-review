export const IMAGE_AVAILABILITY_FILTERS = ['any', 'v2'] as const;

export type ImageAvailabilityFilter =
  (typeof IMAGE_AVAILABILITY_FILTERS)[number];

export const IMAGE_AVAILABILITY_LABELS: Readonly<
  Record<ImageAvailabilityFilter, string>
> = {
  any: 'Any image availability',
  v2: 'Has V2',
};

export type ImageAvailabilityIndexSummary = Readonly<{
  builtAt: string;
  invalidFileCount: number;
  scannedFileCount: number;
  v2ImageCount: number;
  v2QuestionCount: number;
}>;

export function normalizeImageAvailabilityFilter(
  value: null | string | undefined,
): ImageAvailabilityFilter {
  return value === 'v2' ? 'v2' : 'any';
}
