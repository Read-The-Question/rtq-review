import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  DisplayContentField,
  DisplayPaperNode,
  DisplayReviewPaper,
} from './display-model.ts';
import {
  nodeMatchesQuestionContentFilter,
  questionContentFilterMatches,
} from './question-content-filter.ts';

const context = {
  paperStem: 'paper',
  questionIndex: 0,
  scope: 'question' as const,
  sectionIndex: 0,
};

function field(options: Readonly<{ image?: boolean; table?: boolean }> = {}) {
  return {
    context,
    expanded: '',
    hasTable: options.table ?? false,
    preparations: options.image
      ? [{ attributes: {}, context, kind: 'paper-image' as const }]
      : [],
    raw: '',
    rendered: '',
  } satisfies DisplayContentField;
}

function node(
  id: string,
  options: Readonly<{
    answer?: DisplayContentField;
    children?: readonly DisplayPaperNode[];
    question?: DisplayContentField;
    working?: DisplayContentField;
  }> = {},
): DisplayPaperNode {
  const empty = field();
  return {
    children: options.children ?? [],
    content: {
      answers: options.answer
        ? [{ answer: options.answer, key: empty, option: empty }]
        : [],
      question: options.question ?? empty,
      workings: options.working
        ? [{ formulas: [], tips: [], working: options.working }]
        : [],
    },
    depth: id === 'parent' ? 0 : 1,
    effectiveTags: [],
    explicitInherit: null,
    explicitTags: [],
    id,
    inheritedTags: [],
    kind: id === 'parent' ? 'question' : 'subquestion',
    label: id,
    review: {
      answer: { legacyComments: '' },
      'answer-image': { legacyComments: '' },
      question: { legacyComments: '' },
      'question-image': { legacyComments: '' },
    },
  };
}

function paper(question: DisplayPaperNode): DisplayReviewPaper {
  return {
    sections: [{ id: 'section-1', label: 'Section 1', questions: [question] }],
  } as unknown as DisplayReviewPaper;
}

test('finds images and keeps ancestors while removing unrelated siblings', () => {
  const imageChild = node('image-child', { answer: field({ image: true }) });
  const sibling = node('unrelated-child');
  const reviewPaper = paper(
    node('parent', { children: [imageChild, sibling] }),
  );

  assert.deepEqual(questionContentFilterMatches(reviewPaper, 'image'), {
    directNodeIds: ['image-child'],
    questionTreeIds: ['parent'],
    visibleNodeIds: ['image-child', 'parent'],
  });
});

test('finds tables in question, working, and answer fields', () => {
  for (const matchingNode of [
    node('question-table', { question: field({ table: true }) }),
    node('working-table', { working: field({ table: true }) }),
    node('answer-table', { answer: field({ table: true }) }),
  ]) {
    assert.equal(nodeMatchesQuestionContentFilter(matchingNode, 'table'), true);
    assert.equal(
      nodeMatchesQuestionContentFilter(matchingNode, 'image'),
      false,
    );
  }
});

test('the all filter retains every question node', () => {
  const reviewPaper = paper(
    node('parent', { children: [node('first-child'), node('second-child')] }),
  );

  assert.deepEqual(questionContentFilterMatches(reviewPaper, 'all'), {
    directNodeIds: ['first-child', 'second-child', 'parent'],
    questionTreeIds: ['parent'],
    visibleNodeIds: ['first-child', 'second-child', 'parent'],
  });
});
