import type { Data, List, Parent, Root, RootContent } from "mdast";
import remarkMdx from "remark-mdx";
import type { Plugin } from "unified";

export const PAPER_LIST_STYLE_TYPES = [
  "none",
  "disc",
  "circle",
  "square",
  "decimal",
  "decimal-leading-zero",
  "lower-alpha",
  "upper-alpha",
  "lower-roman",
  "upper-roman",
] as const;

export type PaperListStyleType = (typeof PAPER_LIST_STYLE_TYPES)[number];

type MdxElement = Extract<RootContent, { type: "mdxJsxFlowElement" }>;

type PaperListData = Data &
  Readonly<{
    hProperties?: Readonly<Record<string, unknown>>;
  }>;

const PAPER_LIST_STYLE_TYPE_SET = new Set<string>(PAPER_LIST_STYLE_TYPES);
const MARKDOWN_FENCE = /^ {0,3}(`{3,}|~{3,})/;
const PAPER_LIST_TAG = /<\/?PaperList\b[^>\r\n]*(?:>|$)/g;
const PAPER_LIST_TOKEN = /<\/?PaperList\b/;
const PAPER_LIST_OPEN_PATTERN =
  /^(?<indent> {0,3})<PaperList(?:[ \t]+(?<attributes>[^>\r\n]*))?>[ \t]*$/;
const PAPER_LIST_CLOSE_PATTERN = /^ {0,3}<\/PaperList>[ \t]*$/;
const PAPER_LIST_TAG_PREFIX_PATTERN = /^ {0,3}<\/?PaperList\b/;
const PAPER_LIST_STYLE_ATTRIBUTE_PATTERN =
  /^listStyleType[ \t]*=[ \t]*(["'])(.*?)\1$/;

type MarkdownFence = Readonly<{ character: "`" | "~"; length: number }>;

const PAPER_LIST_COMPATIBILITY_KEY = "RTQ_PAPER_LIST_STYLE";
const PAPER_LIST_COMPATIBILITY_COMMENT =
  /^<!--\s*RTQ_PAPER_LIST_STYLE:\s*([\s\S]*?)\s*-->$/;

export function normalizePaperListStyleType(
  value: unknown,
  ordered: boolean,
): PaperListStyleType {
  const fallback = ordered ? "decimal" : "disc";
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  return PAPER_LIST_STYLE_TYPE_SET.has(normalized)
    ? (normalized as PaperListStyleType)
    : fallback;
}

function openingFence(value: string): MarkdownFence | undefined {
  const match = value.match(MARKDOWN_FENCE);
  return match
    ? {
        character: match[1][0] as MarkdownFence["character"],
        length: match[1].length,
      }
    : undefined;
}

function closesFence(value: string, fence: MarkdownFence): boolean {
  return new RegExp(`^ {0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(
    value,
  );
}

/**
 * Keep readable Markdown available after a preparation failure without
 * changing literal PaperList examples in fenced code or dropping adjacent
 * authored content.
 */
export function stripPaperListWrapperLines(markdown: string): string {
  const lines = markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
  const output: string[] = [];
  let fence: MarkdownFence | undefined;

  for (const line of lines) {
    const content = line.replace(/\r?\n$/, "");
    if (fence) {
      output.push(line);
      if (closesFence(content, fence)) fence = undefined;
      continue;
    }

    const nextFence = openingFence(content);
    if (nextFence) {
      fence = nextFence;
      output.push(line);
    } else {
      const strippedContent = content.replace(PAPER_LIST_TAG, "");
      if (strippedContent === content) {
        output.push(line);
      } else if (strippedContent.trim()) {
        const lineEnding = line.slice(content.length);
        output.push(`${strippedContent}${lineEnding}`);
      }
    }
  }

  return output.join("");
}

/** Return whether Markdown contains PaperList markup outside fenced code. */
export function hasActivePaperList(markdown: string): boolean {
  const lines = markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
  let fence: MarkdownFence | undefined;

  for (const line of lines) {
    const content = line.replace(/\r?\n$/, "");
    if (fence) {
      if (closesFence(content, fence)) fence = undefined;
      continue;
    }

    const nextFence = openingFence(content);
    if (nextFence) {
      fence = nextFence;
    } else if (PAPER_LIST_TOKEN.test(content)) {
      return true;
    }
  }

  return false;
}

function paperListCompatibilityStyle(attributes: string | undefined): string {
  if (!attributes?.trim()) return "auto";

  const match = attributes.trim().match(PAPER_LIST_STYLE_ATTRIBUTE_PATTERN);
  if (!match) return "auto";

  const value = match[2].trim().toLowerCase();
  return PAPER_LIST_STYLE_TYPE_SET.has(value) ? value : "auto";
}

/**
 * Convert authored PaperList wrappers to inert metadata understood by the
 * non-MDX Markdown renderer. This mirrors the generated-paper compatibility
 * contract while leaving fenced examples untouched.
 */
export function toPaperListCompatibilityMarkdown(markdown: string): string {
  const lines = markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
  const output: string[] = [];
  let fence: MarkdownFence | undefined;
  let openWrappers = 0;

  for (const line of lines) {
    const content = line.replace(/\r?\n$/, "");

    if (fence) {
      output.push(line);
      if (closesFence(content, fence)) fence = undefined;
      continue;
    }

    const nextFence = openingFence(content);
    if (nextFence) {
      fence = nextFence;
      output.push(line);
      continue;
    }

    const openingMatch = content.match(PAPER_LIST_OPEN_PATTERN);
    if (openingMatch) {
      openWrappers += 1;
      const indent = openingMatch.groups?.indent ?? "";
      const style = paperListCompatibilityStyle(
        openingMatch.groups?.attributes,
      );
      const lineEnding = line.slice(content.length);
      output.push(
        `${indent}<!-- ${PAPER_LIST_COMPATIBILITY_KEY}: ${style} -->${lineEnding}`,
      );
      continue;
    }

    if (PAPER_LIST_CLOSE_PATTERN.test(content)) {
      if (openWrappers === 0) {
        throw new Error("PaperList closing tag has no matching opening tag");
      }
      openWrappers -= 1;
      continue;
    }

    if (PAPER_LIST_TAG_PREFIX_PATTERN.test(content)) {
      throw new Error(`Malformed PaperList wrapper: ${content.trim()}`);
    }

    output.push(line);
  }

  if (openWrappers > 0) {
    throw new Error("PaperList opening tag has no matching closing tag");
  }

  return output.join("");
}

function isParent(node: RootContent): node is RootContent & Parent {
  return "children" in node && Array.isArray(node.children);
}

function isPaperList(node: RootContent): node is MdxElement {
  return node.type === "mdxJsxFlowElement" && node.name === "PaperList";
}

function isInlinePaperList(node: RootContent): boolean {
  return node.type === "mdxJsxTextElement" && node.name === "PaperList";
}

function authoredListStyleType(node: MdxElement): unknown {
  const attribute = node.attributes?.find(
    (candidate) =>
      candidate.type === "mdxJsxAttribute" &&
      candidate.name === "listStyleType",
  );
  return attribute?.value;
}

function configureList(node: MdxElement): List {
  if (node.children.length !== 1 || node.children[0]?.type !== "list") {
    throw new Error(
      "PaperList must contain exactly one ordered or unordered Markdown list.",
    );
  }

  return configureNativeList(node.children[0], authoredListStyleType(node));
}

function configureNativeList(list: List, authoredStyle: unknown): List {
  const listStyleType = normalizePaperListStyleType(
    authoredStyle,
    Boolean(list.ordered),
  );
  const existingData = list.data as PaperListData | undefined;
  const existingProperties = existingData?.hProperties ?? {};
  list.data = {
    ...existingData,
    hProperties: {
      ...existingProperties,
      style: `list-style-type: ${listStyleType}`,
    },
  };
  return list;
}

function compatibilityListStyleType(node: RootContent): unknown | undefined {
  if (
    node.type !== "html" ||
    !node.value.includes(PAPER_LIST_COMPATIBILITY_KEY)
  ) {
    return undefined;
  }

  const match = node.value.match(PAPER_LIST_COMPATIBILITY_COMMENT);
  if (!match) {
    throw new Error("Malformed PaperList compatibility metadata.");
  }
  return match[1];
}

function transformChildren(parent: Root | Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (isInlinePaperList(child)) {
      throw new Error(
        "PaperList must be a standalone wrapper around one Markdown list.",
      );
    }
    if (isParent(child)) transformChildren(child);
    if (isPaperList(child)) {
      parent.children[index] = configureList(child) as RootContent;
      continue;
    }

    const compatibilityStyle = compatibilityListStyleType(child);
    if (compatibilityStyle !== undefined) {
      const list = parent.children[index + 1] as RootContent | undefined;
      if (list?.type !== "list") {
        throw new Error(
          "PaperList compatibility metadata must be followed by one Markdown list.",
        );
      }
      transformChildren(list);
      parent.children.splice(index, 1);
      parent.children[index] = configureNativeList(
        list,
        compatibilityStyle,
      ) as RootContent;
    }
  }
}

export const remarkPaperList: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};

export { remarkMdx as remarkPaperListMdx };

export * from "./paper-author-note.ts";
export * from "./paper-small.ts";
export * from "./paper-table.ts";
