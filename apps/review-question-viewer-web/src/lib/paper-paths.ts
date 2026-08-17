import path from 'node:path';

import {
  REVIEW_WORKSPACE_ROOT,
  resolveRtqContentPaths,
} from '@rtq/review-repository-paths';

const contentPaths = resolveRtqContentPaths();

export const REPO_ROOT = REVIEW_WORKSPACE_ROOT;
export const SOURCE_PAPERS_PACKAGE_ROOT = contentPaths.papersPackageRoot;
export const SOURCE_PAPERS_ROOT = contentPaths.papersRoot;
export const MACROS_TOML_PATH = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'scripts/papers/lib/model/macros.toml',
);
export const EXTERNAL_ASSETS_ROOT = contentPaths.assetsRoot;

export function normalizePaperRelativePath(relativePathFromPapers: string) {
  return relativePathFromPapers.replace(/\\/g, '/').replace(/^\/+/, '');
}

export function resolvePaperFile(relativePathFromPapers: string) {
  const normalized = normalizePaperRelativePath(relativePathFromPapers);

  if (!normalized || normalized.includes('\0')) {
    throw new Error('A paper-relative TOML path is required.');
  }

  if (path.isAbsolute(normalized)) {
    throw new Error('Use a path relative to the @rtq/papers papers directory.');
  }

  if (!normalized.toLowerCase().endsWith('.toml')) {
    throw new Error('The target file must be a TOML file.');
  }

  const absolutePath = path.resolve(SOURCE_PAPERS_ROOT, normalized);
  const relativeToPapers = path.relative(SOURCE_PAPERS_ROOT, absolutePath);

  if (
    relativeToPapers.startsWith('..') ||
    path.isAbsolute(relativeToPapers) ||
    relativeToPapers === ''
  ) {
    throw new Error(
      'The target file must stay inside the @rtq/papers papers directory.',
    );
  }

  return {
    absolutePath,
    normalized,
  };
}

export function fileStemFromPaperPath(relativePathFromPapers: string) {
  return path.basename(
    relativePathFromPapers,
    path.extname(relativePathFromPapers),
  );
}

export function titleFromPaperPath(relativePathFromPapers: string) {
  return fileStemFromPaperPath(relativePathFromPapers)
    .replace(/--/g, ' / ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
