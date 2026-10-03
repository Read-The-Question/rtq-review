import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ImageTagCatalogError,
  getImageTagCatalog,
  validateImageTagCatalog,
} from './image-tag-catalog.ts';

test('loads the canonical image catalog for schema-driven controls', async () => {
  const catalog = await getImageTagCatalog();

  assert.equal(catalog.version, 1);
  assert.equal(catalog.component, 'PaperImage');
  assert.deepEqual(
    new Set(catalog.assignment.scopes),
    new Set(['question', 'working', 'answer']),
  );
  assert.deepEqual(catalog.dimensions, [
    {
      attribute: 'family',
      cardinality: 'zero-or-one',
      inheritance: 'none',
      key: 'family',
      label: 'Family',
      omission: 'unclassified',
      values: [
        {
          description: 'A Venn diagram representing sets and their regions.',
          guide: { path: null, status: 'missing' },
          label: 'Venn diagram',
          status: 'supported',
          value: 'venn',
        },
      ],
    },
  ]);
});

test('rejects unsupported catalog versions instead of guessing a vocabulary', () => {
  assert.throws(
    () =>
      validateImageTagCatalog({
        assignment: {
          scopes: ['question', 'working', 'answer'],
          syntax: 'static-double-quoted-prop',
        },
        component: 'PaperImage',
        dimensions: [],
        version: 2,
      }),
    (error: unknown) =>
      error instanceof ImageTagCatalogError &&
      /Unsupported image dimensional-tag catalog version/.test(error.message),
  );
});
