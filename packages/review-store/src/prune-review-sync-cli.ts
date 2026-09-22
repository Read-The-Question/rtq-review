import { pathToFileURL } from "node:url";

import { pruneReviewSyncRequestJson } from "./review-sync-pruning.ts";
import { openReviewStore } from "./review-store.ts";

async function readStandardInput(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function runReviewSyncPruneCli(): Promise<number> {
  let store: ReturnType<typeof openReviewStore> | undefined;
  try {
    const input = await readStandardInput();
    const configuredDatabasePath =
      process.env.RTQ_REVIEW_STORE_DATABASE_PATH?.trim();
    store = openReviewStore(
      configuredDatabasePath
        ? { databasePath: configuredDatabasePath }
        : undefined,
    );
    process.stdout.write(pruneReviewSyncRequestJson(input, store.maintenance));
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    process.stderr.write(`Review sync pruning failed: ${message}\n`);
    return 1;
  } finally {
    store?.close();
  }
}

const invokedPath = process.argv[1];
if (invokedPath && pathToFileURL(invokedPath).href === import.meta.url) {
  process.exitCode = await runReviewSyncPruneCli();
}
