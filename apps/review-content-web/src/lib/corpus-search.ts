import 'server-only';

import {
  corpusQuestionLocationKey,
  paperCollectionForId,
  PaperContentSearchError,
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
import type { ImageAvailabilityIndex } from './image-availability-index';
import type {
  ImageAvailabilityFilter,
  ImageAvailabilityIndexSummary,
} from './image-availability-types';
import type { PaperPdfOption } from './paper-pdf';
import { resolvePaperPdfByStem } from './paper-pdf-reader';
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
    excludedUuidCount?: number;
    imageAvailability?: ImageAvailabilityFilter;
    imageIndex?: ImageAvailabilityIndexSummary;
    missingUuids?: readonly string[];
    mode: 'content' | 'uuid';
    uuidInput?: string;
    uuidRequestCount?: number;
  }> = { mode: 'content' },
  pdfs: readonly PaperPdfOption[] = [],
): CorpusSearchResponse {
  return {
    commentLoad: loadReviewCommentsForPaper(paper),
    collectionId: paper.source.collection.id,
    endPosition: page.endPosition,
    excludedUuidCount: search.excludedUuidCount ?? 0,
    imageAvailability: search.imageAvailability ?? 'any',
    ...(search.imageIndex ? { imageIndex: search.imageIndex } : {}),
    invalidFileCount: page.invalidFileCount,
    limit: page.limit,
    missingUuids: search.missingUuids ?? [],
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
    outcomeLoad: loadReviewOutcomesForPaper(paper),
    paper: prepareReviewPaperForDisplay(paper),
    pdfs,
    ...(page.previousCursor ? { previousCursor: page.previousCursor } : {}),
    reviewer: reviewContentReviewer,
    scannedFileCount: page.scannedFileCount,
    searchMode: search.mode,
    startPosition: page.startPosition,
    ...(search.uuidInput ? { uuidInput: search.uuidInput } : {}),
    uuidRequestCount: search.uuidRequestCount ?? 0,
  };
}

function fileStem(fileName: string): string | undefined {
  return fileName.toLowerCase().endsWith('.toml')
    ? fileName.slice(0, -'.toml'.length)
    : undefined;
}

function questionSourceStems(node: ReviewPaperNode): readonly string[] {
  const stems = new Set<string>();
  const visit = (current: ReviewPaperNode) => {
    if (current.originalSource?.paperStem) {
      stems.add(current.originalSource.paperStem);
    }
    current.children.forEach(visit);
  };
  visit(node);
  return [...stems];
}

async function loadCorpusQuestions(
  collectionId: PaperCollectionId,
  matches: readonly CorpusQuestionContentSearchMatch[],
  startPosition: number,
): Promise<
  Readonly<{
    pdfs: readonly PaperPdfOption[];
    questions: readonly ReviewPaperNode[];
  }>
> {
  const paths = [...new Set(matches.map((match) => match.relativePath))];
  const papers = new Map(
    await Promise.all(
      paths.map(async (relativePath) => {
        const paper = await readReviewPaper(collectionId, relativePath);
        return [relativePath, paper] as const;
      }),
    ),
  );

  const candidates = new Map<string, { label: string; matchCount: number }>();
  const questions = matches.map((match, index): ReviewPaperNode => {
    const paper = papers.get(match.relativePath);
    const section = paper?.sections[match.sectionIndex];
    const question = section?.questions[match.questionIndex];
    if (!paper || !section || !question) {
      throw new Error(
        `The canonical search result changed while reading ${match.relativePath}.`,
      );
    }

    const directStem = fileStem(paper.source.fileName);
    const sourceStems = questionSourceStems(question);
    const stems = sourceStems.length
      ? sourceStems
      : paper.source.collection.supportsOriginalPdf && directStem
        ? [directStem]
        : paper.source.provenance.sourcePaperStems;
    new Set(stems).forEach((stem) => {
      const current = candidates.get(stem);
      candidates.set(stem, {
        label:
          directStem === stem && paper.source.title ? paper.source.title : stem,
        matchCount: (current?.matchCount ?? 0) + 1,
      });
    });

    return corpusNode(
      question,
      paper.source,
      paper.metadata,
      section.label,
      startPosition + index,
    );
  });

  const pdfs = await Promise.all(
    [...candidates].map(async ([key, candidate]): Promise<PaperPdfOption> => ({
      key,
      label: candidate.label,
      matchCount: candidate.matchCount,
      pdf: await resolvePaperPdfByStem(key),
    })),
  );

  return { pdfs, questions };
}

export function emptyCanonicalQuestionCorpus(
  collectionId: PaperCollectionId,
  limit: CorpusSearchLimit,
  image: Readonly<{
    availability?: ImageAvailabilityFilter;
    index?: ImageAvailabilityIndexSummary;
  }> = {},
): CorpusSearchResponse {
  return corpusResponse(
    corpusPaper(collectionId, [], 'Search results'),
    {
      endPosition: 0,
      invalidFileCount: 0,
      limit,
      scannedFileCount: 0,
      startPosition: 0,
    },
    {
      imageAvailability: image.availability,
      imageIndex: image.index,
      mode: 'content',
    },
  );
}

export function emptyCanonicalQuestionUuidCorpus(
  collectionId: PaperCollectionId,
  input: string,
  image: Readonly<{
    availability?: ImageAvailabilityFilter;
    index?: ImageAvailabilityIndexSummary;
  }> = {},
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
    {
      imageAvailability: image.availability,
      imageIndex: image.index,
      mode: 'uuid',
      uuidInput: input,
    },
  );
}

export async function searchCanonicalQuestionCorpus(
  collectionId: PaperCollectionId,
  query: ContentSearchQuery,
  options: Readonly<{
    candidateQuestionKeys?: ReadonlySet<string>;
    cursor?: string;
    imageAvailability?: ImageAvailabilityFilter;
    imageIndex?: ImageAvailabilityIndexSummary;
    limit: CorpusSearchLimit;
  }>,
): Promise<CorpusSearchResponse> {
  const page = await searchPaperQuestionTrees(collectionId, query, {
    ...(options.candidateQuestionKeys
      ? { candidateQuestionKeys: options.candidateQuestionKeys }
      : {}),
    ...(options.cursor ? { cursor: options.cursor } : {}),
    limit: options.limit,
  });
  const { pdfs, questions } = await loadCorpusQuestions(
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
  return corpusResponse(
    paper,
    {
      endPosition: page.endPosition,
      invalidFileCount: page.invalidFileCount,
      limit: options.limit,
      ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
      ...(page.previousCursor ? { previousCursor: page.previousCursor } : {}),
      scannedFileCount: page.scannedFileCount,
      startPosition: page.startPosition,
    },
    {
      imageAvailability: options.imageAvailability,
      imageIndex: options.imageIndex,
      mode: 'content',
    },
    pdfs,
  );
}

export async function searchCanonicalQuestionCorpusByUuids(
  collectionId: PaperCollectionId,
  input: string,
  options: Readonly<{
    candidateQuestionKeys?: ReadonlySet<string>;
    imageAvailability?: ImageAvailabilityFilter;
    imageIndex?: ImageAvailabilityIndexSummary;
  }> = {},
): Promise<CorpusSearchResponse> {
  const result = await searchPaperQuestionTreesByUuids(collectionId, input);
  const matches = options.candidateQuestionKeys
    ? result.matches.filter((match) =>
        options.candidateQuestionKeys?.has(
          corpusQuestionLocationKey(
            match.relativePath,
            match.sectionIndex,
            match.questionIndex,
          ),
        ),
      )
    : result.matches;
  const excludedUuidCount = result.matches
    .filter((match) => !matches.includes(match))
    .reduce((count, match) => count + match.matchingNodeIds.length, 0);
  const { pdfs, questions } = await loadCorpusQuestions(
    collectionId,
    matches,
    1,
  );
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
      excludedUuidCount,
      imageAvailability: options.imageAvailability,
      imageIndex: options.imageIndex,
      missingUuids: result.missingUuids,
      mode: 'uuid',
      uuidInput: input,
      uuidRequestCount: result.requestedUuids.length,
    },
    pdfs,
  );
}

type ImageAvailabilityCursor = Readonly<{
  builtAt: string;
  offset: number;
  version: 1;
}>;

function imageAvailabilityCursor(
  index: ImageAvailabilityIndex,
  offset: number,
): string {
  return Buffer.from(
    JSON.stringify({ builtAt: index.summary.builtAt, offset, version: 1 }),
    'utf8',
  ).toString('base64url');
}

function imageAvailabilityOffset(
  index: ImageAvailabilityIndex,
  cursor: string | undefined,
): number {
  if (!cursor) return 0;
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<ImageAvailabilityCursor>;
    if (
      parsed.version !== 1 ||
      parsed.builtAt !== index.summary.builtAt ||
      !Number.isSafeInteger(parsed.offset) ||
      (parsed.offset ?? -1) < 0
    ) {
      throw new Error('Invalid cursor.');
    }
    return parsed.offset as number;
  } catch {
    throw new PaperContentSearchError(
      'The search page cursor is invalid for this image index.',
    );
  }
}

export async function searchCanonicalQuestionCorpusByImageAvailability(
  collectionId: PaperCollectionId,
  index: ImageAvailabilityIndex,
  options: Readonly<{
    cursor?: string;
    limit: CorpusSearchLimit;
  }>,
): Promise<CorpusSearchResponse> {
  const offset = imageAvailabilityOffset(index, options.cursor);
  const matches = index.matches.slice(offset, offset + options.limit);
  const startPosition = matches.length ? offset + 1 : 0;
  const endPosition = offset + matches.length;
  const { pdfs, questions } = await loadCorpusQuestions(
    collectionId,
    matches,
    startPosition,
  );
  return corpusResponse(
    corpusPaper(collectionId, questions, 'V2 image results'),
    {
      endPosition,
      invalidFileCount: index.summary.invalidFileCount,
      limit: options.limit,
      ...(offset + matches.length < index.matches.length
        ? {
            nextCursor: imageAvailabilityCursor(index, offset + matches.length),
          }
        : {}),
      ...(offset > 0
        ? {
            previousCursor: imageAvailabilityCursor(
              index,
              Math.max(0, offset - options.limit),
            ),
          }
        : {}),
      scannedFileCount: index.summary.scannedFileCount,
      startPosition,
    },
    {
      imageAvailability: 'v2',
      imageIndex: index.summary,
      mode: 'content',
    },
    pdfs,
  );
}
