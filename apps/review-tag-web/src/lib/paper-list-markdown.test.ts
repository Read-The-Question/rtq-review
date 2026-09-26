import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

import {
  remarkPaperAuthorNote,
  remarkPaperList,
  toPaperListCompatibilityMarkdown,
} from '@rtq/review-paper-markdown';
import { validatePaperListMarkdown } from '@rtq/review-paper-markdown/validate';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const sourceRoot = new URL('..', import.meta.url);

function render(markdown: string) {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [rehypeRaw],
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkPaperAuthorNote,
          remarkPaperList,
        ],
      },
      markdown,
    ),
  );
}

test('renders validated PaperList markers with isolated list semantics', () => {
  const html = render(
    toPaperListCompatibilityMarkdown(
      [
        '<PaperList listStyleType="upper-alpha">',
        '',
        '3. $\\dfrac{1}{3}$',
        '   - Native nested list',
        '',
        '</PaperList>',
      ].join('\n'),
    ),
  );

  assert.match(html, /<ol start="3" style="list-style-type:upper-alpha">/);
  assert.match(html, /<ul>\s*<li>Native nested list<\/li>\s*<\/ul>/);
  assert.doesNotMatch(html, /PaperList|listStyleType/);
});

test('renders prepared PaperTable separators and multiline LongDivision SVG markup', () => {
  const html = render(
    [
      '| Value | Result |',
      '| --- | ---: |',
      '| One | 1 |',
      '',
      '<!-- RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable -->',
      '',
      '<div class="paper-long-division-graphic"><svg aria-hidden="true" viewBox="0 0 10 10">',
      '  <g><text x="5" y="5">8</text></g>',
      '</svg></div>',
    ].join('\n'),
  );

  assert.match(html, /<table>/);
  assert.match(html, /<svg aria-hidden="true" viewBox="0 0 10 10">/);
  assert.match(html, /<text x="5" y="5">8<\/text>/);
  assert.doesNotMatch(html, /RTQ_TABLE_KEEP_AFTER/);
});

test('renders PaperAuthorNote through the non-MDX Tag Web stack', () => {
  const html = render(
    '<PaperAuthorNote>\n\nInternal **context** with $x^2$.\n\n</PaperAuthorNote>',
  );

  assert.match(html, /<aside[^>]*class="paper-author-note"/);
  assert.match(html, /Paper author note · internal only/);
  assert.match(html, /<strong>context<\/strong>/);
  assert.doesNotMatch(html, /PaperAuthorNote/);
});

test('rejects malformed wrappers without rejecting ordinary LaTeX', () => {
  assert.doesNotThrow(() =>
    validatePaperListMarkdown(String.raw`$\large{\boxed{?}}$`),
  );
  assert.throws(
    () => validatePaperListMarkdown('<PaperList>\n\nParagraph\n\n</PaperList>'),
    /exactly one ordered or unordered Markdown list/,
  );
});

test('uses the shared contract at the central read-only Tag Web boundaries', async () => {
  const [assets, component, css, data, folderMetadata] = await Promise.all([
    fs.readFile(new URL('lib/paper-assets.ts', sourceRoot), 'utf8'),
    fs.readFile(new URL('components/rtq-markdown.tsx', sourceRoot), 'utf8'),
    fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
    fs.readFile(new URL('lib/paper-data.ts', sourceRoot), 'utf8'),
    fs.readFile(new URL('lib/paper-folder-metadata.ts', sourceRoot), 'utf8'),
  ]);

  assert.match(assets, /validatePaperListMarkdown\(text\)/);
  assert.match(assets, /toPaperListCompatibilityMarkdown\(text\)/);
  assert.match(assets, /toPaperSymbolCompatibilityMarkdown\(withPaperLists\)/);
  assert.doesNotMatch(component, /remarkPaperListMdx/);
  assert.match(component, /remarkPaperList/);
  assert.match(css, /\.rtq-markdown ul\s*{[^}]*list-style-type:\s*disc/s);
  assert.match(css, /\.rtq-markdown ol\s*{[^}]*list-style-type:\s*decimal/s);
  assert.doesNotMatch(css, /\.rtq-markdown ul ul\s*{[^}]*lower-alpha/s);
  assert.match(data, /children: await buildSubquestionNodes/);
  assert.match(data, /formulas: await Promise\.all/);
  assert.match(data, /tips: await Promise\.all/);
  assert.match(data, /scopeType: 'answer'/);
  const editableFolders = folderMetadata.match(
    /EDITABLE_FOLDER_ORDER[^=]*=\s*\[([\s\S]*?)\];/,
  )?.[1];
  const visibleFolders = folderMetadata.match(
    /export const FOLDER_ORDER[^=]*=\s*\[([\s\S]*?)\];/,
  )?.[1];

  assert.ok(editableFolders);
  assert.ok(visibleFolders);
  assert.doesNotMatch(editableFolders, /allTopicsToml/);
  assert.match(visibleFolders, /allTopicsToml/);
});
