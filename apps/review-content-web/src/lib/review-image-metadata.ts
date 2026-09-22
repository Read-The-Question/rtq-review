import {
  getReviewStore,
  ReviewDatabaseError,
  ReviewStoreValidationError,
  type ReviewImageMetadataRepository,
} from '@rtq/review-store/server';

import type { ReviewImageMetadataRequest } from './review-server.ts';

export type SaveImageMetadataResult = Readonly<{
  message: string;
  status: number;
}>;

export function persistReviewImageMetadata(
  input: ReviewImageMetadataRequest,
  repository: ReviewImageMetadataRepository = getReviewStore().imageMetadata,
): SaveImageMetadataResult {
  try {
    repository.set({
      ignored: input.imageMetadata.ignored,
      ragState: input.target.ragState,
      reviewer: input.reviewer,
      side: input.target.side,
      types: input.imageMetadata.types,
      uuid: input.target.uuid,
    });
    return {
      message: 'Image metadata saved for the current RAG state.',
      status: 200,
    };
  } catch (error) {
    if (error instanceof ReviewStoreValidationError) {
      return { message: 'The image metadata is not valid.', status: 400 };
    }
    if (error instanceof ReviewDatabaseError) {
      return {
        message: 'The review database is unavailable.',
        status: 503,
      };
    }
    throw error;
  }
}
