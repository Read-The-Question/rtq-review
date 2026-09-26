import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperStructuredTable,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import { validatePaperListMarkdown } from '@rtq/review-paper-markdown/validate';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from './rtq-katex.ts';

const sourceRoot = new URL('..', import.meta.url);

function render(markdown: string) {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [rehypePaperTable, [rehypeKatex, rtqKatexOptions]],
        remarkPlugins: [
          remarkMath,
          remarkPaperListMdx,
          remarkPaperAuthorNote,
          remarkPaperTable,
          remarkPaperStructuredTable,
          remarkPaperList,
        ],
      },
      markdown,
    ),
  );
}

test('renders PaperList for an isolated nested question without wrapper metadata', () => {
  const html = render(
    '<PaperList listStyleType="square">\n\n- $x^2$\n- Two\n\n</PaperList>',
  );

  assert.match(html, /<ul style="list-style-type:square">/);
  assert.doesNotMatch(html, /PaperList|listStyleType/);
});

test('renders a complete structured table for question review', () => {
  const html = render(
    [
      '<PaperViewStructuredTable aria-label="Crossnumber" cellAlign="center" density="roomy" grid="framed">',
      '  <PaperViewTableCaption>Number grid</PaperViewTableCaption>',
      '  <PaperViewTableHead><PaperViewTableRow><PaperViewTableHeaderCell scope="col">Column</PaperViewTableHeaderCell></PaperViewTableRow></PaperViewTableHead>',
      '  <PaperViewTableBody><PaperViewTableRow>',
      '    <PaperViewTableCell tone="muted" />',
      '    <PaperViewTableCell><PaperViewTableCellLabel>$\\rtqMathsCellLabelNumber{1}$</PaperViewTableCellLabel>$49$</PaperViewTableCell>',
      '  </PaperViewTableRow></PaperViewTableBody>',
      '</PaperViewStructuredTable>',
    ].join('\n'),
  );

  assert.match(html, /class="rtq-paper-table"/);
  assert.match(html, /data-cell-align="center"/);
  assert.match(html, /data-density="roomy"/);
  assert.match(html, /data-grid="framed"/);
  assert.match(html, /<caption>Number grid<\/caption>/);
  assert.match(html, /<th scope="col">Column<\/th>/);
  assert.match(html, /<td data-tone="muted"><\/td>/);
  assert.match(html, /data-paper-table-cell-label=""/);
  assert.match(html, /class="katex"/);
  assert.match(html, /rtq-maths-cell-label-number/);
});

test('falls back by semantics and rejects malformed wrappers safely', () => {
  assert.match(
    render(
      '<PaperList listStyleType="not-supported">\n\n1. One\n\n</PaperList>',
    ),
    /<ol style="list-style-type:decimal">/,
  );
  assert.throws(
    () => validatePaperListMarkdown('<PaperList>\n\n- One'),
    /closing tag|end of file/i,
  );
});

test('renders PaperAuthorNote in an isolated question or working field', () => {
  const html = render(
    '<PaperAuthorNote>\n\nInternal **context** with $x^2$.\n\n</PaperAuthorNote>',
  );

  assert.match(html, /<aside[^>]*class="paper-author-note"/);
  assert.match(html, /Paper author note · internal only/);
  assert.match(html, /<strong>context<\/strong>/);
  assert.doesNotMatch(html, /PaperAuthorNote/);
});

test('integrates through the viewer preparation, raw, and API error boundaries', async () => {
  const [assets, component, css, data, route] = await Promise.all([
    fs.readFile(new URL('lib/paper-assets.ts', sourceRoot), 'utf8'),
    fs.readFile(new URL('components/rtq-markdown.tsx', sourceRoot), 'utf8'),
    fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
    fs.readFile(new URL('lib/paper-data.ts', sourceRoot), 'utf8'),
    fs.readFile(
      new URL('app/api/current-question/route.ts', sourceRoot),
      'utf8',
    ),
  ]);

  assert.match(assets, /validatePaperListMarkdown\(text\)/);
  assert.match(assets, /validatePaperSymbolMarkdown\(text\)/);
  assert.match(component, /remarkPaperListMdx/);
  assert.match(component, /remarkPaperStructuredTable/);
  assert.match(component, /rehypePaperTable/);
  assert.match(component, /remarkPaperList/);
  assert.match(component, /remarkPaperSymbol/);
  assert.match(css, /\.rtq-markdown ul\s*{[^}]*list-style-type:\s*disc/s);
  assert.match(css, /\.rtq-markdown ol\s*{[^}]*list-style-type:\s*decimal/s);
  assert.match(css, /@import '@rtq\/review-paper-markdown\/paper-table\.css'/);
  assert.match(data, /rawQuestion = asString\(rawNode\.question\)/);
  assert.match(data, /raw:\s*{[\s\S]*answers: rawAnswers/);
  assert.match(data, /formulas: renderedWorkings\.flatMap/);
  assert.match(data, /tips: renderedWorkings\.flatMap/);
  assert.match(data, /kind === 'subsubquestion'/);
  assert.match(route, /catch \(error\)/);
  assert.match(route, /messageForError\(error\)/);
});
