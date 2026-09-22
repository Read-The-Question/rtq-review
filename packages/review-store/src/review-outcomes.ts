import { and, asc, eq } from "drizzle-orm";
import type Database from "better-sqlite3";

import {
  ReviewDatabaseError,
  ReviewStoreDataError,
  ReviewStoreValidationError,
} from "./errors.ts";
import { reviewOutcomes } from "./schema.ts";
import type { ReviewStoreDatabase } from "./review-store.ts";
import type {
  ReviewOutcome,
  ReviewOutcomeTarget,
  SetReviewOutcome,
  StoredReviewOutcome,
} from "./types.ts";
import {
  LEGACY_REVIEW_OUTCOME_CONSOLIDATIONS,
  REMOVED_REVIEW_OUTCOMES,
  REVIEW_OUTCOMES,
  isReviewOutcome,
  isReviewSide,
} from "./types.ts";

export type ReviewOutcomeRepository = Readonly<{
  clear: (target: ReviewOutcomeTarget) => boolean;
  get: (target: ReviewOutcomeTarget) => StoredReviewOutcome | undefined;
  listAll: () => readonly StoredReviewOutcome[];
  listTransitionCandidates: () => readonly StoredReviewOutcome[];
  resolve: (
    targets: readonly ReviewOutcomeTarget[],
  ) => readonly StoredReviewOutcome[];
  set: (input: SetReviewOutcome) => StoredReviewOutcome;
}>;

export type ReviewOutcomeReader = Pick<
  ReviewOutcomeRepository,
  "listTransitionCandidates" | "resolve"
>;

function requireValue(field: string, value: string): void {
  if (!value.trim()) throw new ReviewStoreValidationError(field);
}

function validateTarget(target: ReviewOutcomeTarget): void {
  requireValue("uuid", target.uuid);
  requireValue("ragState", target.ragState);
  if (!isReviewSide(target.side)) {
    throw new ReviewStoreValidationError("side");
  }
}

type OutcomeRecord = Readonly<{
  createdAt: unknown;
  outcome: unknown;
  ragState: unknown;
  reviewer: unknown;
  side: unknown;
  updatedAt: unknown;
  uuid: unknown;
}>;

function describeIdentity(row: OutcomeRecord): string {
  return `uuid=${JSON.stringify(row.uuid)}, side=${JSON.stringify(row.side)}, ragState=${JSON.stringify(row.ragState)}`;
}

function storedString(row: OutcomeRecord, field: keyof OutcomeRecord): string {
  const value = row[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new ReviewStoreDataError(
      `Invalid stored review outcome (${describeIdentity(row)}): field "${field}" must be a non-empty string.`,
    );
  }
  return value;
}

function storedOutcome(row: OutcomeRecord): ReviewOutcome {
  const outcome = storedString(row, "outcome");
  if (isReviewOutcome(outcome)) return outcome;

  const consolidation =
    LEGACY_REVIEW_OUTCOME_CONSOLIDATIONS[
      outcome as keyof typeof LEGACY_REVIEW_OUTCOME_CONSOLIDATIONS
    ];
  const disposition = consolidation
    ? `consolidate it into "${consolidation}" before syncing`
    : (REMOVED_REVIEW_OUTCOMES as readonly string[]).includes(outcome)
      ? "choose an explicit safe disposition before syncing"
      : "correct or remove it before syncing";
  throw new ReviewStoreDataError(
    `Invalid stored review outcome (${describeIdentity(row)}): outcome ${JSON.stringify(outcome)} is not canonical; ${disposition}.`,
  );
}

function toOutcome(row: OutcomeRecord): StoredReviewOutcome {
  const side = storedString(row, "side");
  if (!isReviewSide(side)) {
    throw new ReviewStoreDataError(
      `Invalid stored review outcome (${describeIdentity(row)}): field "side" is not supported.`,
    );
  }
  return {
    createdAt: storedString(row, "createdAt"),
    outcome: storedOutcome(row),
    ragState: storedString(row, "ragState"),
    reviewer: storedString(row, "reviewer"),
    side,
    updatedAt: storedString(row, "updatedAt"),
    uuid: storedString(row, "uuid"),
  };
}

function targetPredicate(target: ReviewOutcomeTarget) {
  return and(
    eq(reviewOutcomes.uuid, target.uuid),
    eq(reviewOutcomes.side, target.side),
    eq(reviewOutcomes.ragState, target.ragState),
  );
}

export function createReviewOutcomeRepository(
  db: ReviewStoreDatabase,
  now: () => Date,
  sqlite: Database.Database,
): ReviewOutcomeRepository {
  const reader = createReviewOutcomeReader(sqlite);
  return {
    clear(target) {
      validateTarget(target);
      try {
        return (
          db.delete(reviewOutcomes).where(targetPredicate(target)).run()
            .changes === 1
        );
      } catch (error) {
        throw new ReviewDatabaseError(
          "The review outcome could not be reset.",
          {
            cause: error,
          },
        );
      }
    },
    get(target) {
      validateTarget(target);
      try {
        const row = db
          .select()
          .from(reviewOutcomes)
          .where(targetPredicate(target))
          .get();
        return row ? toOutcome(row) : undefined;
      } catch (error) {
        throw new ReviewDatabaseError(
          "The review outcome could not be loaded.",
          {
            cause: error,
          },
        );
      }
    },
    listAll() {
      try {
        return db
          .select()
          .from(reviewOutcomes)
          .orderBy(
            asc(reviewOutcomes.uuid),
            asc(reviewOutcomes.side),
            asc(reviewOutcomes.ragState),
          )
          .all()
          .map(toOutcome);
      } catch (error) {
        throw new ReviewDatabaseError("Review outcomes could not be loaded.", {
          cause: error,
        });
      }
    },
    listTransitionCandidates: reader.listTransitionCandidates,
    resolve: reader.resolve,
    set(input) {
      validateTarget(input);
      if (!isReviewOutcome(input.outcome)) {
        throw new ReviewStoreValidationError(
          "outcome",
          `Review store field "outcome" must be one of: ${REVIEW_OUTCOMES.join(", ")}.`,
        );
      }
      requireValue("reviewer", input.reviewer);
      try {
        return db.transaction((transaction) => {
          const timestamp = now().toISOString();
          transaction
            .insert(reviewOutcomes)
            .values({
              createdAt: timestamp,
              outcome: input.outcome,
              ragState: input.ragState,
              reviewer: input.reviewer,
              side: input.side,
              updatedAt: timestamp,
              uuid: input.uuid,
            })
            .onConflictDoUpdate({
              target: [
                reviewOutcomes.uuid,
                reviewOutcomes.side,
                reviewOutcomes.ragState,
              ],
              set: {
                outcome: input.outcome,
                reviewer: input.reviewer,
                updatedAt: timestamp,
              },
            })
            .run();
          const stored = transaction
            .select()
            .from(reviewOutcomes)
            .where(targetPredicate(input))
            .get();
          if (!stored) {
            throw new ReviewDatabaseError(
              "The review outcome could not be read after it was stored.",
            );
          }
          return toOutcome(stored);
        });
      } catch (error) {
        if (error instanceof ReviewDatabaseError) throw error;
        throw new ReviewDatabaseError(
          "The review outcome could not be stored.",
          {
            cause: error,
          },
        );
      }
    },
  };
}

const RESOLVE_OUTCOMES_SQL = `
  with requested as (
    select
      json_extract(value, '$.uuid') as uuid,
      json_extract(value, '$.side') as side,
      json_extract(value, '$.ragState') as rag_state
    from json_each(?)
  )
  select
    outcome.rtq_uuid as uuid,
    outcome.side as side,
    outcome.rag_state as ragState,
    outcome.outcome as outcome,
    outcome.reviewer as reviewer,
    outcome.created_at as createdAt,
    outcome.updated_at as updatedAt
  from requested
  inner join review_outcomes as outcome
    on outcome.rtq_uuid = requested.uuid
    and outcome.side = requested.side
    and outcome.rag_state = requested.rag_state
  order by outcome.rtq_uuid, outcome.side, outcome.rag_state
`;

const LIST_TRANSITION_CANDIDATES_SQL = `
  select
    rtq_uuid as uuid,
    side as side,
    rag_state as ragState,
    outcome as outcome,
    reviewer as reviewer,
    created_at as createdAt,
    updated_at as updatedAt
  from review_outcomes
  where outcome in ('PRG', 'PRBD', 'PRCS')
  order by rtq_uuid, side, rag_state
`;

function uniqueTargets(
  targets: readonly ReviewOutcomeTarget[],
): readonly ReviewOutcomeTarget[] {
  const unique = new Map<string, ReviewOutcomeTarget>();
  for (const target of targets) {
    validateTarget(target);
    unique.set(
      JSON.stringify([target.uuid, target.side, target.ragState]),
      target,
    );
  }
  return [...unique.values()];
}

export function createReviewOutcomeReader(
  sqlite: Database.Database,
): ReviewOutcomeReader {
  const statement = sqlite.prepare(RESOLVE_OUTCOMES_SQL);
  const candidateStatement = sqlite.prepare(LIST_TRANSITION_CANDIDATES_SQL);
  return {
    listTransitionCandidates() {
      try {
        return (candidateStatement.all() as OutcomeRecord[]).map(toOutcome);
      } catch (error) {
        if (error instanceof ReviewStoreDataError) throw error;
        throw new ReviewDatabaseError(
          "Review outcome candidates could not be loaded.",
          { cause: error },
        );
      }
    },
    resolve(targets) {
      if (targets.length === 0) return [];
      const requested = uniqueTargets(targets);
      try {
        return (
          statement.all(JSON.stringify(requested)) as OutcomeRecord[]
        ).map(toOutcome);
      } catch (error) {
        if (
          error instanceof ReviewStoreDataError ||
          error instanceof ReviewStoreValidationError
        ) {
          throw error;
        }
        throw new ReviewDatabaseError(
          "Review outcomes could not be resolved. Check that the review-store database migrations are current.",
          { cause: error },
        );
      }
    },
  };
}
