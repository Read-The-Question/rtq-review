import { createHash, randomUUID } from 'node:crypto';
import { open, rename, stat, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const writeQueues = new Map<string, Promise<void>>();

export function paperSourceVersion(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export async function atomicWritePaperSource(
  sourcePath: string,
  value: string,
): Promise<void> {
  const sourceStat = await stat(sourcePath);
  const temporaryPath = join(
    dirname(sourcePath),
    `.${randomUUID()}.rtq-review-edit.tmp`,
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

export async function withPaperSourceWriteQueue<T>(
  sourcePath: string,
  operation: () => Promise<T>,
): Promise<T> {
  const preceding = writeQueues.get(sourcePath) ?? Promise.resolve();
  let release!: () => void;
  const turn = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queue = preceding.catch(() => undefined).then(() => turn);
  writeQueues.set(sourcePath, queue);
  await preceding.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (writeQueues.get(sourcePath) === queue) writeQueues.delete(sourcePath);
  }
}
