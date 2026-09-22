CREATE TABLE `review_image_metadata` (
	`rtq_uuid` text NOT NULL,
	`side` text NOT NULL,
	`rag_state` text NOT NULL,
	`image_types_json` text NOT NULL,
	`image_ignored_json` text NOT NULL,
	`reviewer` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "review_image_metadata_side_check" CHECK("review_image_metadata"."side" in ('question-image', 'answer-image'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `review_image_metadata_identity_state_unique` ON `review_image_metadata` (`rtq_uuid`,`side`,`rag_state`);--> statement-breakpoint
CREATE INDEX `review_image_metadata_updated_idx` ON `review_image_metadata` (`updated_at`);--> statement-breakpoint
INSERT INTO `review_image_metadata` (
	`rtq_uuid`,
	`side`,
	`rag_state`,
	`image_types_json`,
	`image_ignored_json`,
	`reviewer`,
	`created_at`,
	`updated_at`
)
SELECT
	`rtq_uuid`,
	`side`,
	`rag_state`,
	`image_types_json`,
	`image_ignored_json`,
	`reviewer`,
	`created_at`,
	`updated_at`
FROM `review_outcomes`
WHERE
	`side` IN ('question-image', 'answer-image')
	AND `image_types_json` IS NOT NULL
	AND `image_ignored_json` IS NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `review_outcomes_identity_state_unique` ON `review_outcomes` (`rtq_uuid`,`side`,`rag_state`);--> statement-breakpoint
CREATE INDEX `review_outcomes_updated_idx` ON `review_outcomes` (`updated_at`);