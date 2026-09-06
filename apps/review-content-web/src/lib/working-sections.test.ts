import assert from 'node:assert/strict';
import test from 'node:test';

import { parseWorkingSections } from './working-sections.ts';

test('preserves authored working section hierarchy and visibility', () => {
  const result = parseWorkingSections(`Before the stages.

<WorkingSection phase="setup">

Let $x$ be the missing value.

</WorkingSection>

<WorkingSection phase='solve' title='Solve the equation'>

$x + 4 = 9$

</WorkingSection>

<WorkingSection phase="conclusion" title="Extra detail" visibility="hidden">

Hidden explanation.

</WorkingSection>`);

  assert.deepEqual(result, {
    segments: [
      { kind: 'flat', markdown: 'Before the stages.' },
      {
        kind: 'section',
        markdown: 'Let $x$ be the missing value.',
        phase: 'setup',
        visibility: 'visible',
      },
      {
        kind: 'section',
        markdown: '$x + 4 = 9$',
        phase: 'solve',
        title: 'Solve the equation',
        visibility: 'visible',
      },
      {
        kind: 'section',
        markdown: 'Hidden explanation.',
        phase: 'conclusion',
        title: 'Extra detail',
        visibility: 'hidden',
      },
    ],
  });
});

test('leaves flat working content unstructured', () => {
  assert.deepEqual(parseWorkingSections('A short direct calculation.'), {});
  assert.deepEqual(
    parseWorkingSections(
      '```mdx\n<WorkingSection phase="solve">\nExample\n</WorkingSection>\n```',
    ),
    {},
  );
});

test('normalizes unsupported variants and omits blank titles', () => {
  assert.deepEqual(
    parseWorkingSections(`<WorkingSection phase="made-up" title="   ">
Body
</WorkingSection>`),
    {
      segments: [
        {
          kind: 'section',
          markdown: 'Body',
          phase: 'custom',
          visibility: 'visible',
        },
      ],
    },
  );
});

test('reports malformed and nested working sections safely', () => {
  assert.match(
    parseWorkingSections('</WorkingSection>').issue ?? '',
    /without an opening tag/,
  );
  assert.match(
    parseWorkingSections('<WorkingSection>\nBody').issue ?? '',
    /missing its closing tag/,
  );
  assert.match(
    parseWorkingSections(
      '<WorkingSection>\n<WorkingSection>\nBody\n</WorkingSection>\n</WorkingSection>',
    ).issue ?? '',
    /cannot be nested/,
  );
});
