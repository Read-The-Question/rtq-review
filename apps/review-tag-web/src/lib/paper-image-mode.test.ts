import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePaperImageMode } from './paper-image-mode.ts';

test('preserves prepared preferences and migrates legacy generated/SVG preferences', () => {
  assert.equal(parsePaperImageMode('all'), 'all');
  assert.equal(parsePaperImageMode('prepared'), 'prepared');
  assert.equal(parsePaperImageMode('generated'), 'prepared');
  assert.equal(parsePaperImageMode('svg'), 'prepared');
  assert.equal(parsePaperImageMode(null), 'all');
  assert.equal(parsePaperImageMode('invalid'), 'all');
});
