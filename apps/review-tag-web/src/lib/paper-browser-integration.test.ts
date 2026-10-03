import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const sourceRoot = new URL('..', import.meta.url);

test('tag review uses the shared browser and diverges only at its editor surface', async () => {
  const [index, collectionPage, paperPage, legacyPage, searchRoute, editor] =
    await Promise.all([
      fs.readFile(new URL('components/paper-index.tsx', sourceRoot), 'utf8'),
      fs.readFile(
        new URL('app/papers/[collection]/page.tsx', sourceRoot),
        'utf8',
      ),
      fs.readFile(
        new URL('app/papers/[collection]/[...slug]/page.tsx', sourceRoot),
        'utf8',
      ),
      fs.readFile(
        new URL('app/files/[folder]/[...slug]/page.tsx', sourceRoot),
        'utf8',
      ),
      fs.readFile(
        new URL('app/api/papers/content-search/route.ts', sourceRoot),
        'utf8',
      ),
      fs.readFile(new URL('components/tag-editor-app.tsx', sourceRoot), 'utf8'),
    ]);

  assert.match(index, /@rtq\/review-paper-browser\/browser/);
  assert.match(index, /loadPaperBrowserWorkspace/);
  assert.match(collectionPage, /normalizePaperBrowserSearchParameters/);
  assert.match(searchRoute, /createPaperContentSearchResponse/);
  assert.match(paperPage, /<TagEditorApp/);
  assert.match(paperPage, /paperBrowserCollectionHref/);
  assert.doesNotMatch(paperPage, /<PaperBrowser/);
  assert.match(editor, /<NodeDocument/);
  assert.match(editor, /<ImageTagDocument/);
  assert.doesNotMatch(editor, /FileCommandPalette/);
  assert.match(legacyPage, /permanentRedirect/);
  assert.match(legacyPage, /paperBrowserPaperHref/);
});

test('the superseded tag browser implementation is absent', async () => {
  for (const relativePath of [
    'components/file-browser-page.tsx',
    'components/file-sidebar.tsx',
    'components/file-command-palette.tsx',
  ]) {
    await assert.rejects(fs.access(new URL(relativePath, sourceRoot)));
  }

  const data = await fs.readFile(
    new URL('lib/paper-data.ts', sourceRoot),
    'utf8',
  );
  assert.doesNotMatch(data, /listPaperFiles|navigationCopyForFile/);
});
