PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_review_outcomes` (
	`rtq_uuid` text NOT NULL,
	`side` text NOT NULL,
	`rag_state` text NOT NULL,
	`outcome` text NOT NULL,
	`image_types_json` text,
	`image_ignored_json` text,
	`reviewer` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "review_outcomes_side_check" CHECK("__new_review_outcomes"."side" in ('question', 'answer', 'question-image', 'answer-image')),
	CONSTRAINT "review_outcomes_image_metadata_check" CHECK((("__new_review_outcomes"."side" in ('question-image', 'answer-image')) and (("__new_review_outcomes"."image_types_json" is null and "__new_review_outcomes"."image_ignored_json" is null) or ("__new_review_outcomes"."image_types_json" is not null and "__new_review_outcomes"."image_ignored_json" is not null))) or (("__new_review_outcomes"."side" in ('question', 'answer')) and "__new_review_outcomes"."image_types_json" is null and "__new_review_outcomes"."image_ignored_json" is null))
);
--> statement-breakpoint
INSERT INTO `__new_review_outcomes`("rtq_uuid", "side", "rag_state", "outcome", "image_types_json", "image_ignored_json", "reviewer", "created_at", "updated_at") SELECT "rtq_uuid", "side", "rag_state", "outcome", NULL, NULL, "reviewer", "created_at", "updated_at" FROM `review_outcomes`;--> statement-breakpoint
DROP TABLE `review_outcomes`;--> statement-breakpoint
ALTER TABLE `__new_review_outcomes` RENAME TO `review_outcomes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `review_outcomes_identity_state_unique` ON `review_outcomes` (`rtq_uuid`,`side`,`rag_state`);--> statement-breakpoint
CREATE INDEX `review_outcomes_updated_idx` ON `review_outcomes` (`updated_at`);
