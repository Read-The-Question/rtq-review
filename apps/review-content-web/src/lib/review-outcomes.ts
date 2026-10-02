import type { ReviewPaper } from '@rtq/review-paper-model';
import { REVIEW_SIDES } from '@rtq/review-store/types';
import {
  getReviewStore,
  ReviewDatabaseError,
  ReviewStoreValidationError,
  type ReviewOutcomeRepository,
  type ReviewImageMetadataRepository,
} from '@rtq/review-store/server';

import type { ReviewOutcomeRequest } from './review-server.ts';
import {
  isReviewOutcome,
  reviewOutcomeLabel,
  reviewTargetForNode,
  reviewTargetKey,
  type ReviewOutcomeLoad,
  type ReviewOutcomeSelection,
  type ImageReviewMetadata,
} from './review-types.ts';

export type SubmitOutcomeResult = Readonly<{
  message: string;
  status: number;
}>;

type DatabaseOutcomeOptions = Readonly<{
  repository?: ReviewOutcomeRepository;
}>;

export function persistReviewOutcome(
  input: ReviewOutcomeRequest,
  options: DatabaseOutcomeOptions = {},
): SubmitOutcomeResult {
  try {
    const repository = options.repository ?? getReviewStore().outcomes;
    if (input.outcome === null) {
      repository.clear({
        ragState: input.target.ragState,
        side: input.target.side,
        uuid: input.target.uuid,
      });
      return {
        message: 'Review request reset in the review database.',
        status: 200,
      };
    }
    repository.set({
      outcome: input.outcome,
      ragState: input.target.ragState,
      reviewer: input.reviewer,
      side: input.target.side,
      uuid: input.target.uuid,
    });
    return {
      message:
        input.outcome === 'PRG'
          ? 'Approved and saved to the review database.'
          : `${reviewOutcomeLabel(input.outcome)} saved to the review database.`,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ReviewStoreValidationError) {
      return { message: 'The review request is not valid.', status: 400 };
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

export async function submitReviewOutcome(
  input: ReviewOutcomeRequest,
  options: DatabaseOutcomeOptions = {},
): Promise<SubmitOutcomeResult> {
  return persistReviewOutcome(input, options);
}

export function reviewOutcomeTargetsForPaper(paper: ReviewPaper) {
  const source = {
    collectionId: paper.source.collection.id,
    relativePath: paper.source.relativePath,
  };
  return paper.sections.flatMap((section) =>
    section.questions.flatMap((question) =>
      REVIEW_SIDES.flatMap((side) => {
        const target = reviewTargetForNode(question, side, source);
        return target
          ? [
              {
                ragState: target.ragState,
                side: target.side,
                uuid: target.uuid,
              },
            ]
          : [];
      }),
    ),
  );
}

type LoadReviewOutcomeOptions = Readonly<{
  imageMetadataRepository?: ReviewImageMetadataRepository;
  repository?: ReviewOutcomeRepository;
}>;

export function loadReviewOutcomesForPaper(
  paper: ReviewPaper,
  options: LoadReviewOutcomeOptions = {},
): ReviewOutcomeLoad {
  try {
    const store = getReviewStore();
    const repository = options.repository ?? store.outcomes;
    const imageMetadataRepository =
      options.imageMetadataRepository ?? store.imageMetadata;
    const targets = reviewOutcomeTargetsForPaper(paper);
    const requested = new Set(
      targets.map((target) =>
        JSON.stringify([target.uuid, target.side, target.ragState]),
      ),
    );
    const outcomes: Record<string, ReviewOutcomeSelection> = {};
    const imageMetadata: Record<string, ImageReviewMetadata> = {};
    const storedOutcomes = repository.resolve(targets);
    for (const stored of storedOutcomes) {
      const identity = JSON.stringify([
        stored.uuid,
        stored.side,
        stored.ragState,
      ]);
      if (!requested.has(identity) || !isReviewOutcome(stored.outcome)) {
        throw new Error('The review database returned an invalid outcome.');
      }
      const key = reviewTargetKey(stored);
      outcomes[key] = stored.outcome;
    }
    const imageTargets = targets.flatMap((target) =>
      target.side === 'answer-image' || target.side === 'question-image'
        ? [{ ...target, side: target.side }]
        : [],
    );
    for (const stored of imageMetadataRepository.resolve(imageTargets)) {
      const identity = JSON.stringify([
        stored.uuid,
        stored.side,
        stored.ragState,
      ]);
      if (!requested.has(identity)) {
        throw new Error('The review database returned invalid image metadata.');
      }
      imageMetadata[reviewTargetKey(stored)] = {
        ignored: stored.ignored,
        types: stored.types,
      };
    }
    return { destination: 'database', imageMetadata, outcomes };
  } catch {
    return {
      destination: 'database',
      error:
        'Review requests are unavailable. Check the rtq-review database directory and retry.',
      imageMetadata: {},
      outcomes: {},
    };
  }
}
