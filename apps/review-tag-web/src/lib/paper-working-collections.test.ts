import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseLoosePaperToml,
  parsePaperToml,
  workingCollectionValues,
} from './paper-toml.ts';
import { applyTagMutationToRaw } from './paper-write-lines.ts';

const canonicalSource = `
[[sections]]

[[sections.questions]]
rtq-tags = ["math.number"]
question = '''Top level'''

[[sections.questions.workings]]
working = '''Work one'''

[[sections.questions.workings.formulas]]
formula = '''$x^2$'''

[[sections.questions.workings.formulas]]
formula = '''rtq_abbr_formula_example'''

[[sections.questions.workings.tips]]
tip = '''**Check** the units.'''

[[sections.questions.subquestions]]
rtq-tags = ["reasoning.direct"]
question = '''Nested'''

[[sections.questions.subquestions.workings]]
working = '''Nested work'''

[[sections.questions.subquestions.workings.formulas]]
formula = '''%empty%'''

[[sections.questions.subquestions.workings.tips]]
tip = '''Nested tip'''
`;

function firstQuestion(parsed: ReturnType<typeof parsePaperToml>) {
  const section = parsed.sections?.[0];
  assert.ok(section);
  const questions = section.questions;
  assert.ok(Array.isArray(questions));
  const question = questions[0];
  assert.ok(question && typeof question === 'object');
  return question as Record<string, unknown>;
}

test('full TOML parsing retains ordered child records and placeholders', () => {
  const question = firstQuestion(parsePaperToml(canonicalSource, false));
  const workings = question.workings;
  assert.ok(Array.isArray(workings));
  const working = workings[0] as Record<string, unknown>;

  assert.deepEqual(workingCollectionValues(working, 'formulas', 'formula'), [
    '$x^2$',
    'rtq_abbr_formula_example',
  ]);
  assert.deepEqual(workingCollectionValues(working, 'tips', 'tip'), [
    '**Check** the units.',
  ]);

  const nested = (question.subquestions as Record<string, unknown>[])[0];
  const nestedWorking = (nested.workings as Record<string, unknown>[])[0];
  assert.deepEqual(
    workingCollectionValues(nestedWorking, 'formulas', 'formula'),
    [],
  );
  assert.deepEqual(workingCollectionValues(nestedWorking, 'tips', 'tip'), [
    'Nested tip',
  ]);
});

test('loose parsing attaches child tables to the immediately owning working', () => {
  const question = firstQuestion(parseLoosePaperToml(canonicalSource));
  const working = (question.workings as Record<string, unknown>[])[0];
  const nested = (question.subquestions as Record<string, unknown>[])[0];
  const nestedWorking = (nested.workings as Record<string, unknown>[])[0];

  assert.deepEqual(working.formulas, [
    { formula: '$x^2$' },
    { formula: 'rtq_abbr_formula_example' },
  ]);
  assert.deepEqual(working.tips, [{ tip: '**Check** the units.' }]);
  assert.deepEqual(nestedWorking.formulas, [{ formula: '%empty%' }]);
  assert.deepEqual(nestedWorking.tips, [{ tip: 'Nested tip' }]);
});

test('tag-only raw edits preserve nested collection bytes exactly', () => {
  const collectionStart = canonicalSource.indexOf(
    '[[sections.questions.workings]]',
  );
  const beforeCollections = canonicalSource.slice(collectionStart);
  const updated = applyTagMutationToRaw({
    explicitInherit: null,
    explicitTags: ['family.number', 'math.number'],
    nodePath: 's0.q0',
    raw: canonicalSource,
  });

  assert.match(updated, /rtq-tags = \["family\.number", "math\.number"\]/);
  assert.equal(
    updated.slice(updated.indexOf(beforeCollections)),
    beforeCollections,
  );
});
