import type { DisplayReviewPaper } from './display-model';
import type { ReviewCommentLoad, ReviewOutcomeLoad } from './review-types';

export const CORPUS_SEARCH_LIMITS = [20, 50, 100] as const;
export type CorpusSearchLimit = (typeof CORPUS_SEARCH_LIMITS)[number];
export type CorpusSearchMode = 'content' | 'uuid';

export type CorpusSearchResponse = Readonly<{
  commentLoad: ReviewCommentLoad;
  endPosition: number;
  invalidFileCount: number;
  limit: CorpusSearchLimit;
  missingUuids: readonly string[];
  nextCursor?: string;
  outcomeLoad: ReviewOutcomeLoad;
  paper: DisplayReviewPaper;
  previousCursor?: string;
  reviewer: string;
  scannedFileCount: number;
  searchError?: string;
  searchMode: CorpusSearchMode;
  startPosition: number;
  uuidInput?: string;
  uuidRequestCount: number;
}>;

export function isCorpusSearchLimit(value: number): value is CorpusSearchLimit {
  return CORPUS_SEARCH_LIMITS.some((limit) => limit === value);
}
