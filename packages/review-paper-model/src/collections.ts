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
  allTagsToml: {
    description: 'Papers grouped across all dimensional tags',
    label: 'All Tags Papers',
  },
  focusRagToml: {
    description: 'Focus-group RAG/status variants',
    label: 'Focus RAG Papers',
  },
  focusRagTopicToml: {
    description: 'Focus-group topic RAG/status variants',
    label: 'Focus RAG Topic Papers',
  },
  focusToml: {
    description: 'Focus-group derived papers',
    label: 'Focus Papers',
  },
  focusTopicToml: {
    description: 'Focus-group topic-derived papers',
    label: 'Focus Topic Papers',
  },
  ragToml: {
    description: 'Per-paper RAG/status variants',
    label: 'RAG Papers',
  },
  ragTopicToml: {
    description: 'Topic-grouped RAG/status variants',
    label: 'RAG Topic Papers',
  },
  toml: {
    description: 'Canonical paper source-of-truth',
    label: 'Papers',
  },
  topicToml: {
    description: 'Topic-grouped derived papers',
    label: 'Topic Papers',
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
    };
  }

  const copy = COLLECTION_COPY[value as RegisteredPaperCollectionId];

  return {
    ...copy,
    directory: value,
    generated: value !== 'toml',
    id: value,
    readOnly: true,
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
