import assert from 'node:assert/strict';
import test from 'node:test';

import { SHAPE_PATHS } from '@rtq/review-paper-markdown/paper-shape-paths';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { RtqMarkdown } from '../components/rtq-markdown';
import { readPaperDocument } from './paper-data';

const file = 'dulwich-college--11-plus--maths--undated--specimen-paper-b.toml';
const uuid = 'C6D90BB5-335A-409A-9ED3-BCFDD0ED672D';
const equationUuid = '5925AB53-DB0F-430C-8CF8-C1FCD48156C9';

test('renders the canonical Dulwich PaperShape grid from the tag document reader', async () => {
  const paper = await readPaperDocument('toml', file);
  const question = paper.nodesFlat.find(node => node.uuid === uuid);
  assert.ok(question, `Missing canonical question ${uuid}`);
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, { markdown: question.content.question }),
  );
  assert.equal(html.match(/class="rtq-paper-shape"/g)?.length, 16);
  assert.equal(
    html.match(/class="rtq-paper-shape__pattern-stroke"/g)?.length,
    8,
  );
  assert.equal(html.match(/class="rtq-paper-shape__content"/g)?.length, 8);
  assert.equal(html.match(/class="katex"/g)?.length, 8);
  assert.equal(html.match(/<math xmlns=/g)?.length, 8);
  assert.equal(html.match(/aria-label="[^"]*, blank"/g)?.length, 8);
  assert.deepEqual(
    [...html.matchAll(/data-paper-shape-name="([^"]+)"/g)].map(
      ([, name]) => name,
    ),
    Array.from({ length: 4 }, () => [
      'square',
      'circle',
      'triangle',
      'hexagon',
    ]).flat(),
  );
  assert.deepEqual(
    [...html.matchAll(/data-paper-shape-pattern="([^"]+)"/g)].map(
      ([, pattern]) => pattern,
    ),
    [
      ...Array(4).fill('plain'),
      ...Array(4).fill('vertical-stripes'),
      ...Array(4).fill('wavy-hatch'),
      ...Array(4).fill('plain'),
    ],
  );
  assert.equal(html.match(/<td\b/g)?.length, 16);
  assert.doesNotMatch(html, /<th\b/);
  assert.match(html, /data-density="compact"/);
  assert.match(html, /data-grid="none"/);

  const equation = question.children.find(node => node.uuid === equationUuid);
  assert.ok(equation, `Missing shape equation ${equationUuid}`);
  const equationHtml = renderToStaticMarkup(
    createElement(RtqMarkdown, { markdown: equation.content.question }),
  );
  assert.equal(equationHtml.match(/data-paper-symbol-name=/g)?.length, 4);
  for (const [name, path] of Object.entries(SHAPE_PATHS)) {
    const symbol = equationHtml
      .split(`data-paper-symbol-name="${name}"`)[1]
      ?.split('</svg>')[0];
    assert.ok(symbol, `Missing ${name} equation symbol`);
    assert.match(symbol, /viewBox="0 0 64 64"/);
    assert.ok(symbol.includes(`d="${path}"`));
  }
});
