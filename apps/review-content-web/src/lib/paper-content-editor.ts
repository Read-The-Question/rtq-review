import 'server-only';

import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import {
  PaperContentFieldSourceError,
  readPaperContentField,
  replacePaperContentField,
  resolvePaperSourcePath,
  type PaperCollectionId,
  type ReviewContentFieldLocator,
} from '@rtq/review-paper-model';
import type { ResolveRtqContentOptions } from '@rtq/review-repository-paths';

import { invalidateImageAvailabilityIndex } from './image-availability-index';
import {
  atomicWritePaperSource,
  paperSourceVersion,
  withPaperSourceWriteQueue,
} from './paper-source-writer';

export type PaperContentFieldTarget = Readonly<{
  collectionId: PaperCollectionId;
  relativePath: string;
  source: ReviewContentFieldLocator;
}>;

export type PaperContentFieldSnapshot = Readonly<{
  fileName: string;
  value: string;
  version: string;
}>;

export class PaperContentEditorError extends Error {
  readonly status: 400 | 404 | 409 | 422;

  constructor(
    message: string,
    status: 400 | 404 | 409 | 422,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'PaperContentEditorError';
    this.status = status;
  }
}

function sourcePathFor(
  target: PaperContentFieldTarget,
  options: ResolveRtqContentOptions,
): Readonly<{ fileName: string; sourcePath: string }> {
  try {
    return {
      fileName: basename(target.relativePath),
      sourcePath: resolvePaperSourcePath(
        target.collectionId,
        target.relativePath,
        options,
      ),
    };
  } catch (error) {
    throw new PaperContentEditorError(
      'The displayed paper source is unavailable.',
      404,
      { cause: error },
    );
  }
}

function mapSourceError(error: unknown): never {
  if (error instanceof PaperContentFieldSourceError) {
    throw new PaperContentEditorError(
      error.message,
      error.code === 'field-not-found' ? 404 : 422,
      { cause: error },
    );
  }
  throw error;
}

export async function loadPaperContentField(
  target: PaperContentFieldTarget,
  options: ResolveRtqContentOptions = {},
): Promise<PaperContentFieldSnapshot> {
  const { fileName, sourcePath } = sourcePathFor(target, options);
  const raw = await readFile(sourcePath, 'utf8');
  try {
    return {
      fileName,
      value: readPaperContentField(raw, target.source),
      version: paperSourceVersion(raw),
    };
  } catch (error) {
    mapSourceError(error);
  }
}

export async function savePaperContentField(
  input: Readonly<{
    expectedVersion: string;
    target: PaperContentFieldTarget;
    value: string;
  }>,
  options: ResolveRtqContentOptions = {},
): Promise<PaperContentFieldSnapshot> {
  const { fileName, sourcePath } = sourcePathFor(input.target, options);
  return withPaperSourceWriteQueue(sourcePath, async () => {
    const raw = await readFile(sourcePath, 'utf8');
    if (paperSourceVersion(raw) !== input.expectedVersion) {
      throw new PaperContentEditorError(
        'The displayed TOML changed after editing began. Reload this field and apply the edit again.',
        409,
      );
    }

    let updated: string;
    try {
      updated = replacePaperContentField(raw, input.target.source, input.value);
    } catch (error) {
      mapSourceError(error);
    }
    await atomicWritePaperSource(sourcePath, updated);
    invalidateImageAvailabilityIndex(input.target.collectionId);
    return {
      fileName,
      value: input.value,
      version: paperSourceVersion(updated),
    };
  });
}
