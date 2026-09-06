import path from 'node:path';

import {
  REVIEW_WORKSPACE_ROOT,
  resolveRtqContentPaths,
} from '@rtq/review-repository-paths';

import type { FolderKey, RegisteredFolderKey } from '@/lib/paper-types';

import {
  EDITABLE_FOLDER_ORDER,
  FOLDER_ORDER,
  compareFolderKeys,
  folderLabel,
  isEditableFolderKey,
  isExemplarFolderKey,
  isFolderKey,
  isReadOnlyFolder,
} from './paper-folder-metadata.ts';

export {
  EDITABLE_FOLDER_ORDER,
  FOLDER_ORDER,
  compareFolderKeys,
  folderLabel,
  isEditableFolderKey,
  isExemplarFolderKey,
  isFolderKey,
  isReadOnlyFolder,
};

const contentPaths = resolveRtqContentPaths();

export const REPO_ROOT = REVIEW_WORKSPACE_ROOT;
export const SOURCE_PAPERS_PACKAGE_ROOT = contentPaths.papersPackageRoot;
export const SOURCE_PAPERS_ROOT = contentPaths.papersRoot;
export const DIMENSIONAL_MAPPING_PATH = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'docs/ai/tags/dimensional-tags/dimensional-tag-mapping.json',
);
export const DIMENSIONAL_STYLE_GUIDES_ROOT = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'docs/ai/answers/dimensional-style-guides',
);
export const MACROS_TOML_PATH = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'scripts/papers/lib/model/macros.toml',
);
export const EXTERNAL_ASSETS_ROOT = contentPaths.assetsRoot;

export const SOURCE_FOLDERS: Record<
  RegisteredFolderKey,
  {
    absolutePath: string;
    description: string;
    label: string;
  }
> = {
  allTagsToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'allTagsToml'),
    description: 'Papers grouped across all dimensional tags',
    label: 'All Tags Papers',
  },
  focusToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusToml'),
    description: 'Focus-group derived papers',
    label: 'Focus Papers',
  },
  focusTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusTopicToml'),
    description: 'Focus-group topic-derived papers',
    label: 'Focus Topic Papers',
  },
  focusRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusRagToml'),
    description: 'Focus-group RAG/status variants',
    label: 'Focus RAG Papers',
  },
  focusRagTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusRagTopicToml'),
    description: 'Focus-group topic RAG/status variants',
    label: 'Focus RAG Topic Papers',
  },
  ragToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'ragToml'),
    description: 'Per-paper RAG/status variants',
    label: 'RAG Papers',
  },
  ragTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'ragTopicToml'),
    description: 'Topic-grouped RAG/status variants',
    label: 'RAG Topic Papers',
  },
  toml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'toml'),
    description: 'Canonical paper source-of-truth',
    label: 'Papers',
  },
  topicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'topicToml'),
    description: 'Topic-grouped derived papers',
    label: 'Topic Papers',
  },
};

export function resolveFolderPath(folderKey: FolderKey) {
  if (isExemplarFolderKey(folderKey)) {
    return path.join(SOURCE_PAPERS_ROOT, folderKey);
  }

  return SOURCE_FOLDERS[folderKey as RegisteredFolderKey].absolutePath;
}

export function resolvePaperFilePath(
  folderKey: FolderKey,
  relativePath: string,
) {
  const folderRoot = resolveFolderPath(folderKey);
  const portablePath = relativePath.replace(/\\/g, '/');
  const absolutePath = path.resolve(folderRoot, ...portablePath.split('/'));
  const relativeToFolder = path.relative(folderRoot, absolutePath);

  if (
    !portablePath ||
    path.isAbsolute(relativePath) ||
    !portablePath.toLowerCase().endsWith('.toml') ||
    relativeToFolder === '' ||
    relativeToFolder.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToFolder)
  ) {
    throw new Error(
      'Paper path must resolve to a TOML file inside its folder.',
    );
  }

  return absolutePath;
}

export function relativePaperSlug(fileName: string) {
  return fileName.replace(/\.toml$/i, '');
}

export function buildFileHref(folderKey: FolderKey, slugSegments: string[]) {
  return `/files/${folderKey}/${slugSegments.map(encodeURIComponent).join('/')}`;
}

export function buildSlugSegments(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/').replace(/\.toml$/i, '');
  return normalized.split('/').filter(Boolean);
}

export function buildRelativePathFromSlug(slugSegments: string[]) {
  return `${slugSegments.join('/')}.toml`;
}
