import { ReviewOutcomeRequestError } from "./errors.ts";
import {
  parseReviewOutcomeResolutionRequest,
  REVIEW_OUTCOME_RESOLUTION_SCHEMA_VERSION,
} from "./review-outcome-resolution.ts";
import type {
  PruneReviewSyncResult,
  ReviewSyncMaintenance,
} from "./review-sync-maintenance.ts";

export const REVIEW_SYNC_PRUNE_SCHEMA_VERSION =
  REVIEW_OUTCOME_RESOLUTION_SCHEMA_VERSION;

export type ReviewSyncPruneResponse = PruneReviewSyncResult &
  Readonly<{ schemaVersion: typeof REVIEW_SYNC_PRUNE_SCHEMA_VERSION }>;

function record(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ReviewOutcomeRequestError("Request must be an object.");
  }
  return input as Record<string, unknown>;
}

export function pruneReviewSyncRequest(
  input: unknown,
  maintenance: ReviewSyncMaintenance,
): ReviewSyncPruneResponse {
  const request = record(input);
  const resolution = parseReviewOutcomeResolutionRequest(request);
  if (typeof request.cutoff !== "string" || !request.cutoff.trim()) {
    throw new ReviewOutcomeRequestError(
      "cutoff must be a non-empty timestamp string.",
    );
  }
  if (typeof request.apply !== "boolean") {
    throw new ReviewOutcomeRequestError("apply must be a boolean.");
  }
  return {
    ...maintenance.prune({
      apply: request.apply,
      cutoff: request.cutoff,
      targets: resolution.targets,
    }),
    schemaVersion: REVIEW_SYNC_PRUNE_SCHEMA_VERSION,
  };
}

export function pruneReviewSyncRequestJson(
  input: string,
  maintenance: ReviewSyncMaintenance,
): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new ReviewOutcomeRequestError("Input must be valid JSON.");
  }
  return `${JSON.stringify(pruneReviewSyncRequest(parsed, maintenance))}\n`;
}
