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

  assert.equal(catalog.version, 3);
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
    [
      'venn',
      'illustration',
      'geometry',
      'chart',
      'custom',
      'scale',
      'schematic',
    ],
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
    status: 'approved',
    value: 'triangle',
  });
});

test('accepts pending vocabulary but rejects missing or invalid approval states', async () => {
  const catalog = await getImageTagCatalog();
  const values = catalog.dimensions.flatMap(dimension => dimension.values);
  assert.equal(
    values.filter(value => value.status === 'pending-approval').length,
    20,
  );
  assert.equal(values.filter(value => value.status === 'approved').length, 11);
  assert.doesNotThrow(() =>
    validateImageTagAssignments(catalog, { family: 'scale', type: 'clock' }),
  );
  for (const status of [undefined, 'supported', 'pending', 'available']) {
    const broken = structuredClone(catalog);
    Object.assign(broken.dimensions[0].values[0], { status });
    assert.throws(() => validateImageTagCatalog(broken), /status must be/);
  }
  for (const version of [2, 4]) {
    assert.throws(
      () => validateImageTagCatalog({ ...catalog, version }),
      /Unsupported.*version/,
    );
  }
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

test('rejects malformed dates, guide paths, missing-guide paths and prerequisites', async () => {
  const canonical = await getImageTagCatalog();
  const badDate = structuredClone(canonical);
  badDate.dimensions[0].values[0].lastUpdated = '2026-02-30';
  assert.throws(
    () => validateImageTagCatalog(badDate),
    /valid YYYY-MM-DD date/,
  );
  const badPath = structuredClone(canonical);
  badPath.dimensions[0].values[0].guide.path = '../wrong-guide.md';
  assert.throws(() => validateImageTagCatalog(badPath), /guide.path must be/);
  const missing = structuredClone(canonical);
  missing.dimensions[0].values[0].guide.status = 'missing';
  assert.throws(() => validateImageTagCatalog(missing), /path must be null/);
  const badDependency = structuredClone(canonical);
  badDependency.dimensions[1].values[0].requires = { family: 'unknown' };
  assert.throws(
    () => validateImageTagCatalog(badDependency),
    /supported value of an earlier dimension/,
  );
});
