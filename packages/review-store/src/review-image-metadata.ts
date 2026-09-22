import { and, asc, eq } from "drizzle-orm";
import type Database from "better-sqlite3";

import {
  ReviewDatabaseError,
  ReviewStoreDataError,
  ReviewStoreValidationError,
} from "./errors.ts";
import { reviewImageMetadata } from "./schema.ts";
import type { ReviewStoreDatabase } from "./review-store.ts";
import {
  isImageReviewIgnoredReason,
  isImageReviewSide,
  isImageReviewType,
  type ImageReviewIgnoredReason,
  type ImageReviewType,
  type ReviewImageMetadataTarget,
  type SetReviewImageMetadata,
  type StoredReviewImageMetadata,
} from "./types.ts";

export type ReviewImageMetadataRepository = Readonly<{
  get: (
    target: ReviewImageMetadataTarget,
  ) => StoredReviewImageMetadata | undefined;
  listAll: () => readonly StoredReviewImageMetadata[];
  listCandidates: () => readonly StoredReviewImageMetadata[];
  resolve: (
    targets: readonly ReviewImageMetadataTarget[],
  ) => readonly StoredReviewImageMetadata[];
  set: (input: SetReviewImageMetadata) => StoredReviewImageMetadata;
}>;

export type ReviewImageMetadataReader = Pick<
  ReviewImageMetadataRepository,
  "listCandidates" | "resolve"
>;

type MetadataRecord = Readonly<{
  createdAt: unknown;
  imageIgnoredJson: unknown;
  imageTypesJson: unknown;
  ragState: unknown;
  reviewer: unknown;
  side: unknown;
  updatedAt: unknown;
  uuid: unknown;
}>;

function storedString(
  row: MetadataRecord,
  field: keyof MetadataRecord,
): string {
  const value = row[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new ReviewStoreDataError(
      `Invalid stored image metadata: field "${field}" must be a non-empty string.`,
    );
  }
  return value;
}

function storedArray<Value extends string>(
  row: MetadataRecord,
  field: "imageIgnoredJson" | "imageTypesJson",
  valid: (value: unknown) => value is Value,
): readonly Value[] {
  try {
    const values: unknown = JSON.parse(storedString(row, field));
    if (
      !Array.isArray(values) ||
      !values.every(valid) ||
      new Set(values).size !== values.length
    ) {
      throw new Error("invalid controlled image metadata");
    }
    return values;
  } catch {
    throw new ReviewStoreDataError(
      `Invalid stored image metadata: field "${field}" must contain a supported JSON array.`,
    );
  }
}

function toMetadata(row: MetadataRecord): StoredReviewImageMetadata {
  const side = storedString(row, "side");
  if (!isImageReviewSide(side)) {
    throw new ReviewStoreDataError(
      "Invalid stored image metadata: side must be an image review side.",
    );
  }
  return {
    createdAt: storedString(row, "createdAt"),
    ignored: storedArray<ImageReviewIgnoredReason>(
      row,
      "imageIgnoredJson",
      isImageReviewIgnoredReason,
    ),
    ragState: storedString(row, "ragState"),
    reviewer: storedString(row, "reviewer"),
    side,
    types: storedArray<ImageReviewType>(
      row,
      "imageTypesJson",
      isImageReviewType,
    ),
    updatedAt: storedString(row, "updatedAt"),
    uuid: storedString(row, "uuid"),
  };
}

function validateTarget(target: ReviewImageMetadataTarget): void {
  if (!target.uuid.trim()) throw new ReviewStoreValidationError("uuid");
  if (!target.ragState.trim()) {
    throw new ReviewStoreValidationError("ragState");
  }
  if (!isImageReviewSide(target.side)) {
    throw new ReviewStoreValidationError("side");
  }
}

function validateInput(input: SetReviewImageMetadata): void {
  validateTarget(input);
  if (!input.reviewer.trim()) {
    throw new ReviewStoreValidationError("reviewer");
  }
  if (
    !Array.isArray(input.types) ||
    !input.types.every(isImageReviewType) ||
    new Set(input.types).size !== input.types.length ||
    !Array.isArray(input.ignored) ||
    !input.ignored.every(isImageReviewIgnoredReason) ||
    new Set(input.ignored).size !== input.ignored.length
  ) {
    throw new ReviewStoreValidationError(
      "imageMetadata",
      'Review store field "imageMetadata" contains unsupported or duplicate values.',
    );
  }
}

function targetPredicate(target: ReviewImageMetadataTarget) {
  return and(
    eq(reviewImageMetadata.uuid, target.uuid),
    eq(reviewImageMetadata.side, target.side),
    eq(reviewImageMetadata.ragState, target.ragState),
  );
}

const RESOLVE_IMAGE_METADATA_SQL = `
  with requested as (
    select
      json_extract(value, '$.uuid') as uuid,
      json_extract(value, '$.side') as side,
      json_extract(value, '$.ragState') as rag_state
    from json_each(?)
  )
  select
    metadata.rtq_uuid as uuid,
    metadata.side as side,
    metadata.rag_state as ragState,
    metadata.image_types_json as imageTypesJson,
    metadata.image_ignored_json as imageIgnoredJson,
    metadata.reviewer as reviewer,
    metadata.created_at as createdAt,
    metadata.updated_at as updatedAt
  from requested
  inner join review_image_metadata as metadata
    on metadata.rtq_uuid = requested.uuid
    and metadata.side = requested.side
    and metadata.rag_state = requested.rag_state
  order by metadata.rtq_uuid, metadata.side, metadata.rag_state
`;

const LIST_IMAGE_METADATA_CANDIDATES_SQL = `
  select
    rtq_uuid as uuid,
    side as side,
    rag_state as ragState,
    image_types_json as imageTypesJson,
    image_ignored_json as imageIgnoredJson,
    reviewer as reviewer,
    created_at as createdAt,
    updated_at as updatedAt
  from review_image_metadata
  order by rtq_uuid, side, rag_state
`;

function uniqueTargets(
  targets: readonly ReviewImageMetadataTarget[],
): readonly ReviewImageMetadataTarget[] {
  const unique = new Map<string, ReviewImageMetadataTarget>();
  for (const target of targets) {
    validateTarget(target);
    unique.set(
      JSON.stringify([target.uuid, target.side, target.ragState]),
      target,
    );
  }
  return [...unique.values()];
}

export function createReviewImageMetadataReader(
  sqlite: Database.Database,
): ReviewImageMetadataReader {
  const statement = sqlite.prepare(RESOLVE_IMAGE_METADATA_SQL);
  const candidateStatement = sqlite.prepare(LIST_IMAGE_METADATA_CANDIDATES_SQL);
  return {
    listCandidates() {
      try {
        return (
          candidateStatement.all() as (typeof reviewImageMetadata.$inferSelect)[]
        ).map(toMetadata);
      } catch (error) {
        if (error instanceof ReviewStoreDataError) throw error;
        throw new ReviewDatabaseError(
          "Image metadata candidates could not be loaded.",
          { cause: error },
        );
      }
    },
    resolve(targets) {
      if (targets.length === 0) return [];
      const requested = uniqueTargets(targets);
      try {
        return (
          statement.all(
            JSON.stringify(requested),
          ) as (typeof reviewImageMetadata.$inferSelect)[]
        ).map(toMetadata);
      } catch (error) {
        if (error instanceof ReviewStoreValidationError) throw error;
        throw new ReviewDatabaseError(
          "Image review metadata could not be resolved. Check that the review-store database migrations are current.",
          { cause: error },
        );
      }
    },
  };
}

export function createReviewImageMetadataRepository(
  db: ReviewStoreDatabase,
  now: () => Date,
  sqlite: Database.Database,
): ReviewImageMetadataRepository {
  const reader = createReviewImageMetadataReader(sqlite);
  return {
    get(target) {
      validateTarget(target);
      try {
        const row = db
          .select()
          .from(reviewImageMetadata)
          .where(targetPredicate(target))
          .get();
        return row ? toMetadata(row) : undefined;
      } catch (error) {
        if (error instanceof ReviewStoreValidationError) throw error;
        throw new ReviewDatabaseError(
          "Image review metadata could not be loaded.",
          { cause: error },
        );
      }
    },
    listAll() {
      try {
        return db
          .select()
          .from(reviewImageMetadata)
          .orderBy(
            asc(reviewImageMetadata.uuid),
            asc(reviewImageMetadata.side),
            asc(reviewImageMetadata.ragState),
          )
          .all()
          .map(toMetadata);
      } catch (error) {
        throw new ReviewDatabaseError(
          "Image review metadata could not be loaded.",
          { cause: error },
        );
      }
    },
    listCandidates: reader.listCandidates,
    resolve: reader.resolve,
    set(input) {
      validateInput(input);
      try {
        return db.transaction((transaction) => {
          const timestamp = now().toISOString();
          transaction
            .insert(reviewImageMetadata)
            .values({
              createdAt: timestamp,
              imageIgnoredJson: JSON.stringify(input.ignored),
              imageTypesJson: JSON.stringify(input.types),
              ragState: input.ragState,
              reviewer: input.reviewer,
              side: input.side,
              updatedAt: timestamp,
              uuid: input.uuid,
            })
            .onConflictDoUpdate({
              target: [
                reviewImageMetadata.uuid,
                reviewImageMetadata.side,
                reviewImageMetadata.ragState,
              ],
              set: {
                imageIgnoredJson: JSON.stringify(input.ignored),
                imageTypesJson: JSON.stringify(input.types),
                reviewer: input.reviewer,
                updatedAt: timestamp,
              },
            })
            .run();
          const stored = transaction
            .select()
            .from(reviewImageMetadata)
            .where(targetPredicate(input))
            .get();
          if (!stored) {
            throw new ReviewDatabaseError(
              "Image review metadata could not be read after it was stored.",
            );
          }
          return toMetadata(stored);
        });
      } catch (error) {
        if (
          error instanceof ReviewDatabaseError ||
          error instanceof ReviewStoreValidationError
        ) {
          throw error;
        }
        throw new ReviewDatabaseError(
          "Image review metadata could not be stored.",
          { cause: error },
        );
      }
    },
  };
}
