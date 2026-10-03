import type { CorpusQuestionContentSearchMatch } from '@rtq/review-paper-model';

import type {
  FolderKey,
  PaperDocument,
  PaperNode,
  PaperNodeSource,
  PaperSection,
} from './paper-types.ts';

function projectNode(
  node: PaperNode,
  prefix: string,
  source: Omit<PaperNodeSource, 'nodePath'>,
): PaperNode {
  return {
    ...node,
    children: node.children.map(child => projectNode(child, prefix, source)),
    imageOccurrences: node.imageOccurrences.map(occurrence => ({
      ...occurrence,
      id: `${prefix}:${occurrence.id}`,
    })),
    path: `${prefix}.${node.path}`,
    source: {
      ...source,
      nodePath: node.path,
    },
  };
}

function sourceForMatch(
  folderKey: FolderKey,
  document: PaperDocument,
  match: CorpusQuestionContentSearchMatch,
  resultKey: string,
): Omit<PaperNodeSource, 'nodePath'> {
  return {
    fileName: document.fileName,
    folderKey,
    paperTitle: document.title,
    questionIndex: match.questionIndex,
    relativePath: document.relativePath,
    resultKey,
    sectionIndex: match.sectionIndex,
    versionHash: document.versionHash,
  };
}

function flattenNodes(nodes: readonly PaperNode[]): PaperNode[] {
  return nodes.flatMap(node => [node, ...flattenNodes(node.children)]);
}

function finalizeDocument(document: PaperDocument): PaperDocument {
  const nodesFlat = flattenNodes(
    document.sections.flatMap(section => section.questions),
  );
  return {
    ...document,
    imageOccurrences: nodesFlat.flatMap(node => node.imageOccurrences),
    nodesFlat,
  };
}

export function buildTagCorpusDocument(
  folderKey: FolderKey,
  matches: readonly CorpusQuestionContentSearchMatch[],
  documents: ReadonlyMap<string, PaperDocument>,
  startPosition: number,
): PaperDocument {
  const sectionIndexes = new Map<string, number>();
  const sections: PaperSection[] = [];

  for (const [matchIndex, match] of matches.entries()) {
    const document = documents.get(match.relativePath);
    const question =
      document?.sections[match.sectionIndex]?.questions[match.questionIndex];
    if (!document || !question) {
      throw new Error(
        `The Tag Review search result changed while reading ${match.relativePath}.`,
      );
    }

    let corpusSectionIndex = sectionIndexes.get(match.relativePath);
    if (corpusSectionIndex === undefined) {
      corpusSectionIndex = sections.length;
      sectionIndexes.set(match.relativePath, corpusSectionIndex);
      sections.push({
        index: corpusSectionIndex,
        name: document.title,
        path: `corpus-paper-${corpusSectionIndex}`,
        questions: [],
      });
    }

    const resultPosition = startPosition + matchIndex;
    const resultKey = `result-${resultPosition}`;
    sections[corpusSectionIndex].questions.push(
      projectNode(
        question,
        resultKey,
        sourceForMatch(folderKey, document, match, resultKey),
      ),
    );
  }

  return finalizeDocument({
    corpus: { kind: 'search' },
    fileName: 'tag-corpus-search',
    folderKey,
    imageOccurrences: [],
    meta: {
      accessTier: null,
      paperId: null,
      schoolId: null,
      year: null,
    },
    nodesFlat: [],
    questionCount: matches.length,
    relativePath: 'tag-corpus-search',
    sections,
    slugSegments: [],
    title: 'Tag search results',
    versionHash: sections
      .flatMap(section => section.questions)
      .map(question => question.source?.versionHash ?? '')
      .join(':'),
  });
}

export function mergeTagCorpusSourceDocument(
  corpusDocument: PaperDocument,
  sourceDocument: PaperDocument,
): PaperDocument {
  if (!corpusDocument.corpus) {
    return sourceDocument;
  }

  let changed = false;
  const sections = corpusDocument.sections.map(section => {
    const questions = section.questions.map(question => {
      const source = question.source;
      if (
        !source ||
        source.folderKey !== sourceDocument.folderKey ||
        source.relativePath !== sourceDocument.relativePath
      ) {
        return question;
      }

      const sourceQuestion =
        sourceDocument.sections[source.sectionIndex]?.questions[
          source.questionIndex
        ];
      if (!sourceQuestion) {
        throw new Error(
          `The source question ${source.nodePath} is no longer available.`,
        );
      }

      changed = true;
      return projectNode(sourceQuestion, source.resultKey, {
        ...source,
        fileName: sourceDocument.fileName,
        versionHash: sourceDocument.versionHash,
      });
    });

    return {
      ...section,
      questions,
    };
  });

  if (!changed) {
    return corpusDocument;
  }

  return finalizeDocument({
    ...corpusDocument,
    sections,
  });
}
