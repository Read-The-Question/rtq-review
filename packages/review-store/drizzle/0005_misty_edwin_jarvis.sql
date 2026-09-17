PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_review_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`rtq_uuid` text NOT NULL,
	`side` text NOT NULL,
	`rag_state` text NOT NULL,
	`comment` text NOT NULL,
	`reviewer` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "review_comments_side_check" CHECK("__new_review_comments"."side" in ('question', 'answer', 'question-image', 'answer-image'))
);
--> statement-breakpoint
INSERT INTO `__new_review_comments`("id", "submission_id", "rtq_uuid", "side", "rag_state", "comment", "reviewer", "created_at") SELECT "id", "submission_id", "rtq_uuid", "side", "rag_state", "comment", "reviewer", "created_at" FROM `review_comments`;--> statement-breakpoint
DROP TABLE `review_comments`;--> statement-breakpoint
ALTER TABLE `__new_review_comments` RENAME TO `review_comments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `review_comments_submission_id_unique` ON `review_comments` (`submission_id`);--> statement-breakpoint
CREATE INDEX `review_comments_identity_state_created_idx` ON `review_comments` (`rtq_uuid`,`side`,`rag_state`,`created_at`);--> statement-breakpoint
CREATE TABLE `__new_review_outcomes` (
	`rtq_uuid` text NOT NULL,
	`side` text NOT NULL,
	`rag_state` text NOT NULL,
	`outcome` text NOT NULL,
	`reviewer` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "review_outcomes_side_check" CHECK("__new_review_outcomes"."side" in ('question', 'answer', 'question-image', 'answer-image'))
);
--> statement-breakpoint
INSERT INTO `__new_review_outcomes`("rtq_uuid", "side", "rag_state", "outcome", "reviewer", "created_at", "updated_at") SELECT "rtq_uuid", "side", "rag_state", "outcome", "reviewer", "created_at", "updated_at" FROM `review_outcomes`;--> statement-breakpoint
DROP TABLE `review_outcomes`;--> statement-breakpoint
ALTER TABLE `__new_review_outcomes` RENAME TO `review_outcomes`;--> statement-breakpoint
CREATE UNIQUE INDEX `review_outcomes_identity_state_unique` ON `review_outcomes` (`rtq_uuid`,`side`,`rag_state`);--> statement-breakpoint
CREATE INDEX `review_outcomes_updated_idx` ON `review_outcomes` (`updated_at`);