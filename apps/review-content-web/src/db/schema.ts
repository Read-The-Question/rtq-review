import { sql } from 'drizzle-orm';
import {
  check,
  index,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const reviewComments = sqliteTable(
  'review_comments',
  {
    id: text('id').primaryKey(),
    submissionId: text('submission_id').notNull(),
    questionId: text('rtq_question_id'),
    uuid: text('rtq_uuid').notNull(),
    side: text('side', { enum: ['question', 'answer'] }).notNull(),
    ragState: text('rag_state').notNull(),
    comment: text('comment').notNull(),
    reviewer: text('reviewer').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    check(
      'review_comments_side_check',
      sql`${table.side} in ('question', 'answer')`,
    ),
    uniqueIndex('review_comments_submission_id_unique').on(table.submissionId),
    index('review_comments_identity_state_created_idx').on(
      table.uuid,
      table.questionId,
      table.side,
      table.ragState,
      table.createdAt,
    ),
  ],
);
