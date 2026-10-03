import {
  REVIEWABLE_COLLECTION_IDS,
  type ExemplarPaperCollectionId,
  type PaperCollectionId,
} from './model.ts';

const exemplarCollectionPattern = /^exemplarsLevel(\d+)Toml$/;

export function exemplarLevelFromCollectionId(
  value: string,
): number | undefined {
  const match = exemplarCollectionPattern.exec(value);

  if (!match) return undefined;
  const level = Number.parseInt(match[1], 10);
  return Number.isSafeInteger(level) ? level : undefined;
}

export function isExemplarPaperCollectionId(
  value: string,
): value is ExemplarPaperCollectionId {
  return exemplarLevelFromCollectionId(value) !== undefined;
}

export function isPaperCollectionId(value: string): value is PaperCollectionId {
  return (
    (REVIEWABLE_COLLECTION_IDS as readonly string[]).includes(value) ||
    isExemplarPaperCollectionId(value)
  );
}
