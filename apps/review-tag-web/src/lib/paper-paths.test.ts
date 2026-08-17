import assert from 'node:assert/strict';
import path from 'node:path';

import test from 'node:test';

import * as paperPaths from './paper-paths.ts';

test('resolves the canonical @rtq/papers package in the supported layout', () => {
  assert.equal(
    paperPaths.SOURCE_PAPERS_PACKAGE_ROOT,
    path.resolve(paperPaths.REPO_ROOT, '../rtq-content/packages/papers'),
  );
  assert.equal(
    paperPaths.SOURCE_PAPERS_ROOT,
    path.join(paperPaths.SOURCE_PAPERS_PACKAGE_ROOT, 'papers'),
  );
});

test('contains paper reads and writes inside the selected TOML folder', () => {
  assert.equal(
    paperPaths.resolvePaperFilePath('toml', 'nested/paper.toml'),
    path.join(paperPaths.SOURCE_PAPERS_ROOT, 'toml', 'nested', 'paper.toml'),
  );

  for (const unsafePath of [
    '',
    '../outside.toml',
    '/tmp/outside.toml',
    'paper.json',
  ]) {
    assert.throws(
      () => paperPaths.resolvePaperFilePath('toml', unsafePath),
      /inside its folder/,
    );
  }
});
