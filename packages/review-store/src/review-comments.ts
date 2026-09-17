import { randomUUID } from "node:crypto";

import { and, asc, eq, or } from "drizzle-orm";

import {
  ReviewCommentConflictError,
  ReviewDatabaseError,
  ReviewStoreValidationError,
} from "./errors.ts";
import { reviewComments } from "./schema.ts";
import type { ReviewStoreDatabase } from "./review-store.ts";
import type Database from "better-sqlite3";
import type {
  LocalReviewComment,
  ReviewCommentTarget,
  ReviewTargetIdentity,
} from "./types.ts";
import { isReviewSide } from "./types.ts";

export type AppendReviewComment = ReviewTargetIdentity &
  Readonly<{
    comment: string;
    ragState: string;
    reviewer: string;
    submissionId: string;
  }>;

export type ReviewCommentRepository = Readonly<{
  append: (
    input: AppendReviewComment,
  ) => Readonly<{ comment: LocalReviewComment; created: boolean }>;
  listForTargets: (
    targets: readonly ReviewTargetIdentity[],
  ) => readonly LocalReviewComment[];
}>;

export type ReviewCommentReader = Readonly<{
  resolve: (
    targets: readonly ReviewCommentTarget[],
  ) => readonly LocalReviewComment[];
}>;

function toComment(
  row: typeof reviewComments.$inferSelect,
): LocalReviewComment {
  return {
    comment: row.comment,
    createdAt: row.createdAt,
    id: row.id,
    ragState: row.ragState,
    reviewer: row.reviewer,
    side: row.side,
    submissionId: row.submissionId,
    uuid: row.uuid,
  };
}

function sameSubmission(
  stored: typeof reviewComments.$inferSelect,
  input: AppendReviewComment,
): boolean {
  return (
    stored.submissionId === input.submissionId &&
    stored.uuid === input.uuid &&
    stored.side === input.side &&
    stored.ragState === input.ragState &&
    stored.comment === input.comment &&
    stored.reviewer === input.reviewer
  );
}

export function createReviewCommentRepository(
  db: ReviewStoreDatabase,
  now: () => Date,
): ReviewCommentRepository {
  return {
    append(input) {
      try {
        return db.transaction((transaction) => {
          const insertion = transaction
            .insert(reviewComments)
            .values({
              comment: input.comment,
              createdAt: now().toISOString(),
              id: randomUUID(),
              ragState: input.ragState,
              reviewer: input.reviewer,
              side: input.side,
              submissionId: input.submissionId,
              uuid: input.uuid,
            })
            .onConflictDoNothing({ target: reviewComments.submissionId })
            .run();

          const stored = transaction
            .select()
            .from(reviewComments)
            .where(eq(reviewComments.submissionId, input.submissionId))
            .get();
          if (!stored) {
            throw new ReviewDatabaseError(
              "The local comment could not be read after it was stored.",
            );
          }
          if (!sameSubmission(stored, input)) {
            throw new ReviewCommentConflictError();
          }
          return {
            comment: toComment(stored),
            created: insertion.changes === 1,
          };
        });
      } catch (error) {
        if (
          error instanceof ReviewCommentConflictError ||
          error instanceof ReviewDatabaseError
        ) {
          throw error;
        }
        throw new ReviewDatabaseError(
          "The local comment could not be stored.",
          {
            cause: error,
          },
        );
      }
    },
    listForTargets(targets) {
      if (targets.length === 0) return [];
      try {
        const predicates = targets.map((target) =>
          and(
            eq(reviewComments.uuid, target.uuid),
            eq(reviewComments.side, target.side),
          ),
        );
        const where = or(...predicates);
        if (!where) return [];
        return db
          .select()
          .from(reviewComments)
          .where(where)
          .orderBy(asc(reviewComments.createdAt), asc(reviewComments.id))
          .all()
          .map(toComment);
      } catch (error) {
        throw new ReviewDatabaseError("Local comments could not be loaded.", {
          cause: error,
        });
      }
    },
  };
}

function validateTarget(target: ReviewCommentTarget): void {
  if (!target.uuid.trim()) throw new ReviewStoreValidationError("uuid");
  if (!target.ragState.trim()) {
    throw new ReviewStoreValidationError("ragState");
  }
  if (!isReviewSide(target.side)) {
    throw new ReviewStoreValidationError("side");
  }
}

const RESOLVE_COMMENTS_SQL = `
  with requested as (
    select
      json_extract(value, '$.uuid') as uuid,
      json_extract(value, '$.side') as side,
      json_extract(value, '$.ragState') as rag_state
    from json_each(?)
  )
  select
    comment.id as id,
    comment.submission_id as submissionId,
    comment.rtq_uuid as uuid,
    comment.side as side,
    comment.rag_state as ragState,
    comment.comment as comment,
    comment.reviewer as reviewer,
    comment.created_at as createdAt
  from requested
  inner join review_comments as comment
    on comment.rtq_uuid = requested.uuid
    and comment.side = requested.side
    and comment.rag_state = requested.rag_state
  order by comment.rtq_uuid, comment.side, comment.rag_state,
    comment.created_at, comment.id
`;

function uniqueTargets(
  targets: readonly ReviewCommentTarget[],
): readonly ReviewCommentTarget[] {
  const unique = new Map<string, ReviewCommentTarget>();
  for (const target of targets) {
    validateTarget(target);
    unique.set(
      JSON.stringify([target.uuid, target.side, target.ragState]),
      target,
    );
  }
  return [...unique.values()];
}

export function createReviewCommentReader(
  sqlite: Database.Database,
): ReviewCommentReader {
  const statement = sqlite.prepare(RESOLVE_COMMENTS_SQL);
  return {
    resolve(targets) {
      if (targets.length === 0) return [];
      const requested = uniqueTargets(targets);
      try {
        return (
          statement.all(
            JSON.stringify(requested),
          ) as (typeof reviewComments.$inferSelect)[]
        ).map(toComment);
      } catch (error) {
        if (error instanceof ReviewStoreValidationError) throw error;
        throw new ReviewDatabaseError(
          "Review comments could not be resolved. Check that the review-store database migrations are current.",
          { cause: error },
        );
      }
    },
  };
}
