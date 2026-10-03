import {
  type ContentSearchQuery,
  type CorpusQuestionContentSearchMatch,
  type PaperCollectionId,
  readReviewPaper,
  searchPaperQuestionTrees,
  searchPaperQuestionTreesByUuids,
} from '@rtq/review-paper-model';
import type { ResolveRtqContentOptions } from '@rtq/review-repository-paths';
import 'server-only';

import { readPaperDocument } from './paper-data.ts';
import { buildTagCorpusDocument } from './tag-corpus-document.ts';

async function loadMatchingPapers(
  collectionId: PaperCollectionId,
  matches: readonly CorpusQuestionContentSearchMatch[],
) {
  const paths = [...new Set(matches.map(match => match.relativePath))];
  const entries = await Promise.all(
    paths.map(async relativePath => {
      const [document, paper] = await Promise.all([
        readPaperDocument(collectionId, relativePath),
        readReviewPaper(collectionId, relativePath),
      ]);
      return [
        relativePath,
        {
          ...document,
          title: paper.source.title,
        },
      ] as const;
    }),
  );
  return new Map(entries);
}

export async function searchTagCorpusContent(
  collectionId: PaperCollectionId,
  query: ContentSearchQuery,
  searchOptions: Readonly<{ cursor?: string; limit: number }>,
  options: ResolveRtqContentOptions = {},
) {
  const page = await searchPaperQuestionTrees(
    collectionId,
    query,
    searchOptions,
    options,
  );
  const papers = await loadMatchingPapers(collectionId, page.matches);

  return {
    ...page,
    document: buildTagCorpusDocument(
      collectionId,
      page.matches,
      papers,
      page.startPosition,
    ),
  };
}

export async function searchTagCorpusUuids(
  collectionId: PaperCollectionId,
  input: string,
  options: ResolveRtqContentOptions = {},
) {
  const response = await searchPaperQuestionTreesByUuids(
    collectionId,
    input,
    options,
  );
  const papers = await loadMatchingPapers(collectionId, response.matches);

  return {
    ...response,
    document: buildTagCorpusDocument(
      collectionId,
      response.matches,
      papers,
      response.matches.length ? 1 : 0,
    ),
  };
}
