import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { ReviewCommentRequestError } from "./errors.ts";
import {
  resolveReviewCommentRequest,
  resolveReviewCommentRequestJson,
} from "./review-comment-resolution.ts";
import { openReviewCommentReader, openReviewStore } from "./review-store.ts";
import type { ReviewCommentTarget } from "./types.ts";

function target(
  uuid: string,
  side: "answer" | "question",
  ragState: string,
): ReviewCommentTarget {
  return { ragState, side, uuid };
}

test("serializes an empty request as a stable named-field contract", () => {
  assert.equal(
    resolveReviewCommentRequestJson(
      JSON.stringify({ schemaVersion: 1, targets: [] }),
      { resolve: () => [] },
    ),
    '{"schemaVersion":1,"matches":[]}\n',
  );
});

test("resolves exact UUID, side, and state without paper-projection identity", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "rtq-comment-resolver-"));
  const databasePath = path.join(directory, "review.sqlite");
  const times = [
    new Date("2026-09-14T09:00:00.000Z"),
    new Date("2026-09-14T09:01:00.000Z"),
    new Date("2026-09-14T09:02:00.000Z"),
    new Date("2026-09-14T09:03:00.000Z"),
  ];
  let time = 0;
  const store = openReviewStore({
    databasePath,
    now: () => times[Math.min(time++, times.length - 1)],
  });
  const selected = target("uuid-1", "answer", "rag_wf_ng3");
  store.comments.append({
    ...selected,
    comment: "First comment",
    reviewer: "ap",
    submissionId: "submission-1",
  });
  store.comments.append({
    ...selected,
    comment: "Second comment",
    reviewer: "ap",
    submissionId: "submission-2",
  });
  store.comments.append({
    ...selected,
    comment: "Previous state",
    ragState: "rag_wf_ng2",
    reviewer: "ap",
    submissionId: "submission-3",
  });
  store.comments.append({
    ...selected,
    comment: "Question side",
    side: "question",
    reviewer: "ap",
    submissionId: "submission-4",
  });
  store.close();

  const reader = openReviewCommentReader({ databasePath });
  const response = resolveReviewCommentRequest(
    {
      schemaVersion: 1,
      targets: [
        { ...selected, questionId: null },
        { ...selected, questionId: "source-paper:1:1" },
      ],
    },
    reader,
  );
  assert.deepEqual(
    response.matches.map(({ comment, ragState, side, uuid }) => ({
      comment,
      ragState,
      side,
      uuid,
    })),
    [
      { ...selected, comment: "First comment" },
      { ...selected, comment: "Second comment" },
    ],
  );
  reader.close();
  rmSync(directory, { force: true, recursive: true });
});

test("rejects malformed requests with the precise input location", () => {
  const reader = { resolve: () => [] };
  assert.throws(
    () => resolveReviewCommentRequestJson("not-json", reader),
    (error: unknown) =>
      error instanceof ReviewCommentRequestError &&
      error.message === "Input must be valid JSON.",
  );
  assert.throws(
    () =>
      resolveReviewCommentRequest(
        {
          schemaVersion: 1,
          targets: [{ ragState: "rag_wf_ng3", side: "answer", uuid: "" }],
        },
        reader,
      ),
    (error: unknown) =>
      error instanceof ReviewCommentRequestError &&
      error.message.includes("targets[0].uuid"),
  );
  assert.throws(
    () =>
      resolveReviewCommentRequest({ schemaVersion: 2, targets: [] }, reader),
    ReviewCommentRequestError,
  );
});
