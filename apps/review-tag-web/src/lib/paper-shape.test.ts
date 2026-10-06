import assert from 'node:assert/strict';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { RtqMarkdown } from '../components/rtq-markdown';
import { enrichRtqMarkdown } from './paper-assets';

const context = {
  fileStem: 'unread',
  sectionIndex: 0,
  questionIndex: 0,
  subquestionIndex: null,
  subsubquestionIndex: null,
};

test('renders PaperShape with real KaTeX inside a same-line GFM cell', () => {
  const markdown = [
    '| Pattern | Shape |',
    '| --- | --- |',
    '| Hatch | <PaperShape name="triangle" pattern="wavy-hatch">$56$</PaperShape> |',
  ].join('\n');
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown: enrichRtqMarkdown(markdown, context),
    }),
  );

  assert.match(html, /<table/);
  assert.match(html, /data-paper-shape-name="triangle"/);
  assert.match(html, /data-paper-shape-pattern="wavy-hatch"/);
  assert.match(html, /<svg aria-hidden="true"/);
  assert.match(
    html,
    /<path class="rtq-paper-shape__pattern-stroke" d="M-6 3Q-3 0 0 3/,
  );
  assert.match(
    html,
    /<span class="rtq-paper-shape__content"><span class="katex">/,
  );
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.match(html, /<mn>56<\/mn>/);
  assert.doesNotMatch(html, /<PaperShape/);
});

test('preserves caller span rendering for ordinary spans', () => {
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown: '<span>ordinary</span> <PaperShape name="hexagon" />',
      components: {
        span: ({ children }) =>
          createElement('span', { 'data-custom': '' }, children),
      },
    }),
  );
  assert.match(html, /data-custom="">ordinary<\/span>/);
  assert.match(html, /aria-label="hexagon shape, plain pattern, blank"/);
});

test('rejects invalid shape authoring at the server preparation boundary', () => {
  assert.throws(
    () => enrichRtqMarkdown('<PaperShape name="square" size="lg" />', context),
    /PaperShape prop "size"/,
  );
});
