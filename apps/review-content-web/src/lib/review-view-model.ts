import {
  paperBrowserCollectionHref,
  paperBrowserPaperHref,
  type PaperBrowserRouteContract,
} from '@rtq/review-paper-browser/model';
import type { ReviewFilterSelection } from '@rtq/review-paper-model/client';
import type { ReviewSide } from '@rtq/review-store/types';

import type { QuestionContentFilter } from './question-content-filter';

export type { QuestionContentFilter } from './question-content-filter';

export const REVIEW_PREFERENCES_KEY = 'rtq.review-content.preferences.v11';
export const REVIEW_FILTER_DISCLOSURE_KEY =
  'rtq.review-content.filter-disclosure.v1';
export const PREVIOUS_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v10';
export const LEGACY_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v9';
export const EARLIER_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v8';
export const INITIAL_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v7';
export const OLDEST_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v6';
export const EARLIEST_REVIEW_PREFERENCES_KEY =
  'rtq.review-content.preferences.v5';

export type PaperImageMode = 'all' | 'generated';
export type ReviewControlMode = 'advanced' | 'simple';
export type ReviewContext = 'answer' | 'question';
export type ReviewPanelMode = 'both' | 'content' | 'image';
export type VisibleReviewSide = ReviewContext;

export type ReviewPreferences = Readonly<{
  paperImageMode: PaperImageMode;
  questionContentFilter: QuestionContentFilter;
  reviewControlMode: ReviewControlMode;
  reviewPanelMode: ReviewPanelMode;
  reviewSide: VisibleReviewSide;
  showFeedback: boolean;
  showImageMarkers: boolean;
  showImageTags: boolean;
  showImageStatusInfo: boolean;
  showInlineReview: boolean;
  showMetadata: boolean;
  showPdf: boolean;
  showQuestionStatusInfo: boolean;
  showRaw: boolean;
  showSolutions: boolean;
  showStatusBackground: boolean;
  showTags: boolean;
}>;

export const DEFAULT_REVIEW_PREFERENCES: ReviewPreferences = {
  paperImageMode: 'all',
  questionContentFilter: 'all',
  reviewControlMode: 'simple',
  reviewPanelMode: 'both',
  reviewSide: 'answer',
  showFeedback: true,
  showImageMarkers: true,
  showImageTags: true,
  showImageStatusInfo: true,
  showInlineReview: true,
  showMetadata: true,
  showPdf: true,
  showQuestionStatusInfo: true,
  showRaw: false,
  showSolutions: true,
  showStatusBackground: false,
  showTags: true,
};

export function parseReviewFilterDisclosure(value: string | null): boolean {
  if (!value) return false;
  try {
    const parsed: unknown = JSON.parse(value);
    return (
      Boolean(parsed) &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      (parsed as Record<string, unknown>).expanded === true
    );
  } catch {
    return false;
  }
}

function parsePreferenceRecord(
  value: string | null,
): Record<string, unknown> | undefined {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseReviewPreferences(
  value: string | null,
  previousValue: string | null = null,
  legacyValue: string | null = null,
  earlierValue: string | null = null,
  initialValue: string | null = null,
  oldestValue: string | null = null,
  earliestValue: string | null = null,
): ReviewPreferences {
  const parsed = parsePreferenceRecord(value);
  const previous = parsePreferenceRecord(previousValue);
  const legacy = parsePreferenceRecord(legacyValue);
  const earlier = parsePreferenceRecord(earlierValue);
  const initial = parsePreferenceRecord(initialValue);
  const oldest = parsePreferenceRecord(oldestValue);
  const earliest = parsePreferenceRecord(earliestValue);
  const records = [
    parsed,
    previous,
    legacy,
    earlier,
    initial,
    oldest,
    earliest,
  ];
  const oldReviewPreference =
    typeof parsed?.showReview === 'boolean'
      ? parsed.showReview
      : typeof previous?.showReview === 'boolean'
        ? previous.showReview
        : typeof legacy?.showReview === 'boolean'
          ? legacy.showReview
          : typeof earlier?.showReview === 'boolean'
            ? earlier.showReview
            : typeof initial?.showReview === 'boolean'
              ? initial.showReview
              : typeof oldest?.showReview === 'boolean'
                ? oldest.showReview
                : typeof earliest?.showReview === 'boolean'
                  ? earliest.showReview
                  : undefined;

  function preference(
    key: keyof ReviewPreferences,
    fallback: boolean,
  ): boolean {
    const currentPreference = parsed?.[key];
    const previousPreference = previous?.[key];
    const legacyPreference = legacy?.[key];
    const earlierPreference = earlier?.[key];
    const initialPreference = initial?.[key];
    const oldestPreference = oldest?.[key];
    const earliestPreference = earliest?.[key];
    if (typeof currentPreference === 'boolean') return currentPreference;
    if (typeof previousPreference === 'boolean') return previousPreference;
    if (typeof legacyPreference === 'boolean') return legacyPreference;
    if (typeof earlierPreference === 'boolean') return earlierPreference;
    if (typeof initialPreference === 'boolean') return initialPreference;
    if (typeof oldestPreference === 'boolean') return oldestPreference;
    if (typeof earliestPreference === 'boolean') return earliestPreference;
    return fallback;
  }

  function legacySide(): VisibleReviewSide {
    for (const record of records) {
      const requestedSide = record?.reviewSide ?? record?.reviewTargetSide;
      if (requestedSide === 'answer' || requestedSide === 'answer-image') {
        return 'answer';
      }
      if (requestedSide === 'question' || requestedSide === 'question-image') {
        return 'question';
      }
      if (
        record?.showQuestionReview === true &&
        record?.showAnswerReview !== true
      ) {
        return 'question';
      }
      if (
        record?.showAnswerReview === true &&
        record?.showQuestionReview !== true
      ) {
        return 'answer';
      }
      if (
        record?.showQuestionFeedback === true &&
        record?.showAnswerFeedback !== true
      ) {
        return 'question';
      }
      if (
        record?.showAnswerFeedback === true &&
        record?.showQuestionFeedback !== true
      ) {
        return 'answer';
      }
    }
    return DEFAULT_REVIEW_PREFERENCES.reviewSide;
  }

  function legacySidePreference(
    side: VisibleReviewSide,
    suffix: 'Feedback' | 'Review',
  ): boolean | undefined {
    const key = `show${side === 'question' ? 'Question' : 'Answer'}${suffix}`;
    for (const record of records) {
      const requested = record?.[key];
      if (typeof requested === 'boolean') return requested;
    }
    return undefined;
  }

  const requestedControlMode =
    parsed?.reviewControlMode ??
    previous?.reviewControlMode ??
    legacy?.reviewControlMode ??
    earlier?.reviewControlMode ??
    initial?.reviewControlMode;
  const requestedPanelMode =
    parsed?.reviewPanelMode ??
    previous?.reviewPanelMode ??
    legacy?.reviewPanelMode ??
    earlier?.reviewPanelMode ??
    initial?.reviewPanelMode ??
    oldest?.reviewPanelMode ??
    earliest?.reviewPanelMode;
  const requestedPaperImageMode =
    parsed?.paperImageMode ??
    previous?.paperImageMode ??
    legacy?.paperImageMode ??
    earlier?.paperImageMode ??
    initial?.paperImageMode ??
    oldest?.paperImageMode ??
    earliest?.paperImageMode;
  const requestedQuestionContentFilter = records
    .map((record) => record?.questionContentFilter)
    .find((value) => value === 'all' || value === 'image' || value === 'table');
  const reviewSide = legacySide();

  return {
    paperImageMode:
      requestedPaperImageMode === 'generated' ||
      requestedPaperImageMode === 'svg'
        ? 'generated'
        : DEFAULT_REVIEW_PREFERENCES.paperImageMode,
    questionContentFilter:
      requestedQuestionContentFilter === 'image' ||
      requestedQuestionContentFilter === 'table'
        ? requestedQuestionContentFilter
        : DEFAULT_REVIEW_PREFERENCES.questionContentFilter,
    reviewControlMode:
      requestedControlMode === 'advanced' || requestedControlMode === 'simple'
        ? requestedControlMode
        : DEFAULT_REVIEW_PREFERENCES.reviewControlMode,
    reviewPanelMode:
      requestedPanelMode === 'content' ||
      requestedPanelMode === 'image' ||
      requestedPanelMode === 'both'
        ? requestedPanelMode
        : DEFAULT_REVIEW_PREFERENCES.reviewPanelMode,
    reviewSide,
    showFeedback: preference(
      'showFeedback',
      legacySidePreference(reviewSide, 'Feedback') ??
        DEFAULT_REVIEW_PREFERENCES.showFeedback,
    ),
    showImageMarkers: preference(
      'showImageMarkers',
      DEFAULT_REVIEW_PREFERENCES.showImageMarkers,
    ),
    showImageTags: preference(
      'showImageTags',
      DEFAULT_REVIEW_PREFERENCES.showImageTags,
    ),
    showImageStatusInfo: preference(
      'showImageStatusInfo',
      DEFAULT_REVIEW_PREFERENCES.showImageStatusInfo,
    ),
    showInlineReview: preference(
      'showInlineReview',
      legacySidePreference(reviewSide, 'Review') ??
        oldReviewPreference ??
        DEFAULT_REVIEW_PREFERENCES.showInlineReview,
    ),
    showMetadata: preference(
      'showMetadata',
      DEFAULT_REVIEW_PREFERENCES.showMetadata,
    ),
    showPdf: preference('showPdf', DEFAULT_REVIEW_PREFERENCES.showPdf),
    showQuestionStatusInfo: preference(
      'showQuestionStatusInfo',
      DEFAULT_REVIEW_PREFERENCES.showQuestionStatusInfo,
    ),
    showRaw: preference('showRaw', DEFAULT_REVIEW_PREFERENCES.showRaw),
    showSolutions: preference(
      'showSolutions',
      DEFAULT_REVIEW_PREFERENCES.showSolutions,
    ),
    showStatusBackground: preference(
      'showStatusBackground',
      DEFAULT_REVIEW_PREFERENCES.showStatusBackground,
    ),
    showTags: preference('showTags', DEFAULT_REVIEW_PREFERENCES.showTags),
  };
}

export function reviewSidesForContext(
  context: ReviewContext,
): readonly [ReviewSide, ReviewSide] {
  return context === 'question'
    ? ['question', 'question-image']
    : ['answer', 'answer-image'];
}

export function visibleReviewSides(
  preferences: ReviewPreferences,
): readonly ReviewSide[] {
  return preferences.showInlineReview ? selectedReviewSides(preferences) : [];
}

export function visibleFeedbackSides(
  preferences: ReviewPreferences,
): readonly ReviewSide[] {
  return preferences.showFeedback ? selectedReviewSides(preferences) : [];
}

export function activeReviewSides(
  preferences: ReviewPreferences,
): readonly ReviewSide[] {
  return selectedReviewSides(preferences);
}

function selectedReviewSides(
  preferences: ReviewPreferences,
): readonly ReviewSide[] {
  if (preferences.reviewPanelMode === 'content') {
    return preferences.reviewSide === 'question' ? ['question'] : ['answer'];
  }
  if (preferences.reviewPanelMode === 'image') {
    return preferences.reviewSide === 'question'
      ? ['question-image']
      : ['answer-image'];
  }
  return reviewSidesForContext(preferences.reviewSide);
}

export function reviewFilterSelectionForContext(
  selection: ReviewFilterSelection,
  context: ReviewContext,
): ReviewFilterSelection {
  return context === 'question'
    ? {
        ...selection,
        answerImageRag: [],
        answerImageReview: [],
        answerRag: [],
        answerReview: [],
      }
    : {
        ...selection,
        questionImageRag: [],
        questionImageReview: [],
        questionRag: [],
        questionReview: [],
      };
}

export function clearReviewFiltersForContext(
  selection: ReviewFilterSelection,
  context: ReviewContext,
): ReviewFilterSelection {
  const withoutDimensions = {
    ...selection,
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };
  return context === 'question'
    ? {
        ...withoutDimensions,
        questionImageRag: [],
        questionImageReview: [],
        questionRag: [],
        questionReview: [],
      }
    : {
        ...withoutDimensions,
        answerImageRag: [],
        answerImageReview: [],
        answerRag: [],
        answerReview: [],
      };
}

export function clearReviewOutcomeFiltersForContext(
  selection: ReviewFilterSelection,
  context: ReviewContext,
): ReviewFilterSelection {
  return context === 'question'
    ? {
        ...selection,
        questionImageReview: [],
        questionReview: [],
      }
    : {
        ...selection,
        answerImageReview: [],
        answerReview: [],
      };
}

export function adjacentQuestionId(
  questionIds: readonly string[],
  activeId: string | undefined,
  direction: -1 | 1,
): string | undefined {
  if (questionIds.length === 0) return undefined;
  const activeIndex = activeId ? questionIds.indexOf(activeId) : -1;
  const nextIndex =
    activeIndex < 0
      ? direction === 1
        ? 0
        : questionIds.length - 1
      : activeIndex + direction;
  return questionIds[nextIndex];
}

export type ContentSearchRouteState = Readonly<{
  pattern: string;
  scope: 'all' | 'answer' | 'question' | 'working';
}>;

const paperBrowserRoutes: PaperBrowserRouteContract = {
  collectionBasePath: '/papers',
  contentSearchPath: '/api/papers/content-search',
};

function paperBrowserSearchState(
  indexQuery?: string,
  contentSearch?: ContentSearchRouteState,
) {
  const pattern = contentSearch?.pattern.trim() ?? '';
  return {
    content:
      pattern && contentSearch
        ? { pattern, scope: contentSearch.scope }
        : undefined,
    query: indexQuery?.trim() ?? '',
  };
}

export function paperRoute(
  collectionId: string,
  relativePath: string,
  indexQuery?: string,
  contentSearch?: ContentSearchRouteState,
): string {
  return paperBrowserPaperHref(
    paperBrowserRoutes,
    collectionId,
    relativePath,
    paperBrowserSearchState(indexQuery, contentSearch),
  );
}

export function collectionRoute(
  collectionId: string,
  indexQuery?: string,
  contentSearch?: ContentSearchRouteState,
): string {
  return paperBrowserCollectionHref(
    paperBrowserRoutes,
    collectionId,
    paperBrowserSearchState(indexQuery, contentSearch),
  );
}

export function reviewStateLabel(value: string): string {
  const state = value
    .trim()
    .replace(/^rag_wf_/i, '')
    .replace(/^rag_/i, '')
    .replaceAll(/[_-]+/g, ' ');
  return state.toLowerCase() === 'notapplicable' ? 'N/A' : state.toUpperCase();
}
