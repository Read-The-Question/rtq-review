import assert from 'node:assert/strict';
import test from 'node:test';

import { openReviewStore } from '@rtq/review-store/server';

import { persistReviewImageMetadata } from './review-image-metadata.ts';

const target = {
  collectionId: 'toml',
  nodeId: 's0.q0',
  questionId: 'paper:1:1',
  ragState: 'rag_wf_ng2',
  relativePath: 'paper.toml',
  sheet: 'NG2' as const,
  side: 'question-image' as const,
  uuid: 'D8AE66C1-9AB8-4C7F-A023-1C17B53237CF',
};

test('persists image metadata without an outcome', () => {
  const store = openReviewStore({ databasePath: ':memory:' });
  const result = persistReviewImageMetadata(
    {
      imageMetadata: {
        ignored: ['decorative'],
        types: ['generated', 'screenshot'],
      },
      reviewer: 'up',
      target,
    },
    store.imageMetadata,
  );

  assert.equal(result.status, 200);
  assert.deepEqual(store.imageMetadata.get(target), {
    createdAt: store.imageMetadata.get(target)?.createdAt,
    ignored: ['decorative'],
    ragState: 'rag_wf_ng2',
    reviewer: 'up',
    side: 'question-image',
    types: ['generated', 'screenshot'],
    updatedAt: store.imageMetadata.get(target)?.updatedAt,
    uuid: target.uuid,
  });
  assert.deepEqual(store.outcomes.listAll(), []);
  store.close();
});

test('stores explicit empty arrays as a clearing instruction', () => {
  const store = openReviewStore({ databasePath: ':memory:' });
  persistReviewImageMetadata(
    {
      imageMetadata: { ignored: [], types: [] },
      reviewer: 'up',
      target,
    },
    store.imageMetadata,
  );

  assert.deepEqual(store.imageMetadata.get(target)?.ignored, []);
  assert.deepEqual(store.imageMetadata.get(target)?.types, []);
  store.close();
});
