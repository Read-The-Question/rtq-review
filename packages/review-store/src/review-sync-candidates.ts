import { ReviewOutcomeRequestError } from "./errors.ts";
import type { ReviewImageMetadataReader } from "./review-image-metadata.ts";
import type { ReviewOutcomeReader } from "./review-outcomes.ts";
import type {
  StoredReviewImageMetadata,
  StoredReviewOutcome,
} from "./types.ts";

export const REVIEW_SYNC_CANDIDATE_SCHEMA_VERSION = 1 as const;

export type ReviewSyncCandidateResponse = Readonly<{
  imageMetadata: readonly StoredReviewImageMetadata[];
  outcomes: readonly StoredReviewOutcome[];
  schemaVersion: typeof REVIEW_SYNC_CANDIDATE_SCHEMA_VERSION;
}>;

export type ReviewSyncCandidateReaders = Readonly<{
  imageMetadata: Pick<ReviewImageMetadataReader, "listCandidates">;
  outcomes: Pick<ReviewOutcomeReader, "listTransitionCandidates">;
}>;

function parseRequest(input: unknown): void {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ReviewOutcomeRequestError("Request must be an object.");
  }
  const record = input as Record<string, unknown>;
  if (record.schemaVersion !== REVIEW_SYNC_CANDIDATE_SCHEMA_VERSION) {
    throw new ReviewOutcomeRequestError(
      `schemaVersion must be ${REVIEW_SYNC_CANDIDATE_SCHEMA_VERSION}.`,
    );
  }
}

export function listReviewSyncCandidates(
  input: unknown,
  readers: ReviewSyncCandidateReaders,
): ReviewSyncCandidateResponse {
  parseRequest(input);
  return {
    imageMetadata: readers.imageMetadata.listCandidates(),
    outcomes: readers.outcomes.listTransitionCandidates(),
    schemaVersion: REVIEW_SYNC_CANDIDATE_SCHEMA_VERSION,
  };
}

export function listReviewSyncCandidatesJson(
  input: string,
  readers: ReviewSyncCandidateReaders,
): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new ReviewOutcomeRequestError("Input must be valid JSON.");
  }
  return `${JSON.stringify(listReviewSyncCandidates(parsed, readers))}\n`;
}
