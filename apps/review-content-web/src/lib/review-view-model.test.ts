import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_REVIEW_PREFERENCES,
  adjacentQuestionId,
  paperRoute,
  parseReviewPreferences,
  reviewStateLabel,
} from './review-view-model.ts';

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
});

test('rack states have compact reviewer-facing labels', () => {
  assert.equal(reviewStateLabel('rag_wf_ng4'), 'NG4');
  assert.equal(reviewStateLabel('rag_g2'), 'G2');
  assert.equal(reviewStateLabel('editorial_hold'), 'EDITORIAL HOLD');
});
