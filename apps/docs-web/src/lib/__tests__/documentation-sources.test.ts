import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import {
  documentationSources,
  getDocumentationSourceForVirtualPath,
  isRepositoryDocumentationPath,
  reviewTagDocumentationSource,
  rtqDocsDocumentationSource,
  toDocumentationSlugs,
  toRepositoryDocumentationPath,
  toRepositoryDocumentationUrl,
  toVirtualDocumentationPath,
} from "../documentation-sources.ts";

const workspaceRoot = resolve(import.meta.dirname, "../../../../..");
const docsAppRoot = resolve(workspaceRoot, "apps/docs-web");

describe("Review - Tag documentation source", () => {
  it("allowlists only the Tag README", () => {
    assert.deepEqual(reviewTagDocumentationSource.files, ["README.md"]);
    assert.equal(
      resolve(
        workspaceRoot,
        "apps/docs-web",
        reviewTagDocumentationSource.collectionDirectory,
      ),
      resolve(workspaceRoot, "apps/review-tag-web"),
    );
    assert.equal(
      reviewTagDocumentationSource.files.includes("AGENTS.md"),
      false,
    );
    assert.equal(
      reviewTagDocumentationSource.files.includes("CLAUDE.md"),
      false,
    );
  });

  it("maps the README to the source landing page", () => {
    assert.equal(
      toVirtualDocumentationPath(reviewTagDocumentationSource, "README.md"),
      "review-tag/README.md",
    );
    assert.deepEqual(
      toDocumentationSlugs(
        reviewTagDocumentationSource,
        "review-tag/README.md",
        () => ["review-tag", "readme"],
      ),
      ["review-tag"],
    );
    assert.equal(
      toRepositoryDocumentationPath(
        reviewTagDocumentationSource,
        "review-tag/README.md",
      ),
      "apps/review-tag-web/README.md",
    );
  });

  it("preserves nested paths beneath the source root", () => {
    assert.equal(
      toVirtualDocumentationPath(
        reviewTagDocumentationSource,
        "docs/operations/runbook.md",
      ),
      "review-tag/docs/operations/runbook.md",
    );
    assert.deepEqual(
      toDocumentationSlugs(
        reviewTagDocumentationSource,
        "review-tag/docs/operations/runbook.md",
        () => ["review-tag", "docs", "operations", "runbook"],
      ),
      ["review-tag", "docs", "operations", "runbook"],
    );
  });
});

describe("RTQ Docs documentation source", () => {
  it("publishes Markdown only from the app-owned docs directory", () => {
    assert.deepEqual(rtqDocsDocumentationSource.files, ["**/*.md"]);
    assert.equal(
      resolve(
        workspaceRoot,
        "apps/docs-web",
        rtqDocsDocumentationSource.collectionDirectory,
      ),
      resolve(workspaceRoot, "apps/docs-web/docs"),
    );
    assert.equal(
      isRepositoryDocumentationPath(
        rtqDocsDocumentationSource,
        "apps/docs-web/docs/architecture/fumadocs-architecture.md",
      ),
      true,
    );
    assert.equal(
      isRepositoryDocumentationPath(
        rtqDocsDocumentationSource,
        "apps/docs-web/README.md",
      ),
      false,
    );
    assert.equal(
      isRepositoryDocumentationPath(
        rtqDocsDocumentationSource,
        "apps/docs-web/AGENTS.md",
      ),
      false,
    );
    assert.equal(
      isRepositoryDocumentationPath(
        rtqDocsDocumentationSource,
        "apps/docs-web/CLAUDE.md",
      ),
      false,
    );
    assert.equal(
      isRepositoryDocumentationPath(
        rtqDocsDocumentationSource,
        "apps/docs-web/docs/../README.md",
      ),
      false,
    );
  });

  it("maps architecture files into the RTQ Docs namespace", () => {
    const sourcePath = "architecture/fumadocs-architecture.md";
    const virtualPath = toVirtualDocumentationPath(
      rtqDocsDocumentationSource,
      sourcePath,
    );

    assert.equal(virtualPath, "rtq-docs/architecture/fumadocs-architecture.md");
    assert.deepEqual(
      toDocumentationSlugs(rtqDocsDocumentationSource, virtualPath, () => [
        "rtq-docs",
        "architecture",
        "fumadocs-architecture",
      ]),
      ["rtq-docs", "architecture", "fumadocs-architecture"],
    );
    assert.equal(
      toRepositoryDocumentationPath(rtqDocsDocumentationSource, virtualPath),
      "apps/docs-web/docs/architecture/fumadocs-architecture.md",
    );
    assert.equal(
      toRepositoryDocumentationUrl(rtqDocsDocumentationSource, virtualPath),
      "https://github.com/Read-The-Question/rtq-review/blob/develop/apps/docs-web/docs/architecture/fumadocs-architecture.md",
    );
  });

  it("keeps both sources independently addressable", () => {
    assert.deepEqual(
      documentationSources.map(({ key, label }) => ({ key, label })),
      [
        { key: "review-tag", label: "Review - Tag" },
        { key: "rtq-docs", label: "RTQ Docs" },
      ],
    );
    assert.equal(
      getDocumentationSourceForVirtualPath("review-tag/README.md"),
      reviewTagDocumentationSource,
    );
    assert.equal(
      getDocumentationSourceForVirtualPath(
        "rtq-docs/architecture/fumadocs-architecture.md",
      ),
      rtqDocsDocumentationSource,
    );
    assert.equal(
      getDocumentationSourceForVirtualPath("unconfigured/README.md"),
      undefined,
    );
  });
});

describe("RTQ Docs application surface", () => {
  it("retains only the required application routes", async () => {
    const retainedRoutes = [
      "src/app/(home)/page.tsx",
      "src/app/docs/[[...slug]]/page.tsx",
      "src/app/api/search/route.ts",
    ];
    const removedRoutes = [
      "src/app/llms.txt/route.ts",
      "src/app/llms-full.txt/route.ts",
      "src/app/llms.mdx/docs/[[...slug]]/route.ts",
      "src/app/og/docs/[...slug]/route.tsx",
      "proxy.ts",
    ];

    await Promise.all(
      retainedRoutes.map((route) => access(resolve(docsAppRoot, route))),
    );
    await Promise.all(
      removedRoutes.map((route) =>
        assert.rejects(access(resolve(docsAppRoot, route))),
      ),
    );
  });

  it("does not declare unused scaffold utilities as dependencies", async () => {
    const packageJson = JSON.parse(
      await readFile(resolve(docsAppRoot, "package.json"), "utf8"),
    ) as { dependencies: Record<string, string> };

    assert.equal("cnfast" in packageJson.dependencies, false);
    assert.equal("lucide-react" in packageJson.dependencies, false);
  });
});
