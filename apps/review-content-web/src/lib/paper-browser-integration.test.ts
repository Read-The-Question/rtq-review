import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const sourceRoot = new URL('..', import.meta.url);

test('content review composes the shared browser around its private review surface', async () => {
  const [index, paperPage, searchRoute] = await Promise.all([
    fs.readFile(new URL('components/paper-index.tsx', sourceRoot), 'utf8'),
    fs.readFile(
      new URL('app/papers/[collection]/[...slug]/page.tsx', sourceRoot),
      'utf8',
    ),
    fs.readFile(
      new URL('app/api/papers/content-search/route.ts', sourceRoot),
      'utf8',
    ),
  ]);

  assert.match(index, /@rtq\/review-paper-browser\/browser/);
  assert.match(index, /loadPaperBrowserWorkspace/);
  assert.match(index, /<ContentReviewNavigation/);
  assert.match(index, /All questions/);
  assert.match(index, /Global findings/);
  assert.match(index, /Change requests/);
  assert.match(index, /Macros/);
  assert.match(searchRoute, /createPaperContentSearchResponse/);
  assert.match(paperPage, /<ReviewSurface/);
  assert.doesNotMatch(paperPage, /PaperBrowser/);
});
