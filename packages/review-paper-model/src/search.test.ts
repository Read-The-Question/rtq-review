import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compileContentSearch,
  contentSearchRanges,
  filterReviewPaper,
  parsedQuestionTreeContentMatchNodeIds,
  type ReviewContentField,
  type ReviewPaper,
  type ReviewPaperNode,
} from './index.ts';

function field(
  raw: string,
  scope: 'answer' | 'question' | 'working',
): ReviewContentField {
  return {
    context: {
      paperStem: 'paper',
      questionIndex: 0,
      scope,
      sectionIndex: 0,
    },
    expanded: raw.replace('rtqSpecialMacro', 'expanded value'),
    preparations: [],
    raw,
  };
}

function node(
  id: string,
  question: string,
  children: readonly ReviewPaperNode[] = [],
): ReviewPaperNode {
  return {
    children,
    content: {
      answers: [
        {
          answer: field('The answer is 42', 'answer'),
          key: field('42', 'answer'),
          option: field('A', 'answer'),
        },
      ],
      question: field(question, 'question'),
      workings: [
        {
          formulas: [field('rtqSpecialMacro', 'working')],
          tips: [field('Use place value', 'working')],
          working: field('Add the two values', 'working'),
        },
      ],
    },
    depth: id.includes('.sq') ? 1 : 0,
    effectiveTags: [],
    explicitInherit: id.includes('.sq') ? true : null,
    explicitTags: [],
    id,
    inheritedTags: [],
    kind: id.includes('.sq') ? 'subquestion' : 'question',
    label: id,
    review: {
      answer: { legacyComments: '' },
      'answer-image': { legacyComments: '' },
      question: { legacyComments: '' },
      'question-image': { legacyComments: '' },
    },
  };
}

function paper(): ReviewPaper {
  const nested = node('s0.q0.sq0', 'Nested fraction prompt');
  const questions = [
    node('s0.q0', 'Parent instruction', [nested]),
    node('s0.q1', 'Independent geometry prompt'),
  ];
  return {
    metadata: { focusGroups: [], schoolIds: [] },
    sections: [{ id: 'section-0', label: 'A', questions }],
    source: {
      collection: {
        description: 'Papers',
        directory: 'toml',
        generated: false,
        id: 'toml',
        label: 'Papers',
        readOnly: true,
      },
      fileName: 'paper.toml',
      focusGroups: [],
      provenance: { kind: 'canonical', sourcePaperStems: ['paper'] },
      questionCount: questions.length,
      relativePath: 'paper.toml',
      title: 'Paper',
      version: 'version',
    },
    title: 'Paper',
  };
}

test('raw content search retains the complete top-level question tree', () => {
  const result = filterReviewPaper(paper(), {}, undefined, {
    pattern: 'Nested fraction',
    scope: 'question',
  });

  assert.deepEqual(result.matchingQuestionTreeIds, ['s0.q0']);
  assert.deepEqual(result.contentMatchingNodeIds, ['s0.q0.sq0']);
  assert.equal(result.matchingSections[0].questions[0].children.length, 1);
});

test('content search ranges identify every exact raw-source match', () => {
  const compiled = compileContentSearch({
    pattern: 'macro',
    scope: 'question',
  });
  assert.equal(compiled.state, 'ready');
  if (compiled.state !== 'ready') return;

  assert.deepEqual(
    contentSearchRanges('Macro then macro', 'question', compiled.search),
    [
      { end: 5, start: 0 },
      { end: 16, start: 11 },
    ],
  );
  assert.deepEqual(contentSearchRanges('Macro', 'answer', compiled.search), []);
});

test('content scope distinguishes questions, answers, and workings', () => {
  assert.deepEqual(
    filterReviewPaper(paper(), {}, undefined, {
      pattern: 'answer is 42',
      scope: 'question',
    }).matchingQuestionTreeIds,
    [],
  );
  assert.equal(
    filterReviewPaper(paper(), {}, undefined, {
      pattern: 'answer is 42',
      scope: 'answer',
    }).matchingQuestionTreeCount,
    2,
  );
  assert.equal(
    filterReviewPaper(paper(), {}, undefined, {
      pattern: 'rtqSpecialMacro',
      scope: 'working',
    }).matchingQuestionTreeCount,
    2,
  );
});

test('search examines authored raw content rather than expanded content', () => {
  assert.equal(
    filterReviewPaper(paper(), {}, undefined, {
      pattern: 'expanded value',
      scope: 'working',
    }).matchingQuestionTreeCount,
    0,
  );
});

test('invalid expressions leave the current paper visible and report an error', () => {
  const result = filterReviewPaper(paper(), {}, undefined, {
    pattern: '[',
    scope: 'all',
  });

  assert.equal(result.matchingQuestionTreeCount, 2);
  assert.deepEqual(result.contentMatchingNodeIds, []);
  assert.match(result.contentSearchError ?? '', /unterminated|invalid/i);
  assert.equal(
    compileContentSearch({ pattern: '[', scope: 'all' }).state,
    'invalid',
  );
});

test('raw parsed search IDs follow the normalized nested node path', () => {
  const compiled = compileContentSearch({
    pattern: 'deep match',
    scope: 'question',
  });
  assert.equal(compiled.state, 'ready');
  if (compiled.state !== 'ready') return;

  assert.deepEqual(
    parsedQuestionTreeContentMatchNodeIds(
      {
        question: 'parent',
        subquestions: [
          {
            question: 'child',
            subquestions: [{ question: 'deep match' }],
          },
        ],
      },
      compiled.search,
      's2.q4',
    ),
    ['s2.q4.sq0.ssq0'],
  );
});
