import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PaperTagSourceError,
  readPaperNodeTagSource,
  replacePaperNodeTags,
  sortPersistedQuestionTags,
} from './tag-source.ts';

const source = `[[sections]]
name = 'One'

[[sections.questions]]
rtq-uuid = 'root-one'
rtq-tags = ['family.money', 'legacy'] # keep this note
question = 'Root'

[[sections.questions.subquestions]]
rtq-uuid = 'child-one'
rtq-tags = ['math.number']
question = 'Child'

[[sections.questions.subquestions.workings]]
working = 'Do not treat nested fields as node tags'

[[sections.questions.subquestions]]
rtq-uuid = 'child-two'
question = 'Second child'
`;

test('reads explicit tags and default inheritance by UUID', () => {
  assert.deepEqual(readPaperNodeTagSource(source, 'root-one'), {
    depth: 0,
    explicitInherit: null,
    explicitTags: ['family.money', 'legacy'],
    nodeUuid: 'root-one',
  });
  assert.deepEqual(readPaperNodeTagSource(source, 'child-one'), {
    depth: 1,
    explicitInherit: true,
    explicitTags: ['math.number'],
    nodeUuid: 'child-one',
  });
});

test('replaces only the selected node tags and preserves comments', () => {
  const updated = replacePaperNodeTags(source, {
    explicitInherit: null,
    explicitTags: ['frame.prose', 'family.age'],
    nodeUuid: 'root-one',
  });
  assert.match(
    updated,
    /rtq-tags = \["frame\.prose", "family\.age"\] # keep this note/,
  );
  assert.deepEqual(readPaperNodeTagSource(updated, 'child-one').explicitTags, [
    'math.number',
  ]);
});

test('inserts missing tag and inheritance assignments for a nested node', () => {
  const updated = replacePaperNodeTags(source, {
    explicitInherit: false,
    explicitTags: ['marker.find-mode'],
    nodeUuid: 'child-two',
  });
  assert.deepEqual(readPaperNodeTagSource(updated, 'child-two'), {
    depth: 1,
    explicitInherit: false,
    explicitTags: ['marker.find-mode'],
    nodeUuid: 'child-two',
  });
});

test('rejects ambiguous UUIDs and invalid inheritance', () => {
  assert.throws(
    () =>
      readPaperNodeTagSource(
        `${source}\n[[sections.questions]]\nrtq-uuid = 'root-one'\n`,
        'root-one',
      ),
    (error: unknown) =>
      error instanceof PaperTagSourceError && error.code === 'node-not-found',
  );
  assert.throws(
    () =>
      replacePaperNodeTags(source, {
        explicitInherit: true,
        explicitTags: [],
        nodeUuid: 'root-one',
      }),
    /top-level question cannot inherit/,
  );
});

test('sorts persisted tags by legacy and dimensional axis', () => {
  assert.deepEqual(
    sortPersistedQuestionTags([
      'marker.find-mode',
      'family.money',
      'legacy',
      'math.number',
      'family.money',
    ]),
    ['legacy', 'family.money', 'math.number', 'marker.find-mode'],
  );
});
