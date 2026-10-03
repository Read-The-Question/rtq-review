import assert from 'node:assert/strict';
import test from 'node:test';

import { readPaperDocument } from './paper-data.ts';
import { findPaperImageComponents } from './paper-image-components.ts';

test('discovers nested and repeated question and working PaperImage occurrences', async () => {
  const document = await readPaperDocument(
    'focusPaperToml',
    'bancrofts-school--11-plus--maths--2018--paper-1.toml',
  );

  assert.ok(document.imageOccurrences.length > 0);
  assert.ok(
    document.imageOccurrences.some(
      occurrence =>
        occurrence.scope === 'question' &&
        occurrence.hierarchyLabel.includes('.'),
    ),
    'expected a nested question image',
  );
  assert.ok(
    document.imageOccurrences.some(
      occurrence => occurrence.scope === 'working',
    ),
    'expected a working image',
  );
  assert.ok(
    document.imageOccurrences.some(
      occurrence =>
        occurrence.scope === 'question' && occurrence.occurrenceIndex > 0,
    ),
    'expected multiple independently indexed images in one field',
  );
  assert.ok(
    document.imageOccurrences.every(
      occurrence =>
        occurrence.nodeUuid &&
        occurrence.contextMarkdown &&
        occurrence.previewMarkdown,
    ),
  );
  assert.ok(
    document.imageOccurrences.every(
      occurrence => !occurrence.previewMarkdown.includes('LongDivision'),
    ),
  );
});

test('discovers answer PaperImage components while excluding legacy and generated image forms', () => {
  const components = findPaperImageComponents(
    `TODOIMAGE
<LongDivision assetScope="answer" dividend="24" divisor="3" />
<PaperImage assetScope="answer" kind="essential" />`,
    'answer',
  );

  assert.equal(components.length, 1);
  assert.deepEqual(components[0].attributes, {
    assetScope: 'answer',
    kind: 'essential',
  });
});
