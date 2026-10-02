import { readdir } from 'node:fs/promises';

import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import {
  REVIEWABLE_COLLECTION_IDS,
  type ExemplarPaperCollectionId,
  type PaperCollection,
  type PaperCollectionId,
  type RegisteredPaperCollectionId,
} from './model.ts';

const COLLECTION_COPY: Record<
  RegisteredPaperCollectionId,
  Readonly<{ description: string; label: string }>
> = {
  corpusAllTopicsToml: {
    description: 'Corpus questions grouped across every active tag',
    label: 'Corpus All Topics',
  },
  corpusAnswerRagToml: {
    description: 'Corpus questions grouped by answer RAG',
    label: 'Corpus Answer RAG',
  },
  corpusAnswerImageReviewRagToml: {
    description:
      'Corpus PRCR and PRCC questions grouped by answer-image RAG and review outcome',
    label: 'Corpus Answer Image Review RAG',
  },
  corpusAnswerReviewRagToml: {
    description:
      'Corpus PRCR and PRCC questions grouped by answer RAG and review outcome',
    label: 'Corpus Answer Review RAG',
  },
  corpusPrimaryTopicAnswerRagToml: {
    description: 'Corpus questions grouped by primary topic and answer RAG',
    label: 'Corpus Primary Topic Answer RAG',
  },
  corpusPrimaryTopicToml: {
    description: 'Corpus questions grouped by primary topic',
    label: 'Corpus Primary Topic',
  },
  corpusQuestionRagToml: {
    description: 'Corpus questions grouped by question RAG',
    label: 'Corpus Question RAG',
  },
  corpusQuestionImageReviewRagToml: {
    description:
      'Corpus PRCR and PRCC questions grouped by question-image RAG and review outcome',
    label: 'Corpus Question Image Review RAG',
  },
  corpusQuestionReviewRagToml: {
    description:
      'Corpus PRCR and PRCC questions grouped by question RAG and review outcome',
    label: 'Corpus Question Review RAG',
  },
  focusCorpusAnswerRagToml: {
    description: 'Focused corpus questions grouped by answer RAG',
    label: 'Focus Corpus Answer RAG',
  },
  focusCorpusAnswerImageRagToml: {
    description: 'Focused corpus questions grouped by answer-image RAG',
    label: 'Focus Corpus Answer Image RAG',
  },
  focusCorpusAnswerImageReviewRagToml: {
    description:
      'Focused PRCR and PRCC questions grouped by answer-image RAG and review outcome',
    label: 'Focus Corpus Answer Image Review RAG',
  },
  focusCorpusAnswerReviewRagToml: {
    description:
      'Focused PRCR and PRCC questions grouped by answer RAG and review outcome',
    label: 'Focus Corpus Answer Review RAG',
  },
  focusCorpusPrimaryTopicAnswerRagToml: {
    description:
      'Focused corpus questions grouped by primary topic and answer RAG',
    label: 'Focus Corpus Primary Topic Answer RAG',
  },
  focusCorpusPrimaryTopicToml: {
    description: 'Focused corpus questions grouped by primary topic',
    label: 'Focus Corpus Primary Topic',
  },
  focusCorpusQuestionRagToml: {
    description: 'Focused corpus questions grouped by question RAG',
    label: 'Focus Corpus Question RAG',
  },
  focusCorpusQuestionImageRagToml: {
    description: 'Focused corpus questions grouped by question-image RAG',
    label: 'Focus Corpus Question Image RAG',
  },
  focusCorpusQuestionImageReviewRagToml: {
    description:
      'Focused PRCR and PRCC questions grouped by question-image RAG and review outcome',
    label: 'Focus Corpus Question Image Review RAG',
  },
  focusCorpusQuestionReviewRagToml: {
    description:
      'Focused PRCR and PRCC questions grouped by question RAG and review outcome',
    label: 'Focus Corpus Question Review RAG',
  },
  focusPaperAnswerRagToml: {
    description: 'Focused papers split independently by answer RAG',
    label: 'Focus Paper Answer RAG',
  },
  focusPaperToml: {
    description: 'Complete copies of focused papers',
    label: 'Focus Papers',
  },
  paperAnswerRagToml: {
    description: 'Papers split independently by answer RAG',
    label: 'Paper Answer RAG',
  },
  toml: {
    description: 'Canonical paper source-of-truth',
    label: 'Papers',
  },
};

const exemplarCollectionPattern = /^exemplarsLevel(\d+)Toml$/;

export function exemplarLevelFromCollectionId(
  value: string,
): number | undefined {
  const match = exemplarCollectionPattern.exec(value);

  if (!match) {
    return undefined;
  }

  const level = Number.parseInt(match[1], 10);
  return Number.isSafeInteger(level) ? level : undefined;
}

export function isExemplarPaperCollectionId(
  value: string,
): value is ExemplarPaperCollectionId {
  return exemplarLevelFromCollectionId(value) !== undefined;
}

export function isPaperCollectionId(value: string): value is PaperCollectionId {
  return (
    (REVIEWABLE_COLLECTION_IDS as readonly string[]).includes(value) ||
    isExemplarPaperCollectionId(value)
  );
}

export function paperCollectionForId(value: string): PaperCollection {
  if (!isPaperCollectionId(value)) {
    throw new Error('Unsupported paper collection.');
  }

  const exemplarLevel = exemplarLevelFromCollectionId(value);

  if (exemplarLevel !== undefined) {
    return {
      description: `Read-only exemplar papers for access tier ${exemplarLevel}`,
      directory: value,
      exemplarLevel,
      generated: true,
      id: value,
      label: `Exemplars Level ${exemplarLevel}`,
      readOnly: true,
      supportsOriginalPdf: false,
    };
  }

  const copy = COLLECTION_COPY[value as RegisteredPaperCollectionId];

  return {
    ...copy,
    directory: value,
    generated: value !== 'toml',
    id: value,
    readOnly: true,
    supportsOriginalPdf: value === 'toml' || value === 'focusPaperToml',
  };
}

export async function listPaperCollections(
  options: ResolveRtqContentOptions = {},
): Promise<readonly PaperCollection[]> {
  const { papersRoot } = resolveRtqContentPaths(options);
  const entries = await readdir(papersRoot, { withFileTypes: true });
  const directoryNames = new Set(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name),
  );
  const registered = REVIEWABLE_COLLECTION_IDS.filter((id) =>
    directoryNames.has(id),
  ).map(paperCollectionForId);
  const exemplars = [...directoryNames]
    .filter(isExemplarPaperCollectionId)
    .sort((left, right) => {
      const leftLevel = exemplarLevelFromCollectionId(left) ?? 0;
      const rightLevel = exemplarLevelFromCollectionId(right) ?? 0;
      return leftLevel - rightLevel;
    })
    .map(paperCollectionForId);

  return [...registered, ...exemplars];
}
