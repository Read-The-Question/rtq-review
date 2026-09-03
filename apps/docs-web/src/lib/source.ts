import { loader } from "fumadocs-core/source";
import { docsRoute } from "./shared";
import { defineDocs } from "fumadocs-mdx/macro";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";
import {
  getDocumentationSourceByKey,
  getDocumentationSourceForVirtualPath,
  reviewTagDocumentationSource,
  rtqDocsDocumentationSource,
  toDocumentationSlugs,
  toRepositoryDocumentationUrl,
} from "./documentation-sources";

const reviewTagDocs = defineDocs({
  // Macro paths and file globs must remain string literals.
  dir: "../review-tag-web",
  docs: {
    files: ["README.md"],
    schema: pageSchema.extend({
      title: z.string().default("RTQ Tag Review Web"),
    }),
  },
  meta: {
    files: [],
    schema: metaSchema,
  },
});

const reviewTagSource = reviewTagDocs.toFumadocsSource({
  baseDir: reviewTagDocumentationSource.key,
});

const rtqDocs = defineDocs({
  // Macro paths and file globs must remain string literals.
  dir: "docs",
  docs: {
    files: ["**/*.md"],
    schema: pageSchema,
  },
  meta: {
    files: [],
    schema: metaSchema,
  },
});

const rtqDocsSource = rtqDocs.toFumadocsSource({
  baseDir: rtqDocsDocumentationSource.key,
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader(
  {
    "review-tag": reviewTagSource,
    "rtq-docs": rtqDocsSource,
  },
  {
    baseUrl: docsRoute,
    slugs(file, fallback) {
      const documentationSource = getDocumentationSourceForVirtualPath(
        file.path,
      );

      return documentationSource
        ? toDocumentationSlugs(documentationSource, file.path, fallback)
        : fallback();
    },
    pageTree: {
      transformers: [
        {
          folder(node, folderPath) {
            const documentationSource = getDocumentationSourceByKey(folderPath);
            if (!documentationSource) return node;

            const landingPage = documentationSource.landingFile
              ? node.children.find(
                  (child) =>
                    child.type === "page" &&
                    child.$ref ===
                      `${documentationSource.key}/${documentationSource.landingFile}`,
                )
              : undefined;

            return {
              ...node,
              name: documentationSource.label,
              index: landingPage?.type === "page" ? landingPage : node.index,
              children: landingPage
                ? node.children.filter((child) => child !== landingPage)
                : node.children,
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
