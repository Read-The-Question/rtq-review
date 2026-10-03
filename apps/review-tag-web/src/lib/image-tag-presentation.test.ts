import assert from 'node:assert/strict';
import test from 'node:test';

import { getImageTagCatalog } from './image-tag-catalog.ts';
import { imageTagGuidance } from './image-tag-presentation.ts';

test('family and type vocabulary remain independently available', async () => {
  const catalog = await getImageTagCatalog();
  const [family, type] = catalog.dimensions;

  assert.ok(family.values.some(value => value.value === 'venn'));
  assert.ok(type.values.some(value => value.value === 'triangle'));
  assert.doesNotThrow(() =>
    imageTagGuidance(type, { family: 'venn', type: 'triangle' }),
  );
  assert.equal(
    imageTagGuidance(type, { type: 'triangle' }).label,
    'Guide placeholder',
  );
});

test('placeholder status and last-updated metadata are visible without implying readiness', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[1];
  const value = dimension.values[0];
  const attributes = { [dimension.attribute]: value.value };
  const before = structuredClone(attributes);
  const guidance = imageTagGuidance(dimension, attributes);
  assert.equal(guidance.label, 'Guide placeholder');
  assert.equal(guidance.approvalLabel, 'Vocabulary: approved');
  assert.equal(guidance.lastUpdated, value.lastUpdated);
  assert.match(guidance.message!, /Complete and approve.*before drawing/);
  assert.deepEqual(attributes, before);
});

test('pending vocabulary remains selectable and visible independently of guide readiness', async () => {
  const catalog = await getImageTagCatalog();
  const [family, type] = catalog.dimensions;
  assert.ok(family.values.some(value => value.value === 'scale'));
  assert.ok(type.values.some(value => value.value === 'clock'));

  const attributes = { type: 'clock' };
  const value = type.values.find(value => value.value === 'clock')!;
  const before = structuredClone(attributes);
  let guidance = imageTagGuidance(type, attributes);
  assert.equal(guidance.approvalLabel, 'Vocabulary: pending approval');
  assert.equal(guidance.label, 'Guide placeholder');
  assert.match(guidance.message!, /approve this vocabulary before drawing/);
  value.guide.status = 'available';
  guidance = imageTagGuidance(type, attributes);
  assert.equal(guidance.approvalLabel, 'Vocabulary: pending approval');
  assert.equal(guidance.label, 'Guide available');
  assert.match(guidance.message!, /drawing-tool support still needs checking/);
  value.status = 'approved';
  assert.equal(
    imageTagGuidance(type, attributes).approvalLabel,
    'Vocabulary: approved',
  );
  assert.deepEqual(attributes, before);
  assert.equal(imageTagGuidance(type, {}).approvalLabel, null);
  assert.equal(imageTagGuidance(type, { type: 'unknown' }).approvalLabel, null);
});

test('missing and available guidance remain distinct from renderer support', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[0];
  const value = dimension.values[0];
  const attributes = { [dimension.attribute]: value.value };
  value.guide = { status: 'missing', path: null };
  assert.equal(imageTagGuidance(dimension, attributes).label, 'Guide missing');
  assert.equal(
    imageTagGuidance(dimension, attributes).lastUpdated,
    value.lastUpdated,
  );
  assert.match(
    imageTagGuidance(dimension, attributes).message!,
    /Establish and approve/,
  );
  value.guide = {
    status: 'available',
    path: `docs/image-style-guides/${dimension.key}.${value.value}.md`,
  };
  const guidance = imageTagGuidance(dimension, attributes);
  assert.equal(guidance.label, 'Guide available');
  assert.match(guidance.message!, /drawing-tool support still needs checking/);
});

test('unclassified, empty, and unknown selections are distinguishable', async () => {
  const catalog = await getImageTagCatalog();
  const dimension = catalog.dimensions[1];
  assert.equal(imageTagGuidance(dimension, {}).label, 'Unclassified');
  for (const value of ['', 'unknown']) {
    const guidance = imageTagGuidance(dimension, { type: value });
    assert.equal(guidance.label, 'Unsupported value');
    assert.equal(guidance.lastUpdated, null);
    assert.match(guidance.message!, /Choose a supported value or remove/);
  }
});
