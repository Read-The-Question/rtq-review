import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clearAllDimensionalFilters,
  clearAllReviewFilters,
  clearDimensionalFilter,
  filterReviewPaper,
  parseDimensionalFilterSearchParams,
  parseReviewFilterSearchParams,
  resolveReviewPaperTags,
  serializeDimensionalFilterSearchParams,
  serializeReviewFilterSearchParams,
  type DimensionalTagAxis,
  type ReviewContentField,
  type ReviewPaper,
  type ReviewPaperNode,
} from './index.ts';

const emptyField: ReviewContentField = {
  context: {
    paperStem: 'paper',
    questionIndex: 0,
    scope: 'question',
    sectionIndex: 0,
  },
  expanded: '',
  preparations: [],
  raw: '',
};

function node(
  id: string,
  explicitTags: readonly string[],
  children: readonly ReviewPaperNode[] = [],
  options: Readonly<{
    answerRag?: string;
    depth?: 0 | 1 | 2;
    inherit?: boolean | null;
    questionRag?: string;
  }> = {},
): ReviewPaperNode {
  const depth = options.depth ?? 0;
  return {
    children,
    content: { answers: [], question: emptyField, workings: [] },
    depth,
    effectiveTags: [],
    explicitInherit: options.inherit ?? (depth === 0 ? null : true),
    explicitTags,
    id,
    inheritedTags: [],
    kind:
      depth === 0
        ? 'question'
        : depth === 1
          ? 'subquestion'
          : 'sub-subquestion',
    label: id,
    review: {
      answer: {
        ...(options.answerRag ? { contentRag: options.answerRag } : {}),
        legacyComments: '',
      },
      question: {
        ...(options.questionRag ? { contentRag: options.questionRag } : {}),
        legacyComments: '',
      },
    },
  };
}

function paperWith(questions: readonly ReviewPaperNode[]): ReviewPaper {
  return {
    metadata: { focusGroups: [], schoolIds: [] },
    sections: [{ id: 'section-0', label: 'A', questions }],
    source: {
      collection: {
        description: 'Canonical paper source-of-truth',
        directory: 'toml',
        generated: false,
        id: 'toml',
        label: 'Papers',
        readOnly: true,
      },
      fileName: 'paper.toml',
      focusGroups: [],
      provenance: {
        kind: 'canonical',
        sourcePaperStems: ['paper'],
      },
      questionCount: questions.length,
      relativePath: 'paper.toml',
      title: 'Paper',
      version: 'version',
    },
    title: 'Paper',
  };
}

function valuesFor(
  candidate: ReviewPaperNode,
  axis: DimensionalTagAxis,
): string[] {
  return candidate.effectiveTags
    .filter((tag) => tag.axis === axis)
    .map((tag) => tag.value);
}

test('resolves each dimension independently with explicit lineage and defaults', () => {
  const grandchild = node('s0.q0.sq0.ssq0', [], [], { depth: 2 });
  const frameOverride = node('s0.q0.sq0', ['frame.columnar'], [grandchild], {
    depth: 1,
  });
  const markerReplacement = node(
    's0.q0.sq1',
    ['marker.child-a', 'marker.child-b'],
    [],
    { depth: 1 },
  );
  const inheritanceOff = node(
    's0.q0.sq2',
    ['marker.local', 'tunassigned'],
    [],
    { depth: 1, inherit: false },
  );
  const root = node(
    's0.q0',
    [
      'family.money',
      'math.number.fraction',
      'frame.labelled',
      'marker.parent-a',
      'marker.parent-b',
      'reasoning.infer',
      'legacy-tag',
    ],
    [frameOverride, markerReplacement, inheritanceOff],
  );
  const defaultsOnly = node('s0.q1', ['tunassigned']);
  const resolved = resolveReviewPaperTags(paperWith([root, defaultsOnly]));
  const resolvedRoot = resolved.sections[0].questions[0];
  const resolvedFrame = resolvedRoot.children[0];
  const resolvedGrandchild = resolvedFrame.children[0];
  const resolvedMarker = resolvedRoot.children[1];
  const resolvedOff = resolvedRoot.children[2];
  const resolvedDefaults = resolved.sections[0].questions[1];

  assert.deepEqual(valuesFor(resolvedFrame, 'family'), ['family.money']);
  assert.deepEqual(valuesFor(resolvedFrame, 'math'), ['math.number.fraction']);
  assert.deepEqual(valuesFor(resolvedFrame, 'frame'), ['frame.columnar']);
  assert.deepEqual(valuesFor(resolvedFrame, 'marker'), [
    'marker.parent-a',
    'marker.parent-b',
  ]);
  assert.deepEqual(valuesFor(resolvedFrame, 'reasoning'), ['reasoning.infer']);
  assert.deepEqual(valuesFor(resolvedMarker, 'marker'), [
    'marker.child-a',
    'marker.child-b',
  ]);
  assert.equal(
    resolvedMarker.effectiveTags.some((tag) => tag.value === 'marker.parent-a'),
    false,
  );
  assert.deepEqual(resolvedOff.inheritedTags, []);
  assert.deepEqual(
    resolvedOff.effectiveTags.map((tag) => [tag.value, tag.origin]),
    [
      ['family.unknown', 'implicit'],
      ['math.unknown', 'implicit'],
      ['frame.raw', 'implicit'],
      ['marker.local', 'explicit'],
      ['reasoning.direct', 'implicit'],
    ],
  );
  assert.deepEqual(
    resolvedDefaults.effectiveTags.map((tag) => tag.value),
    ['family.unknown', 'math.unknown', 'frame.raw', 'reasoning.direct'],
  );
  assert.equal(
    resolvedDefaults.effectiveTags.some((tag) => tag.value === 'tunassigned'),
    false,
  );
  const inheritedMath = resolvedGrandchild.effectiveTags.find(
    (tag) => tag.axis === 'math',
  );
  assert.deepEqual(inheritedMath, {
    axis: 'math',
    inheritedFromNodeId: 's0.q0',
    origin: 'inherited',
    value: 'math.number.fraction',
  });
  assert.equal(
    resolvedFrame.inheritedTags.some(
      (tag) => tag.value === 'frame.labelled' && tag.origin === 'inherited',
    ),
    true,
  );
});

function filterFixture(): ReviewPaper {
  const matchingFractionTree = node(
    's0.q0',
    ['family.money', 'math.number.fraction', 'frame.labelled'],
    [
      node('s0.q0.sq0', ['frame.columnar'], [], {
        answerRag: 'rag_wf_g1',
        depth: 1,
        questionRag: 'rag_wf_g2',
      }),
    ],
    { answerRag: 'rag_wf_g3', questionRag: 'rag_wf_g4' },
  );
  const splitAcrossNodesTree = node(
    's0.q1',
    ['family.money', 'math.number.fraction', 'frame.labelled'],
    [
      node('s0.q1.sq0', ['frame.columnar'], [], {
        answerRag: 'rag_wf_g2',
        depth: 1,
        inherit: false,
        questionRag: 'rag_wf_g3',
      }),
    ],
    { answerRag: 'rag_wf_g4', questionRag: 'rag_wf_g4' },
  );
  const ratioTree = node(
    's0.q2',
    ['family.recipe', 'math.ratio', 'frame.columnar'],
    [],
    { answerRag: 'rag_wf_g4', questionRag: 'rag_wf_g1' },
  );

  return resolveReviewPaperTags(
    paperWith([matchingFractionTree, splitAcrossNodesTree, ratioTree]),
  );
}

test('filters with OR within dimensions, AND between dimensions, and same-node matching', () => {
  const paper = filterFixture();
  const fractionColumnar = filterReviewPaper(paper, {
    math: ['math.number.fraction'],
    frame: ['frame.columnar'],
  });

  assert.equal(fractionColumnar.totalQuestionTreeCount, 3);
  assert.equal(fractionColumnar.matchingQuestionTreeCount, 1);
  assert.deepEqual(fractionColumnar.matchingQuestionTreeIds, ['s0.q0']);
  assert.deepEqual(fractionColumnar.matchingNodeIds, ['s0.q0.sq0']);
  assert.equal(fractionColumnar.matchingSections.length, 1);
  assert.equal(fractionColumnar.matchingSections[0].questions.length, 1);
  assert.equal(
    fractionColumnar.matchingSections[0].questions[0].children.length,
    1,
  );
  assert.deepEqual(fractionColumnar.questionTreeMatches, [
    {
      matchingNodeIds: ['s0.q0.sq0'],
      questionId: 's0.q0',
      sectionId: 'section-0',
    },
  ]);

  const fractionOrRatio = filterReviewPaper(paper, {
    frame: ['frame.columnar'],
    math: ['math.ratio', 'math.number.fraction'],
  });
  assert.deepEqual(fractionOrRatio.matchingQuestionTreeIds, ['s0.q0', 's0.q2']);
  assert.deepEqual(fractionOrRatio.matchingNodeIds, ['s0.q0.sq0', 's0.q2']);

  assert.equal(
    filterReviewPaper(paper, { math: ['math.number'] })
      .matchingQuestionTreeCount,
    0,
  );
});

test('computes cross-filtered facet counts and retains selected zero results', () => {
  const result = filterReviewPaper(filterFixture(), {
    family: ['family.does-not-exist'],
    frame: ['frame.columnar'],
    math: ['math.number.fraction'],
  });
  const family = result.facets.find((facet) => facet.axis === 'family');
  const frame = result.facets.find((facet) => facet.axis === 'frame');
  const math = result.facets.find((facet) => facet.axis === 'math');

  assert.ok(family && frame && math);
  assert.deepEqual(
    result.facets.map((facet) => facet.axis),
    ['family', 'math', 'frame', 'marker', 'reasoning'],
  );
  assert.deepEqual(
    family.options.find((option) => option.selected),
    {
      count: 0,
      disabled: false,
      selected: true,
      value: 'family.does-not-exist',
    },
  );
  assert.deepEqual(
    frame.options.find((option) => option.value === 'frame.columnar'),
    {
      count: 0,
      disabled: false,
      selected: true,
      value: 'frame.columnar',
    },
  );
  assert.deepEqual(
    math.options.find((option) => option.value === 'math.ratio'),
    {
      count: 0,
      disabled: true,
      selected: false,
      value: 'math.ratio',
    },
  );

  const withoutMissingFamily = filterReviewPaper(filterFixture(), {
    frame: ['frame.columnar'],
    math: ['math.number.fraction'],
  });
  const frameWithoutFamily = withoutMissingFamily.facets.find(
    (facet) => facet.axis === 'frame',
  );
  const mathWithoutFamily = withoutMissingFamily.facets.find(
    (facet) => facet.axis === 'math',
  );
  assert.equal(
    frameWithoutFamily?.options.find(
      (option) => option.value === 'frame.labelled',
    )?.count,
    2,
  );
  assert.equal(
    mathWithoutFamily?.options.find((option) => option.value === 'math.ratio')
      ?.count,
    1,
  );
});

test('filters question and answer content states independently on the same node', () => {
  const paper = filterFixture();

  assert.deepEqual(
    filterReviewPaper(paper, { questionRag: ['rag_wf_g4'] })
      .matchingQuestionTreeIds,
    ['s0.q0', 's0.q1'],
  );
  assert.deepEqual(
    filterReviewPaper(paper, { answerRag: ['rag_wf_g4'] })
      .matchingQuestionTreeIds,
    ['s0.q1', 's0.q2'],
  );
  assert.deepEqual(
    filterReviewPaper(paper, {
      answerRag: ['rag_wf_g4'],
      questionRag: ['rag_wf_g4'],
    }).matchingQuestionTreeIds,
    ['s0.q1'],
  );
  assert.deepEqual(
    filterReviewPaper(paper, {
      answerRag: ['rag_wf_g1'],
      frame: ['frame.columnar'],
      math: ['math.number.fraction'],
      questionRag: ['rag_wf_g2'],
    }).matchingNodeIds,
    ['s0.q0.sq0'],
  );
});

test('cross-filters question and answer state counts and retains zero selections', () => {
  const result = filterReviewPaper(filterFixture(), {
    answerRag: ['rag_wf_g4'],
    questionRag: ['rag_wf_missing'],
  });
  const question = result.stateFacets.find(
    (facet) => facet.side === 'question',
  );
  const answer = result.stateFacets.find((facet) => facet.side === 'answer');

  assert.deepEqual(
    result.stateFacets.map((facet) => facet.side),
    ['question', 'answer'],
  );
  assert.deepEqual(
    question?.options.find((option) => option.value === 'rag_wf_missing'),
    {
      count: 0,
      disabled: false,
      selected: true,
      value: 'rag_wf_missing',
    },
  );
  assert.deepEqual(
    question?.options.find((option) => option.value === 'rag_wf_g4'),
    { count: 1, disabled: false, selected: false, value: 'rag_wf_g4' },
  );
  assert.deepEqual(
    answer?.options.find((option) => option.value === 'rag_wf_g4'),
    { count: 0, disabled: false, selected: true, value: 'rag_wf_g4' },
  );
});

test('round-trips stable repeated URL parameters and clears dimensions', () => {
  const parsed = parseDimensionalFilterSearchParams(
    '?math=math.ratio&view=raw&math=math.number.fraction&math=math.ratio&family=math.invalid&marker=marker.fill+missing',
  );

  assert.deepEqual(parsed, {
    family: [],
    frame: [],
    marker: ['marker.fill missing'],
    math: ['math.number.fraction', 'math.ratio'],
    reasoning: [],
  });
  const serialized = serializeDimensionalFilterSearchParams(
    parsed,
    'view=raw&math=old',
  );
  assert.equal(
    serialized,
    'marker=marker.fill+missing&math=math.number.fraction&math=math.ratio&view=raw',
  );
  assert.deepEqual(parseDimensionalFilterSearchParams(serialized), parsed);
  assert.deepEqual(clearDimensionalFilter(parsed, 'math').math, []);
  assert.deepEqual(clearAllDimensionalFilters(), {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  });
});

test('round-trips state and dimensional filters and clears the complete lens', () => {
  const parsed = parseReviewFilterSearchParams(
    '?question-rag=rag_wf_ng4&math=math.number.fraction&answer-rag=rag_wf_g3&question=q-3&answer-rag=rag_wf_g2&question-rag=rag_wf_ng4',
  );

  assert.deepEqual(parsed, {
    answerRag: ['rag_wf_g2', 'rag_wf_g3'],
    family: [],
    frame: [],
    marker: [],
    math: ['math.number.fraction'],
    questionRag: ['rag_wf_ng4'],
    reasoning: [],
  });
  const serialized = serializeReviewFilterSearchParams(
    parsed,
    'question=q-3&answer-rag=old&view=raw',
  );
  assert.equal(
    serialized,
    'answer-rag=rag_wf_g2&answer-rag=rag_wf_g3&math=math.number.fraction&question=q-3&question-rag=rag_wf_ng4&view=raw',
  );
  assert.deepEqual(parseReviewFilterSearchParams(serialized), parsed);
  assert.deepEqual(clearAllReviewFilters(), {
    answerRag: [],
    family: [],
    frame: [],
    marker: [],
    math: [],
    questionRag: [],
    reasoning: [],
  });
});
