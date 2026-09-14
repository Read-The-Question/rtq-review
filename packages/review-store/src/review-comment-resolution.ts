import { ReviewCommentRequestError } from "./errors.ts";
import type { ReviewCommentReader } from "./review-comments.ts";
import type { LocalReviewComment, ReviewCommentTarget } from "./types.ts";

export const REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION = 1 as const;

export type ReviewCommentResolutionRequest = Readonly<{
  schemaVersion: typeof REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION;
  targets: readonly ReviewCommentTarget[];
}>;

export type ReviewCommentResolutionResponse = Readonly<{
  schemaVersion: typeof REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION;
  matches: readonly LocalReviewComment[];
}>;

function recordAt(value: unknown, location: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ReviewCommentRequestError(`${location} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function stringAt(
  record: Record<string, unknown>,
  field: string,
  location: string,
): string {
  const value = record[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new ReviewCommentRequestError(
      `${location}.${field} must be a non-empty string.`,
    );
  }
  return value;
}

function parseTarget(value: unknown, index: number): ReviewCommentTarget {
  const location = `targets[${index}]`;
  const record = recordAt(value, location);
  const side = record.side;
  if (side !== "question" && side !== "answer") {
    throw new ReviewCommentRequestError(
      `${location}.side must be "question" or "answer".`,
    );
  }
  return {
    ragState: stringAt(record, "ragState", location),
    side,
    uuid: stringAt(record, "uuid", location),
  };
}

export function parseReviewCommentResolutionRequest(
  input: unknown,
): ReviewCommentResolutionRequest {
  const record = recordAt(input, "Request");
  if (record.schemaVersion !== REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION) {
    throw new ReviewCommentRequestError(
      `schemaVersion must be ${REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION}.`,
    );
  }
  if (!Array.isArray(record.targets)) {
    throw new ReviewCommentRequestError("targets must be an array.");
  }
  return {
    schemaVersion: REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION,
    targets: record.targets.map(parseTarget),
  };
}

export function resolveReviewCommentRequest(
  input: unknown,
  reader: ReviewCommentReader,
): ReviewCommentResolutionResponse {
  const request = parseReviewCommentResolutionRequest(input);
  return {
    schemaVersion: REVIEW_COMMENT_RESOLUTION_SCHEMA_VERSION,
    matches: reader.resolve(request.targets),
  };
}

export function resolveReviewCommentRequestJson(
  input: string,
  reader: ReviewCommentReader,
): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new ReviewCommentRequestError("Input must be valid JSON.");
  }
  return `${JSON.stringify(resolveReviewCommentRequest(parsed, reader))}\n`;
}
