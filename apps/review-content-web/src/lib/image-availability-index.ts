import 'server-only';

import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  corpusQuestionLocationKey,
  listPaperSourcesForCollection,
  readReviewPaper,
  type CorpusQuestionContentSearchMatch,
  type PaperCollectionId,
  type ReviewContentField,
  type ReviewPaperImagePreparation,
  type ReviewPaperNode,
} from '@rtq/review-paper-model';
import { resolveRtqContentPaths } from '@rtq/review-repository-paths';

import type { ImageAvailabilityIndexSummary } from './image-availability-types';
import { paperImageOwnerPath } from './prepare-paper';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'webp'] as const;

export type ImageAvailabilityIndex = Readonly<{
  matches: readonly CorpusQuestionContentSearchMatch[];
  questionKeys: ReadonlySet<string>;
  summary: ImageAvailabilityIndexSummary;
}>;

type CachedIndex = Readonly<{
  promise: Promise<ImageAvailabilityIndex>;
  summary?: ImageAvailabilityIndexSummary;
}>;

const imageAvailabilityIndexes = new Map<string, CachedIndex>();

function cacheKey(collectionId: PaperCollectionId): string {
  return `${resolveRtqContentPaths().contentRoot}\0${collectionId}`;
}

export function invalidateImageAvailabilityIndex(
  collectionId: PaperCollectionId,
): void {
  imageAvailabilityIndexes.delete(cacheKey(collectionId));
}

function fieldV2ImageCount(
  field: ReviewContentField,
  assetsRoot: string,
): number {
  const preparations = field.preparations.filter(
    (preparation): preparation is ReviewPaperImagePreparation =>
      preparation.kind === 'paper-image',
  );
  return preparations.reduce((count, preparation, imageIndex) => {
    const location = paperImageOwnerPath(
      preparation.context,
      preparation.context.scope,
      imageIndex,
      'v2',
    );
    const paperRoot = path.join(
      assetsRoot,
      'papers',
      preparation.context.paperStem,
    );
    const available = IMAGE_EXTENSIONS.some((extension) =>
      existsSync(path.join(paperRoot, `${location.sourceStem}.${extension}`)),
    );
    return count + Number(available);
  }, 0);
}

function nodeV2ImageCount(node: ReviewPaperNode, assetsRoot: string): number {
  return (
    fieldV2ImageCount(node.content.question, assetsRoot) +
    node.content.workings.reduce(
      (workingTotal, working) =>
        workingTotal +
        fieldV2ImageCount(working.working, assetsRoot) +
        working.formulas.reduce(
          (fieldTotal, field) =>
            fieldTotal + fieldV2ImageCount(field, assetsRoot),
          0,
        ) +
        working.tips.reduce(
          (fieldTotal, field) =>
            fieldTotal + fieldV2ImageCount(field, assetsRoot),
          0,
        ),
      0,
    ) +
    node.content.answers.reduce(
      (answerTotal, answer) =>
        answerTotal +
        fieldV2ImageCount(answer.answer, assetsRoot) +
        fieldV2ImageCount(answer.key, assetsRoot) +
        fieldV2ImageCount(answer.option, assetsRoot),
      0,
    )
  );
}

function v2MatchesForQuestion(
  question: ReviewPaperNode,
  assetsRoot: string,
): Readonly<{ imageCount: number; nodeIds: readonly string[] }> {
  const ownCount = nodeV2ImageCount(question, assetsRoot);
  const children = question.children.map((child) =>
    v2MatchesForQuestion(child, assetsRoot),
  );
  return {
    imageCount:
      ownCount + children.reduce((total, child) => total + child.imageCount, 0),
    nodeIds: [
      ...(ownCount > 0 ? [question.id] : []),
      ...children.flatMap((child) => child.nodeIds),
    ],
  };
}

async function buildImageAvailabilityIndex(
  collectionId: PaperCollectionId,
): Promise<ImageAvailabilityIndex> {
  const { assetsRoot } = resolveRtqContentPaths();
  const sources = await listPaperSourcesForCollection(collectionId);
  const inspected = await Promise.all(
    sources.map(async (summary) => {
      if (summary.state !== 'ready') return { state: 'invalid' as const };
      try {
        return {
          paper: await readReviewPaper(
            collectionId,
            summary.source.relativePath,
          ),
          relativePath: summary.source.relativePath,
          state: 'ready' as const,
        };
      } catch {
        return { state: 'invalid' as const };
      }
    }),
  );
  let v2ImageCount = 0;
  const matches = inspected.flatMap((entry) => {
    if (entry.state !== 'ready') return [];
    return entry.paper.sections.flatMap((section, sectionIndex) =>
      section.questions.flatMap((question, questionIndex) => {
        const match = v2MatchesForQuestion(question, assetsRoot);
        v2ImageCount += match.imageCount;
        return match.imageCount > 0
          ? [
              {
                matchingNodeIds: match.nodeIds,
                questionIndex,
                relativePath: entry.relativePath,
                sectionIndex,
              },
            ]
          : [];
      }),
    );
  });
  const summary = {
    builtAt: new Date().toISOString(),
    invalidFileCount: inspected.filter((entry) => entry.state === 'invalid')
      .length,
    scannedFileCount: sources.length,
    v2ImageCount,
    v2QuestionCount: matches.length,
  } satisfies ImageAvailabilityIndexSummary;
  return {
    matches,
    questionKeys: new Set(
      matches.map((match) =>
        corpusQuestionLocationKey(
          match.relativePath,
          match.sectionIndex,
          match.questionIndex,
        ),
      ),
    ),
    summary,
  };
}

export function imageAvailabilityIndexSummary(
  collectionId: PaperCollectionId,
): ImageAvailabilityIndexSummary | undefined {
  return imageAvailabilityIndexes.get(cacheKey(collectionId))?.summary;
}

export async function getImageAvailabilityIndex(
  collectionId: PaperCollectionId,
  options: Readonly<{ rebuild?: boolean }> = {},
): Promise<ImageAvailabilityIndex> {
  const key = cacheKey(collectionId);
  if (options.rebuild) imageAvailabilityIndexes.delete(key);
  const cached = imageAvailabilityIndexes.get(key);
  if (cached) return cached.promise;

  const promise = buildImageAvailabilityIndex(collectionId);
  imageAvailabilityIndexes.set(key, { promise });
  try {
    const index = await promise;
    imageAvailabilityIndexes.set(key, { promise, summary: index.summary });
    return index;
  } catch (error) {
    imageAvailabilityIndexes.delete(key);
    throw error;
  }
}
