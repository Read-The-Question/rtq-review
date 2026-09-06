export const reviewApiBaseUrl =
  process.env.RTQ_REVIEW_API_BASE_URL ?? 'http://localhost:4567';

export const reviewContentReviewer = process.env.RTQ_REVIEWER?.trim() || 'up';
