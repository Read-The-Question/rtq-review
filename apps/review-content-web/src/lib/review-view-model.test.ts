import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_REVIEW_PREFERENCES,
  EARLIER_REVIEW_PREFERENCES_KEY,
  INITIAL_REVIEW_PREFERENCES_KEY,
  LEGACY_REVIEW_PREFERENCES_KEY,
  PREVIOUS_REVIEW_PREFERENCES_KEY,
  REVIEW_FILTER_DISCLOSURE_KEY,
  REVIEW_PREFERENCES_KEY,
  activeReviewSides,
  adjacentQuestionId,
  collectionRoute,
  paperRoute,
  parseReviewFilterDisclosure,
  parseReviewPreferences,
  reviewStateLabel,
  visibleFeedbackSides,
  visibleReviewSides,
} from './review-view-model.ts';

test('display preference storage is versioned for review status treatments', () => {
  assert.equal(REVIEW_PREFERENCES_KEY, 'rtq.review-content.preferences.v5');
  assert.equal(
    PREVIOUS_REVIEW_PREFERENCES_KEY,
    'rtq.review-content.preferences.v4',
  );
  assert.equal(
    LEGACY_REVIEW_PREFERENCES_KEY,
    'rtq.review-content.preferences.v3',
  );
  assert.equal(
    EARLIER_REVIEW_PREFERENCES_KEY,
    'rtq.review-content.preferences.v2',
  );
  assert.equal(
    INITIAL_REVIEW_PREFERENCES_KEY,
    'rtq.review-content.preferences.v1',
  );
});

test('review filter disclosure storage is versioned and safely parsed', () => {
  assert.equal(
    REVIEW_FILTER_DISCLOSURE_KEY,
    'rtq.review-content.filter-disclosure.v1',
  );
  assert.equal(parseReviewFilterDisclosure(null), false);
  assert.equal(parseReviewFilterDisclosure('{broken'), false);
  assert.equal(parseReviewFilterDisclosure('{}'), false);
  assert.equal(parseReviewFilterDisclosure('{"expanded":false}'), false);
  assert.equal(parseReviewFilterDisclosure('{"expanded":true}'), true);
});

test('preferences survive partial and malformed local values', () => {
  assert.deepEqual(parseReviewPreferences(null), DEFAULT_REVIEW_PREFERENCES);
  assert.deepEqual(
    parseReviewPreferences('{broken'),
    DEFAULT_REVIEW_PREFERENCES,
  );
  assert.deepEqual(parseReviewPreferences('{"showRaw":true}'), {
    ...DEFAULT_REVIEW_PREFERENCES,
    showRaw: true,
  });
});

test('preferences migrate independent side settings into one active review side', () => {
  assert.deepEqual(
    parseReviewPreferences(
      null,
      '{"showQuestionReview":true,"showAnswerReview":true,"showRaw":true}',
    ),
    {
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'answer',
      showRaw: true,
    },
  );
  assert.deepEqual(
    parseReviewPreferences(
      '{"showAnswerReview":true,"showQuestionReview":false}',
      null,
      '{"showReview":true}',
    ),
    DEFAULT_REVIEW_PREFERENCES,
  );
  assert.equal(
    parseReviewPreferences(
      null,
      '{"showAnswerReview":false,"showQuestionReview":true}',
    ).reviewSide,
    'question',
  );
});

test('inline review and feedback migrate independently for the active side', () => {
  assert.deepEqual(
    parseReviewPreferences(
      '{"showAnswerReview":false,"showQuestionReview":true}',
    ),
    {
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'question',
    },
  );
  assert.deepEqual(
    parseReviewPreferences(
      '{"reviewSide":"question","showFeedback":false,"showInlineReview":false}',
    ),
    {
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'question',
      showFeedback: false,
      showInlineReview: false,
    },
  );
});

test('review controls default to simple and preserve an advanced selection', () => {
  assert.equal(parseReviewPreferences(null).reviewControlMode, 'simple');
  assert.equal(
    parseReviewPreferences('{"reviewControlMode":"advanced"}')
      .reviewControlMode,
    'advanced',
  );
  assert.equal(
    parseReviewPreferences(
      null,
      '{"reviewControlMode":"advanced"}',
      null,
      '{"showReview":false}',
    ).reviewControlMode,
    'advanced',
  );
});

test('the former shared review target migrates into the active side', () => {
  assert.equal(
    parseReviewPreferences('{"reviewTargetSide":"question"}').reviewSide,
    'question',
  );
});

test('inline review exposes only the active side or stays hidden', () => {
  assert.deepEqual(visibleReviewSides(DEFAULT_REVIEW_PREFERENCES), ['answer']);
  assert.deepEqual(
    visibleReviewSides({
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'question',
    }),
    ['question'],
  );
  assert.deepEqual(
    visibleReviewSides({
      ...DEFAULT_REVIEW_PREFERENCES,
      showInlineReview: false,
    }),
    [],
  );
});

test('feedback exposes only the active side or stays hidden', () => {
  assert.deepEqual(visibleFeedbackSides(DEFAULT_REVIEW_PREFERENCES), [
    'answer',
  ]);
  assert.deepEqual(
    visibleFeedbackSides({
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'question',
    }),
    ['question'],
  );
  assert.deepEqual(
    visibleFeedbackSides({
      ...DEFAULT_REVIEW_PREFERENCES,
      showFeedback: false,
    }),
    [],
  );
});

test('sticky review always exposes exactly one active side', () => {
  assert.deepEqual(activeReviewSides(DEFAULT_REVIEW_PREFERENCES), ['answer']);
  assert.deepEqual(
    activeReviewSides({
      ...DEFAULT_REVIEW_PREFERENCES,
      reviewSide: 'question',
      showInlineReview: false,
    }),
    ['question'],
  );
});

test('matching-question navigation stops at either end', () => {
  const ids = ['q1', 'q2', 'q3'];
  assert.equal(adjacentQuestionId(ids, undefined, 1), 'q1');
  assert.equal(adjacentQuestionId(ids, undefined, -1), 'q3');
  assert.equal(adjacentQuestionId(ids, 'q2', 1), 'q3');
  assert.equal(adjacentQuestionId(ids, 'q1', -1), undefined);
  assert.equal(adjacentQuestionId(ids, 'q3', 1), undefined);
});

test('paper routes encode collection and every source-relative segment', () => {
  assert.equal(
    paperRoute('topicToml', 'nested/a paper.toml'),
    '/papers/topicToml/nested/a%20paper.toml',
  );
  assert.equal(
    paperRoute('topicToml', 'nested/a paper.toml', 'subtraction facts'),
    '/papers/topicToml/nested/a%20paper.toml?q=subtraction%20facts',
  );
});

test('collection routes encode the collection identifier', () => {
  assert.equal(collectionRoute('focusToml'), '/papers/focusToml');
  assert.equal(collectionRoute('focus papers'), '/papers/focus%20papers');
  assert.equal(
    collectionRoute('topicToml', 'subtraction facts'),
    '/papers/topicToml?q=subtraction%20facts',
  );
});

test('rack states have compact reviewer-facing labels', () => {
  assert.equal(reviewStateLabel('rag_wf_ng4'), 'NG4');
  assert.equal(reviewStateLabel('rag_ng2'), 'NG2');
  assert.equal(reviewStateLabel('editorial_hold'), 'EDITORIAL HOLD');
});
