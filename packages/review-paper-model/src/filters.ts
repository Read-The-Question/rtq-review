import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalFacet,
  type DimensionalFilterResult,
  type DimensionalFilterSelection,
  type DimensionalTagAxis,
  type QuestionTreeMatch,
  type ReviewFilterSelection,
  type ReviewOutcomeFacet,
  type ReviewOutcomeFilterContext,
  type ReviewOutcomeFilterSide,
  type ReviewPaper,
  type ReviewPaperNode,
  type ReviewStateFacet,
  type ReviewStateFilterSide,
} from './model.ts';

export const PENDING_REVIEW_OUTCOME = 'PRNS';
export const REVIEW_OUTCOME_FILTER_VALUES = [
  PENDING_REVIEW_OUTCOME,
  'PRG',
  'PRCR',
  'PRCC',
  'PRBD',
  'PRCS',
] as const;

const facetLabels: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'Family',
  frame: 'Frame',
  marker: 'Marker',
  math: 'Math',
  reasoning: 'Reasoning',
};

const stateFacetParameters = {
  answer: 'answerRag',
  'answer-image': 'answerImageRag',
  question: 'questionRag',
  'question-image': 'questionImageRag',
} as const;

const stateFacetLabels: Readonly<Record<ReviewStateFilterSide, string>> = {
  answer: 'Answer state',
  'answer-image': 'Answer image state',
  question: 'Question state',
  'question-image': 'Question image state',
};

const outcomeFacetParameters = {
  answer: 'answerReview',
  'answer-image': 'answerImageReview',
  question: 'questionReview',
  'question-image': 'questionImageReview',
} as const;

const outcomeFacetLabels: Readonly<Record<ReviewOutcomeFilterSide, string>> = {
  answer: 'Answer review outcome',
  'answer-image': 'Answer image review outcome',
  question: 'Question review outcome',
  'question-image': 'Question image review outcome',
};

const reviewFilterSides = [
  'question',
  'question-image',
  'answer',
  'answer-image',
] as const satisfies readonly ReviewStateFilterSide[];

const reviewOutcomeSidePairs = [
  ['question', 'question-image'],
  ['answer', 'answer-image'],
] as const satisfies readonly (readonly [
  ReviewOutcomeFilterSide,
  ReviewOutcomeFilterSide,
])[];

const pairedReviewOutcomeSide: Readonly<
  Record<ReviewOutcomeFilterSide, ReviewOutcomeFilterSide>
> = {
  answer: 'answer-image',
  'answer-image': 'answer',
  question: 'question-image',
  'question-image': 'question',
};

function compareValues(left: string, right: string): number {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function emptyDimensionalFilterSelection(): DimensionalFilterSelection {
  return {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };
}

export function emptyReviewFilterSelection(): ReviewFilterSelection {
  return {
    ...emptyDimensionalFilterSelection(),
    answerImageRag: [],
    answerImageReview: [],
    answerRag: [],
    answerReview: [],
    questionImageRag: [],
    questionImageReview: [],
    questionRag: [],
    questionReview: [],
  };
}

export function normalizeDimensionalFilterSelection(
  selection: Partial<DimensionalFilterSelection>,
): DimensionalFilterSelection {
  const valuesFor = (axis: DimensionalTagAxis): string[] =>
    [...new Set(selection[axis] ?? [])]
      .filter((value) => value.startsWith(`${axis}.`))
      .sort(compareValues);

  return {
    family: valuesFor('family'),
    frame: valuesFor('frame'),
    marker: valuesFor('marker'),
    math: valuesFor('math'),
    reasoning: valuesFor('reasoning'),
  };
}

function normalizeStateValues(values: readonly string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()))]
    .filter(Boolean)
    .sort(compareValues);
}

export function normalizeReviewFilterSelection(
  selection: Partial<ReviewFilterSelection>,
): ReviewFilterSelection {
  return {
    ...normalizeDimensionalFilterSelection(selection),
    answerImageRag: normalizeStateValues(selection.answerImageRag),
    answerImageReview: normalizeStateValues(selection.answerImageReview),
    answerRag: normalizeStateValues(selection.answerRag),
    answerReview: normalizeStateValues(selection.answerReview),
    questionImageRag: normalizeStateValues(selection.questionImageRag),
    questionImageReview: normalizeStateValues(selection.questionImageReview),
    questionRag: normalizeStateValues(selection.questionRag),
    questionReview: normalizeStateValues(selection.questionReview),
  };
}

function searchParamsFrom(value: string | URLSearchParams): URLSearchParams {
  return value instanceof URLSearchParams
    ? new URLSearchParams(value)
    : new URLSearchParams(value.startsWith('?') ? value.slice(1) : value);
}

export function parseDimensionalFilterSearchParams(
  value: string | URLSearchParams,
): DimensionalFilterSelection {
  const searchParams = searchParamsFrom(value);

  return normalizeDimensionalFilterSelection({
    family: searchParams.getAll('family'),
    frame: searchParams.getAll('frame'),
    marker: searchParams.getAll('marker'),
    math: searchParams.getAll('math'),
    reasoning: searchParams.getAll('reasoning'),
  });
}

export function serializeDimensionalFilterSearchParams(
  selection: Partial<DimensionalFilterSelection>,
  current: string | URLSearchParams = '',
): string {
  const searchParams = searchParamsFrom(current);
  const normalized = normalizeDimensionalFilterSelection(selection);

  for (const axis of DIMENSIONAL_TAG_AXES) {
    searchParams.delete(axis);
    for (const value of normalized[axis]) searchParams.append(axis, value);
  }

  searchParams.sort();
  return searchParams.toString();
}

export function parseReviewFilterSearchParams(
  value: string | URLSearchParams,
): ReviewFilterSelection {
  const searchParams = searchParamsFrom(value);
  return normalizeReviewFilterSelection({
    ...parseDimensionalFilterSearchParams(searchParams),
    answerImageRag: searchParams.getAll('answer-image-rag'),
    answerImageReview: searchParams.getAll('answer-image-review'),
    answerRag: searchParams.getAll('answer-rag'),
    answerReview: searchParams.getAll('answer-review'),
    questionImageRag: searchParams.getAll('question-image-rag'),
    questionImageReview: searchParams.getAll('question-image-review'),
    questionRag: searchParams.getAll('question-rag'),
    questionReview: searchParams.getAll('question-review'),
  });
}

export function serializeReviewFilterSearchParams(
  selection: Partial<ReviewFilterSelection>,
  current: string | URLSearchParams = '',
): string {
  const normalized = normalizeReviewFilterSelection(selection);
  const searchParams = new URLSearchParams(
    serializeDimensionalFilterSearchParams(normalized, current),
  );

  searchParams.delete('answer-image-rag');
  searchParams.delete('answer-image-review');
  searchParams.delete('answer-rag');
  searchParams.delete('answer-review');
  searchParams.delete('question-image-rag');
  searchParams.delete('question-image-review');
  searchParams.delete('question-rag');
  searchParams.delete('question-review');
  for (const value of normalized.answerImageRag) {
    searchParams.append('answer-image-rag', value);
  }
  for (const value of normalized.answerImageReview) {
    searchParams.append('answer-image-review', value);
  }
  for (const value of normalized.answerRag) {
    searchParams.append('answer-rag', value);
  }
  for (const value of normalized.answerReview) {
    searchParams.append('answer-review', value);
  }
  for (const value of normalized.questionImageRag) {
    searchParams.append('question-image-rag', value);
  }
  for (const value of normalized.questionImageReview) {
    searchParams.append('question-image-review', value);
  }
  for (const value of normalized.questionRag) {
    searchParams.append('question-rag', value);
  }
  for (const value of normalized.questionReview) {
    searchParams.append('question-review', value);
  }
  searchParams.sort();
  return searchParams.toString();
}

export function clearDimensionalFilter(
  selection: DimensionalFilterSelection,
  axis: DimensionalTagAxis,
): DimensionalFilterSelection {
  return normalizeDimensionalFilterSelection({ ...selection, [axis]: [] });
}

export function clearAllDimensionalFilters(): DimensionalFilterSelection {
  return emptyDimensionalFilterSelection();
}

export function clearAllReviewFilters(): ReviewFilterSelection {
  return emptyReviewFilterSelection();
}

export function clearReviewOutcomeFilters(
  selection: ReviewFilterSelection,
): ReviewFilterSelection {
  return normalizeReviewFilterSelection({
    ...selection,
    answerImageReview: [],
    answerReview: [],
    questionImageReview: [],
    questionReview: [],
  });
}

function flattenNode(node: ReviewPaperNode): ReviewPaperNode[] {
  return [node, ...node.children.flatMap(flattenNode)];
}

function nodeMatches(
  node: ReviewPaperNode,
  selection: ReviewFilterSelection,
  excludedAxis?: DimensionalTagAxis,
  excludedStateSide?: ReviewStateFilterSide,
): boolean {
  const dimensionsMatch = DIMENSIONAL_TAG_AXES.every((axis) => {
    if (axis === excludedAxis || selection[axis].length === 0) return true;
    const values = new Set(
      node.effectiveTags
        .filter((tag) => tag.axis === axis)
        .map((tag) => tag.value),
    );
    return selection[axis].some((selected) => values.has(selected));
  });
  if (!dimensionsMatch) return false;

  return reviewFilterSides.every((side) => {
    if (side === excludedStateSide) return true;
    const selected = selection[stateFacetParameters[side]];
    if (selected.length === 0) return true;
    const state = node.review[side].contentRag;
    return state ? selected.includes(state) : false;
  });
}

function questionTrees(paper: ReviewPaper): Array<
  Readonly<{
    nodes: readonly ReviewPaperNode[];
    question: ReviewPaperNode;
    sectionId: string;
  }>
> {
  return paper.sections.flatMap((section) =>
    section.questions.map((question) => ({
      nodes: flattenNode(question),
      question,
      sectionId: section.id,
    })),
  );
}

function reviewOutcomeValue(
  question: ReviewPaperNode,
  side: ReviewOutcomeFilterSide,
  context: ReviewOutcomeFilterContext,
): string | undefined {
  const value = context.values[question.id]?.[side];
  return value === null ? PENDING_REVIEW_OUTCOME : value;
}

function reviewOutcomeMatches(
  actual: string | undefined,
  selected: readonly string[],
): boolean {
  if (!actual) return false;
  return selected.includes(actual);
}

function treeMatchesReviewOutcomes(
  question: ReviewPaperNode,
  selection: ReviewFilterSelection,
  context: ReviewOutcomeFilterContext | undefined,
): boolean {
  if (!context) return true;
  return reviewOutcomeSidePairs.every((sides) => {
    const activeSides = sides.filter(
      (side) => selection[outcomeFacetParameters[side]].length > 0,
    );
    if (activeSides.length === 0) return true;
    return activeSides.some((side) => {
      const selected = selection[outcomeFacetParameters[side]];
      return reviewOutcomeMatches(
        reviewOutcomeValue(question, side, context),
        selected,
      );
    });
  });
}

function treeHasMatchingNode(
  tree: ReturnType<typeof questionTrees>[number],
  selection: ReviewFilterSelection,
  excludedAxis?: DimensionalTagAxis,
  excludedStateSide?: ReviewStateFilterSide,
): boolean {
  return tree.nodes.some((node) =>
    nodeMatches(node, selection, excludedAxis, excludedStateSide),
  );
}

function facetValues(
  paper: ReviewPaper,
  selection: ReviewFilterSelection,
  axis: DimensionalTagAxis,
): string[] {
  return [
    ...new Set([
      ...paper.sections.flatMap((section) =>
        section.questions.flatMap((question) =>
          flattenNode(question).flatMap((node) =>
            node.effectiveTags
              .filter((tag) => tag.axis === axis)
              .map((tag) => tag.value),
          ),
        ),
      ),
      ...selection[axis],
    ]),
  ].sort(compareValues);
}

function facetCount(
  trees: ReturnType<typeof questionTrees>,
  selection: ReviewFilterSelection,
  axis: DimensionalTagAxis,
  value: string,
  outcomeContext?: ReviewOutcomeFilterContext,
): number {
  return trees.filter(
    (tree) =>
      treeMatchesReviewOutcomes(tree.question, selection, outcomeContext) &&
      tree.nodes.some(
        (node) =>
          nodeMatches(node, selection, axis) &&
          node.effectiveTags.some(
            (tag) => tag.axis === axis && tag.value === value,
          ),
      ),
  ).length;
}

function stateFacetValues(
  paper: ReviewPaper,
  selection: ReviewFilterSelection,
  side: ReviewStateFilterSide,
): string[] {
  return [
    ...new Set([
      ...paper.sections.flatMap((section) =>
        section.questions.flatMap((question) =>
          flattenNode(question).flatMap((node) => {
            const value = node.review[side].contentRag;
            return value ? [value] : [];
          }),
        ),
      ),
      ...selection[stateFacetParameters[side]],
    ]),
  ].sort(compareValues);
}

function stateFacetCount(
  trees: ReturnType<typeof questionTrees>,
  selection: ReviewFilterSelection,
  side: ReviewStateFilterSide,
  value: string,
  outcomeContext?: ReviewOutcomeFilterContext,
): number {
  return trees.filter(
    (tree) =>
      treeMatchesReviewOutcomes(tree.question, selection, outcomeContext) &&
      tree.nodes.some(
        (node) =>
          nodeMatches(node, selection, undefined, side) &&
          node.review[side].contentRag === value,
      ),
  ).length;
}

function reviewOutcomeFacetValues(
  selection: ReviewFilterSelection,
  side: ReviewOutcomeFilterSide,
): string[] {
  const standard = new Set<string>(REVIEW_OUTCOME_FILTER_VALUES);
  const selected = selection[outcomeFacetParameters[side]];
  return [
    ...REVIEW_OUTCOME_FILTER_VALUES,
    ...selected.filter((value) => !standard.has(value)).sort(compareValues),
  ];
}

function reviewOutcomeFacetCount(
  trees: ReturnType<typeof questionTrees>,
  selection: ReviewFilterSelection,
  side: ReviewOutcomeFilterSide,
  value: string,
  context: ReviewOutcomeFilterContext,
): number {
  const parameter = outcomeFacetParameters[side];
  const pairedSide = pairedReviewOutcomeSide[side];
  const candidateSelection = normalizeReviewFilterSelection({
    ...selection,
    [parameter]: [value],
    [outcomeFacetParameters[pairedSide]]: [],
  });
  return trees.filter(
    (tree) =>
      treeHasMatchingNode(tree, candidateSelection) &&
      treeMatchesReviewOutcomes(tree.question, candidateSelection, context),
  ).length;
}

export function filterReviewPaper(
  paper: ReviewPaper,
  requestedSelection: Partial<ReviewFilterSelection> = {},
  outcomeContext?: ReviewOutcomeFilterContext,
): DimensionalFilterResult {
  const selection = normalizeReviewFilterSelection(requestedSelection);
  const trees = questionTrees(paper);
  const questionTreeMatches: QuestionTreeMatch[] = trees.flatMap((tree) => {
    if (!treeMatchesReviewOutcomes(tree.question, selection, outcomeContext)) {
      return [];
    }
    const matchingNodeIds = tree.nodes
      .filter((node) => nodeMatches(node, selection))
      .map((node) => node.id);

    return matchingNodeIds.length > 0
      ? [
          {
            matchingNodeIds,
            questionId: tree.question.id,
            sectionId: tree.sectionId,
          },
        ]
      : [];
  });
  const facets: DimensionalFacet[] = DIMENSIONAL_TAG_AXES.map((axis) => ({
    axis,
    label: facetLabels[axis],
    options: facetValues(paper, selection, axis).map((value) => {
      const count = facetCount(trees, selection, axis, value, outcomeContext);
      const selected = selection[axis].includes(value);
      return { count, disabled: count === 0 && !selected, selected, value };
    }),
  }));
  const stateFacets: ReviewStateFacet[] = reviewFilterSides.map((side) => {
    const parameter = stateFacetParameters[side];
    return {
      label: stateFacetLabels[side],
      options: stateFacetValues(paper, selection, side).map((value) => {
        const count = stateFacetCount(
          trees,
          selection,
          side,
          value,
          outcomeContext,
        );
        const selected = selection[parameter].includes(value);
        return { count, disabled: count === 0 && !selected, selected, value };
      }),
      parameter,
      side,
    };
  });
  const reviewOutcomeFacets: ReviewOutcomeFacet[] = outcomeContext
    ? reviewFilterSides.map((side) => {
        const parameter = outcomeFacetParameters[side];
        return {
          label: outcomeFacetLabels[side],
          options: reviewOutcomeFacetValues(selection, side).map((value) => {
            const count = reviewOutcomeFacetCount(
              trees,
              selection,
              side,
              value,
              outcomeContext,
            );
            const selected = selection[parameter].includes(value);
            return {
              count,
              disabled: false,
              selected,
              value,
            };
          }),
          parameter,
          side,
        };
      })
    : [];
  const matchingNodeIds = questionTreeMatches.flatMap(
    (match) => match.matchingNodeIds,
  );
  const matchingQuestionTreeIds = questionTreeMatches.map(
    (match) => match.questionId,
  );
  const matchingQuestionTreeIdSet = new Set(matchingQuestionTreeIds);
  const matchingSections = paper.sections.flatMap((section) => {
    const questions = section.questions.filter((question) =>
      matchingQuestionTreeIdSet.has(question.id),
    );
    return questions.length > 0 ? [{ ...section, questions }] : [];
  });

  return {
    facets,
    matchingNodeIds,
    matchingSections,
    matchingQuestionTreeCount: questionTreeMatches.length,
    matchingQuestionTreeIds,
    questionTreeMatches,
    reviewOutcomeFacets,
    selection,
    stateFacets,
    totalQuestionTreeCount: trees.length,
  };
}
