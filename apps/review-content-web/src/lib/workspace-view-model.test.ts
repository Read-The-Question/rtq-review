import assert from 'node:assert/strict';
import test from 'node:test';

import { getWorkspaceStatusCopy } from './workspace-view-model.ts';

test('describes a connected content workspace', () => {
  assert.deepEqual(
    getWorkspaceStatusCopy({
      assetsPackage: '@rtq/maths-assets',
      papersPackage: '@rtq/papers',
      source: 'rtq-content',
      state: 'ready',
    }),
    {
      detail: '@rtq/papers and @rtq/maths-assets are available.',
      label: 'Content checkout connected',
      tone: 'ready',
    },
  );
});

test('describes an unavailable content workspace without a filesystem path', () => {
  const copy = getWorkspaceStatusCopy({
    message: 'Set RTQ_CONTENT_ROOT to a complete checkout and refresh.',
    source: 'rtq-content',
    state: 'unavailable',
  });

  assert.equal(copy.tone, 'warning');
  assert.match(copy.detail, /RTQ_CONTENT_ROOT/);
});
