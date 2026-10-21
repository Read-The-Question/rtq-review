import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PaperContentFieldSourceError,
  readPaperContentField,
  replacePaperContentField,
} from './content-source.ts';
import type { ReviewContentFieldLocator } from './model.ts';

const source = `[[sections]]
title = 'One'

[[sections.questions]]
rtq-uuid = 'question-one'
question = '''Repeated text'''

[[sections.questions.workings]]
working = '''First working'''

[[sections.questions.workings.formulas]]
formula = '''x = 1'''

[[sections.questions.workings.formulas]]
formula = '''y = 2'''

[[sections.questions.workings.tips]]
tip = '''Use the formula'''

[[sections.questions.answers]]
option = '''Repeated text'''
key = '''A'''
answer = '''The first answer'''

[[sections.questions.answers]]
option = '''Second option'''
key = '''B'''
answer = '''The second answer'''

[[sections.questions.subquestions]]
rtq-uuid = 'subquestion-one'
question = '''Nested question'''
`;

function locator(value: ReviewContentFieldLocator): ReviewContentFieldLocator {
  return value;
}

test('content source fields are resolved by UUID, kind, and collection index', () => {
  const examples: ReadonlyArray<readonly [ReviewContentFieldLocator, string]> =
    [
      [
        locator({ kind: 'question', nodeUuid: 'question-one' }),
        'Repeated text',
      ],
      [
        locator({
          kind: 'working',
          nodeUuid: 'question-one',
          workingIndex: 0,
        }),
        'First working',
      ],
      [
        locator({
          itemIndex: 1,
          kind: 'formula',
          nodeUuid: 'question-one',
          workingIndex: 0,
        }),
        'y = 2',
      ],
      [
        locator({
          itemIndex: 0,
          kind: 'tip',
          nodeUuid: 'question-one',
          workingIndex: 0,
        }),
        'Use the formula',
      ],
      [
        locator({
          answerIndex: 1,
          kind: 'option',
          nodeUuid: 'question-one',
        }),
        'Second option',
      ],
      [
        locator({
          answerIndex: 0,
          kind: 'key',
          nodeUuid: 'question-one',
        }),
        'A',
      ],
      [
        locator({
          answerIndex: 1,
          kind: 'answer',
          nodeUuid: 'question-one',
        }),
        'The second answer',
      ],
      [
        locator({ kind: 'question', nodeUuid: 'subquestion-one' }),
        'Nested question',
      ],
    ];

  for (const [field, expected] of examples) {
    assert.equal(readPaperContentField(source, field), expected);
  }
});

test('a replacement changes only the selected TOML value span', () => {
  const field = locator({
    answerIndex: 0,
    kind: 'option',
    nodeUuid: 'question-one',
  });
  const updated = replacePaperContentField(
    source,
    field,
    'Changed on two lines\nwith "quotes" and \\slashes',
  );

  assert.equal(
    readPaperContentField(updated, field),
    'Changed on two lines\nwith "quotes" and \\slashes',
  );
  assert.equal(
    readPaperContentField(updated, {
      kind: 'question',
      nodeUuid: 'question-one',
    }),
    'Repeated text',
  );
  assert.equal(
    updated.replace(
      `'''\nChanged on two lines\nwith "quotes" and \\slashes'''`,
      "'''Repeated text'''",
    ),
    source,
  );
});

test('values containing literal multiline delimiters use a safe basic string', () => {
  const field = locator({ kind: 'question', nodeUuid: 'question-one' });
  const value = `Keep ''' this delimiter and a tab\there`;
  const updated = replacePaperContentField(source, field, value);

  assert.equal(readPaperContentField(updated, field), value);
  assert.match(updated, /question = """/);
});

test('missing UUIDs and mismatched locators are rejected', () => {
  assert.throws(
    () => readPaperContentField(source, { kind: 'question' }),
    (error: unknown) =>
      error instanceof PaperContentFieldSourceError &&
      error.code === 'field-not-found',
  );
  assert.throws(
    () =>
      readPaperContentField(source, {
        answerIndex: 99,
        kind: 'answer',
        nodeUuid: 'question-one',
      }),
    (error: unknown) =>
      error instanceof PaperContentFieldSourceError &&
      error.code === 'field-not-found',
  );
});
