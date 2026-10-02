import assert from 'node:assert/strict';
import test from 'node:test';

import type { LocalReviewComment } from '@rtq/review-store/server';

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

test('groups comments by UUID and side without adding outcome items', () => {
  const groups = buildReviewWorkGroups({
    comments: [comment],
    occurrences: [source],
  });

  assert.equal(groups.length, 1);
  assert.equal(groups[0]?.lanes.length, 1);
  assert.equal(groups[0]?.lanes[0]?.side, 'question');
  assert.equal(groups[0]?.lanes[0]?.states[0]?.lifecycle, 'active');
  assert.equal(groups[0]?.lanes[0]?.states[0]?.comments.length, 1);
  assert.deepEqual(
    groups[0]?.sourceFiles.toml.map((item) => item.relativePath),
    ['paper-a.toml'],
  );
  assert.deepEqual(groups[0]?.sourceFiles.corpusPrimaryTopicToml, []);
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
  });

  const state = groups[0]?.lanes[0]?.states[0];
  assert.equal(state?.lifecycle, 'archived');
  assert.equal(state?.comments.length, 1);
  assert.deepEqual(state?.currentRagStates, ['rag_wf_ng3']);
});

test('omits UUIDs that have no comments', () => {
  const groups = buildReviewWorkGroups({
    comments: [],
    occurrences: [source],
  });

  assert.deepEqual(groups, []);
});

test('retains multiple comments as separate actionable items', () => {
  const groups = buildReviewWorkGroups({
    comments: [
      comment,
      {
        ...comment,
        comment: 'Also check the diagram.',
        id: 'comment-2',
        submissionId: 'submission-2',
      },
    ],
    occurrences: [source],
  });

  assert.equal(groups[0]?.lanes[0]?.states[0]?.comments.length, 2);
});

test('uses any matching UUID occurrence as active while preferring canonical context', () => {
  const topicSource: ReviewWorkOccurrence = {
    ...source,
    collectionId: 'corpusPrimaryTopicToml',
    paperTitle: 'Division topic',
    relativePath: 'division.toml',
    route: '/papers/corpusPrimaryTopicToml/division.toml#s0.q0',
  };
  const groups = buildReviewWorkGroups({
    comments: [comment],
    occurrences: [
      { ...source, states: { ...source.states, question: 'rag_wf_ng3' } },
      topicSource,
    ],
  });

  assert.equal(groups[0]?.source?.collectionId, 'toml');
  assert.deepEqual(
    groups[0]?.sourceFiles.corpusPrimaryTopicToml.map(
      (item) => item.relativePath,
    ),
    ['division.toml'],
  );
  assert.equal(
    groups[0]?.lanes[0]?.states[0]?.source?.collectionId,
    'corpusPrimaryTopicToml',
  );
  assert.equal(groups[0]?.lanes[0]?.states[0]?.lifecycle, 'active');
});
