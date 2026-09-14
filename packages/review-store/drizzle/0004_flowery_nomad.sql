DROP INDEX `review_comments_identity_state_created_idx`;--> statement-breakpoint
CREATE INDEX `review_comments_identity_state_created_idx` ON `review_comments` (`rtq_uuid`,`side`,`rag_state`,`created_at`);--> statement-breakpoint
ALTER TABLE `review_comments` DROP COLUMN `rtq_question_id`;