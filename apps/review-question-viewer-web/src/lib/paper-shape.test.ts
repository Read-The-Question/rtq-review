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
    '| Plain | <PaperShape name="circle" size="2xl">$56$</PaperShape> |',
  ].join('\n');
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown: enrichRtqMarkdown(markdown, context),
    }),
  );

  assert.match(html, /<table/);
  assert.match(html, /data-paper-shape-name="circle"/);
  assert.match(html, /data-paper-shape-pattern="plain"/);
  assert.match(html, /data-paper-shape-size="2xl"/);
  assert.match(html, /<svg aria-hidden="true"/);
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.match(html, /<mn>56<\/mn>/);
});

test('rejects invalid shape authoring at the server preparation boundary', () => {
  assert.throws(
    () =>
      enrichRtqMarkdown(
        '<PaperShape name="hexagon" pattern="dots" />',
        context,
      ),
    /PaperShape prop "pattern"/,
  );
});
