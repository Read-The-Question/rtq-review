import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalFacet,
  type DimensionalFilterResult,
  type DimensionalFilterSelection,
  type DimensionalTagAxis,
  type QuestionTreeMatch,
  type ReviewFilterSelection,
  type ReviewPaper,
  type ReviewPaperNode,
  type ReviewStateFacet,
  type ReviewStateFilterSide,
} from './model.ts';

const facetLabels: Readonly<Record<DimensionalTagAxis, string>> = {
  family: 'Family',
  frame: 'Frame',
  marker: 'Marker',
  math: 'Math',
  reasoning: 'Reasoning',
};

const stateFacetParameters = {
  answer: 'answerRag',
  question: 'questionRag',
} as const;

const stateFacetLabels: Readonly<Record<ReviewStateFilterSide, string>> = {
  answer: 'Answer state',
  question: 'Question state',
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
    answerRag: [],
    questionRag: [],
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
    answerRag: normalizeStateValues(selection.answerRag),
    questionRag: normalizeStateValues(selection.questionRag),
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
    answerRag: searchParams.getAll('answer-rag'),
    questionRag: searchParams.getAll('question-rag'),
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

  searchParams.delete('answer-rag');
  searchParams.delete('question-rag');
  for (const value of normalized.answerRag) {
    searchParams.append('answer-rag', value);
  }
  for (const value of normalized.questionRag) {
    searchParams.append('question-rag', value);
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

  return (['question', 'answer'] as const).every((side) => {
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
): number {
  return trees.filter((tree) =>
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
): number {
  return trees.filter((tree) =>
    tree.nodes.some(
      (node) =>
        nodeMatches(node, selection, undefined, side) &&
        node.review[side].contentRag === value,
    ),
  ).length;
}

export function filterReviewPaper(
  paper: ReviewPaper,
  requestedSelection: Partial<ReviewFilterSelection> = {},
): DimensionalFilterResult {
  const selection = normalizeReviewFilterSelection(requestedSelection);
  const trees = questionTrees(paper);
  const questionTreeMatches: QuestionTreeMatch[] = trees.flatMap((tree) => {
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
      const count = facetCount(trees, selection, axis, value);
      const selected = selection[axis].includes(value);
      return { count, disabled: count === 0 && !selected, selected, value };
    }),
  }));
  const stateFacets: ReviewStateFacet[] = (['question', 'answer'] as const).map(
    (side) => {
      const parameter = stateFacetParameters[side];
      return {
        label: stateFacetLabels[side],
        options: stateFacetValues(paper, selection, side).map((value) => {
          const count = stateFacetCount(trees, selection, side, value);
          const selected = selection[parameter].includes(value);
          return { count, disabled: count === 0 && !selected, selected, value };
        }),
        parameter,
        side,
      };
    },
  );
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
    selection,
    stateFacets,
    totalQuestionTreeCount: trees.length,
  };
}
