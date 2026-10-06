import { unified } from "unified";
import type { Parent, Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";

import {
  hasActivePaperList,
  hasActivePaperTable,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperShape,
  remarkPaperStructuredTable,
  remarkPaperSymbol,
  remarkPaperTable,
} from "./index.ts";

export function validatePaperListMarkdown(markdown: string): void {
  if (!hasActivePaperList(markdown)) return;

  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperList);
  processor.runSync(processor.parse(markdown));
}

export function validatePaperTableMarkdown(markdown: string): void {
  if (!hasActivePaperTable(markdown)) return;

  paperTableTree(markdown);
}

function paperTableTree(markdown: string): Root {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperTable)
    .use(remarkPaperStructuredTable);
  return processor.runSync(processor.parse(markdown)) as Root;
}

function containsMarkdownTable(parent: Root | Parent): boolean {
  return parent.children.some(
    (child) =>
      (child as { type: string }).type === "table" ||
      (child as { type: string }).type === "paperStructuredTableNative" ||
      ("children" in child && containsMarkdownTable(child)),
  );
}

export function hasMarkdownTable(markdown: string): boolean {
  try {
    return containsMarkdownTable(paperTableTree(markdown));
  } catch {
    return false;
  }
}

export function validatePaperSymbolMarkdown(markdown: string): void {
  if (!/<\/?PaperSymbol(?:Group)?\b/.test(markdown)) return;

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperSymbol);
  processor.runSync(processor.parse(markdown));
}

function containsPaperShape(parent: Root | Parent): boolean {
  return parent.children.some(
    (child) =>
      (child as { type: string }).type === "paperShapeNative" ||
      ("children" in child && containsPaperShape(child)),
  );
}

export function hasActivePaperShapeMarkdown(markdown: string): boolean {
  if (!/<\/?PaperShape\b/.test(markdown)) return false;

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperShape);
  return containsPaperShape(processor.runSync(processor.parse(markdown)));
}

export function validatePaperShapeMarkdown(markdown: string): void {
  hasActivePaperShapeMarkdown(markdown);
}
