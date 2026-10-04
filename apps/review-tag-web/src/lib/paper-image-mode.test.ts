import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePaperImageMode } from './paper-image-mode.ts';

test('preserves all/generated preferences and migrates legacy SVG preference', () => {
  assert.equal(parsePaperImageMode('all'), 'all');
  assert.equal(parsePaperImageMode('generated'), 'generated');
  assert.equal(parsePaperImageMode('svg'), 'generated');
  assert.equal(parsePaperImageMode(null), 'all');
  assert.equal(parsePaperImageMode('invalid'), 'all');
});
