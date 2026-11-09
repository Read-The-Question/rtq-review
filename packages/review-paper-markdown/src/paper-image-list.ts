import type { Data, List, ListItem, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

/**
 * PaperImageList for the review sites (web PRD prd-2026-11-08-1833, D8/D9).
 *
 * Port of rtq-web's paper-image-list.schema.ts and the prepare-time rules in
 * scripts/mdx/paper-image-list-mdx.ts, with the same messages so reviewers
 * see what production renders. remarkPaperImageList marks the wrapped list
 * (data-image-list, data-list-style-type, data-columns) for
 * rehypePaperImageList. Separate from PaperList, which stays the text list.
 */

export const PAPER_IMAGE_LIST_MIN_COLUMNS = 2;
export const PAPER_IMAGE_LIST_MAX_COLUMNS = 6;

export const PAPER_IMAGE_LIST_STYLE_TYPES = [
  "none",
  "decimal",
  "decimal-leading-zero",
  "lower-alpha",
  "upper-alpha",
  "lower-roman",
  "upper-roman",
] as const;

export type PaperImageListStyleType =
  (typeof PAPER_IMAGE_LIST_STYLE_TYPES)[number];

const PAPER_IMAGE_LIST_ATTRIBUTES = new Set(["columns", "listStyleType"]);

export const PAPER_IMAGE_LIST_MESSAGES = {
  caption: "PaperImageList: a caption is plain text after the image.",
  columnsRange: `PaperImageList: columns must be a whole number from ${PAPER_IMAGE_LIST_MIN_COLUMNS} to ${PAPER_IMAGE_LIST_MAX_COLUMNS}.`,
  item: "PaperImageList: each item starts with exactly one PaperImage.",
  list: "PaperImageList: wrap exactly one Markdown list.",
  listStyleType:
    'PaperImageList: listStyleType must be "none" or a letter or number style.',
  staticAttribute: (name: string) =>
    `PaperImageList: ${name} must be a static double-quoted value.`,
  unknownAttribute: (name: string) =>
    `PaperImageList: unknown attribute "${name}". Use listStyleType and columns.`,
} as const;

export function parsePaperImageListStyleType(
  value: string,
): PaperImageListStyleType | undefined {
  const normalized = value.trim().toLowerCase();
  return (PAPER_IMAGE_LIST_STYLE_TYPES as readonly string[]).includes(
    normalized,
  )
    ? (normalized as PaperImageListStyleType)
    : undefined;
}

export function parsePaperImageListColumns(value: string): number | undefined {
  if (!/^\d+$/.test(value.trim())) return undefined;
  const columns = Number(value.trim());
  return columns >= PAPER_IMAGE_LIST_MIN_COLUMNS &&
    columns <= PAPER_IMAGE_LIST_MAX_COLUMNS
    ? columns
    : undefined;
}

/** Mirrors rtq-web PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX. */
export const PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX = {
  full: null,
  lg: 576,
  md: 320,
  sm: 256,
} as const;

export type PaperImageDisplaySize =
  keyof typeof PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX;

/**
 * The width an image takes when it stands alone, used as its width inside an
 * image list: an SVG's natural width (times the review SVG size preference),
 * or a raster's displaySize cap, raised to `rasterFloor` when a review
 * preference enlarges it. Pass `intrinsicWidth` where a lone raster is not
 * enlarged past its pixels (review-content-web cards). null fills the line.
 */
export function getPaperImageListWidth(
  input: Readonly<{
    displaySize: PaperImageDisplaySize | (string & {});
    intrinsicWidth?: number;
    naturalWidth?: number;
    rasterFloor?: number;
    scale?: number;
  }>,
): number | null {
  if (input.naturalWidth !== undefined) {
    return input.naturalWidth * (input.scale ?? 1);
  }
  const cap =
    input.displaySize in PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX
      ? PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX[
          input.displaySize as PaperImageDisplaySize
        ]
      : PAPER_IMAGE_DISPLAY_SIZE_CAPS_PX.sm;
  if (input.rasterFloor) {
    return cap === null ? null : Math.max(cap, input.rasterFloor);
  }
  if (input.intrinsicWidth !== undefined) {
    return cap === null
      ? input.intrinsicWidth
      : Math.min(cap, input.intrinsicWidth);
  }
  return cap;
}

// ---------------------------------------------------------------------------
// Markdown wrappers

type MarkdownFence = Readonly<{ character: "`" | "~"; length: number }>;

const MARKDOWN_FENCE = /^ {0,3}(`{3,}|~{3,})/;
const PAPER_IMAGE_LIST_TOKEN = /<\/?PaperImageList\b/;
const PAPER_IMAGE_LIST_TAG = /<\/?PaperImageList\b[^>\r\n]*(?:>|$)/g;
const PAPER_IMAGE_LIST_OPEN =
  /^(?<indent> {0,3})<PaperImageList(?:[ \t]+(?<attributes>[^>\r\n]*))?>[ \t]*$/;
const PAPER_IMAGE_LIST_CLOSE = /^ {0,3}<\/PaperImageList>[ \t]*$/;
const PAPER_IMAGE_LIST_TAG_PREFIX = /^ {0,3}<\/?PaperImageList\b/;
const ATTRIBUTE = /([A-Za-z][A-Za-z0-9]*)[ \t]*=[ \t]*(["'])(.*?)\2/g;
const COMPATIBILITY_KEY = "RTQ_PAPER_IMAGE_LIST";
const COMPATIBILITY_COMMENT =
  /^<!--\s*RTQ_PAPER_IMAGE_LIST:\s*([\s\S]*?)\s*-->$/;

function lines(markdown: string): string[] {
  return markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
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

/** Calls `visit` for every line outside fenced code. */
function eachActiveLine(
  markdown: string,
  visit: (line: string, content: string) => string | undefined,
): string {
  const output: string[] = [];
  let fence: MarkdownFence | undefined;
  for (const line of lines(markdown)) {
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
    const replacement = visit(line, content);
    if (replacement !== undefined) output.push(replacement);
  }
  return output.join("");
}

/** Return whether Markdown contains PaperImageList markup outside fences. */
export function hasActivePaperImageList(markdown: string): boolean {
  let found = false;
  eachActiveLine(markdown, (line, content) => {
    if (PAPER_IMAGE_LIST_TOKEN.test(content)) found = true;
    return line;
  });
  return found;
}

/** Readable Markdown after a preparation failure: drop the wrapper tags. */
export function stripPaperImageListWrapperLines(markdown: string): string {
  return eachActiveLine(markdown, (line, content) => {
    const stripped = content.replace(PAPER_IMAGE_LIST_TAG, "");
    if (stripped === content) return line;
    return stripped.trim()
      ? `${stripped}${line.slice(content.length)}`
      : undefined;
  });
}

function readWrapperAttributes(attributes: string | undefined) {
  const values = new Map<string, string>();
  for (const match of (attributes ?? "").matchAll(ATTRIBUTE)) {
    values.set(match[1], match[3]);
  }
  return values;
}

/**
 * Convert PaperImageList wrappers to inert metadata for the non-MDX Markdown
 * renderer (review-tag-web), leaving fenced examples untouched.
 */
export function toPaperImageListCompatibilityMarkdown(
  markdown: string,
): string {
  let open = 0;
  const output = eachActiveLine(markdown, (line, content) => {
    const opening = content.match(PAPER_IMAGE_LIST_OPEN);
    if (opening) {
      open += 1;
      const values = readWrapperAttributes(opening.groups?.attributes);
      const tokens = [
        values.get("listStyleType")?.trim() || "missing",
        ...[...values.entries()]
          .filter(([name]) => name !== "listStyleType")
          .map(([name, value]) => `${name}=${value.replace(/\s+/g, "")}`),
      ];
      return `${opening.groups?.indent ?? ""}<!-- ${COMPATIBILITY_KEY}: ${tokens.join(" ")} -->${line.slice(content.length)}`;
    }
    if (PAPER_IMAGE_LIST_CLOSE.test(content)) {
      if (open === 0) {
        throw new Error(
          "PaperImageList closing tag has no matching opening tag",
        );
      }
      open -= 1;
      return undefined;
    }
    if (PAPER_IMAGE_LIST_TAG_PREFIX.test(content)) {
      throw new Error(`Malformed PaperImageList wrapper: ${content.trim()}`);
    }
    return line;
  });
  if (open > 0) {
    throw new Error("PaperImageList opening tag has no matching closing tag");
  }
  return output;
}

// ---------------------------------------------------------------------------
// remark

type MdxElement = Extract<
  RootContent,
  { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }
>;

type ImageListData = Data &
  Readonly<{ hProperties?: Readonly<Record<string, unknown>> }>;

type MdastNode = Readonly<{
  children?: readonly MdastNode[];
  name?: unknown;
  type: string;
  value?: unknown;
}>;

const CAPTION_PHRASING_TYPES = new Set([
  "break",
  "delete",
  "emphasis",
  "inlineCode",
  "inlineMath",
  "strong",
  "text",
]);

/** A PaperImage as authored (MDX), prepared (Markdown image) or enriched (HTML). */
function isImageNode(node: MdastNode): boolean {
  if (node.type === "image") return true;
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "PaperImage"
  ) {
    return true;
  }
  return (
    node.type === "html" &&
    typeof node.value === "string" &&
    /<img\b|paper-image/.test(node.value)
  );
}

function countImages(node: MdastNode): number {
  return (
    (isImageNode(node) ? 1 : 0) +
    (node.children ?? []).reduce((sum, child) => sum + countImages(child), 0)
  );
}

function isBlankText(node: MdastNode): boolean {
  return (
    node.type === "text" &&
    typeof node.value === "string" &&
    node.value.trim() === ""
  );
}

function isCaptionPhrasing(node: MdastNode): boolean {
  if (isImageNode(node)) return false;
  if (node.type === "mdxJsxTextElement" || node.type === "html") return true;
  return (
    CAPTION_PHRASING_TYPES.has(node.type) &&
    (node.children ?? []).every(isCaptionPhrasing)
  );
}

function validateItem(item: ListItem): void {
  const root = item as unknown as MdastNode;
  if (countImages(root) !== 1) {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.item);
  }
  const blocks = (root.children ?? []).filter((node) => !isBlankText(node));
  const [firstBlock, ...otherBlocks] = blocks;
  const leading =
    firstBlock?.type === "paragraph"
      ? (firstBlock.children ?? []).filter((node) => !isBlankText(node))
      : firstBlock
        ? [firstBlock]
        : [];
  const [image, ...inlineCaption] = leading;
  if (!image || !isImageNode(image)) {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.item);
  }
  const captions =
    (inlineCaption.length > 0 ? 1 : 0) +
    otherBlocks.filter((node) => node.type === "paragraph").length;
  if (
    captions > 1 ||
    !inlineCaption.every(isCaptionPhrasing) ||
    !otherBlocks.every(
      (node) =>
        node.type === "paragraph" &&
        (node.children ?? []).every(isCaptionPhrasing),
    )
  ) {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.caption);
  }
}

/** Validates one list and marks it for rehypePaperImageList. */
function configureImageList(
  list: List,
  attributes: ReadonlyMap<string, unknown>,
): List {
  for (const [name, value] of attributes) {
    if (!PAPER_IMAGE_LIST_ATTRIBUTES.has(name)) {
      throw new Error(PAPER_IMAGE_LIST_MESSAGES.unknownAttribute(name));
    }
    if (typeof value !== "string") {
      throw new Error(PAPER_IMAGE_LIST_MESSAGES.staticAttribute(name));
    }
  }
  const authoredStyle = attributes.get("listStyleType");
  const listStyleType =
    typeof authoredStyle === "string"
      ? parsePaperImageListStyleType(authoredStyle)
      : undefined;
  if (!listStyleType) {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.listStyleType);
  }
  const authoredColumns = attributes.get("columns");
  const columns =
    typeof authoredColumns === "string"
      ? parsePaperImageListColumns(authoredColumns)
      : undefined;
  if (authoredColumns !== undefined && columns === undefined) {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.columnsRange);
  }
  for (const item of list.children) validateItem(item);

  const existing = list.data as ImageListData | undefined;
  list.data = {
    ...existing,
    hProperties: {
      ...existing?.hProperties,
      "data-image-list": "",
      "data-list-style-type": listStyleType,
      ...(columns === undefined ? {} : { "data-columns": String(columns) }),
      style: `list-style-type: ${listStyleType}`,
    },
  };
  return list;
}

function mdxAttributes(node: MdxElement): Map<string, unknown> {
  const values = new Map<string, unknown>();
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== "mdxJsxAttribute") {
      throw new Error(PAPER_IMAGE_LIST_MESSAGES.unknownAttribute("{…}"));
    }
    values.set(attribute.name, attribute.value ?? "");
  }
  return values;
}

function compatibilityAttributes(
  node: RootContent,
): Map<string, unknown> | undefined {
  if (node.type !== "html" || !node.value.includes(COMPATIBILITY_KEY)) {
    return undefined;
  }
  const match = node.value.match(COMPATIBILITY_COMMENT);
  if (!match)
    throw new Error("Malformed PaperImageList compatibility metadata.");
  const [style, ...rest] = match[1].trim().split(/\s+/);
  const values = new Map<string, unknown>();
  if (style && style !== "missing") values.set("listStyleType", style);
  for (const token of rest) {
    const [name, value = ""] = token.split("=");
    values.set(name!, value);
  }
  return values;
}

function isParent(node: RootContent): node is RootContent & Parent {
  return "children" in node && Array.isArray(node.children);
}

function onlyList(node: MdxElement): List {
  const content = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );
  if (content.length !== 1 || content[0]?.type !== "list") {
    throw new Error(PAPER_IMAGE_LIST_MESSAGES.list);
  }
  return content[0];
}

function transformChildren(parent: Root | Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (child.type === "mdxJsxTextElement" && child.name === "PaperImageList") {
      throw new Error(PAPER_IMAGE_LIST_MESSAGES.list);
    }
    if (isParent(child)) transformChildren(child);
    if (child.type === "mdxJsxFlowElement" && child.name === "PaperImageList") {
      parent.children[index] = configureImageList(
        onlyList(child),
        mdxAttributes(child),
      ) as RootContent;
      continue;
    }
    const attributes = compatibilityAttributes(child);
    if (attributes) {
      const list = parent.children[index + 1] as RootContent | undefined;
      if (list?.type !== "list")
        throw new Error(PAPER_IMAGE_LIST_MESSAGES.list);
      parent.children.splice(index, 1);
      parent.children[index] = configureImageList(
        list,
        attributes,
      ) as RootContent;
    }
  }
}

/** Validates PaperImageList wrappers and marks their lists (see module comment). */
export const remarkPaperImageList: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};
