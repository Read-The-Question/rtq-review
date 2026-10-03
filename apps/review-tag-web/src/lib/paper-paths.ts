import path from 'node:path';

import {
  REVIEW_WORKSPACE_ROOT,
  resolveRtqContentPaths,
} from '@rtq/review-repository-paths';

import type { FolderKey } from '@/lib/paper-types';

import {
  EDITABLE_FOLDER_ORDER,
  isEditableFolderKey,
  isExemplarFolderKey,
  isFolderKey,
  isReadOnlyFolder,
} from './paper-folder-metadata.ts';

export {
  EDITABLE_FOLDER_ORDER,
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
  'macros/content/expansions.toml',
);
export const EXTERNAL_ASSETS_ROOT = contentPaths.assetsRoot;
export const IMAGE_DIMENSIONAL_TAG_CATALOG_PATH = path.join(
  contentPaths.assetsPackageRoot,
  'docs/architecture/image-dimensional-tags.json',
);

export function resolveFolderPath(folderKey: FolderKey) {
  return path.join(SOURCE_PAPERS_ROOT, folderKey);
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

export function buildSlugSegments(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/').replace(/\.toml$/i, '');
  return normalized.split('/').filter(Boolean);
}
