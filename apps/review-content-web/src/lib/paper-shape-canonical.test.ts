import assert from 'node:assert/strict';
import test from 'node:test';

import { readReviewPaper } from '@rtq/review-paper-model';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { RtqMarkdown } from '../components/rtq-markdown';
import '../../scripts/paper-image-test-loader.mjs';

const { prepareReviewPaperNodeForDisplay } = await import('./prepare-paper');

const file = 'dulwich-college--11-plus--maths--undated--specimen-paper-b.toml';
const uuid = 'C6D90BB5-335A-409A-9ED3-BCFDD0ED672D';

test('renders the canonical Dulwich PaperShape grid from reviewed source', async () => {
  const paper = await readReviewPaper('toml', file);
  const question = paper.sections
    .flatMap((section) => section.questions)
    .find((node) => node.uuid === uuid);
  assert.ok(question, `Missing canonical question ${uuid}`);

  const source = question.content.question.expanded;
  assert.equal(source.match(/<PaperShape\b/g)?.length, 16);
  assert.equal(source.match(/\$\d+\$/g)?.length, 8);
  assert.match(source, /<PaperTable[^>]*columnHeaders="none"/);
  assert.match(source, /<PaperTable[^>]*density="compact"/);
  assert.match(source, /<PaperTable[^>]*grid="none"/);

  const prepared = prepareReviewPaperNodeForDisplay(question).content.question;
  assert.equal(prepared.preparationIssue, undefined);
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, { markdown: prepared.rendered }),
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
  assert.equal(
    html.match(/aria-hidden="true" class="rtq-paper-shape__graphic"/g)?.length,
    16,
  );
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
});
