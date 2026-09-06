import { realpathSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import { isPaperCollectionId } from './collections.ts';

const windowsAbsolutePathPattern = /^[a-z]:[\\/]/i;

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function assertSimpleDirectoryName(value: string): void {
  if (
    !value ||
    value.includes('\0') ||
    value.includes('/') ||
    value.includes('\\') ||
    value === '.' ||
    value === '..' ||
    isAbsolute(value) ||
    windowsAbsolutePathPattern.test(value)
  ) {
    throw new Error(
      'Paper collection must be a single relative directory name.',
    );
  }

  if (!isPaperCollectionId(value)) {
    throw new Error('Unsupported paper collection.');
  }
}

function assertSafeRelativePath(value: string): void {
  const segments = value.split(/[\\/]/);

  if (
    !value ||
    value.includes('\0') ||
    isAbsolute(value) ||
    windowsAbsolutePathPattern.test(value) ||
    segments.some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new Error('Paper source must be a safe repository-relative path.');
  }
}

function assertContained(root: string, candidate: string): void {
  const pathFromRoot = relative(root, candidate);

  if (
    pathFromRoot === '..' ||
    pathFromRoot.startsWith(`..${sep}`) ||
    isAbsolute(pathFromRoot)
  ) {
    throw new Error('Resolved paper path escapes the validated papers root.');
  }
}

export function resolvePaperCollectionRoot(
  collectionDirectory: string,
  options: ResolveRtqContentOptions = {},
): string {
  assertSimpleDirectoryName(collectionDirectory);

  const { papersRoot } = resolveRtqContentPaths(options);
  const canonicalPapersRoot = realpathSync(papersRoot);
  const candidate = resolve(canonicalPapersRoot, collectionDirectory);
  assertContained(canonicalPapersRoot, candidate);

  if (!isDirectory(candidate)) {
    throw new Error('Requested paper collection is unavailable.');
  }

  const canonicalCollectionRoot = realpathSync(candidate);
  assertContained(canonicalPapersRoot, canonicalCollectionRoot);
  return canonicalCollectionRoot;
}

export function resolvePaperSourcePath(
  collectionDirectory: string,
  sourceRelativePath: string,
  options: ResolveRtqContentOptions = {},
): string {
  assertSafeRelativePath(sourceRelativePath);
  if (extname(sourceRelativePath).toLowerCase() !== '.toml') {
    throw new Error('Paper source must be a TOML file.');
  }

  const collectionRoot = resolvePaperCollectionRoot(
    collectionDirectory,
    options,
  );
  const candidate = resolve(collectionRoot, sourceRelativePath);
  assertContained(collectionRoot, candidate);

  if (!isFile(candidate)) {
    throw new Error('Requested paper source is unavailable.');
  }

  const canonicalSourcePath = realpathSync(candidate);
  assertContained(collectionRoot, canonicalSourcePath);
  return canonicalSourcePath;
}
