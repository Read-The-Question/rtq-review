import { loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs, type MacroSchemaContext } from "fumadocs-mdx/macro";
import { z } from "zod";

import {
  getDocumentationSourceForVirtualPath,
  getFileNavigationLabel,
  getFolderNavigationLabel,
  toRepositoryDocumentationUrl,
} from "./documentation-sources";
import { docsRoute } from "./shared";

function titleFromPath(path: string): string {
  const fileName =
    path
      .split("/")
      .at(-1)
      ?.replace(/\.mdx?$/, "") ?? path;
  if (fileName.toLowerCase() === "readme") return "README.md";

  return fileName
    .split(/[-_.]/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}

function pageTitleFromSource(context: MacroSchemaContext): string {
  const heading = context.source.match(/^#\s+(.+)$/m)?.[1];

  return (
    heading?.replaceAll(/[`*_]/g, "").trim() || titleFromPath(context.path)
  );
}

function documentationPageSchema(context: MacroSchemaContext) {
  return pageSchema.extend({
    title: z.string().default(pageTitleFromSource(context)),
    sourceHasHeading: z.boolean().default(/^#\s+/m.test(context.source)),
  });
}

// Collection directories and file globs must remain statically analyzable.
const rtqContent = defineDocs({
  dir: "../../../rtq-content",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqContentAssets = defineDocs({
  dir: "../../../rtq-content/packages/assets",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqContentPapers = defineDocs({
  dir: "../../../rtq-content/packages/papers",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqEnv = defineDocs({
  dir: "../../../rtq-env",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReview = defineDocs({
  dir: "../..",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewDocsWeb = defineDocs({
  dir: ".",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewApi = defineDocs({
  dir: "../review-api",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewLegacyGatsbyWeb = defineDocs({
  dir: "../review-legacy-gatsby-web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewQuestionViewerWeb = defineDocs({
  dir: "../review-question-viewer-web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewTagWeb = defineDocs({
  dir: "../review-tag-web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewWeb = defineDocs({
  dir: "../review-web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqReviewRepositoryPaths = defineDocs({
  dir: "../../packages/repository-paths",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqWeb = defineDocs({
  dir: "../../../rtq-web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqWebApp = defineDocs({
  dir: "../../../rtq-web/apps/web",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});
const rtqWebFeatureConfig = defineDocs({
  dir: "../../../rtq-web/packages/feature-config",
  docs: {
    files: ["README.md", "docs/**/*.md"],
    schema: documentationPageSchema,
  },
  meta: { files: [], schema: metaSchema },
});

export const source = loader(
  {
    "rtq-content": rtqContent.toFumadocsSource({ baseDir: "rtq-content" }),
    "rtq-content-assets": rtqContentAssets.toFumadocsSource({
      baseDir: "rtq-content/packages/assets",
    }),
    "rtq-content-papers": rtqContentPapers.toFumadocsSource({
      baseDir: "rtq-content/packages/papers",
    }),
    "rtq-env": rtqEnv.toFumadocsSource({ baseDir: "rtq-env" }),
    "rtq-review": rtqReview.toFumadocsSource({ baseDir: "rtq-review" }),
    "rtq-review-docs-web": rtqReviewDocsWeb.toFumadocsSource({
      baseDir: "rtq-review/apps/docs-web",
    }),
    "rtq-review-review-api": rtqReviewApi.toFumadocsSource({
      baseDir: "rtq-review/apps/review-api",
    }),
    "rtq-review-review-legacy-gatsby-web":
      rtqReviewLegacyGatsbyWeb.toFumadocsSource({
        baseDir: "rtq-review/apps/review-legacy-gatsby-web",
      }),
    "rtq-review-review-question-viewer-web":
      rtqReviewQuestionViewerWeb.toFumadocsSource({
        baseDir: "rtq-review/apps/review-question-viewer-web",
      }),
    "rtq-review-review-tag-web": rtqReviewTagWeb.toFumadocsSource({
      baseDir: "rtq-review/apps/review-tag-web",
    }),
    "rtq-review-review-web": rtqReviewWeb.toFumadocsSource({
      baseDir: "rtq-review/apps/review-web",
    }),
    "rtq-review-repository-paths": rtqReviewRepositoryPaths.toFumadocsSource({
      baseDir: "rtq-review/packages/repository-paths",
    }),
    "rtq-web": rtqWeb.toFumadocsSource({ baseDir: "rtq-web" }),
    "rtq-web-web": rtqWebApp.toFumadocsSource({
      baseDir: "rtq-web/apps/web",
    }),
    "rtq-web-feature-config": rtqWebFeatureConfig.toFumadocsSource({
      baseDir: "rtq-web/packages/feature-config",
    }),
  },
  {
    baseUrl: docsRoute,
    pageTree: {
      transformers: [
        {
          file(node, filePath) {
            return {
              ...node,
              name: getFileNavigationLabel(filePath ?? "", node.name),
            };
          },
          folder(node, folderPath) {
            return {
              ...node,
              name: getFolderNavigationLabel(folderPath),
            };
          },
        },
      ],
    },
  },
);

export function getPageGitHubUrl(page: (typeof source)["$inferPage"]) {
  const documentationSource = getDocumentationSourceForVirtualPath(page.path);
  if (!documentationSource) {
    throw new Error(`No documentation source owns ${page.path}`);
  }

  return toRepositoryDocumentationUrl(documentationSource, page.path);
}
