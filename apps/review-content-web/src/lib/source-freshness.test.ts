import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluateSourceFreshness,
  sourceVersionUrl,
} from './source-freshness.ts';

test('distinguishes current, changed, invalid, and unavailable sources', () => {
  assert.deepEqual(
    evaluateSourceFreshness('version-1', {
      state: 'ready',
      version: 'version-1',
    }),
    { state: 'current' },
  );
  assert.deepEqual(
    evaluateSourceFreshness('version-1', {
      state: 'ready',
      version: 'version-2',
    }),
    { state: 'changed', version: 'version-2' },
  );
  assert.deepEqual(
    evaluateSourceFreshness('version-1', {
      message: 'Save valid TOML and check again.',
      state: 'invalid',
      version: 'broken-version',
    }),
    {
      message: 'Save valid TOML and check again.',
      state: 'invalid',
      version: 'broken-version',
    },
  );
  assert.deepEqual(
    evaluateSourceFreshness('version-1', {
      message: 'The source is no longer available.',
      state: 'unavailable',
    }),
    {
      message: 'The source is no longer available.',
      state: 'unavailable',
    },
  );
});

test('rejects malformed freshness payloads safely', () => {
  assert.deepEqual(evaluateSourceFreshness('version-1', { state: 'ready' }), {
    message: 'The source freshness response was not valid.',
    state: 'error',
  });
  assert.equal(evaluateSourceFreshness('version-1', null).state, 'error');
});

test('encodes the selected collection and full relative path', () => {
  assert.equal(
    sourceVersionUrl('topicToml', 'nested/a paper.toml'),
    '/api/papers/source-version?collection=topicToml&path=nested%2Fa+paper.toml',
  );
});
