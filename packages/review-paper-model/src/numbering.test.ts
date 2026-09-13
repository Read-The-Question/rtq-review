import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_QUESTION_NUMBERING,
  formatQuestionIndexLabel,
  formatQuestionPathLabel,
  questionListTypeForDepth,
  resolveQuestionNumberingConfig,
  resolveSectionQuestionStart,
} from './numbering.ts';

test('formats the numbering styles supported by the paper pipeline', () => {
  assert.equal(formatQuestionIndexLabel(27, 'lower-alpha'), 'aa');
  assert.equal(formatQuestionIndexLabel(27, 'upper-alpha'), 'AA');
  assert.equal(formatQuestionIndexLabel(14, 'lower-roman'), 'xiv');
  assert.equal(formatQuestionIndexLabel(14, 'upper-roman'), 'XIV');
  assert.equal(formatQuestionIndexLabel(14, 'decimal'), '14');
  assert.equal(formatQuestionIndexLabel(14, 'unknown'), '14');
});

test('resolves paper, section, and question numbering overrides by inheritance', () => {
  const paper = resolveQuestionNumberingConfig({
    'list-type': 'upper-alpha',
    'sub-list-type': 'decimal',
    'sub-sub-list-type': 'upper-roman',
  });
  const section = resolveQuestionNumberingConfig(
    { 'list-type': 'lower-alpha', 'sub-list-type': 'upper-alpha' },
    paper,
  );
  const question = resolveQuestionNumberingConfig(
    { 'sub-list-type': 'decimal', 'sub-sub-list-type': 'lower-roman' },
    section,
  );

  assert.deepEqual(DEFAULT_QUESTION_NUMBERING, {
    listType: 'decimal',
    subListType: 'lower-alpha',
    subSubListType: 'lower-roman',
  });
  assert.deepEqual(section, {
    listType: 'lower-alpha',
    subListType: 'upper-alpha',
    subSubListType: 'upper-roman',
  });
  assert.deepEqual(question, {
    listType: 'lower-alpha',
    subListType: 'decimal',
    subSubListType: 'lower-roman',
  });
  assert.equal(questionListTypeForDepth(question, 0), 'lower-alpha');
  assert.equal(questionListTypeForDepth(question, 1), 'decimal');
  assert.equal(questionListTypeForDepth(question, 2), 'lower-roman');
  assert.equal(formatQuestionPathLabel(['aa', '2', 'iv']), 'aa.2.iv');
});

test('resolves and validates section question-start', () => {
  assert.equal(resolveSectionQuestionStart({}), 1);
  assert.equal(resolveSectionQuestionStart({ 'question-start': 20 }), 20);
  assert.throws(
    () => resolveSectionQuestionStart({ 'question-start': 0 }),
    /positive integer/,
  );
});
