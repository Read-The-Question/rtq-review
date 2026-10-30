import type { Data, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

import {
  PAPER_TABLE_DEFAULTS,
  PAPER_TABLE_MARKS,
  PAPER_TABLE_PROP_VALUES,
  describePaperTableRetiredValue,
  getPaperTableTotalsCountError,
  isPaperTableMark,
  isPaperTablePropValue,
} from "./paper-table.ts";

/**
 * Structured-table cell meanings (04 §5). The question's words decide the
 * fill: "shaded" (or no word) takes tone="shaded", a solid black-out takes
 * tone="blocked", and a named colour takes a swatch instead.
 */
export const PAPER_STRUCTURED_TABLE_CELL_TONES = [
  "default",
  "shaded",
  "blocked",
] as const;

/**
 * Named colours a cell can take when the question names the colour. They
 * mirror the RTQ diagram swatches and stay the same in light and dark mode.
 */
export const PAPER_STRUCTURED_TABLE_CELL_SWATCHES = [
  "black",
  "white",
  "grey",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
] as const;

export type PaperStructuredTableOptions = Readonly<{
  /**
   * Check the table's meanings (totals, answer marks, cell tones and swatches), row and
   * cell cellAlign, columnWidths, horizontalDensity and verticalDensity with
   * the same rules as the RTQ web build, and throw on the first problem. Other layout props stay unvalidated either
   * way. Rendering leaves this off so an
   * invalid table still shows; validation reports it as an issue.
   */
  validateMeanings?: boolean;
}>;

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
  "borderModel",
  "cellBorder",
  "cellAlign",
  "columnWidths",
  "density",
  "firstColumnStartPadding",
  "grid",
  "horizontalDensity",
  "indent",
  "rowHeaderWeight",
  "totals",
  "verticalDensity",
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
  const borderModel = takeProperty(properties, "borderModel", "table");
  const cellBorder = takeProperty(properties, "cellBorder", "all");

  return {
    ...Object.fromEntries(
      Object.entries(properties).filter(
        ([name]) => !ROOT_PRESENTATION_PROPS.has(name),
      ),
    ),
    dataAlign: takeProperty(properties, "align", PAPER_TABLE_DEFAULTS.align),
    dataBlankCorner: PAPER_TABLE_DEFAULTS.blankCorner,
    dataBorderModel: borderModel,
    ...(borderModel === "cells" ? { dataCellBorder: cellBorder } : {}),
    dataCellAlign: takeProperty(
      properties,
      "cellAlign",
      PAPER_TABLE_DEFAULTS.cellAlign,
    ),
    ...(cellAlignAuthored ? { dataCellAlignAuthored: "" } : {}),
    dataColumnWidths: takeProperty(
      properties,
      "columnWidths",
      PAPER_TABLE_DEFAULTS.columnWidths,
    ),
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
    ...(Object.hasOwn(properties, "grid")
      ? { dataGrid: takeProperty(properties, "grid", "") }
      : {}),
    ...(Object.hasOwn(properties, "horizontalDensity")
      ? {
          dataHorizontalDensity: takeProperty(
            properties,
            "horizontalDensity",
            "",
          ),
        }
      : {}),
    dataIndent: takeProperty(properties, "indent", PAPER_TABLE_DEFAULTS.indent),
    dataPaperStructuredTable: "",
    dataRowHeaderWeight: takeProperty(
      properties,
      "rowHeaderWeight",
      PAPER_TABLE_DEFAULTS.rowHeaderWeight,
    ),
    ...(Object.hasOwn(properties, "totals")
      ? { dataTotals: takeProperty(properties, "totals", "") }
      : {}),
    ...(Object.hasOwn(properties, "verticalDensity")
      ? {
          dataVerticalDensity: takeProperty(properties, "verticalDensity", ""),
        }
      : {}),
    dataWidth: takeProperty(properties, "width", PAPER_TABLE_DEFAULTS.width),
  };
}

function structuredElementProperties(node: MdxElement): NativeProperties {
  const properties = staticProperties(node);

  if (node.name === "PaperViewStructuredTable") {
    return structuredTableProperties(node);
  }
  if (
    node.name === "PaperViewTableRow" ||
    node.name === "PaperViewTableHeaderCell" ||
    node.name === "PaperViewTableCell"
  ) {
    const cellBorder = properties.cellBorder;
    delete properties.cellBorder;
    if (cellBorder !== undefined) {
      properties.dataCellBorder = cellBorder;
    }
    const cellAlign = properties.cellAlign;
    delete properties.cellAlign;
    if (cellAlign !== undefined) {
      properties.dataCellAlign = cellAlign;
    }
    if (node.name !== "PaperViewTableHeaderCell") {
      const mark = properties.mark;
      delete properties.mark;
      if (mark !== undefined) {
        properties.dataMark = mark;
      }
    }

    if (node.name !== "PaperViewTableCell") {
      return properties;
    }

    const tone = takeProperty(properties, "tone", "default");
    const swatch = properties.swatch;
    delete properties.swatch;
    return {
      ...properties,
      ...(swatch === undefined ? {} : { dataSwatch: swatch }),
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

type StructuredMark = Readonly<{
  inBody: boolean;
  node: unknown;
  owner: string;
}>;

function isNamedMdxElement(node: RootContent, name: string): boolean {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === name
  );
}

/** A row or cell written on one line with its parent arrives in a paragraph. */
function structuredChildren(node: Root | Parent): RootContent[] {
  return node.children.flatMap((child) =>
    child.type === "paragraph" ? child.children : [child],
  ) as RootContent[];
}

function throwStructuredTableError(message: string, node: unknown): never {
  const start = (
    node as { position?: { start?: { column?: number; line?: number } } }
  ).position?.start;
  throw Object.assign(new Error(message), {
    column: start?.column,
    line: start?.line,
    ruleId: "paper-table-authoring",
    source: "rtq-paper-table",
  });
}

function getStaticStringAttribute(
  node: MdxElement,
  owner: string,
  name: string,
  allowedValues: readonly string[],
): { node: unknown; value: string } | undefined {
  const attribute = (node.attributes ?? []).find(
    (candidate) =>
      candidate.type === "mdxJsxAttribute" && candidate.name === name,
  );
  if (!attribute) return undefined;
  if (typeof attribute.value !== "string") {
    const form =
      attribute.value === null || attribute.value === undefined
        ? "boolean attribute"
        : "expression-valued attribute";
    throwStructuredTableError(
      `${owner} prop ${JSON.stringify(name)} must use a static quoted string; received ${form}; allowed values: ${allowedValues.join(", ")}.`,
      attribute.position ? attribute : node,
    );
  }
  return {
    node: attribute.position ? attribute : node,
    value: attribute.value,
  };
}

function isCellTone(value: string): boolean {
  return (PAPER_STRUCTURED_TABLE_CELL_TONES as readonly string[]).includes(
    value,
  );
}

function isCellSwatch(value: string): boolean {
  return (PAPER_STRUCTURED_TABLE_CELL_SWATCHES as readonly string[]).includes(
    value,
  );
}

function collectStructuredMeanings(
  node: Root | Parent,
  inBody: boolean,
  marks: StructuredMark[],
  bodyRows: RootContent[],
): void {
  for (const child of structuredChildren(node)) {
    const isRow = isNamedMdxElement(child, "PaperViewTableRow");
    const isCell = isNamedMdxElement(child, "PaperViewTableCell");
    if (isRow && isNamedMdxElement(node as RootContent, "PaperViewTableBody")) {
      bodyRows.push(child);
    }

    if (isRow || isCell) {
      const owner = isRow ? "PaperViewTableRow" : "PaperViewTableCell";
      const mark = getStaticStringAttribute(
        child as MdxElement,
        owner,
        "mark",
        PAPER_TABLE_MARKS,
      );
      if (mark && !isPaperTableMark(mark.value)) {
        throwStructuredTableError(
          `${owner} prop "mark" received ${JSON.stringify(mark.value)}; allowed values: ${PAPER_TABLE_MARKS.join(", ")}.`,
          mark.node,
        );
      }
      if (mark) marks.push({ inBody, node: mark.node, owner });
    }

    const isHeaderCell = isNamedMdxElement(child, "PaperViewTableHeaderCell");
    if (isRow || isCell || isHeaderCell) {
      const owner = isRow
        ? "PaperViewTableRow"
        : isCell
          ? "PaperViewTableCell"
          : "PaperViewTableHeaderCell";
      const cellAlign = getStaticStringAttribute(
        child as MdxElement,
        owner,
        "cellAlign",
        PAPER_TABLE_PROP_VALUES.cellAlign,
      );
      if (cellAlign && !isPaperTablePropValue("cellAlign", cellAlign.value)) {
        throwStructuredTableError(
          `${owner} prop "cellAlign" received ${JSON.stringify(cellAlign.value)}; allowed values: ${PAPER_TABLE_PROP_VALUES.cellAlign.join(", ")}.`,
          cellAlign.node,
        );
      }
    }

    if (isCell) {
      const tone = getStaticStringAttribute(
        child as MdxElement,
        "PaperViewTableCell",
        "tone",
        PAPER_STRUCTURED_TABLE_CELL_TONES,
      );
      if (tone && !isCellTone(tone.value)) {
        throwStructuredTableError(
          `PaperViewTableCell prop "tone" received ${JSON.stringify(tone.value)}; ${describePaperTableRetiredValue("tone", tone.value)}allowed values: ${PAPER_STRUCTURED_TABLE_CELL_TONES.join(", ")}.`,
          tone.node,
        );
      }
      const swatch = getStaticStringAttribute(
        child as MdxElement,
        "PaperViewTableCell",
        "swatch",
        PAPER_STRUCTURED_TABLE_CELL_SWATCHES,
      );
      if (swatch && !isCellSwatch(swatch.value)) {
        throwStructuredTableError(
          `PaperViewTableCell prop "swatch" received ${JSON.stringify(swatch.value)}; allowed values: ${PAPER_STRUCTURED_TABLE_CELL_SWATCHES.join(", ")}.`,
          swatch.node,
        );
      }
      if (swatch && tone && tone.value !== "default") {
        throwStructuredTableError(
          "PaperViewTableCell takes swatch or tone, not both; both fill the cell. Use swatch when the question names the colour, otherwise tone.",
          swatch.node,
        );
      }
    }

    if ("children" in child) {
      collectStructuredMeanings(
        child,
        inBody || isNamedMdxElement(child, "PaperViewTableBody"),
        marks,
        bodyRows,
      );
    }
  }
}

function countStructuredColumns(node: Root | Parent): number {
  let columnCount = 0;
  for (const child of structuredChildren(node)) {
    if (isNamedMdxElement(child, "PaperViewTableRow") && "children" in child) {
      const cellCount = structuredChildren(child).filter(
        (cell) =>
          isNamedMdxElement(cell, "PaperViewTableCell") ||
          isNamedMdxElement(cell, "PaperViewTableHeaderCell"),
      ).length;
      columnCount = Math.max(columnCount, cellCount);
    } else if ("children" in child) {
      columnCount = Math.max(columnCount, countStructuredColumns(child));
    }
  }
  return columnCount;
}

function validateStructuredRootValue(
  node: MdxElement,
  owner: string,
  name: "columnWidths" | "horizontalDensity" | "verticalDensity",
): void {
  const attribute = getStaticStringAttribute(
    node,
    owner,
    name,
    PAPER_TABLE_PROP_VALUES[name],
  );
  if (!attribute) return;
  if (!isPaperTablePropValue(name, attribute.value)) {
    throwStructuredTableError(
      `${owner} prop ${JSON.stringify(name)} received ${JSON.stringify(attribute.value)}; allowed values: ${PAPER_TABLE_PROP_VALUES[name].join(", ")}.`,
      attribute.node,
    );
  }
}

function validateStructuredTable(node: MdxElement): void {
  const owner = "PaperViewStructuredTable";
  const marks: StructuredMark[] = [];
  const bodyRows: RootContent[] = [];
  collectStructuredMeanings(node, false, marks, bodyRows);
  validateStructuredRootValue(node, owner, "columnWidths");
  validateStructuredRootValue(node, owner, "horizontalDensity");
  validateStructuredRootValue(node, owner, "verticalDensity");

  const totals = getStaticStringAttribute(
    node,
    owner,
    "totals",
    PAPER_TABLE_PROP_VALUES.totals,
  );
  if (totals && !isPaperTablePropValue("totals", totals.value)) {
    throwStructuredTableError(
      `${owner} prop "totals" received ${JSON.stringify(totals.value)}; allowed values: ${PAPER_TABLE_PROP_VALUES.totals.join(", ")}.`,
      totals.node,
    );
  }
  if (totals && isPaperTablePropValue("totals", totals.value)) {
    const reason = getPaperTableTotalsCountError(
      totals.value,
      bodyRows.length,
      countStructuredColumns(node),
    );
    if (reason) {
      throwStructuredTableError(
        `${owner} prop "totals" received ${JSON.stringify(totals.value)}, but ${reason}`,
        totals.node,
      );
    }
  }

  const outsideBody = marks.find((mark) => !mark.inBody);
  if (outsideBody) {
    throwStructuredTableError(
      `${outsideBody.owner} mark="answer" must be inside PaperViewTableBody; answer marks apply to body rows and cells only.`,
      outsideBody.node,
    );
  }
  if (marks.length > 1) {
    throwStructuredTableError(
      `${owner} allows one answer mark; received ${marks.length}. Mark one row or one cell.`,
      marks[1].node,
    );
  }
}

function validateStructuredTables(parent: Root | Parent): void {
  for (const child of parent.children as RootContent[]) {
    if (isNamedMdxElement(child, "PaperViewStructuredTable")) {
      validateStructuredTable(child as MdxElement);
    }
    if ("children" in child) validateStructuredTables(child);
  }
}

/**
 * Lower direct paper-table MDX primitives to native table elements.
 *
 * Layout props get no structure or presentation-value validation: direct
 * composition has the same author-owned validity boundary as ordinary React
 * and HTML table markup. The exception is columnWidths, whose equal value
 * has a structural limit. It and the meanings are checked only when
 * validateMeanings is set, matching the RTQ web build's rules.
 */
export const remarkPaperStructuredTable: Plugin<
  [PaperStructuredTableOptions?],
  Root
> = (options) => (tree) => {
  if (options?.validateMeanings) validateStructuredTables(tree);
  transformChildren(tree, false);
};

/** Preserve native lowercase HTML when a legacy renderer enables MDX parsing. */
export const remarkPaperNativeMdx: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree, true);
};
