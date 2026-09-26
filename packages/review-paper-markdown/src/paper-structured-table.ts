import type { Data, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

import { PAPER_TABLE_DEFAULTS } from "./paper-table.ts";

export const PAPER_STRUCTURED_TABLE_CELL_TONES = ["default", "muted"] as const;

type MdxElement = Extract<
  RootContent,
  { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }
>;
type NativeProperty = string | number | boolean;
type NativeProperties = Record<string, NativeProperty>;
type NativeNode = {
  children: RootContent[];
  data: Data & {
    hName: string;
    hProperties: NativeProperties;
  };
  type: "paperStructuredTableNative";
};

const ELEMENT_NAMES = {
  PaperViewStructuredTable: "table",
  PaperViewTableBody: "tbody",
  PaperViewTableCaption: "caption",
  PaperViewTableCell: "td",
  PaperViewTableCellLabel: "span",
  PaperViewTableHead: "thead",
  PaperViewTableHeaderCell: "th",
  PaperViewTableRow: "tr",
} as const;
const MARKDOWN_FENCE = /^ {0,3}(`{3,}|~{3,})/;
const PAPER_LIST_COMPATIBILITY_COMMENT =
  /^(\s*)<!--\s*RTQ_PAPER_LIST_STYLE:\s*([\s\S]*?)\s*-->(\r?\n)?$/;
const PAPER_TABLE_KEEP_HTML_COMMENT =
  "<!-- RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable -->";

const ROOT_PRESENTATION_PROPS = new Set([
  "align",
  "cellAlign",
  "density",
  "firstColumnStartPadding",
  "grid",
  "indent",
  "width",
]);
const STRUCTURAL_CONTAINER_NAMES = new Set([
  "PaperViewStructuredTable",
  "PaperViewTableBody",
  "PaperViewTableHead",
  "PaperViewTableRow",
]);
type MarkdownFence = Readonly<{ character: "`" | "~"; length: number }>;

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
 * Make package-owned compatibility comments safe for the MDX parser while
 * preserving fenced examples and the metadata consumed by remarkPaperList.
 */
export function toPaperMdxCompatibilityMarkdown(markdown: string): string {
  const output: string[] = [];
  let fence: MarkdownFence | undefined;

  for (const line of markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ??
    []) {
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

    const listMarker = line.match(PAPER_LIST_COMPATIBILITY_COMMENT);
    if (listMarker) {
      const [, indent, listStyleType, lineEnding = ""] = listMarker;
      output.push(
        `${indent}<PaperListCompatibility listStyleType=${JSON.stringify(listStyleType.trim())} />${lineEnding}`,
      );
      continue;
    }

    output.push(line.replace(PAPER_TABLE_KEEP_HTML_COMMENT, ""));
  }

  return output.join("");
}

function isMdxElement(node: RootContent): node is MdxElement {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    typeof node.name === "string" &&
    Object.hasOwn(ELEMENT_NAMES, node.name)
  );
}

function isNativeMdxElement(node: RootContent): boolean {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    typeof node.name === "string" &&
    /^[a-z][A-Za-z0-9-]*$/.test(node.name)
  );
}

function staticProperties(node: MdxElement): NativeProperties {
  const properties: NativeProperties = {};

  for (const attribute of node.attributes ?? []) {
    if (
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.name !== "string"
    ) {
      continue;
    }
    if (attribute.value === null) {
      properties[attribute.name === "class" ? "className" : attribute.name] =
        true;
    } else if (typeof attribute.value === "string") {
      properties[attribute.name === "class" ? "className" : attribute.name] =
        attribute.value;
    }
  }

  return properties;
}

function takeProperty(
  properties: NativeProperties,
  name: string,
  fallback: string,
): NativeProperty {
  const value = properties[name];
  delete properties[name];
  return value ?? fallback;
}

function structuredTableProperties(node: MdxElement): NativeProperties {
  const properties = staticProperties(node);
  const cellAlignAuthored = Object.hasOwn(properties, "cellAlign");

  return {
    ...Object.fromEntries(
      Object.entries(properties).filter(
        ([name]) => !ROOT_PRESENTATION_PROPS.has(name),
      ),
    ),
    dataAlign: takeProperty(properties, "align", PAPER_TABLE_DEFAULTS.align),
    dataBlankCorner: PAPER_TABLE_DEFAULTS.blankCorner,
    dataCellAlign: takeProperty(
      properties,
      "cellAlign",
      PAPER_TABLE_DEFAULTS.cellAlign,
    ),
    ...(cellAlignAuthored ? { dataCellAlignAuthored: "" } : {}),
    dataDensity: takeProperty(
      properties,
      "density",
      PAPER_TABLE_DEFAULTS.density,
    ),
    dataFirstColumnStartPadding: takeProperty(
      properties,
      "firstColumnStartPadding",
      PAPER_TABLE_DEFAULTS.firstColumnStartPadding,
    ),
    dataGrid: takeProperty(properties, "grid", PAPER_TABLE_DEFAULTS.grid),
    dataIndent: takeProperty(properties, "indent", PAPER_TABLE_DEFAULTS.indent),
    dataPaperStructuredTable: "",
    dataWidth: takeProperty(properties, "width", PAPER_TABLE_DEFAULTS.width),
  };
}

function structuredElementProperties(node: MdxElement): NativeProperties {
  const properties = staticProperties(node);

  if (node.name === "PaperViewStructuredTable") {
    return structuredTableProperties(node);
  }
  if (node.name === "PaperViewTableCell") {
    const tone = takeProperty(properties, "tone", "default");
    return {
      ...properties,
      dataTone: tone,
    };
  }
  if (node.name === "PaperViewTableCellLabel") {
    return {
      ...properties,
      dataPaperTableCellLabel: "",
    };
  }

  return properties;
}

function toNativeNode(node: MdxElement, hName?: string): NativeNode {
  const children = STRUCTURAL_CONTAINER_NAMES.has(node.name ?? "")
    ? node.children.flatMap((child) =>
        child.type === "paragraph" ? child.children : child,
      )
    : node.children;

  return {
    children: children as RootContent[],
    data: {
      hName: hName ?? ELEMENT_NAMES[node.name as keyof typeof ELEMENT_NAMES],
      hProperties: structuredElementProperties(node),
    },
    type: "paperStructuredTableNative",
  };
}

function transformChildren(
  parent: Root | Parent,
  includeNativeElements: boolean,
): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if ("children" in child) {
      transformChildren(child, includeNativeElements);
    }
    if (isMdxElement(child)) {
      parent.children[index] = toNativeNode(child) as unknown as RootContent;
    } else if (includeNativeElements && isNativeMdxElement(child)) {
      const nativeElement = child as unknown as MdxElement;
      parent.children[index] = toNativeNode(
        nativeElement,
        nativeElement.name ?? "div",
      ) as unknown as RootContent;
    }
  }
}

/**
 * Lower direct paper-table MDX primitives to native table elements.
 *
 * The transform intentionally performs no structure or presentation-value
 * validation. Direct composition has the same author-owned validity boundary
 * as ordinary React and HTML table markup.
 */
export const remarkPaperStructuredTable: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree, false);
};

/** Preserve native lowercase HTML when a legacy renderer enables MDX parsing. */
export const remarkPaperNativeMdx: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree, true);
};
