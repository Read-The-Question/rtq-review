import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { QuestionTagCatalog } from '@rtq/review-paper-model/client';

import '../../scripts/paper-image-test-loader.mjs';

const { QuestionTagTable } =
  await import('../components/question-tag-table.tsx');
const { QuestionTagEditor } =
  await import('../components/question-tag-editor.tsx');

const subQuestion = {
  effectiveTags: [
    { axis: 'family', origin: 'inherited', value: 'family.ratio' },
    { axis: 'math', origin: 'implicit', value: 'math.unknown' },
    { axis: 'frame', origin: 'explicit', value: 'frame.money' },
    { axis: 'marker', origin: 'explicit', value: 'marker.two-step' },
    { axis: 'marker', origin: 'explicit', value: 'marker.units' },
    { axis: 'reasoning', origin: 'implicit', value: 'reasoning.direct' },
  ],
  explicitInherit: null,
  explicitTags: ['frame.money', 'marker.two-step', 'marker.units'],
  inheritedTags: [
    { axis: 'family', origin: 'inherited', value: 'family.ratio' },
    { axis: 'frame', origin: 'inherited', value: 'frame.raw' },
  ],
} as const;

const catalog: QuestionTagCatalog = {
  family: ['family.ratio', 'family.area'],
  frame: ['frame.money', 'frame.raw'],
  marker: ['marker.two-step', 'marker.units'],
  math: ['math.fractions', 'math.unknown'],
  reasoning: ['reasoning.direct'],
};

function rowCells(markup: string, row: string): string[] {
  const match = new RegExp(`<tr data-row="${row}">(.*?)</tr>`).exec(markup);
  assert.ok(match, `row ${row} is rendered`);
  return [...match[1].matchAll(/<td[^>]*>(.*?)<\/td>/g)].map((cell) =>
    cell[1]
      .replace(/<span class="visually-hidden">None<\/span>/g, '')
      .replace(/<[^>]+>/g, ''),
  );
}

test('sub-question tags read as one table: inherited, set here, final', () => {
  const markup = renderToStaticMarkup(
    createElement(QuestionTagTable, {
      label: 'Q1a dimensional tags',
      nodeDepth: 1,
      state: subQuestion,
    }),
  );

  assert.match(markup, /aria-label="Q1a dimensional tags"/);
  assert.deepEqual(
    [...markup.matchAll(/<th data-axis="([a-z]+)" scope="col">([^<]+)</g)].map(
      (header) => `${header[1]}:${header[2]}`,
    ),
    [
      'family:Family',
      'math:Math',
      'frame:Frame',
      'marker:Markers',
      'reasoning:Reasoning',
    ],
  );
  assert.deepEqual(rowCells(markup, 'inherited'), [
    'ratio',
    '—',
    'raw',
    '—',
    '—',
  ]);
  assert.deepEqual(rowCells(markup, 'explicit'), [
    '—',
    '—',
    'money',
    'two-step, units',
    '—',
  ]);
  assert.deepEqual(rowCells(markup, 'final'), [
    'ratio',
    'unknown',
    'money',
    'two-step, units',
    'direct',
  ]);
  // No per-value notes: the rows already show overrides and defaults.
  assert.doesNotMatch(markup, /overridden|same as parent|default|↳/);
});

test('inheritance off and top-level questions keep the same columns', () => {
  const off = renderToStaticMarkup(
    createElement(QuestionTagTable, {
      label: 'Q1a dimensional tags',
      nodeDepth: 1,
      state: { ...subQuestion, explicitInherit: false },
    }),
  );
  assert.match(
    off,
    /<td class="tag-table__note" colSpan="5">Inheritance is off/,
  );

  const topLevel = renderToStaticMarkup(
    createElement(QuestionTagTable, {
      label: 'Q1 dimensional tags',
      nodeDepth: 0,
      state: { ...subQuestion, inheritedTags: [] },
    }),
  );
  assert.doesNotMatch(topLevel, /data-row="inherited"/);
  assert.match(topLevel, /data-row="explicit"/);
  assert.match(topLevel, /data-row="final"/);
});

test('edit mode makes only the Set here row editable', () => {
  const markup = renderToStaticMarkup(
    createElement(QuestionTagEditor, {
      catalog,
      disabled: false,
      nodeDepth: 1,
      nodeLabel: 'Q1a',
      onChange: () => undefined,
      state: { ...subQuestion, nodeUuid: 'uuid-1' },
      status: { kind: 'idle', message: '' },
    }),
  );

  const explicitRow = /<tr data-row="explicit">(.*?)<\/tr>/.exec(markup)?.[1];
  assert.ok(explicitRow);
  assert.match(explicitRow, /aria-label="Remove frame\.money"/);
  assert.match(explicitRow, /aria-label="Add family tag"/);
  assert.match(explicitRow, /aria-label="Change frame tag"/);
  // Every marker is already chosen, so there is nothing left to add.
  assert.doesNotMatch(explicitRow, /Add markers tag/);
  for (const row of ['inherited', 'final']) {
    const cells = /<tr data-row="[a-z]+">(.*?)<\/tr>/g;
    for (const match of markup.matchAll(cells)) {
      if (match[0].includes(`data-row="${row}"`)) {
        assert.doesNotMatch(match[1], /<select|<button/);
      }
    }
  }

  // The old duplicate rows and per-card lines are gone.
  assert.doesNotMatch(
    markup,
    /tag-lineage-row|tag-axis-card|tag-axis-inherited|No explicit tag|Effective/,
  );
  assert.match(markup, /Use parent tags/);
});

test('colour is on the axis headers only', async () => {
  const css = await readFile(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  assert.match(css, /\.tag-table thead th\s*{[^}]*--tag-axis-accent/s);
  assert.doesNotMatch(css, /\.tag-table tbody td\s*{[^}]*background/s);
  assert.doesNotMatch(css, /\.tag-group|\.tag-axis-card|\.node-tags-layer/);
});
