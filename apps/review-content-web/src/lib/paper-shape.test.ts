import assert from 'node:assert/strict';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReviewPaperNode } from '@rtq/review-paper-model';

import { RtqMarkdown } from '../components/rtq-markdown';
import '../../scripts/paper-image-test-loader.mjs';

const { prepareReviewPaperNodeForDisplay } = await import('./prepare-paper');

function prepareQuestion(markdown: string) {
  const field = {
    context: {
      answerIndex: 0,
      paperStem: 'unread',
      questionIndex: 0,
      scope: 'question' as const,
      sectionIndex: 0,
      workingIndex: 0,
    },
    expanded: markdown,
    preparations: [],
    raw: markdown,
  };
  const node = {
    children: [],
    content: { answers: [], question: field, workings: [] },
  } as unknown as ReviewPaperNode;
  return prepareReviewPaperNodeForDisplay(node).content.question;
}

test('renders patterned PaperShape with real KaTeX inside a GFM table cell', () => {
  const markdown = [
    '| Pattern | Shape |',
    '| --- | --- |',
    '| Stripes | <PaperShape name="square" pattern="vertical-stripes" size="2xl">**$56$**</PaperShape> |',
  ].join('\n');
  const prepared = prepareQuestion(markdown);
  assert.equal(prepared.preparationIssue, undefined);
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, { markdown: prepared.rendered }),
  );

  assert.match(html, /<table/);
  assert.match(html, /data-paper-shape-name="square"/);
  assert.match(html, /data-paper-shape-pattern="vertical-stripes"/);
  assert.match(html, /data-paper-shape-size="2xl"/);
  assert.match(html, /aria-label="square shape, vertical stripes pattern"/);
  assert.match(html, /role="group"/);
  assert.match(html, /<svg aria-hidden="true"/);
  assert.match(
    html,
    /<path class="rtq-paper-shape__pattern-stroke" d="M3 0V12M9 0V12" stroke="currentColor"/,
  );
  assert.match(
    html,
    /<path d="M3 3H61V61H3Z" fill="url\(#.+?\)" stroke="currentColor" stroke-width="2"/,
  );
  assert.match(
    html,
    /<span class="rtq-paper-shape__content"><strong><span class="katex">/,
  );
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.match(html, /<mn>56<\/mn>/);
});

test('labels a self-closing shape as blank and keeps fenced examples literal', () => {
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown:
        '<PaperShape name="circle" />\n\n```mdx\n<PaperShape name="square" />\n```',
    }),
  );
  assert.match(html, /aria-label="circle shape, plain pattern, blank"/);
  assert.equal(html.match(/class="rtq-paper-shape"/g)?.length, 1);
  assert.match(html, /&lt;PaperShape name=&quot;square&quot; \/&gt;/);
});

test('assigns separate SVG pattern IDs to adjacent shapes', () => {
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown:
        '<PaperShape name="square" pattern="vertical-stripes" /> <PaperShape name="square" pattern="vertical-stripes" />',
    }),
  );
  const ids = [...html.matchAll(/<pattern[^>]* id="([^"]+)"/g)].map(
    ([, id]) => id,
  );
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  for (const id of ids) {
    assert.ok(html.includes(`fill="url(#${id})"`));
  }
});

test('reports invalid shapes via the existing content preparation issue', () => {
  const prepared = prepareQuestion(
    '<PaperShape name="square" pattern="dots" />',
  );
  assert.match(prepared.preparationIssue ?? '', /PaperShape prop "pattern"/);
});
