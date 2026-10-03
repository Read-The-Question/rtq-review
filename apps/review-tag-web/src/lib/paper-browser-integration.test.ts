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
  assert.match(editor, /Search all questions/);
  assert.match(index, /secondaryNavigation=\{<TagReviewNavigation \/>}/);
  assert.match(index, /href="\/search"/);
  assert.doesNotMatch(editor, /FileCommandPalette/);
  assert.match(legacyPage, /permanentRedirect/);
  assert.match(legacyPage, /paperBrowserPaperHref/);
});

test('tag review exposes one compact collection-aware regex and UUID search', async () => {
  const [page, form, search, corpusDocument, editor, document, css] =
    await Promise.all([
      fs.readFile(new URL('app/search/page.tsx', sourceRoot), 'utf8'),
      fs.readFile(
        new URL('components/tag-corpus-search-form.tsx', sourceRoot),
        'utf8',
      ),
      fs.readFile(new URL('lib/tag-corpus-search.ts', sourceRoot), 'utf8'),
      fs.readFile(new URL('lib/tag-corpus-document.ts', sourceRoot), 'utf8'),
      fs.readFile(new URL('components/tag-editor-app.tsx', sourceRoot), 'utf8'),
      fs.readFile(new URL('components/node-document.tsx', sourceRoot), 'utf8'),
      fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
    ]);

  assert.match(page, /'focusPaperToml'/);
  assert.match(page, /<TagCorpusSearchForm/);
  assert.match(page, /<TagEditorApp/);
  assert.match(page, /searchPanel=\{searchPanel\}/);
  assert.doesNotMatch(page, /Open in Tag Review/);
  assert.equal(form.match(/<form/g)?.length, 1);
  assert.match(form, /aria-label="Search method"/);
  assert.match(form, /aria-pressed=\{mode === 'content'\}/);
  assert.match(form, /aria-pressed=\{mode === 'uuid'\}/);
  assert.match(form, /name="collection"/);
  assert.match(form, /name="content"/);
  assert.match(form, /name="content-scope"/);
  assert.match(form, /name="uuids"/);
  assert.match(page, /PaperContentSearchError/);
  assert.match(search, /searchPaperQuestionTrees\(/);
  assert.match(search, /searchPaperQuestionTreesByUuids\(/);
  assert.match(search, /buildTagCorpusDocument/);
  assert.match(corpusDocument, /mergeTagCorpusSourceDocument/);
  assert.match(corpusDocument, /path: `\$\{prefix\}\.\$\{node\.path\}`/);
  assert.match(editor, /mergeTagCorpusSourceDocument/);
  assert.match(document, /<PaperOutline/);
  assert.match(document, /node\.source\?\.nodePath \?\? node\.path/);
  assert.match(css, /--tag-search-action:\s*#275f72/);
  assert.match(
    css,
    /\.tag-corpus-search \.tag-corpus-search__actions > button\s*{[^}]*background:\s*var\(--tag-search-action\)[^}]*color:\s*#fff/s,
  );
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

test('the document outline and question list own bounded scroll areas', async () => {
  const [document, css] = await Promise.all([
    fs.readFile(new URL('components/node-document.tsx', sourceRoot), 'utf8'),
    fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
  ]);

  assert.match(
    document,
    /className="document-content" ref=\{scrollContainerRef\}/,
  );
  assert.match(css, /\.document-pane\s*{[^}]*overflow:\s*hidden/s);
  assert.match(
    css,
    /\.document-layout > \.paper-outline\s*{[^}]*max-height:\s*none[^}]*position:\s*static/s,
  );
  assert.match(css, /\.document-content\s*{[^}]*overflow-y:\s*auto/s);
});

test('combined search uses page scrolling with a sticky question outline', async () => {
  const [document, css] = await Promise.all([
    fs.readFile(new URL('components/node-document.tsx', sourceRoot), 'utf8'),
    fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
  ]);

  assert.match(document, /usesPageScroll = document\.corpus/);
  assert.match(document, /root: usesPageScroll \? null : container/);
  assert.match(
    document,
    /usesPageScroll \? null : scrollContainerRef\.current/,
  );
  assert.match(
    css,
    /\.editor-shell--with-search\s*{[^}]*height:\s*auto[^}]*overflow:\s*visible/s,
  );
  assert.match(
    css,
    /\.editor-shell--with-search \.document-content\s*{[^}]*overflow:\s*visible/s,
  );
  assert.match(
    css,
    /\.editor-shell--with-search \.document-layout > \.paper-outline\s*{[^}]*position:\s*sticky[^}]*max-height:\s*calc\(100vh - 2rem\)/s,
  );
});
