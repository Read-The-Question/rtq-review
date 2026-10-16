import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePaperImageMode } from './paper-image-mode.ts';

test('preserves V1 preferences and migrates legacy prepared/generated/SVG preferences', () => {
  assert.equal(parsePaperImageMode('all'), 'all');
  assert.equal(parsePaperImageMode('v1'), 'v1');
  assert.equal(parsePaperImageMode('prepared'), 'v1');
  assert.equal(parsePaperImageMode('generated'), 'v1');
  assert.equal(parsePaperImageMode('svg'), 'v1');
  assert.equal(parsePaperImageMode(null), 'all');
  assert.equal(parsePaperImageMode('invalid'), 'all');
});
