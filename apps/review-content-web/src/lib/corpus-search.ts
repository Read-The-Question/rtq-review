import 'server-only';

import {
  paperCollectionForId,
  readReviewPaper,
  searchPaperQuestionTrees,
  searchPaperQuestionTreesByUuids,
  type ContentSearchQuery,
  type CorpusQuestionContentSearchMatch,
  type PaperCollectionId,
  type ReviewPaper,
  type ReviewPaperNode,
} from '@rtq/review-paper-model';

import type {
  CorpusSearchLimit,
  CorpusSearchResponse,
} from './corpus-search-types';
import { prepareReviewPaperForDisplay } from './prepare-paper';
import { reviewContentReviewer } from './review-config';
import { loadReviewCommentsForPaper } from './review-comments';
import { loadReviewOutcomesForPaper } from './review-outcomes';

function corpusNode(
  node: ReviewPaperNode,
  source: ReviewPaper['source'],
  paperMetadata: ReviewPaper['metadata'],
  sectionLabel: string,
  resultPosition: number,
): ReviewPaperNode {
  const canonicalNodeId = node.id;
  const id = `result-${resultPosition}.${canonicalNodeId}`;
  return {
    ...node,
    children: node.children.map((child) =>
      corpusNode(child, source, paperMetadata, sectionLabel, resultPosition),
    ),
    id,
    reviewSource: {
      collectionId: source.collection.id,
      nodeId: canonicalNodeId,
      paperMetadata,
      paperTitle: source.title,
      relativePath: source.relativePath,
      resultPosition,
      sectionLabel,
      version: source.version,
    },
  };
}

function corpusPaper(
  collectionId: PaperCollectionId,
  questions: readonly ReviewPaperNode[],
  label: string,
): ReviewPaper {
  return {
    metadata: { focusGroups: [], schoolIds: [] },
    sections: [{ id: 'corpus-results', label, questions }],
    source: {
      collection: paperCollectionForId(collectionId),
      fileName: 'corpus-search',
      focusGroups: [],
      provenance: { kind: 'canonical', sourcePaperStems: [] },
      questionCount: questions.length,
      relativePath: 'corpus-search',
      title: 'Corpus search',
      version: 'live',
    },
    title: 'Corpus search',
  };
}

function corpusResponse(
  paper: ReviewPaper,
  page: Readonly<{
    endPosition: number;
    invalidFileCount: number;
    limit: CorpusSearchLimit;
    nextCursor?: string;
    previousCursor?: string;
    scannedFileCount: number;
    startPosition: number;
  }>,
  search: Readonly<{
    missingUuids?: readonly string[];
    mode: 'content' | 'uuid';
    uuidInput?: string;
    uuidRequestCount?: number;
  }> = { mode: 'content' },
): CorpusSearchResponse {
  return {
    commentLoad: loadReviewCommentsForPaper(paper),
    collectionId: paper.source.collection.id,
    endPosition: page.endPosition,
    invalidFileCount: page.invalidFileCount,
    limit: page.limit,
    missingUuids: search.missingUuids ?? [],
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
    outcomeLoad: loadReviewOutcomesForPaper(paper),
    paper: prepareReviewPaperForDisplay(paper),
    ...(page.previousCursor ? { previousCursor: page.previousCursor } : {}),
    reviewer: reviewContentReviewer,
    scannedFileCount: page.scannedFileCount,
    searchMode: search.mode,
    startPosition: page.startPosition,
    ...(search.uuidInput ? { uuidInput: search.uuidInput } : {}),
    uuidRequestCount: search.uuidRequestCount ?? 0,
  };
}

async function loadCorpusQuestions(
  collectionId: PaperCollectionId,
  matches: readonly CorpusQuestionContentSearchMatch[],
  startPosition: number,
): Promise<readonly ReviewPaperNode[]> {
  const paths = [...new Set(matches.map((match) => match.relativePath))];
  const papers = new Map(
    await Promise.all(
      paths.map(async (relativePath) => {
        const paper = await readReviewPaper(collectionId, relativePath);
        return [relativePath, paper] as const;
      }),
    ),
  );

  return matches.map((match, index): ReviewPaperNode => {
    const paper = papers.get(match.relativePath);
    const section = paper?.sections[match.sectionIndex];
    const question = section?.questions[match.questionIndex];
    if (!paper || !section || !question) {
      throw new Error(
        `The canonical search result changed while reading ${match.relativePath}.`,
      );
    }
    return corpusNode(
      question,
      paper.source,
      paper.metadata,
      section.label,
      startPosition + index,
    );
  });
}

export function emptyCanonicalQuestionCorpus(
  collectionId: PaperCollectionId,
  limit: CorpusSearchLimit,
): CorpusSearchResponse {
  return corpusResponse(corpusPaper(collectionId, [], 'Search results'), {
    endPosition: 0,
    invalidFileCount: 0,
    limit,
    scannedFileCount: 0,
    startPosition: 0,
  });
}

export function emptyCanonicalQuestionUuidCorpus(
  collectionId: PaperCollectionId,
  input: string,
): CorpusSearchResponse {
  return corpusResponse(
    corpusPaper(collectionId, [], 'UUID results'),
    {
      endPosition: 0,
      invalidFileCount: 0,
      limit: 100,
      scannedFileCount: 0,
      startPosition: 0,
    },
    { mode: 'uuid', uuidInput: input },
  );
}

export async function searchCanonicalQuestionCorpus(
  collectionId: PaperCollectionId,
  query: ContentSearchQuery,
  options: Readonly<{
    cursor?: string;
    limit: CorpusSearchLimit;
  }>,
): Promise<CorpusSearchResponse> {
  const page = await searchPaperQuestionTrees(collectionId, query, options);
  const questions = await loadCorpusQuestions(
    collectionId,
    page.matches,
    page.startPosition,
  );
  const paper = corpusPaper(
    collectionId,
    questions,
    page.matches.length > 0
      ? `Results ${page.startPosition}–${page.endPosition}`
      : 'Search results',
  );
  return corpusResponse(paper, {
    endPosition: page.endPosition,
    invalidFileCount: page.invalidFileCount,
    limit: options.limit,
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
    ...(page.previousCursor ? { previousCursor: page.previousCursor } : {}),
    scannedFileCount: page.scannedFileCount,
    startPosition: page.startPosition,
  });
}

export async function searchCanonicalQuestionCorpusByUuids(
  collectionId: PaperCollectionId,
  input: string,
): Promise<CorpusSearchResponse> {
  const result = await searchPaperQuestionTreesByUuids(collectionId, input);
  const questions = await loadCorpusQuestions(collectionId, result.matches, 1);
  const paper = corpusPaper(collectionId, questions, 'UUID results');
  return corpusResponse(
    paper,
    {
      endPosition: questions.length,
      invalidFileCount: result.invalidFileCount,
      limit: 100,
      scannedFileCount: result.scannedFileCount,
      startPosition: questions.length > 0 ? 1 : 0,
    },
    {
      missingUuids: result.missingUuids,
      mode: 'uuid',
      uuidInput: input,
      uuidRequestCount: result.requestedUuids.length,
    },
  );
}
