import assert from 'node:assert/strict';
import test from 'node:test';

import { getImageTagCatalog } from './image-tag-catalog.ts';
import {
  compatibleImageTagValues,
  imageTagGuidance,
  imageTagValueIsApplicable,
} from './image-tag-presentation.ts';

test('editor choices follow catalogue prerequisites rather than a local type list', async () => {
  const catalog = await getImageTagCatalog();
  const [family, type] = catalog.dimensions;
  assert.equal(
    compatibleImageTagValues(catalog, family, {}).length,
    family.values.length,
  );
  assert.deepEqual(compatibleImageTagValues(catalog, type, {}), []);
  for (const value of family.values) {
    const attributes = { [family.attribute]: value.value };
    const expected = type.values.filter(
      candidate => candidate.requires[family.key] === value.value,
    );
    assert.deepEqual(
      compatibleImageTagValues(catalog, type, attributes),
      expected,
    );
  }
});

test('placeholder status and last-updated metadata are visible without implying readiness', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[1];
  const value = dimension.values[0];
  const attributes = { ...value.requires, [dimension.attribute]: value.value };
  const before = structuredClone(attributes);
  const guidance = imageTagGuidance(catalog, dimension, attributes);
  assert.equal(guidance.label, 'Guide placeholder');
  assert.equal(guidance.approvalLabel, 'Vocabulary: approved');
  assert.equal(guidance.lastUpdated, value.lastUpdated);
  assert.match(guidance.message!, /Complete and approve.*before drawing/);
  assert.deepEqual(attributes, before);
});

test('pending vocabulary remains selectable and visible independently of guide readiness', async () => {
  const catalog = await getImageTagCatalog();
  const [family, type] = catalog.dimensions;
  assert.ok(
    compatibleImageTagValues(catalog, family, {}).some(
      value => value.value === 'scale',
    ),
  );
  assert.ok(
    compatibleImageTagValues(catalog, type, { family: 'scale' }).some(
      value => value.value === 'clock',
    ),
  );
  const attributes = { family: 'scale', type: 'clock' };
  const value = type.values.find(value => value.value === 'clock')!;
  const before = structuredClone(attributes);
  let guidance = imageTagGuidance(catalog, type, attributes);
  assert.equal(guidance.approvalLabel, 'Vocabulary: pending approval');
  assert.equal(guidance.label, 'Guide placeholder');
  assert.match(guidance.message!, /approve this vocabulary before drawing/);
  value.guide.status = 'available';
  guidance = imageTagGuidance(catalog, type, attributes);
  assert.equal(guidance.approvalLabel, 'Vocabulary: pending approval');
  assert.equal(guidance.label, 'Guide available');
  assert.match(guidance.message!, /drawing-tool support still needs checking/);
  value.status = 'approved';
  assert.equal(
    imageTagGuidance(catalog, type, attributes).approvalLabel,
    'Vocabulary: approved',
  );
  assert.deepEqual(attributes, before);
  assert.equal(imageTagGuidance(catalog, type, {}).approvalLabel, null);
  assert.equal(
    imageTagGuidance(catalog, type, { type: 'unknown' }).approvalLabel,
    null,
  );
});

test('missing and available guidance remain distinct from renderer support', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[0];
  const value = dimension.values[0];
  const attributes = { [dimension.attribute]: value.value };
  value.guide = { status: 'missing', path: null };
  assert.equal(
    imageTagGuidance(catalog, dimension, attributes).label,
    'Guide missing',
  );
  assert.equal(
    imageTagGuidance(catalog, dimension, attributes).lastUpdated,
    value.lastUpdated,
  );
  assert.match(
    imageTagGuidance(catalog, dimension, attributes).message!,
    /Establish and approve/,
  );
  value.guide = {
    status: 'available',
    path: `docs/image-style-guides/${dimension.key}.${value.value}.md`,
  };
  const guidance = imageTagGuidance(catalog, dimension, attributes);
  assert.equal(guidance.label, 'Guide available');
  assert.match(guidance.message!, /drawing-tool support still needs checking/);
});

test('unclassified, empty, unknown and incompatible selections are distinguishable', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[1];
  assert.equal(imageTagGuidance(catalog, dimension, {}).label, 'Unclassified');
  for (const value of ['', 'unknown']) {
    const guidance = imageTagGuidance(catalog, dimension, { type: value });
    assert.equal(guidance.label, 'Unsupported value');
    assert.equal(guidance.lastUpdated, null);
    assert.match(guidance.message!, /Choose a supported value or remove/);
  }
  const attributes = { family: 'chart', type: 'triangle' };
  const before = structuredClone(attributes);
  const guidance = imageTagGuidance(catalog, dimension, attributes);
  assert.match(guidance.label, /Incompatible selection.*Guide placeholder/);
  assert.match(guidance.message!, /Requires Family: Geometry.*explicitly/);
  assert.deepEqual(attributes, before);
});

test('prerequisite keys resolve their declared attribute names', async () => {
  const catalog = await getImageTagCatalog();
  catalog.dimensions[0].attribute = 'image-family';
  const triangle = catalog.dimensions[1].values.find(
    value => value.value === 'triangle',
  );
  assert.ok(triangle);
  assert.equal(
    imageTagValueIsApplicable(catalog, triangle, {
      'image-family': 'geometry',
    }),
    true,
  );
  assert.equal(
    imageTagValueIsApplicable(catalog, triangle, { family: 'geometry' }),
    false,
  );
});
