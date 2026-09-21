import type { DisplayReviewPaper } from './display-model';
import type { ReviewCommentLoad, ReviewOutcomeLoad } from './review-types';

export const CORPUS_SEARCH_LIMITS = [20, 50, 100] as const;
export type CorpusSearchLimit = (typeof CORPUS_SEARCH_LIMITS)[number];

export type CorpusSearchResponse = Readonly<{
  commentLoad: ReviewCommentLoad;
  endPosition: number;
  invalidFileCount: number;
  limit: CorpusSearchLimit;
  nextCursor?: string;
  outcomeLoad: ReviewOutcomeLoad;
  paper: DisplayReviewPaper;
  previousCursor?: string;
  reviewer: string;
  scannedFileCount: number;
  searchError?: string;
  startPosition: number;
}>;

export function isCorpusSearchLimit(value: number): value is CorpusSearchLimit {
  return CORPUS_SEARCH_LIMITS.some((limit) => limit === value);
}
