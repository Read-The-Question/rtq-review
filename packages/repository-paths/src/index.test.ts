import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";

import { resolveRtqContentPaths, resolveRtqContentRoot } from "./index.ts";

function writePackage(root: string, name: string) {
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify({ name }));
}

function makeFixture() {
  const parent = mkdtempSync(join(tmpdir(), "rtq-review-paths-"));
  const reviewRoot = join(parent, "review-checkout");
  const contentRoot = join(parent, "content-checkout");

  writePackage(reviewRoot, "@rtq/review-workspace");
  writePackage(contentRoot, "@rtq/content-workspace");
  writeFileSync(join(contentRoot, "pnpm-workspace.yaml"), "packages: []\n");
  writePackage(join(contentRoot, "packages/papers"), "@rtq/papers");
  mkdirSync(join(contentRoot, "packages/papers/papers/toml"), {
    recursive: true,
  });
  writePackage(join(contentRoot, "packages/assets"), "@rtq/maths-assets");
  mkdirSync(join(contentRoot, "packages/assets/assets"), { recursive: true });

  return { contentRoot, parent, reviewRoot };
}

describe("review workspace content discovery", () => {
  it("derives papers and assets from one absolute content root", () => {
    const fixture = makeFixture();
    const canonicalRoot = realpathSync(fixture.contentRoot);

    assert.deepEqual(
      resolveRtqContentPaths({
        environment: { RTQ_CONTENT_ROOT: fixture.contentRoot },
        workspaceRoot: fixture.reviewRoot,
      }),
      {
        assetsPackageRoot: join(canonicalRoot, "packages/assets"),
        assetsRoot: join(canonicalRoot, "packages/assets/assets"),
        contentRoot: canonicalRoot,
        papersPackageRoot: join(canonicalRoot, "packages/papers"),
        papersRoot: join(canonicalRoot, "packages/papers/papers"),
      },
    );
  });

  it("anchors a relative override to the review workspace", () => {
    const fixture = makeFixture();
    const originalCwd = process.cwd();

    try {
      process.chdir(tmpdir());
      assert.equal(
        resolveRtqContentRoot({
          environment: { RTQ_CONTENT_ROOT: "../content-checkout" },
          workspaceRoot: fixture.reviewRoot,
        }),
        realpathSync(fixture.contentRoot),
      );
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("uses the conventional sibling checkout without an override", () => {
    const fixture = makeFixture();
    const sibling = join(fixture.parent, "rtq-content");

    writePackage(sibling, "@rtq/content-workspace");
    writeFileSync(join(sibling, "pnpm-workspace.yaml"), "packages: []\n");
    writePackage(join(sibling, "packages/papers"), "@rtq/papers");
    mkdirSync(join(sibling, "packages/papers/papers/toml"), {
      recursive: true,
    });
    writePackage(join(sibling, "packages/assets"), "@rtq/maths-assets");
    mkdirSync(join(sibling, "packages/assets/assets"), { recursive: true });

    assert.equal(
      resolveRtqContentRoot({
        environment: {},
        workspaceRoot: fixture.reviewRoot,
      }),
      realpathSync(sibling),
    );
  });

  it("rejects missing and mismatched content roots before use", () => {
    const fixture = makeFixture();
    const wrongRoot = join(fixture.parent, "wrong-root");
    writePackage(wrongRoot, "@rtq/env");

    assert.throws(
      () =>
        resolveRtqContentRoot({
          environment: { RTQ_CONTENT_ROOT: wrongRoot },
          workspaceRoot: fixture.reviewRoot,
        }),
      /expected package @rtq\/content-workspace/,
    );
    assert.throws(
      () =>
        resolveRtqContentRoot({
          environment: { RTQ_CONTENT_ROOT: "../missing-content" },
          workspaceRoot: fixture.reviewRoot,
        }),
      new RegExp(resolve(fixture.reviewRoot, "../missing-content")),
    );
  });
});
