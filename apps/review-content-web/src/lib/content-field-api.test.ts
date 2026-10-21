import assert from 'node:assert/strict';
import test from 'node:test';

import {
  contentFieldApiUrl,
  parseContentFieldApiTarget,
} from './content-field-api.ts';

test('content field API targets retain the displayed file and field locator', () => {
  const target = parseContentFieldApiTarget({
    collectionId: 'focusPaperToml',
    relativePath: 'focus-paper-one.toml',
    source: {
      itemIndex: 2,
      kind: 'formula',
      nodeUuid: 'QUESTION-UUID',
      workingIndex: 1,
    },
  });

  assert.deepEqual(target, {
    collectionId: 'focusPaperToml',
    relativePath: 'focus-paper-one.toml',
    source: {
      itemIndex: 2,
      kind: 'formula',
      nodeUuid: 'QUESTION-UUID',
      workingIndex: 1,
    },
  });
  assert.ok(target);
  const url = new URL(contentFieldApiUrl(target), 'http://localhost');
  assert.deepEqual(JSON.parse(url.searchParams.get('target') ?? ''), target);
});

test('content field API targets reject missing identities and invalid indexes', () => {
  assert.equal(
    parseContentFieldApiTarget({
      collectionId: 'focusPaperToml',
      relativePath: 'focus-paper-one.toml',
      source: { kind: 'question' },
    }),
    undefined,
  );
  assert.equal(
    parseContentFieldApiTarget({
      collectionId: 'focusPaperToml',
      relativePath: 'focus-paper-one.toml',
      source: {
        answerIndex: -1,
        kind: 'answer',
        nodeUuid: 'QUESTION-UUID',
      },
    }),
    undefined,
  );
  assert.equal(
    parseContentFieldApiTarget({
      collectionId: 'focusPaperToml',
      relativePath: 'focus-paper-one.toml',
      source: { kind: 'unknown', nodeUuid: 'QUESTION-UUID' },
    }),
    undefined,
  );
  assert.equal(
    parseContentFieldApiTarget({
      collectionId: 'not-a-collection',
      relativePath: 'paper-one.toml',
      source: { kind: 'question', nodeUuid: 'QUESTION-UUID' },
    }),
    undefined,
  );
});
