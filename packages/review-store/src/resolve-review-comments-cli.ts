import { pathToFileURL } from "node:url";

import { resolveReviewCommentRequestJson } from "./review-comment-resolution.ts";
import { openReviewCommentReader } from "./review-store.ts";

async function readStandardInput(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function runReviewCommentResolutionCli(): Promise<number> {
  let reader: ReturnType<typeof openReviewCommentReader> | undefined;
  try {
    const input = await readStandardInput();
    const configuredDatabasePath =
      process.env.RTQ_REVIEW_STORE_DATABASE_PATH?.trim();
    reader = openReviewCommentReader(
      configuredDatabasePath
        ? { databasePath: configuredDatabasePath }
        : undefined,
    );
    process.stdout.write(resolveReviewCommentRequestJson(input, reader));
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    process.stderr.write(`Review comment resolution failed: ${message}\n`);
    return 1;
  } finally {
    reader?.close();
  }
}

const invokedPath = process.argv[1];
if (invokedPath && pathToFileURL(invokedPath).href === import.meta.url) {
  process.exitCode = await runReviewCommentResolutionCli();
}
