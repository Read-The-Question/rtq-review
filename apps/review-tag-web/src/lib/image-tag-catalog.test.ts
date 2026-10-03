import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ImageTagCatalogError,
  getImageTagCatalog,
  validateImageTagAssignments,
  validateImageTagCatalog,
} from './image-tag-catalog.ts';

test('loads the canonical image catalog for schema-driven controls', async () => {
  const catalog = await getImageTagCatalog();

  assert.equal(catalog.version, 2);
  assert.equal(catalog.component, 'PaperImage');
  assert.deepEqual(
    new Set(catalog.assignment.scopes),
    new Set(['question', 'working', 'answer']),
  );
  assert.deepEqual(
    catalog.dimensions.map(dimension => dimension.key),
    ['family', 'type'],
  );
  assert.deepEqual(
    catalog.dimensions[0]?.values.map(value => value.value),
    ['venn', 'illustration', 'geometry', 'chart', 'custom'],
  );
  assert.deepEqual(catalog.dimensions[1]?.values[2], {
    description:
      'A standard triangle diagram. Side labels, angle labels and right-angle marks do not create separate types.',
    guide: {
      path: 'docs/image-style-guides/type.triangle.md',
      status: 'placeholder',
    },
    label: 'Triangle',
    lastUpdated: '2026-10-03',
    requires: { family: 'geometry' },
    status: 'supported',
    value: 'triangle',
  });
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
        version: 1,
      }),
    (error: unknown) =>
      error instanceof ImageTagCatalogError &&
      /Unsupported image dimensional-tag catalog version/.test(error.message),
  );
});

test('validates catalog dependencies and assigned value combinations', async () => {
  const catalog = await getImageTagCatalog();

  assert.doesNotThrow(() =>
    validateImageTagAssignments(catalog, {
      family: 'geometry',
      type: 'triangle',
    }),
  );
  assert.throws(
    () =>
      validateImageTagAssignments(catalog, {
        family: 'chart',
        type: 'triangle',
      }),
    /type="triangle" requires family="geometry"/,
  );
  assert.throws(
    () => validateImageTagAssignments(catalog, { family: 'unknown' }),
    /unsupported family="unknown"/,
  );
});
