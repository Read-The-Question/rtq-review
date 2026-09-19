import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  LocalReviewComment,
  StoredReviewOutcome,
} from '@rtq/review-store/server';

import {
  buildReviewWorkGroups,
  type ReviewWorkOccurrence,
} from './review-work.ts';

const comment = {
  comment: 'Recheck the wording.',
  createdAt: '2026-09-19T10:00:00.000Z',
  id: 'comment-1',
  ragState: 'rag_wf_ng2',
  reviewer: 'up',
  side: 'question' as const,
  submissionId: 'submission-1',
  uuid: 'uuid-1',
} satisfies LocalReviewComment;

const source = {
  collectionId: 'toml',
  nodeId: 's0.q1',
  nodeLabel: 'Question 2',
  paperTitle: 'Paper A',
  relativePath: 'paper-a.toml',
  route: '/papers/toml/paper-a.toml#question-s0.q1',
  sortIndex: 1,
  states: {
    answer: 'rag_wf_ng3',
    'answer-image': 'rag_wf_na',
    question: 'rag_wf_ng2',
    'question-image': 'rag_wf_ng2',
  },
  uuid: 'uuid-1',
} satisfies ReviewWorkOccurrence;

function outcome(
  overrides: Partial<StoredReviewOutcome> = {},
): StoredReviewOutcome {
  return {
    createdAt: '2026-09-19T10:00:00.000Z',
    imageMetadata: null,
    outcome: 'PRCR',
    ragState: 'rag_wf_ng2',
    reviewer: 'up',
    side: 'question',
    updatedAt: '2026-09-19T10:00:00.000Z',
    uuid: 'uuid-1',
    ...overrides,
  };
}

test('groups comments and PRCR outcomes by UUID and side', () => {
  const groups = buildReviewWorkGroups({
    comments: [comment],
    occurrences: [source],
    outcomes: [outcome(), outcome({ outcome: 'PRG', side: 'answer' })],
  });

  assert.equal(groups.length, 1);
  assert.equal(groups[0]?.lanes.length, 1);
  assert.equal(groups[0]?.lanes[0]?.side, 'question');
  assert.equal(groups[0]?.lanes[0]?.states[0]?.lifecycle, 'active');
  assert.equal(groups[0]?.lanes[0]?.states[0]?.comments.length, 1);
  assert.equal(groups[0]?.lanes[0]?.states[0]?.changeRequest?.outcome, 'PRCR');
  assert.deepEqual(
    groups[0]?.sourceFiles.toml.map((item) => item.relativePath),
    ['paper-a.toml'],
  );
  assert.deepEqual(groups[0]?.sourceFiles.topicToml, []);
});

test('archives stored work only when its RAG state no longer matches', () => {
  const groups = buildReviewWorkGroups({
    comments: [comment],
    occurrences: [
      {
        ...source,
        states: { ...source.states, question: 'rag_wf_ng3' },
      },
    ],
    outcomes: [outcome({ outcome: 'PRG' })],
  });

  const state = groups[0]?.lanes[0]?.states[0];
  assert.equal(state?.lifecycle, 'archived');
  assert.equal(state?.comments.length, 1);
  assert.equal(state?.changeRequest, null);
  assert.deepEqual(state?.currentRagStates, ['rag_wf_ng3']);
});

test('uses any matching UUID occurrence as active while preferring canonical context', () => {
  const topicSource: ReviewWorkOccurrence = {
    ...source,
    collectionId: 'topicToml',
    paperTitle: 'Division topic',
    relativePath: 'division.toml',
    route: '/papers/topicToml/division.toml#s0.q0',
  };
  const groups = buildReviewWorkGroups({
    comments: [comment],
    occurrences: [
      { ...source, states: { ...source.states, question: 'rag_wf_ng3' } },
      topicSource,
    ],
    outcomes: [],
  });

  assert.equal(groups[0]?.source?.collectionId, 'toml');
  assert.deepEqual(
    groups[0]?.sourceFiles.topicToml.map((item) => item.relativePath),
    ['division.toml'],
  );
  assert.equal(
    groups[0]?.lanes[0]?.states[0]?.source?.collectionId,
    'topicToml',
  );
  assert.equal(groups[0]?.lanes[0]?.states[0]?.lifecycle, 'active');
});
