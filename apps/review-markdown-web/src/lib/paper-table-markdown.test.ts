import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

import { renderMarkdownToHtml } from './markdown-renderer.ts';
import { rtqKatexMacros } from './rtq-katex.ts';

test('renders a complete structured table in generated paper review', async () => {
  const html = await renderMarkdownToHtml(
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
    rtqKatexMacros,
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

test('keeps raw GFM table rendering through the shared wrapper', async () => {
  const html = await renderMarkdownToHtml(
    '| A | B |\n| --- | ---: |\n| 1 | 2 |',
    {},
  );

  assert.match(html, /class="rtq-paper-table"/);
  assert.doesNotMatch(html, /data-paper-table=""/);
});

test('loads the shared paper-table presentation contract', async () => {
  const css = await fs.readFile(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.match(css, /@import '@rtq\/review-paper-markdown\/paper-table\.css'/);
  assert.match(css, /\.rtq-document \.katex\s*\{[^}]*color:\s*blue/s);
  assert.doesNotMatch(css, /\.rtq-document \.katex \*/);
});
