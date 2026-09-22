import assert from "node:assert/strict";
import test from "node:test";

import { listReviewSyncCandidates } from "./review-sync-candidates.ts";
import { pruneReviewSyncRequest } from "./review-sync-pruning.ts";
import { openReviewStore, openReviewSyncReader } from "./review-store.ts";

test("candidate listing returns only transition outcomes and all image metadata", () => {
  const store = openReviewStore({ databasePath: ":memory:" });
  store.outcomes.set({
    outcome: "PRG",
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "answer",
    uuid: "uuid-transition",
  });
  store.outcomes.set({
    outcome: "PRCR",
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "question",
    uuid: "uuid-retained",
  });
  store.imageMetadata.set({
    ignored: [],
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "question-image",
    types: ["generated"],
    uuid: "uuid-image",
  });

  const result = listReviewSyncCandidates(
    { schemaVersion: 1 },
    {
      imageMetadata: store.imageMetadata,
      outcomes: store.outcomes,
    },
  );

  assert.deepEqual(
    result.outcomes.map(({ outcome, uuid }) => [uuid, outcome]),
    [["uuid-transition", "PRG"]],
  );
  assert.deepEqual(
    result.imageMetadata.map(({ uuid }) => uuid),
    ["uuid-image"],
  );
  store.close();
});

test("pruning removes only stale rows at or before the cutoff", () => {
  let now = "2026-09-01T00:00:00.000Z";
  const store = openReviewStore({
    databasePath: ":memory:",
    now: () => new Date(now),
  });
  store.outcomes.set({
    outcome: "PRCR",
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "question",
    uuid: "uuid-current",
  });
  now = "2026-09-12T00:00:00.000Z";
  store.outcomes.set({
    outcome: "PRCC",
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "answer",
    uuid: "uuid-old-stale",
  });
  store.imageMetadata.set({
    ignored: ["decorative"],
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "question-image",
    types: [],
    uuid: "uuid-old-image",
  });
  now = "2026-09-20T00:00:00.000Z";
  store.outcomes.set({
    outcome: "PRG",
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "answer",
    uuid: "uuid-recent-stale",
  });
  store.imageMetadata.set({
    ignored: [],
    ragState: "rag_wf_ng2",
    reviewer: "up",
    side: "answer-image",
    types: ["screenshot"],
    uuid: "uuid-current",
  });

  const request = {
    apply: false,
    cutoff: "2026-09-12T00:00:00.000Z",
    schemaVersion: 1,
    targets: [
      {
        ragState: "rag_wf_ng2",
        side: "question",
        uuid: "uuid-current",
      },
      {
        ragState: "rag_wf_ng2",
        side: "answer-image",
        uuid: "uuid-current",
      },
    ],
  } as const;
  const preview = pruneReviewSyncRequest(request, store.maintenance);

  assert.equal(preview.applied, false);
  assert.deepEqual(
    preview.outcomes.map(({ uuid }) => uuid),
    ["uuid-old-stale"],
  );
  assert.deepEqual(
    preview.imageMetadata.map(({ uuid }) => uuid),
    ["uuid-old-image"],
  );
  assert.equal(store.outcomes.listAll().length, 3);
  assert.equal(store.imageMetadata.listAll().length, 2);

  const applied = pruneReviewSyncRequest(
    { ...request, apply: true },
    store.maintenance,
  );
  assert.equal(applied.applied, true);
  assert.deepEqual(
    store.outcomes.listAll().map(({ uuid }) => uuid),
    ["uuid-current", "uuid-recent-stale"],
  );
  assert.deepEqual(
    store.imageMetadata.listAll().map(({ uuid }) => uuid),
    ["uuid-current"],
  );
  store.close();
});

test("candidate reader opens the database read-only", () => {
  assert.throws(
    () => openReviewSyncReader({ databasePath: "missing-review-store.sqlite" }),
    /reader is unavailable/,
  );
});
