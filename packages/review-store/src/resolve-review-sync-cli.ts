import { pathToFileURL } from "node:url";

import { resolveReviewSyncRequestJson } from "./review-sync-resolution.ts";
import { openReviewSyncReader } from "./review-store.ts";

async function readStandardInput(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function runReviewSyncResolutionCli(): Promise<number> {
  let reader: ReturnType<typeof openReviewSyncReader> | undefined;
  try {
    const input = await readStandardInput();
    const configuredDatabasePath =
      process.env.RTQ_REVIEW_STORE_DATABASE_PATH?.trim();
    reader = openReviewSyncReader(
      configuredDatabasePath
        ? { databasePath: configuredDatabasePath }
        : undefined,
    );
    process.stdout.write(resolveReviewSyncRequestJson(input, reader));
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    process.stderr.write(`Review sync resolution failed: ${message}\n`);
    return 1;
  } finally {
    reader?.close();
  }
}

const invokedPath = process.argv[1];
if (invokedPath && pathToFileURL(invokedPath).href === import.meta.url) {
  process.exitCode = await runReviewSyncResolutionCli();
}
