export const REVIEW_PREFERENCES_KEY = 'rtq.review-content.preferences.v1';

export type ReviewPreferences = Readonly<{
  showRaw: boolean;
  showReview: boolean;
  showSolutions: boolean;
  showTags: boolean;
}>;

export const DEFAULT_REVIEW_PREFERENCES: ReviewPreferences = {
  showRaw: false,
  showReview: true,
  showSolutions: true,
  showTags: true,
};

export function parseReviewPreferences(
  value: string | null,
): ReviewPreferences {
  if (!value) return DEFAULT_REVIEW_PREFERENCES;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return {
      showRaw:
        typeof parsed.showRaw === 'boolean'
          ? parsed.showRaw
          : DEFAULT_REVIEW_PREFERENCES.showRaw,
      showReview:
        typeof parsed.showReview === 'boolean'
          ? parsed.showReview
          : DEFAULT_REVIEW_PREFERENCES.showReview,
      showSolutions:
        typeof parsed.showSolutions === 'boolean'
          ? parsed.showSolutions
          : DEFAULT_REVIEW_PREFERENCES.showSolutions,
      showTags:
        typeof parsed.showTags === 'boolean'
          ? parsed.showTags
          : DEFAULT_REVIEW_PREFERENCES.showTags,
    };
  } catch {
    return DEFAULT_REVIEW_PREFERENCES;
  }
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

export function paperRoute(collectionId: string, relativePath: string): string {
  const slug = relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/papers/${encodeURIComponent(collectionId)}/${slug}`;
}

export function reviewStateLabel(value: string): string {
  return value
    .trim()
    .replace(/^rag_wf_/i, '')
    .replace(/^rag_/i, '')
    .replaceAll(/[_-]+/g, ' ')
    .toUpperCase();
}
