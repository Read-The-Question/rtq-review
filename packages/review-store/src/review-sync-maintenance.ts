import type Database from "better-sqlite3";

import { ReviewDatabaseError } from "./errors.ts";
import type { ReviewImageMetadataRepository } from "./review-image-metadata.ts";
import type { ReviewOutcomeRepository } from "./review-outcomes.ts";
import type {
  ReviewOutcomeTarget,
  StoredReviewImageMetadata,
  StoredReviewOutcome,
} from "./types.ts";

export type PruneReviewSyncData = Readonly<{
  apply: boolean;
  cutoff: string;
  targets: readonly ReviewOutcomeTarget[];
}>;

export type PruneReviewSyncResult = Readonly<{
  applied: boolean;
  cutoff: string;
  imageMetadata: readonly StoredReviewImageMetadata[];
  outcomes: readonly StoredReviewOutcome[];
}>;

export type ReviewSyncMaintenance = Readonly<{
  prune: (input: PruneReviewSyncData) => PruneReviewSyncResult;
}>;

function identity(value: ReviewOutcomeTarget): string {
  return JSON.stringify([value.uuid, value.side, value.ragState]);
}

function cutoffTime(value: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new ReviewDatabaseError(
      "Review sync prune cutoff must be a valid timestamp.",
    );
  }
  return timestamp;
}

export function createReviewSyncMaintenance(
  sqlite: Database.Database,
  outcomes: ReviewOutcomeRepository,
  imageMetadata: ReviewImageMetadataRepository,
): ReviewSyncMaintenance {
  const deleteOutcome = sqlite.prepare(`
    delete from review_outcomes
    where rtq_uuid = ? and side = ? and rag_state = ? and updated_at = ?
  `);
  const deleteImageMetadata = sqlite.prepare(`
    delete from review_image_metadata
    where rtq_uuid = ? and side = ? and rag_state = ? and updated_at = ?
  `);

  return {
    prune(input) {
      const cutoff = cutoffTime(input.cutoff);
      const current = new Set(input.targets.map(identity));
      try {
        const findStale = () => ({
          imageMetadata: imageMetadata
            .listAll()
            .filter(
              (row) =>
                !current.has(identity(row)) &&
                cutoffTime(row.updatedAt) <= cutoff,
            ),
          outcomes: outcomes
            .listAll()
            .filter(
              (row) =>
                !current.has(identity(row)) &&
                cutoffTime(row.updatedAt) <= cutoff,
            ),
        });
        const execute = () => {
          const stale = findStale();
          if (input.apply) {
            for (const row of stale.outcomes) {
              deleteOutcome.run(
                row.uuid,
                row.side,
                row.ragState,
                row.updatedAt,
              );
            }
            for (const row of stale.imageMetadata) {
              deleteImageMetadata.run(
                row.uuid,
                row.side,
                row.ragState,
                row.updatedAt,
              );
            }
          }
          return {
            applied: input.apply,
            cutoff: new Date(cutoff).toISOString(),
            imageMetadata: stale.imageMetadata,
            outcomes: stale.outcomes,
          };
        };
        return input.apply
          ? sqlite.transaction(execute).immediate()
          : execute();
      } catch (error) {
        if (error instanceof ReviewDatabaseError) throw error;
        throw new ReviewDatabaseError("Review sync data could not be pruned.", {
          cause: error,
        });
      }
    },
  };
}
