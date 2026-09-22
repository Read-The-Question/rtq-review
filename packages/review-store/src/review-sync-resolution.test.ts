import assert from "node:assert/strict";
import test from "node:test";

import { resolveReviewSyncRequest } from "./review-sync-resolution.ts";
import { openReviewStore } from "./review-store.ts";

test("resolves outcomes and state-scoped image metadata independently", () => {
  const store = openReviewStore({ databasePath: ":memory:" });
  const imageTarget = {
    ragState: "rag_wf_ng2",
    side: "question-image" as const,
    uuid: "uuid-image",
  };
  store.imageMetadata.set({
    ...imageTarget,
    ignored: ["decorative"],
    reviewer: "metadata-reviewer",
    types: ["generated", "screenshot"],
  });
  store.outcomes.set({
    ...imageTarget,
    outcome: "PRG",
    reviewer: "outcome-reviewer",
  });
  store.imageMetadata.set({
    ...imageTarget,
    ragState: "rag_wf_ng3",
    ignored: [],
    reviewer: "future-reviewer",
    types: [],
  });

  const response = resolveReviewSyncRequest(
    { schemaVersion: 1, targets: [imageTarget] },
    store,
  );

  assert.equal(response.schemaVersion, 1);
  assert.deepEqual(
    response.outcomes.map(({ outcome, ragState, side, uuid }) => ({
      outcome,
      ragState,
      side,
      uuid,
    })),
    [{ ...imageTarget, outcome: "PRG" }],
  );
  assert.deepEqual(
    response.imageMetadata.map(
      ({ ignored, ragState, reviewer, side, types, uuid }) => ({
        ignored,
        ragState,
        reviewer,
        side,
        types,
        uuid,
      }),
    ),
    [
      {
        ...imageTarget,
        ignored: ["decorative"],
        reviewer: "metadata-reviewer",
        types: ["generated", "screenshot"],
      },
    ],
  );
  store.close();
});

test("returns metadata even when no image outcome exists", () => {
  const store = openReviewStore({ databasePath: ":memory:" });
  const target = {
    ragState: "rag_wf_ng2",
    side: "answer-image" as const,
    uuid: "uuid-metadata-only",
  };
  store.imageMetadata.set({
    ...target,
    ignored: [],
    reviewer: "up",
    types: [],
  });

  const response = resolveReviewSyncRequest(
    { schemaVersion: 1, targets: [target] },
    store,
  );

  assert.deepEqual(response.outcomes, []);
  assert.equal(response.imageMetadata.length, 1);
  assert.deepEqual(response.imageMetadata[0]?.types, []);
  store.close();
});
