import assert from 'node:assert/strict';
import test from 'node:test';

import { getImageTagCatalog } from './image-tag-catalog.ts';
import {
  ImageTagMutationError,
  applyImageTagMutationToRaw,
  imageTagSourceVersion,
  verifyImageTagSourceVersion,
} from './paper-image-write-lines.ts';
import type { ImageTagCatalog } from './paper-types.ts';

const catalog: ImageTagCatalog = {
  assignment: {
    scopes: ['question', 'working', 'answer'],
    syntax: 'static-double-quoted-prop',
  },
  component: 'PaperImage',
  dimensions: [
    {
      attribute: 'family',
      cardinality: 'zero-or-one',
      inheritance: 'none',
      key: 'family',
      label: 'Family',
      omission: 'unclassified',
      values: [
        {
          description: 'A Venn diagram.',
          guide: { path: null, status: 'missing' },
          label: 'Venn diagram',
          lastUpdated: '2026-10-03',
          status: 'approved',
          value: 'venn',
        },
        {
          description: 'A geometric diagram.',
          guide: {
            path: 'docs/image-style-guides/family.geometry.md',
            status: 'placeholder',
          },
          label: 'Geometry',
          lastUpdated: '2026-10-03',
          status: 'approved',
          value: 'geometry',
        },
      ],
    },
    {
      attribute: 'type',
      cardinality: 'zero-or-one',
      inheritance: 'none',
      key: 'type',
      label: 'Type',
      omission: 'unclassified',
      values: [
        {
          description: 'A triangle.',
          guide: {
            path: 'docs/image-style-guides/type.triangle.md',
            status: 'placeholder',
          },
          label: 'Triangle',
          lastUpdated: '2026-10-03',
          status: 'approved',
          value: 'triangle',
        },
      ],
    },
  ],
  version: 4,
};

const source = `title = "Fixture"

[[sections]]
name = "Section"

[[sections.questions]]
rtq-uuid = "ROOT"
question = '''
Compare the diagrams.
<PaperImage assetScope="question" kind="essential" family="venn" />
<PaperImage assetScope="question" kind="essential" />
'''

[[sections.questions.workings]]
working = '''
Work it out.
<PaperImage assetScope="working" kind="essential" />
'''

[[sections.questions.answers]]
answer = '''
<PaperImage assetScope="answer" kind="essential" />
'''

[[sections.questions.subquestions]]
rtq-uuid = "CHILD"
question = '''
Nested image.
<PaperImage assetScope="question" kind="essential" />
'''
`;

function mutate(input: {
  dimensionKey?: string;
  field?: { kind: 'question' } | { index: number; kind: 'answer' | 'working' };
  nodeUuid?: string;
  occurrenceIndex?: number;
  value: string | null;
}) {
  return applyImageTagMutationToRaw(
    source,
    {
      dimensionKey: input.dimensionKey ?? 'family',
      field: input.field ?? { kind: 'question' },
      nodeUuid: input.nodeUuid ?? 'ROOT',
      occurrenceIndex: input.occurrenceIndex ?? 0,
      value: input.value,
    },
    catalog,
  );
}

test('adds, replaces, and removes one image prop without reformatting TOML', () => {
  const added = mutate({ occurrenceIndex: 1, value: 'venn' });
  assert.equal(
    added,
    source.replace(
      '<PaperImage assetScope="question" kind="essential" />',
      '<PaperImage assetScope="question" kind="essential" family="venn" />',
    ),
  );

  const replaced = applyImageTagMutationToRaw(
    source.replace('family="venn"', 'family="old"'),
    {
      dimensionKey: 'family',
      field: { kind: 'question' },
      nodeUuid: 'ROOT',
      occurrenceIndex: 0,
      value: 'venn',
    },
    catalog,
  );
  assert.equal(replaced, source);

  const removed = mutate({ value: null });
  assert.equal(removed, source.replace(' family="venn"', ''));
});

test('targets working, answer, nested, and multi-image occurrences independently', () => {
  const working = mutate({
    field: { index: 0, kind: 'working' },
    value: 'venn',
  });
  assert.match(
    working,
    /<PaperImage assetScope="working" kind="essential" family="venn" \/>/,
  );
  assert.equal((working.match(/family="venn"/g) ?? []).length, 2);

  const answer = mutate({ field: { index: 0, kind: 'answer' }, value: 'venn' });
  assert.match(
    answer,
    /<PaperImage assetScope="answer" kind="essential" family="venn" \/>/,
  );

  const nested = mutate({ nodeUuid: 'CHILD', value: 'venn' });
  assert.match(
    nested,
    /Nested image\.\n<PaperImage assetScope="question" kind="essential" family="venn" \/>/,
  );
});

test('verifies the exact source version before an image mutation', () => {
  const version = imageTagSourceVersion(source);
  assert.doesNotThrow(() => verifyImageTagSourceVersion(source, version));
  assert.throws(
    () => verifyImageTagSourceVersion(`${source}\n`, version),
    /file changed outside the editor/i,
  );
});

test('rejects missing or duplicate UUID identities', () => {
  assert.throws(
    () => mutate({ nodeUuid: 'MISSING', value: 'venn' }),
    /Could not find node UUID MISSING/,
  );
  assert.throws(
    () =>
      applyImageTagMutationToRaw(
        `${source}\n[[sections.questions]]\nrtq-uuid = "ROOT"\nquestion = '''x'''\n`,
        {
          dimensionKey: 'family',
          field: { kind: 'question' },
          nodeUuid: 'ROOT',
          occurrenceIndex: 0,
          value: 'venn',
        },
        catalog,
      ),
    /duplicated/,
  );
});

test('rejects reordered, mismatched, malformed, and unsupported mutations', () => {
  assert.throws(
    () => mutate({ occurrenceIndex: 9, value: 'venn' }),
    /occurrence no longer exists/,
  );
  assert.throws(
    () =>
      mutate({
        field: { index: 0, kind: 'answer' },
        occurrenceIndex: 1,
        value: 'venn',
      }),
    /occurrence no longer exists/,
  );
  assert.throws(
    () =>
      applyImageTagMutationToRaw(
        source.replace('assetScope="working"', 'assetScope="question"'),
        {
          dimensionKey: 'family',
          field: { index: 0, kind: 'working' },
          nodeUuid: 'ROOT',
          occurrenceIndex: 0,
          value: 'venn',
        },
        catalog,
      ),
    /requires assetScope="working"/,
  );
  assert.throws(
    () =>
      applyImageTagMutationToRaw(
        source.replace(
          'kind="essential" family="venn"',
          'kind=\'essential\' family="venn"',
        ),
        {
          dimensionKey: 'family',
          field: { kind: 'question' },
          nodeUuid: 'ROOT',
          occurrenceIndex: 0,
          value: null,
        },
        catalog,
      ),
    (error: unknown) =>
      error instanceof Error &&
      /static double-quoted props/.test(error.message),
  );
  assert.throws(
    () => mutate({ value: 'circles' }),
    /Unsupported family value circles/,
  );
  assert.throws(
    () => mutate({ dimensionKey: 'shape', value: 'venn' }),
    (error: unknown) =>
      error instanceof ImageTagMutationError &&
      /Unsupported image tag dimension shape/.test(error.message),
  );
});

test('allows independent family and type mutations', () => {
  const tagged = applyImageTagMutationToRaw(
    source,
    {
      dimensionKey: 'type',
      field: { kind: 'question' },
      nodeUuid: 'ROOT',
      occurrenceIndex: 0,
      value: 'triangle',
    },
    catalog,
  );
  assert.match(tagged, /family="venn" type="triangle"/);
  const withoutFamily = applyImageTagMutationToRaw(
    tagged,
    {
      dimensionKey: 'family',
      field: { kind: 'question' },
      nodeUuid: 'ROOT',
      occurrenceIndex: 0,
      value: null,
    },
    catalog,
  );
  assert.match(withoutFamily, /kind="essential" type="triangle"/);
});

test('round-trips every canonical type while preserving independent family tags', async () => {
  const canonical = await getImageTagCatalog();
  const targets = [
    {
      nodeUuid: 'ROOT',
      field: { kind: 'question' } as const,
      occurrenceIndex: 0,
    },
    {
      nodeUuid: 'ROOT',
      field: { kind: 'question' } as const,
      occurrenceIndex: 1,
    },
    {
      nodeUuid: 'ROOT',
      field: { kind: 'working', index: 0 } as const,
      occurrenceIndex: 0,
    },
    {
      nodeUuid: 'ROOT',
      field: { kind: 'answer', index: 0 } as const,
      occurrenceIndex: 0,
    },
    {
      nodeUuid: 'CHILD',
      field: { kind: 'question' } as const,
      occurrenceIndex: 0,
    },
  ];
  for (const target of targets) {
    for (const type of canonical.dimensions[1].values) {
      let raw = applyImageTagMutationToRaw(
        source,
        { ...target, dimensionKey: 'type', value: type.value },
        canonical,
      );
      for (const value of [null, 'custom']) {
        raw = applyImageTagMutationToRaw(
          raw,
          { ...target, dimensionKey: 'family', value },
          canonical,
        );
        assert.match(raw, new RegExp(`type="${type.value}"`));
      }
      raw = applyImageTagMutationToRaw(
        raw,
        { ...target, dimensionKey: 'type', value: null },
        canonical,
      );
      const originalFamily =
        target.nodeUuid === 'ROOT' &&
        target.field.kind === 'question' &&
        target.occurrenceIndex === 0
          ? 'venn'
          : null;
      raw = applyImageTagMutationToRaw(
        raw,
        { ...target, dimensionKey: 'family', value: originalFamily },
        canonical,
      );
      assert.equal(raw, source);
    }
  }
});

test('rejects adjacent attributes instead of persisting syntax production rejects', () => {
  assert.throws(
    () =>
      applyImageTagMutationToRaw(
        source.replace(
          'kind="essential" family="venn"',
          'kind="essential"family="venn"',
        ),
        {
          nodeUuid: 'ROOT',
          field: { kind: 'question' },
          occurrenceIndex: 0,
          dimensionKey: 'family',
          value: null,
        },
        catalog,
      ),
    /whitespace-separated/,
  );
});
