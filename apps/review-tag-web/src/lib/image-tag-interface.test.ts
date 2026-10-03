import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

import { markdownWithOccurrenceMarkers } from './image-tag-markers.ts';
import type { ImageTagOccurrence } from './paper-types.ts';

const sourceRoot = new URL('..', import.meta.url);

function occurrence(id: string, previewMarkdown: string): ImageTagOccurrence {
  return {
    assetState: 'available',
    attributes: {},
    contextMarkdown: '',
    field: { kind: 'question' },
    fieldLabel: 'Question',
    hierarchyLabel: '1',
    id,
    imageNumber: Number(id),
    nodeUuid: 'test-node-uuid',
    occurrenceIndex: Number(id) - 1,
    previewMarkdown,
    scope: 'question',
  };
}

test('keeps surrounding paper content and marks each repeated image independently', () => {
  const first = occurrence('1', '<figure>first image</figure>');
  const second = occurrence('2', '<figure>second image</figure>');
  const source = `Before\n${first.previewMarkdown}\nBetween\n${second.previewMarkdown}\nAfter`;

  const result = markdownWithOccurrenceMarkers(source, [first, second]);

  assert.equal(
    result.markdown,
    'Before\n<div data-image-tag-occurrence="0"></div>\nBetween\n<div data-image-tag-occurrence="1"></div>\nAfter',
  );
  assert.equal(result.marked.get('0'), first);
  assert.equal(result.marked.get('1'), second);
});

test('image review composes the question document and shared tag controls', async () => {
  const [document, imageDocument, imageEditor, css] = await Promise.all([
    fs.readFile(new URL('components/node-document.tsx', sourceRoot), 'utf8'),
    fs.readFile(
      new URL('components/image-tag-document.tsx', sourceRoot),
      'utf8',
    ),
    fs.readFile(
      new URL('components/image-tag-occurrence-editor.tsx', sourceRoot),
      'utf8',
    ),
    fs.readFile(new URL('app/globals.css', sourceRoot), 'utf8'),
  ]);

  assert.match(imageDocument, /<ImageNodeDocument/);
  assert.match(document, /review\.kind === 'image'/);
  assert.match(document, /<ImageTagMarkdown/);
  assert.match(document, /review\.kind === 'question'/);
  assert.match(document, /<PaperOutline/);
  assert.match(document, /function tagOutlineNode/);
  assert.match(document, /node\.imageOccurrences\.length/);
  assert.match(document, /occurrence\.assetState === 'missing'/);
  assert.doesNotMatch(document, /node\.explicitDisplayTags\.length/);
  assert.match(document, /Parent tag inheritance off/);
  assert.doesNotMatch(document, /QuestionGlance|ImageGlance/);
  assert.match(css, /@rtq\/review-paper-browser\/paper-outline\.css/);
  assert.match(imageEditor, /<TagGroup/);
  assert.match(imageEditor, /<TagPicker/);
  assert.match(
    imageEditor,
    /imageTagGuidance\(\s*catalog,\s*dimension,\s*occurrence\.attributes,?\s*\)/,
  );
  assert.match(imageEditor, /dateTime=\{guidance\.lastUpdated\}/);
  assert.match(imageEditor, /guidance\.message/);
  assert.match(imageEditor, /guidance\.approvalLabel/);
  assert.match(imageEditor, /Vocabulary approval is separate/);
  assert.match(imageEditor, /Dependent tags are never removed automatically/);
  assert.match(imageEditor, />Final tags</);
  assert.doesNotMatch(imageEditor, /<select/);
  assert.doesNotMatch(imageEditor, /Use parent tags|Inherited from parent/);
});
