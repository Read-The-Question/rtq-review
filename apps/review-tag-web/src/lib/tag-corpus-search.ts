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
import { resolvePaperPdfByStem } from './paper-pdf-reader.ts';
import type { PaperPdfOption } from './paper-pdf.ts';
import type { PaperDocument, PaperNode } from './paper-types.ts';
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

function fileStem(fileName: string): string | undefined {
  return fileName.toLowerCase().endsWith('.toml')
    ? fileName.slice(0, -'.toml'.length)
    : undefined;
}

function questionSourceStems(node: PaperNode): readonly string[] {
  const stems = new Set<string>();
  const visit = (current: PaperNode) => {
    if (current.originalSource?.paperStem) {
      stems.add(current.originalSource.paperStem);
    }
    current.children.forEach(visit);
  };
  visit(node);
  return [...stems];
}

async function resolveCorpusPdfOptions(
  matches: readonly CorpusQuestionContentSearchMatch[],
  papers: ReadonlyMap<string, PaperDocument>,
): Promise<readonly PaperPdfOption[]> {
  const candidates = new Map<string, { label: string; matchCount: number }>();

  matches.forEach(match => {
    const paper = papers.get(match.relativePath);
    const question =
      paper?.sections[match.sectionIndex]?.questions[match.questionIndex];
    if (!paper || !question) return;

    const directStem = fileStem(paper.fileName);
    const sourceStems = questionSourceStems(question);
    const stems = sourceStems.length
      ? sourceStems
      : (paper.folderKey === 'toml' || paper.folderKey === 'focusPaperToml') &&
          directStem
        ? [directStem]
        : [];

    new Set(stems).forEach(stem => {
      const current = candidates.get(stem);
      candidates.set(stem, {
        label: directStem === stem && paper.title ? paper.title : stem,
        matchCount: (current?.matchCount ?? 0) + 1,
      });
    });
  });

  return Promise.all(
    [...candidates].map(async ([key, candidate]): Promise<PaperPdfOption> => ({
      key,
      label: candidate.label,
      matchCount: candidate.matchCount,
      pdf: await resolvePaperPdfByStem(key),
    })),
  );
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
  const document = buildTagCorpusDocument(
    collectionId,
    page.matches,
    papers,
    page.startPosition,
  );
  const pdfs = await resolveCorpusPdfOptions(page.matches, papers);

  return {
    ...page,
    document,
    pdfs,
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
  const document = buildTagCorpusDocument(
    collectionId,
    response.matches,
    papers,
    response.matches.length ? 1 : 0,
  );
  const pdfs = await resolveCorpusPdfOptions(response.matches, papers);

  return {
    ...response,
    document,
    pdfs,
  };
}
