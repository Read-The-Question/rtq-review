import 'server-only';

import { createHash, randomUUID } from 'node:crypto';
import { open, readFile, rename, stat, unlink } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

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

const writeQueues = new Map<string, Promise<void>>();

function contentVersion(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
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

async function atomicWrite(sourcePath: string, value: string): Promise<void> {
  const sourceStat = await stat(sourcePath);
  const temporaryPath = join(
    dirname(sourcePath),
    `.${randomUUID()}.rtq-content-edit.tmp`,
  );
  let temporaryCreated = false;
  try {
    const handle = await open(temporaryPath, 'wx', sourceStat.mode);
    temporaryCreated = true;
    try {
      await handle.writeFile(value, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(temporaryPath, sourcePath);
    temporaryCreated = false;
  } finally {
    if (temporaryCreated) await unlink(temporaryPath).catch(() => undefined);
  }
}

async function queued<T>(
  path: string,
  operation: () => Promise<T>,
): Promise<T> {
  const preceding = writeQueues.get(path) ?? Promise.resolve();
  let release!: () => void;
  const turn = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queue = preceding.catch(() => undefined).then(() => turn);
  writeQueues.set(path, queue);
  await preceding.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (writeQueues.get(path) === queue) writeQueues.delete(path);
  }
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
      version: contentVersion(raw),
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
  return queued(sourcePath, async () => {
    const raw = await readFile(sourcePath, 'utf8');
    if (contentVersion(raw) !== input.expectedVersion) {
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
    await atomicWrite(sourcePath, updated);
    invalidateImageAvailabilityIndex(input.target.collectionId);
    return {
      fileName,
      value: input.value,
      version: contentVersion(updated),
    };
  });
}
