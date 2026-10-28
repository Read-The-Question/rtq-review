import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  rehypePaperTable,
  remarkPaperListMdx,
  remarkPaperStructuredTable,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from './rtq-katex.ts';
import { preparePaperTableMarkdown } from './paper-table-markdown.ts';

function render(markdown: string): string {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [rehypePaperTable, [rehypeKatex, rtqKatexOptions]],
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperTable,
          remarkPaperStructuredTable,
        ],
      },
      markdown,
    ),
  );
}

test('preserves a valid PaperTable for the shared render transform', () => {
  const markdown =
    '<PaperTable width="full">\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n</PaperTable>\n';
  assert.deepEqual(preparePaperTableMarkdown(markdown), {
    hasTable: true,
    markdown,
  });
});

test('leaves wrapper examples inside fences untouched', () => {
  const source = '```md\n<PaperTable>\n</PaperTable>\n```\n';
  assert.deepEqual(preparePaperTableMarkdown(source), {
    hasTable: false,
    markdown: source,
  });
});

test('detects raw GFM tables outside PaperTable wrappers', () => {
  assert.deepEqual(preparePaperTableMarkdown('| A |\n| - |\n| 1 |'), {
    hasTable: true,
    markdown: '| A |\n| - |\n| 1 |',
  });
});

test('keeps invalid PaperTable content readable and reports the issue', () => {
  const prepared = preparePaperTableMarkdown(
    '<PaperTable density="giant">\n\n| A |\n| - |\n| 1 |\n\n</PaperTable>',
  );
  assert.match(
    prepared.issue ?? '',
    /density.*giant.*compact, regular, roomy/i,
  );
  assert.doesNotMatch(prepared.markdown, /<\/?PaperTable/);
  assert.match(prepared.markdown, /\| A \|/);
  assert.equal(prepared.hasTable, true);
});

test('renders all presentation metadata and semantic headers', () => {
  const html = render(
    [
      '<PaperTable align="center" blankCorner="open" cellAlign="right" columnHeaders="first-row" density="compact" firstColumnStartPadding="none" grid="framed" indent="sm" rowHeaders="first-column" width="full">',
      '',
      '| | Value |',
      '| - | -: |',
      '| Alpha | $12$ |',
      '',
      '</PaperTable>',
    ].join('\n'),
  );

  assert.match(html, /class="rtq-paper-table"/);
  assert.match(html, /data-align="center"/);
  assert.match(html, /data-blank-corner="open"/);
  assert.match(html, /data-cell-align="right"/);
  assert.match(html, /data-cell-align-authored=""/);
  assert.match(html, /data-density="compact"/);
  assert.match(html, /data-first-column-start-padding="none"/);
  assert.match(html, /data-grid="framed"/);
  assert.match(html, /data-indent="sm"/);
  assert.match(html, /data-width="full"/);
  assert.match(html, /<th><\/th>/);
  assert.match(html, /<th scope="col" style="text-align:right">Value<\/th>/);
  assert.match(html, /<th scope="row">Alpha<\/th>/);
  assert.match(html, /class="katex"/);
});

test('renders raw GFM tables with the RTQ web defaults', () => {
  const html = render('| A | B |\n| - | - |\n| 1 | 2 |');
  assert.match(html, /class="rtq-paper-table"/);
  assert.match(html, /data-align="start"/);
  assert.match(html, /data-density="roomy"/);
  assert.doesNotMatch(html, /data-grid/);
  assert.match(html, /data-width="fit"/);
  assert.doesNotMatch(html, /data-paper-table/);
});

test('renders a complete structured table with review presentation metadata', () => {
  const html = render(
    [
      '<PaperViewStructuredTable aria-label="Crossnumber" borderModel="cells" cellBorder="all" cellAlign="center" density="roomy">',
      '  <PaperViewTableCaption>Number grid</PaperViewTableCaption>',
      '  <PaperViewTableHead><PaperViewTableRow cellBorder="none"><PaperViewTableHeaderCell cellBorder="all" scope="col">Column</PaperViewTableHeaderCell></PaperViewTableRow></PaperViewTableHead>',
      '  <PaperViewTableBody>',
      '    <PaperViewTableRow>',
      '      <PaperViewTableCell cellBorder="none" tone="muted" />',
      '      <PaperViewTableCell><PaperViewTableCellLabel>$\\rtqMathsCellLabelNumber{1}$</PaperViewTableCellLabel>$49$</PaperViewTableCell>',
      '    </PaperViewTableRow>',
      '  </PaperViewTableBody>',
      '</PaperViewStructuredTable>',
    ].join('\n'),
  );

  assert.match(html, /class="rtq-paper-table"/);
  assert.match(html, /data-cell-align="center"/);
  assert.match(html, /data-density="roomy"/);
  assert.doesNotMatch(html, /data-grid/);
  assert.match(html, /data-border-model="cells"/);
  assert.match(html, /data-cell-border="all"/);
  assert.match(html, /<caption>Number grid<\/caption>/);
  assert.match(html, /<thead>/);
  assert.match(html, /<tbody>/);
  assert.match(html, /<th scope="col" data-cell-border="all">Column<\/th>/);
  assert.match(
    html,
    /<td data-cell-border="none" data-tone="blocked"><span data-paper-table-hidden-text="">shaded<\/span> <\/td>/,
  );
  assert.match(html, /data-paper-table-cell-label=""/);
  assert.match(html, /class="katex"/);
  assert.match(html, /rtq-maths-cell-label-number/);
});

test('uses the shared table rules and the RTQ web table colours in both themes', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.match(css, /@import '@rtq\/review-paper-markdown\/paper-table\.css'/);
  assert.doesNotMatch(css, /\.rtq-paper-table/);
  for (const [role, light, dark] of [
    ['rule-strong', '#222222', '#d7d7d7'],
    ['rule-inner', '#8a8a8a', '#727272'],
    ['rule-quiet', '#b8b8b8', '#444444'],
    ['fill-blocked', '#bebebe', '#484848'],
  ] as const) {
    assert.equal(
      css.match(new RegExp(`--rtq-paper-table-${role}: ${light};`, 'g'))
        ?.length,
      1,
    );
    assert.equal(
      css.match(new RegExp(`--rtq-paper-table-${role}: ${dark};`, 'g'))?.length,
      2,
    );
  }
  assert.equal(
    css.match(
      /--rtq-paper-table-fill-answer: color-mix\(\s*in oklab,\s*var\(--rtq-maths-answer-correct\) 11%,\s*var\(--paper-bright\)\s*\);/g,
    )?.length,
    1,
  );
  assert.equal(
    css.match(
      /--rtq-paper-table-fill-answer: color-mix\(\s*in oklab,\s*var\(--rtq-maths-answer-correct\) 16%,\s*var\(--paper-bright\)\s*\);/g,
    )?.length,
    2,
  );
  assert.equal(
    css.match(
      /--rtq-paper-table-mark-answer: var\(--rtq-maths-answer-correct\);/g,
    )?.length,
    3,
  );
});

test('every content field marks its voice as production does', () => {
  const markdown = readFileSync(
    new URL('../components/rtq-markdown.tsx', import.meta.url),
    'utf8',
  );
  const surface = readFileSync(
    new URL('../components/review-surface.tsx', import.meta.url),
    'utf8',
  );

  assert.match(markdown, /className="rtq-markdown" data-variant=\{variant\}/);
  assert.match(
    surface,
    /field=\{node\.content\.question\}\s*label="Question"\s*preferences=\{preferences\}\s*variant="question"/,
  );
  assert.match(
    surface,
    /field=\{answer\.option\}\s*label="Option"\s*preferences=\{preferences\}\s*variant="answer"/,
  );
  assert.match(
    surface,
    /field=\{answer\.key\}\s*label="Key"\s*preferences=\{preferences\}\s*variant="default"/,
  );
  assert.match(
    surface,
    /field=\{answer\.answer\}\s*label="Answer"\s*preferences=\{preferences\}\s*variant="answer"/,
  );
  assert.match(surface, /preferences=\{preferences\}\s*variant=\{kind\}/);
  assert.equal(surface.match(/variant="working"/g)?.length, 3);
});
