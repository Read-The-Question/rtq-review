export const REVIEW_SIDES = [
  "question",
  "question-image",
  "answer",
  "answer-image",
] as const;

export type ReviewSide = (typeof REVIEW_SIDES)[number];
export type ReviewImageSide = Extract<
  ReviewSide,
  "answer-image" | "question-image"
>;

export const IMAGE_REVIEW_TYPES = ["generated", "screenshot"] as const;
export const IMAGE_REVIEW_IGNORED_REASONS = ["decorative"] as const;

export type ImageReviewType = (typeof IMAGE_REVIEW_TYPES)[number];
export type ImageReviewIgnoredReason =
  (typeof IMAGE_REVIEW_IGNORED_REASONS)[number];

export type ImageReviewMetadata = Readonly<{
  ignored: readonly ImageReviewIgnoredReason[];
  types: readonly ImageReviewType[];
}>;

export function isImageReviewSide(side: unknown): side is ReviewImageSide {
  return side === "answer-image" || side === "question-image";
}

export function isImageReviewType(value: unknown): value is ImageReviewType {
  return (
    typeof value === "string" &&
    (IMAGE_REVIEW_TYPES as readonly string[]).includes(value)
  );
}

export function isImageReviewIgnoredReason(
  value: unknown,
): value is ImageReviewIgnoredReason {
  return (
    typeof value === "string" &&
    (IMAGE_REVIEW_IGNORED_REASONS as readonly string[]).includes(value)
  );
}

export function isReviewSide(value: unknown): value is ReviewSide {
  return (
    typeof value === "string" &&
    (REVIEW_SIDES as readonly string[]).includes(value)
  );
}

export const GLOBAL_REVIEW_FINDING_STATUSES = ["todo", "processed"] as const;

export type GlobalReviewFindingStatus =
  (typeof GLOBAL_REVIEW_FINDING_STATUSES)[number];

export type GlobalReviewFinding = Readonly<{
  createdAt: string;
  finding: string;
  id: string;
  processedAt: string | null;
  processedBy: string | null;
  reviewer: string;
  sourceCollectionId: string;
  sourceNodeId: string;
  sourceNodeLabel: string;
  sourceNodeUuid: string | null;
  sourcePaperTitle: string;
  sourceRelativePath: string;
  sourceSide: ReviewSide;
  sourceVersion: string;
  status: GlobalReviewFindingStatus;
  submissionId: string;
}>;

export const REVIEW_OUTCOMES = [
  "PRNS",
  "PRG",
  "PRBD",
  "PRCS",
  "PRCR",
  "PRCC",
] as const;

export type ReviewOutcome = (typeof REVIEW_OUTCOMES)[number];

export const LEGACY_REVIEW_OUTCOME_CONSOLIDATIONS = {
  PRA: "PRBD",
  PRG2: "PRG",
  PRPCC: "PRG",
  PRR: "PRBD",
} as const satisfies Readonly<Record<string, ReviewOutcome>>;

export const REMOVED_REVIEW_OUTCOMES = ["PRPCR", "PRRL", "PRCT"] as const;

export function isReviewOutcome(value: unknown): value is ReviewOutcome {
  return (
    typeof value === "string" &&
    (REVIEW_OUTCOMES as readonly string[]).includes(value)
  );
}

export type ReviewTargetIdentity = Readonly<{
  side: ReviewSide;
  uuid: string;
}>;

export type ReviewCommentTarget = ReviewTargetIdentity &
  Readonly<{
    ragState: string;
  }>;

export type LocalReviewComment = ReviewTargetIdentity &
  Readonly<{
    comment: string;
    createdAt: string;
    id: string;
    ragState: string;
    reviewer: string;
    submissionId: string;
  }>;

export type ReviewOutcomeTarget = Readonly<{
  ragState: string;
  side: ReviewSide;
  uuid: string;
}>;

export type ReviewImageMetadataTarget = Readonly<{
  ragState: string;
  side: ReviewImageSide;
  uuid: string;
}>;

export type StoredReviewImageMetadata = ReviewImageMetadataTarget &
  ImageReviewMetadata &
  Readonly<{
    createdAt: string;
    reviewer: string;
    updatedAt: string;
  }>;

export type SetReviewImageMetadata = ReviewImageMetadataTarget &
  ImageReviewMetadata &
  Readonly<{
    reviewer: string;
  }>;

export type StoredReviewOutcome = ReviewOutcomeTarget &
  Readonly<{
    createdAt: string;
    outcome: ReviewOutcome;
    reviewer: string;
    updatedAt: string;
  }>;

export type SetReviewOutcome = ReviewOutcomeTarget &
  Readonly<{
    outcome: ReviewOutcome;
    reviewer: string;
  }>;
