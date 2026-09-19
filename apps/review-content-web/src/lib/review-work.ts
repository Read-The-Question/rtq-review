import { readFile } from 'node:fs/promises';

import {
  listPaperSourcesForCollection,
  readReviewPaper,
  resolvePaperSourcePath,
  type PaperCollectionId,
  type ReviewPaperNode,
} from '@rtq/review-paper-model';
import {
  getReviewStore,
  type LocalReviewComment,
  type StoredReviewOutcome,
} from '@rtq/review-store/server';
import { REVIEW_SIDES, type ReviewSide } from '@rtq/review-store/types';

import { normalizeSourceRag } from './review-types.ts';
import { paperRoute } from './review-view-model.ts';

const REVIEW_SOURCE_COLLECTIONS = [
  'topicToml',
  'toml',
] as const satisfies readonly PaperCollectionId[];

export type ReviewWorkLifecycle = 'active' | 'archived';

export type ReviewWorkSource = Readonly<{
  collectionId: string;
  nodeId: string;
  nodeLabel: string;
  paperTitle: string;
  relativePath: string;
  route: string;
  sortIndex: number;
}>;

export type ReviewWorkOccurrence = ReviewWorkSource &
  Readonly<{
    states: Readonly<Record<ReviewSide, string | undefined>>;
    uuid: string;
  }>;

export type ReviewWorkStateGroup = Readonly<{
  changeRequest: StoredReviewOutcome | null;
  comments: readonly LocalReviewComment[];
  currentRagStates: readonly string[];
  lifecycle: ReviewWorkLifecycle;
  ragState: string;
  source: ReviewWorkSource | null;
}>;

export type ReviewWorkLane = Readonly<{
  side: ReviewSide;
  states: readonly ReviewWorkStateGroup[];
}>;

export type ReviewWorkGroup = Readonly<{
  lanes: readonly ReviewWorkLane[];
  source: ReviewWorkSource | null;
  sourceFiles: Readonly<{
    toml: readonly ReviewWorkSource[];
    topicToml: readonly ReviewWorkSource[];
  }>;
  uuid: string;
}>;

function flattenNodes(node: ReviewPaperNode): readonly ReviewPaperNode[] {
  return [node, ...node.children.flatMap(flattenNodes)];
}

function sourcePreference(source: ReviewWorkSource): number {
  return source.collectionId === 'toml' ? 0 : 1;
}

function compareSources(left: ReviewWorkSource, right: ReviewWorkSource) {
  return (
    sourcePreference(left) - sourcePreference(right) ||
    left.paperTitle.localeCompare(right.paperTitle, undefined, {
      numeric: true,
      sensitivity: 'base',
    }) ||
    left.relativePath.localeCompare(right.relativePath, undefined, {
      numeric: true,
      sensitivity: 'base',
    }) ||
    left.sortIndex - right.sortIndex
  );
}

function compareGroups(left: ReviewWorkGroup, right: ReviewWorkGroup) {
  if (left.source && right.source) {
    return (
      compareSources(left.source, right.source) ||
      left.uuid.localeCompare(right.uuid)
    );
  }
  if (left.source) return -1;
  if (right.source) return 1;
  return left.uuid.localeCompare(right.uuid);
}

function uniqueSorted(values: readonly (string | undefined)[]): string[] {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ].sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true }),
  );
}

function uniqueSources(
  occurrences: readonly ReviewWorkOccurrence[],
  collectionId: 'toml' | 'topicToml',
): readonly ReviewWorkSource[] {
  const sources = new Map<string, ReviewWorkSource>();
  for (const occurrence of occurrences) {
    if (occurrence.collectionId !== collectionId) continue;
    const key = `${occurrence.collectionId}:${occurrence.relativePath}`;
    if (!sources.has(key)) sources.set(key, occurrence);
  }
  return [...sources.values()].sort(compareSources);
}

export function buildReviewWorkGroups({
  comments,
  occurrences,
  outcomes,
}: Readonly<{
  comments: readonly LocalReviewComment[];
  occurrences: readonly ReviewWorkOccurrence[];
  outcomes: readonly StoredReviewOutcome[];
}>): readonly ReviewWorkGroup[] {
  const actionableOutcomes = outcomes.filter(
    (outcome) => outcome.outcome === 'PRCR',
  );
  const uuids = new Set([
    ...comments.map((comment) => comment.uuid),
    ...actionableOutcomes.map((outcome) => outcome.uuid),
  ]);

  return [...uuids]
    .map((uuid): ReviewWorkGroup => {
      const matchingOccurrences = occurrences
        .filter((occurrence) => occurrence.uuid === uuid)
        .sort(compareSources);
      const lanes = REVIEW_SIDES.flatMap((side): readonly ReviewWorkLane[] => {
        const sideComments = comments.filter(
          (comment) => comment.uuid === uuid && comment.side === side,
        );
        const sideOutcomes = actionableOutcomes.filter(
          (outcome) => outcome.uuid === uuid && outcome.side === side,
        );
        const ragStates = uniqueSorted([
          ...sideComments.map((comment) => comment.ragState),
          ...sideOutcomes.map((outcome) => outcome.ragState),
        ]);
        if (ragStates.length === 0) return [];

        const currentRagStates = uniqueSorted(
          matchingOccurrences.map((occurrence) => occurrence.states[side]),
        );
        const states = ragStates.map((ragState): ReviewWorkStateGroup => {
          const currentSource = matchingOccurrences.find(
            (occurrence) => occurrence.states[side] === ragState,
          );
          return {
            changeRequest:
              sideOutcomes.find((outcome) => outcome.ragState === ragState) ??
              null,
            comments: sideComments.filter(
              (comment) => comment.ragState === ragState,
            ),
            currentRagStates,
            lifecycle: currentSource ? 'active' : 'archived',
            ragState,
            source: currentSource ?? matchingOccurrences[0] ?? null,
          };
        });
        return [{ side, states }];
      });

      return {
        lanes,
        source: matchingOccurrences[0] ?? null,
        sourceFiles: {
          toml: uniqueSources(matchingOccurrences, 'toml'),
          topicToml: uniqueSources(matchingOccurrences, 'topicToml'),
        },
        uuid,
      };
    })
    .sort(compareGroups);
}

function rawUuids(raw: string): readonly string[] {
  return [...raw.matchAll(/\brtq-uuid\s*=\s*["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
}

function normalizedState(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return normalizeSourceRag(value) || undefined;
}

async function loadOccurrences(
  targetUuids: ReadonlySet<string>,
): Promise<readonly ReviewWorkOccurrence[]> {
  if (targetUuids.size === 0) return [];
  const summaries = (
    await Promise.all(
      REVIEW_SOURCE_COLLECTIONS.map((collectionId) =>
        listPaperSourcesForCollection(collectionId),
      ),
    )
  )
    .flat()
    .filter(
      (summary): summary is Extract<typeof summary, { state: 'ready' }> =>
        summary.state === 'ready',
    );

  const candidates = (
    await Promise.all(
      summaries.map(async (summary) => {
        try {
          const sourcePath = resolvePaperSourcePath(
            summary.source.collection.directory,
            summary.source.relativePath,
          );
          const raw = await readFile(sourcePath, 'utf8');
          return rawUuids(raw).some((uuid) => targetUuids.has(uuid))
            ? summary.source
            : null;
        } catch {
          return null;
        }
      }),
    )
  ).filter((source): source is NonNullable<typeof source> => source !== null);

  const papers = await Promise.all(
    candidates.map(async (source) => {
      try {
        return await readReviewPaper(source.collection.id, source.relativePath);
      } catch {
        return null;
      }
    }),
  );

  return papers.flatMap((paper): readonly ReviewWorkOccurrence[] => {
    if (!paper) return [];
    let sortIndex = 0;
    return paper.sections.flatMap((section) =>
      section.questions.flatMap((question) =>
        flattenNodes(question).flatMap((node) => {
          const nodeSortIndex = sortIndex++;
          if (!node.uuid || !targetUuids.has(node.uuid)) return [];
          return [
            {
              collectionId: paper.source.collection.id,
              nodeId: node.id,
              nodeLabel: node.label,
              paperTitle: paper.title,
              relativePath: paper.source.relativePath,
              route: `${paperRoute(
                paper.source.collection.id,
                paper.source.relativePath,
              )}#question-${encodeURIComponent(node.id)}`,
              sortIndex: nodeSortIndex,
              states: {
                answer: normalizedState(question.review.answer.contentRag),
                'answer-image': normalizedState(
                  question.review['answer-image'].contentRag,
                ),
                question: normalizedState(question.review.question.contentRag),
                'question-image': normalizedState(
                  question.review['question-image'].contentRag,
                ),
              },
              uuid: node.uuid,
            },
          ];
        }),
      ),
    );
  });
}

export async function loadReviewWorkGroups(): Promise<
  readonly ReviewWorkGroup[]
> {
  const store = getReviewStore();
  const comments = store.comments.listAll();
  const outcomes = store.outcomes
    .listAll()
    .filter((outcome) => outcome.outcome === 'PRCR');
  const targetUuids = new Set([
    ...comments.map((comment) => comment.uuid),
    ...outcomes.map((outcome) => outcome.uuid),
  ]);
  const occurrences = await loadOccurrences(targetUuids);
  return buildReviewWorkGroups({ comments, occurrences, outcomes });
}
