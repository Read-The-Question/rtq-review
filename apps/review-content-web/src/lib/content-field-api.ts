import type {
  PaperCollectionId,
  ReviewContentFieldKind,
  ReviewContentFieldLocator,
} from '@rtq/review-paper-model/client';
import { isPaperCollectionId } from '@rtq/review-paper-model/client';

export type ContentFieldApiTarget = Readonly<{
  collectionId: PaperCollectionId;
  relativePath: string;
  source: ReviewContentFieldLocator;
}>;

const kinds = new Set<ReviewContentFieldKind>([
  'answer',
  'formula',
  'key',
  'option',
  'question',
  'tip',
  'working',
]);

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function optionalIndex(value: unknown): number | undefined | null {
  if (value === undefined) return undefined;
  return Number.isSafeInteger(value) && Number(value) >= 0
    ? Number(value)
    : null;
}

export function parseContentFieldApiTarget(
  value: unknown,
): ContentFieldApiTarget | undefined {
  const target = record(value);
  const source = record(target?.source);
  const collectionId = target?.collectionId;
  const relativePath =
    typeof target?.relativePath === 'string' ? target.relativePath.trim() : '';
  const nodeUuid =
    typeof source?.nodeUuid === 'string' ? source.nodeUuid.trim() : '';
  const kind = source?.kind;
  const workingIndex = optionalIndex(source?.workingIndex);
  const answerIndex = optionalIndex(source?.answerIndex);
  const itemIndex = optionalIndex(source?.itemIndex);
  if (
    typeof collectionId !== 'string' ||
    !isPaperCollectionId(collectionId) ||
    !relativePath ||
    !nodeUuid ||
    typeof kind !== 'string' ||
    !kinds.has(kind as ReviewContentFieldKind) ||
    workingIndex === null ||
    answerIndex === null ||
    itemIndex === null
  ) {
    return undefined;
  }
  return {
    collectionId,
    relativePath,
    source: {
      ...(answerIndex === undefined ? {} : { answerIndex }),
      ...(itemIndex === undefined ? {} : { itemIndex }),
      kind: kind as ReviewContentFieldKind,
      nodeUuid,
      ...(workingIndex === undefined ? {} : { workingIndex }),
    },
  };
}

export function contentFieldApiUrl(target: ContentFieldApiTarget): string {
  const parameters = new URLSearchParams({ target: JSON.stringify(target) });
  return `/api/papers/content-field?${parameters.toString()}`;
}
