import { ReviewOutcomeRequestError } from "./errors.ts";
import type { ReviewImageMetadataReader } from "./review-image-metadata.ts";
import {
  parseReviewOutcomeResolutionRequest,
  REVIEW_OUTCOME_RESOLUTION_SCHEMA_VERSION,
} from "./review-outcome-resolution.ts";
import type { ReviewOutcomeReader } from "./review-outcomes.ts";
import {
  isImageReviewSide,
  type StoredReviewImageMetadata,
  type StoredReviewOutcome,
} from "./types.ts";

export const REVIEW_SYNC_RESOLUTION_SCHEMA_VERSION =
  REVIEW_OUTCOME_RESOLUTION_SCHEMA_VERSION;

export type ReviewSyncResolutionResponse = Readonly<{
  imageMetadata: readonly StoredReviewImageMetadata[];
  outcomes: readonly StoredReviewOutcome[];
  schemaVersion: typeof REVIEW_SYNC_RESOLUTION_SCHEMA_VERSION;
}>;

export type ReviewSyncResolutionReaders = Readonly<{
  imageMetadata: Pick<ReviewImageMetadataReader, "resolve">;
  outcomes: Pick<ReviewOutcomeReader, "resolve">;
}>;

export function resolveReviewSyncRequest(
  input: unknown,
  readers: ReviewSyncResolutionReaders,
): ReviewSyncResolutionResponse {
  const request = parseReviewOutcomeResolutionRequest(input);
  const imageTargets = request.targets.flatMap((target) =>
    isImageReviewSide(target.side) ? [{ ...target, side: target.side }] : [],
  );
  return {
    imageMetadata: readers.imageMetadata.resolve(imageTargets),
    outcomes: readers.outcomes.resolve(request.targets),
    schemaVersion: REVIEW_SYNC_RESOLUTION_SCHEMA_VERSION,
  };
}

export function resolveReviewSyncRequestJson(
  input: string,
  readers: ReviewSyncResolutionReaders,
): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new ReviewOutcomeRequestError("Input must be valid JSON.");
  }
  return `${JSON.stringify(resolveReviewSyncRequest(parsed, readers))}\n`;
}
