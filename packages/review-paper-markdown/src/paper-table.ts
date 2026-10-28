import type { Data, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

export const PAPER_TABLE_DENSITIES = ["compact", "regular", "roomy"] as const;
export const PAPER_TABLE_GRIDS = [
  "framed",
  "horizontal",
  "interior",
  "none",
  "outline",
  "rows",
  "vertical",
] as const;
export const PAPER_TABLE_CELL_ALIGNS = ["center", "left", "right"] as const;
export const PAPER_TABLE_WIDTHS = ["fit", "full"] as const;
export const PAPER_TABLE_ALIGNS = ["start", "center", "end"] as const;
export const PAPER_TABLE_COLUMN_HEADERS = ["first-row", "none"] as const;
export const PAPER_TABLE_ROW_HEADERS = ["none", "first-column"] as const;
export const PAPER_TABLE_BLANK_CORNERS = ["ruled", "open"] as const;
export const PAPER_TABLE_FIRST_COLUMN_START_PADDINGS = [
  "default",
  "none",
] as const;
export const PAPER_TABLE_INDENTS = ["none", "sm", "md"] as const;
export const PAPER_TABLE_TOTALS = ["row", "column", "both"] as const;

export const PAPER_TABLE_PROP_VALUES = {
  align: PAPER_TABLE_ALIGNS,
  blankCorner: PAPER_TABLE_BLANK_CORNERS,
  cellAlign: PAPER_TABLE_CELL_ALIGNS,
  columnHeaders: PAPER_TABLE_COLUMN_HEADERS,
  density: PAPER_TABLE_DENSITIES,
  firstColumnStartPadding: PAPER_TABLE_FIRST_COLUMN_START_PADDINGS,
  grid: PAPER_TABLE_GRIDS,
  indent: PAPER_TABLE_INDENTS,
  rowHeaders: PAPER_TABLE_ROW_HEADERS,
  totals: PAPER_TABLE_TOTALS,
  width: PAPER_TABLE_WIDTHS,
} as const;

export type PaperTablePropName = keyof typeof PAPER_TABLE_PROP_VALUES;
export type PaperTablePropValue<Name extends PaperTablePropName> =
  (typeof PAPER_TABLE_PROP_VALUES)[Name][number];
/**
 * Props whose default depends on the voice of the field the table sits in.
 * They have no fixed default: an unset value is not emitted, so the CSS picks
 * the voice default (framed in a question, horizontal everywhere else).
 */
export type PaperTableVoiceDefaultPropName = "grid";
/** Meanings with no default: an unset value means the table has none. */
export type PaperTableOptionalPropName = "totals";
export type PaperTableFixedDefaultPropName = Exclude<
  PaperTablePropName,
  PaperTableVoiceDefaultPropName | PaperTableOptionalPropName
>;
export type PaperTableConfig = {
  [Name in PaperTableFixedDefaultPropName]: PaperTablePropValue<Name>;
} & {
  [
    Name in PaperTableVoiceDefaultPropName | PaperTableOptionalPropName
  ]?: PaperTablePropValue<Name>;
};

export const PAPER_TABLE_DEFAULTS = {
  align: "start",
  blankCorner: "ruled",
  cellAlign: "center",
  columnHeaders: "first-row",
  density: "roomy",
  firstColumnStartPadding: "default",
  indent: "none",
  rowHeaders: "none",
  width: "fit",
} as const satisfies {
  [Name in PaperTableFixedDefaultPropName]: PaperTablePropValue<Name>;
};

/**
 * Superseded authored values. Each is still accepted and resolves to its
 * canonical replacement until the content migration (web PRD T7) removes it.
 */
export const PAPER_TABLE_DEPRECATED_ALIASES = {
  density: { default: "regular" },
} as const satisfies {
  [Name in PaperTablePropName]?: Record<string, PaperTablePropValue<Name>>;
};

export const PAPER_TABLE_PROP_NAMES = Object.keys(
  PAPER_TABLE_PROP_VALUES,
) as PaperTablePropName[];

/**
 * PaperTable's answer mark (04 §5). Positions count body rows and columns
 * from 1, after header semantics apply.
 */
export const PAPER_TABLE_ANSWER_PROP_FORMATS = {
  answerCell: '"<body row>,<column>", each counted from 1',
  answerRow: '"<body row>", counted from 1',
} as const;

export type PaperTableAnswerPropName =
  keyof typeof PAPER_TABLE_ANSWER_PROP_FORMATS;

export type PaperTableAnswerPosition = {
  column?: number;
  row: number;
};

export const PAPER_TABLE_ANSWER_PROP_NAMES = Object.keys(
  PAPER_TABLE_ANSWER_PROP_FORMATS,
) as PaperTableAnswerPropName[];

const PAPER_TABLE_ANSWER_PROP_PATTERNS = {
  answerCell: /^([1-9]\d*),([1-9]\d*)$/,
  answerRow: /^([1-9]\d*)$/,
} as const satisfies Record<PaperTableAnswerPropName, RegExp>;

export function isPaperTableAnswerPropName(
  value: string,
): value is PaperTableAnswerPropName {
  return Object.hasOwn(PAPER_TABLE_ANSWER_PROP_FORMATS, value);
}

/** Returns undefined for a malformed value. */
export function parsePaperTableAnswerPosition(
  name: PaperTableAnswerPropName,
  value: string,
): PaperTableAnswerPosition | undefined {
  const match = PAPER_TABLE_ANSWER_PROP_PATTERNS[name].exec(value);
  if (!match) return undefined;
  return name === "answerCell"
    ? { column: Number(match[2]), row: Number(match[1]) }
    : { row: Number(match[1]) };
}

export const PAPER_TABLE_MARKS = ["answer"] as const;
export type PaperTableMark = (typeof PAPER_TABLE_MARKS)[number];

export function isPaperTableMark(value: unknown): value is PaperTableMark {
  return (
    typeof value === "string" &&
    (PAPER_TABLE_MARKS as readonly string[]).includes(value)
  );
}

/**
 * Visually hidden text that carries each meaning to assistive tech. Cells
 * without a meaning get none; screen readers announce an empty one as blank.
 */
export const PAPER_TABLE_HIDDEN_TEXT = {
  answerCell: "Answer cell",
  answerRow: "Answer row",
  blocked: "shaded",
} as const;

const SUPPORTED_PROP_NAMES = [
  ...PAPER_TABLE_PROP_NAMES,
  ...PAPER_TABLE_ANSWER_PROP_NAMES,
].join(", ");

function paperTableDefault(name: PaperTablePropName): string | undefined {
  return Object.hasOwn(PAPER_TABLE_DEFAULTS, name)
    ? PAPER_TABLE_DEFAULTS[name as PaperTableFixedDefaultPropName]
    : undefined;
}

function resolvePaperTableDeprecatedAlias(
  name: PaperTablePropName,
  value: unknown,
): unknown {
  const aliases: Readonly<Record<string, string>> | undefined =
    PAPER_TABLE_DEPRECATED_ALIASES[
      name as keyof typeof PAPER_TABLE_DEPRECATED_ALIASES
    ];
  return typeof value === "string" && aliases && Object.hasOwn(aliases, value)
    ? aliases[value]
    : value;
}

type AstPoint = Readonly<{ column?: number; line?: number }>;
type AstNode = {
  attributes?: unknown[];
  children?: unknown[];
  data?: Data & Readonly<{ hProperties?: Readonly<Record<string, unknown>> }>;
  name?: unknown;
  position?: Readonly<{ start?: AstPoint }>;
  properties?: Record<string, unknown>;
  tagName?: unknown;
  type: string;
  value?: unknown;
};
type PaperTableAttribute = Readonly<{
  name: PaperTablePropName;
  node: AstNode;
  value: string;
}>;
type PaperTableAnswerAttribute = Readonly<{
  name: PaperTableAnswerPropName;
  node: AstNode;
  position: PaperTableAnswerPosition;
  value: string;
}>;
type PaperTableAttributes = Readonly<{
  answers: PaperTableAnswerAttribute[];
  props: PaperTableAttribute[];
}>;
type MarkdownFence = Readonly<{ character: "`" | "~"; length: number }>;

const MARKDOWN_FENCE = /^ {0,3}(`{3,}|~{3,})/;
const PAPER_TABLE_TAG = /<\/?PaperTable\b[^>\r\n]*(?:>|$)/g;
const PAPER_TABLE_TOKEN = /<\/?PaperTable\b/;
const PAPER_STRUCTURED_TABLE_TOKEN = /<PaperViewStructuredTable\b/;

function isAstNode(value: unknown): value is AstNode {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

function isParent(node: AstNode): node is AstNode & Parent {
  return Array.isArray(node.children);
}

function isPaperTable(node: AstNode): boolean {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "PaperTable"
  );
}

function isElement(node: unknown, tagName?: string): node is AstNode {
  return (
    isAstNode(node) &&
    node.type === "element" &&
    typeof node.tagName === "string" &&
    (tagName === undefined || node.tagName === tagName)
  );
}

function isTableNode(node: unknown): node is AstNode {
  return isAstNode(node) && node.type === "table";
}

function isTableCell(node: unknown): node is AstNode {
  return isAstNode(node) && node.type === "tableCell";
}

function throwPaperTableError(message: string, node: AstNode): never {
  throw Object.assign(new Error(message), {
    column: node.position?.start?.column,
    line: node.position?.start?.line,
    ruleId: "paper-table-authoring",
    source: "rtq-paper-table",
  });
}

export function isPaperTablePropName(
  value: string,
): value is PaperTablePropName {
  return Object.hasOwn(PAPER_TABLE_PROP_VALUES, value);
}

export function isPaperTablePropValue<Name extends PaperTablePropName>(
  name: Name,
  value: unknown,
): value is PaperTablePropValue<Name> {
  return (
    typeof value === "string" &&
    (PAPER_TABLE_PROP_VALUES[name] as readonly string[]).includes(value)
  );
}

function getAttributeForm(attribute: AstNode): string {
  if (attribute.type === "mdxJsxExpressionAttribute") {
    return "spread or expression attribute";
  }
  if (attribute.type !== "mdxJsxAttribute") {
    return `unsupported ${attribute.type} attribute`;
  }
  if (attribute.value === null || attribute.value === undefined) {
    return "boolean attribute";
  }
  if (typeof attribute.value === "object") {
    return "expression-valued attribute";
  }
  return `${typeof attribute.value}-valued attribute`;
}

function describeAllowedValues(
  name: PaperTablePropName | PaperTableAnswerPropName,
): string {
  return isPaperTableAnswerPropName(name)
    ? `expected ${PAPER_TABLE_ANSWER_PROP_FORMATS[name]}`
    : `allowed values: ${PAPER_TABLE_PROP_VALUES[name].join(", ")}`;
}

function getPaperTableAttributes(node: AstNode): PaperTableAttributes {
  const answers: PaperTableAnswerAttribute[] = [];
  const props: PaperTableAttribute[] = [];
  const seenNames = new Set<string>();

  for (const rawAttribute of node.attributes ?? []) {
    if (!isAstNode(rawAttribute)) {
      throwPaperTableError(
        `PaperTable received an unsupported attribute form; supported props: ${SUPPORTED_PROP_NAMES}.`,
        node,
      );
    }
    if (
      rawAttribute.type !== "mdxJsxAttribute" ||
      typeof rawAttribute.name !== "string"
    ) {
      throwPaperTableError(
        `PaperTable received ${getAttributeForm(rawAttribute)}; only static quoted-string props are supported: ${SUPPORTED_PROP_NAMES}.`,
        rawAttribute,
      );
    }

    const name = rawAttribute.name;
    if (!isPaperTablePropName(name) && !isPaperTableAnswerPropName(name)) {
      throwPaperTableError(
        `PaperTable prop ${JSON.stringify(name)} is unsupported; supported props: ${SUPPORTED_PROP_NAMES}.`,
        rawAttribute,
      );
    }
    if (seenNames.has(name)) {
      throwPaperTableError(
        `PaperTable prop ${JSON.stringify(name)} must be authored once; received a duplicate attribute.`,
        rawAttribute,
      );
    }
    seenNames.add(name);

    const allowedValues = describeAllowedValues(name);
    if (typeof rawAttribute.value !== "string") {
      throwPaperTableError(
        `PaperTable prop ${JSON.stringify(name)} must use a static quoted string; received ${getAttributeForm(rawAttribute)}; ${allowedValues}.`,
        rawAttribute,
      );
    }

    const value = rawAttribute.value;
    if (isPaperTableAnswerPropName(name)) {
      const position = parsePaperTableAnswerPosition(name, value);
      if (!position) {
        throwPaperTableError(
          `PaperTable prop ${JSON.stringify(name)} received ${JSON.stringify(value)}; ${allowedValues}.`,
          rawAttribute,
        );
      }
      answers.push({ name, node: rawAttribute, position, value });
      continue;
    }

    if (
      !isPaperTablePropValue(
        name,
        resolvePaperTableDeprecatedAlias(name, value),
      )
    ) {
      throwPaperTableError(
        `PaperTable prop ${JSON.stringify(name)} received ${JSON.stringify(value)}; ${allowedValues}.`,
        rawAttribute,
      );
    }
    props.push({ name, node: rawAttribute, value });
  }

  return { answers, props };
}

function resolvePaperTableConfig(
  attributes: readonly PaperTableAttribute[],
): PaperTableConfig {
  const authored = Object.fromEntries(
    attributes.map(({ name, value }) => [
      name,
      resolvePaperTableDeprecatedAlias(name, value),
    ]),
  ) as Partial<Record<PaperTablePropName, string>>;
  return Object.fromEntries(
    PAPER_TABLE_PROP_NAMES.map((name) => [
      name,
      authored[name] ?? paperTableDefault(name),
    ]),
  ) as PaperTableConfig;
}

function getOnlyDirectTable(node: AstNode): AstNode {
  const significantChildren = (node.children ?? []).filter(
    (child) =>
      !(
        isAstNode(child) &&
        child.type === "text" &&
        typeof child.value === "string" &&
        child.value.trim() === ""
      ),
  );
  if (
    significantChildren.length !== 1 ||
    !isTableNode(significantChildren[0])
  ) {
    throwPaperTableError(
      "PaperTable requires exactly one direct GFM table child.",
      node,
    );
  }
  return significantChildren[0];
}

function isEmptyAuthoredCell(node: AstNode): boolean {
  return (node.children ?? []).every(
    (child) =>
      isAstNode(child) &&
      child.type === "text" &&
      typeof child.value === "string" &&
      child.value.trim() === "",
  );
}

function validateBlankCorner(
  table: AstNode,
  config: PaperTableConfig,
  attributes: readonly PaperTableAttribute[],
  owner: AstNode,
): void {
  if (config.blankCorner !== "open") return;
  const blankCornerNode =
    attributes.find(({ name }) => name === "blankCorner")?.node ?? owner;
  if (
    config.columnHeaders !== "first-row" ||
    config.rowHeaders !== "first-column"
  ) {
    throwPaperTableError(
      'PaperTable prop "blankCorner" received "open"; open requires columnHeaders="first-row" and rowHeaders="first-column".',
      blankCornerNode,
    );
  }
  const firstRow = table.children?.[0];
  const firstCell = isAstNode(firstRow) ? firstRow.children?.[0] : undefined;
  if (!isTableCell(firstCell) || !isEmptyAuthoredCell(firstCell)) {
    throwPaperTableError(
      'PaperTable prop "blankCorner" received "open", but the first column-header cell contains authored content.',
      blankCornerNode,
    );
  }
}

function getMdastBodyRows(
  table: AstNode,
  columnHeaders: PaperTableConfig["columnHeaders"],
): AstNode[] {
  const rows = (table.children ?? []).filter(isAstNode);
  return columnHeaders === "first-row" ? rows.slice(1) : rows;
}

/** GFM renders every row at the delimiter row's width. */
function getMdastColumnCount(table: AstNode): number {
  const align = (table as { align?: unknown }).align;
  return Array.isArray(align) ? align.length : 0;
}

export function getPaperTableTotalsCountError(
  totals: PaperTablePropValue<"totals">,
  bodyRowCount: number,
  columnCount: number,
): string | undefined {
  if (totals !== "column" && bodyRowCount < 2) {
    return `a totals row needs at least two body rows; the body has ${bodyRowCount}.`;
  }
  if (totals !== "row" && columnCount < 2) {
    return `a totals column needs at least two columns; the table has ${columnCount}.`;
  }
  return undefined;
}

function validateTotals(
  table: AstNode,
  config: PaperTableConfig,
  attributes: readonly PaperTableAttribute[],
  owner: AstNode,
): void {
  if (!config.totals) return;
  const reason = getPaperTableTotalsCountError(
    config.totals,
    getMdastBodyRows(table, config.columnHeaders).length,
    getMdastColumnCount(table),
  );
  if (reason) {
    throwPaperTableError(
      `PaperTable prop "totals" received ${JSON.stringify(config.totals)}, but ${reason}`,
      attributes.find(({ name }) => name === "totals")?.node ?? owner,
    );
  }
}

function validateAnswerMark(
  table: AstNode,
  config: PaperTableConfig,
  answers: readonly PaperTableAnswerAttribute[],
): PaperTableAnswerAttribute | undefined {
  if (answers.length === 0) return undefined;
  if (answers.length > 1) {
    throwPaperTableError(
      "PaperTable allows one answer mark; received both answerRow and answerCell. Mark the row or the cell, not both.",
      answers[1].node,
    );
  }

  const [answer] = answers;
  const bodyRowCount = getMdastBodyRows(table, config.columnHeaders).length;
  if (answer.position.row > bodyRowCount) {
    throwPaperTableError(
      `PaperTable prop ${JSON.stringify(answer.name)} received ${JSON.stringify(answer.value)}, but the table body has ${bodyRowCount} row${bodyRowCount === 1 ? "" : "s"}.`,
      answer.node,
    );
  }
  const columnCount = getMdastColumnCount(table);
  if (
    answer.position.column !== undefined &&
    answer.position.column > columnCount
  ) {
    throwPaperTableError(
      `PaperTable prop "answerCell" received ${JSON.stringify(answer.value)}, but body row ${answer.position.row} has ${columnCount} column${columnCount === 1 ? "" : "s"}.`,
      answer.node,
    );
  }
  return answer;
}

function configurePaperTable(node: AstNode): AstNode {
  const { answers, props: attributes } = getPaperTableAttributes(node);
  const config = resolvePaperTableConfig(attributes);
  const table = getOnlyDirectTable(node);
  validateBlankCorner(table, config, attributes, node);
  validateTotals(table, config, attributes, node);
  const answer = validateAnswerMark(table, config, answers);

  const existingData = table.data ?? {};
  const existingProperties = existingData.hProperties ?? {};
  table.data = {
    ...existingData,
    hProperties: {
      ...existingProperties,
      "data-align": config.align,
      ...(answer
        ? {
            [answer.name === "answerRow"
              ? "data-answer-row"
              : "data-answer-cell"]: answer.value,
          }
        : {}),
      "data-blank-corner": config.blankCorner,
      "data-cell-align": config.cellAlign,
      ...(attributes.some(({ name }) => name === "cellAlign")
        ? { "data-cell-align-authored": "" }
        : {}),
      "data-column-headers": config.columnHeaders,
      "data-density": config.density,
      "data-first-column-start-padding": config.firstColumnStartPadding,
      ...(config.grid === undefined ? {} : { "data-grid": config.grid }),
      "data-indent": config.indent,
      "data-paper-table": "",
      "data-row-headers": config.rowHeaders,
      ...(config.totals === undefined ? {} : { "data-totals": config.totals }),
      "data-width": config.width,
    },
  };
  return table;
}

function transformPaperTableChildren(parent: AstNode & Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (!isAstNode(child)) continue;
    if (isPaperTable(child)) {
      const table = configurePaperTable(child);
      parent.children[index] = table as RootContent;
      if (isParent(table)) transformPaperTableChildren(table);
      continue;
    }
    if (isParent(child)) transformPaperTableChildren(child);
  }
}

export const remarkPaperTable: Plugin<[], Root> = () => (tree) => {
  transformPaperTableChildren(tree as AstNode & Parent);
};

function getDirectElement(node: AstNode, tagName: string): AstNode | undefined {
  return (node.children ?? []).find((child) => isElement(child, tagName)) as
    AstNode | undefined;
}

function getDirectElements(node: AstNode, tagName: string): AstNode[] {
  return (node.children ?? []).filter((child) =>
    isElement(child, tagName),
  ) as AstNode[];
}

function getProperties(node: AstNode): Record<string, unknown> {
  node.properties ??= {};
  return node.properties;
}

function getDataProperty(node: AstNode, name: string): unknown {
  const properties = getProperties(node);
  const camelName = `data${name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join("")}`;
  return properties[`data-${name}`] ?? properties[camelName];
}

function hasDataProperty(node: AstNode, name: string): boolean {
  const properties = getProperties(node);
  const camelName = `data${name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join("")}`;
  return (
    Object.hasOwn(properties, `data-${name}`) ||
    Object.hasOwn(properties, camelName)
  );
}

function deleteDataProperty(node: AstNode, name: string): void {
  const properties = getProperties(node);
  const camelName = `data${name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join("")}`;
  delete properties[`data-${name}`];
  delete properties[camelName];
}

function getHeaderRow(table: AstNode): AstNode | undefined {
  const tableHead = getDirectElement(table, "thead");
  return tableHead && getDirectElement(tableHead, "tr");
}

function applyColumnHeaderSemantics(
  table: AstNode,
  columnHeaders: PaperTableConfig["columnHeaders"],
  blankCorner: PaperTableConfig["blankCorner"],
): void {
  const tableHead = getDirectElement(table, "thead");
  const headerRow = getHeaderRow(table);
  if (!tableHead || !headerRow) return;

  if (columnHeaders === "first-row") {
    for (const [index, cell] of getDirectElements(headerRow, "th").entries()) {
      if (blankCorner === "open" && index === 0) {
        delete getProperties(cell).scope;
      } else {
        getProperties(cell).scope = "col";
      }
    }
    return;
  }

  for (const cell of getDirectElements(headerRow, "th")) {
    cell.tagName = "td";
    delete getProperties(cell).scope;
  }
  const tableChildren = table.children ?? [];
  const tableHeadIndex = tableChildren.indexOf(tableHead);
  let tableBody = getDirectElement(table, "tbody");
  if (tableBody) {
    tableChildren.splice(tableHeadIndex, 1);
    tableBody.children ??= [];
    tableBody.children.unshift(headerRow);
  } else {
    tableBody = {
      children: [headerRow],
      properties: {},
      tagName: "tbody",
      type: "element",
    };
    tableChildren.splice(tableHeadIndex, 1, tableBody);
  }
}

function applyRowHeaderSemantics(
  table: AstNode,
  rowHeaders: PaperTableConfig["rowHeaders"],
): void {
  if (rowHeaders === "none") return;
  const tableBody = getDirectElement(table, "tbody");
  if (!tableBody) return;
  for (const row of getDirectElements(tableBody, "tr")) {
    const firstCell = getDirectElement(row, "td");
    if (!firstCell) continue;
    firstCell.tagName = "th";
    getProperties(firstCell).scope = "row";
  }
}

function resolvedDataValue(
  table: AstNode,
  name: PaperTablePropName,
): string | undefined {
  const propertyName = name.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  );
  const value = resolvePaperTableDeprecatedAlias(
    name,
    getDataProperty(table, propertyName),
  );
  return isPaperTablePropValue(name, value) ? value : paperTableDefault(name);
}

function directDataValue(table: AstNode, name: PaperTablePropName): unknown {
  const propertyName = name.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  );
  const value = resolvePaperTableDeprecatedAlias(
    name,
    getDataProperty(table, propertyName),
  );
  return value ?? paperTableDefault(name);
}

function getRowCells(row: AstNode): AstNode[] {
  return (row.children ?? []).filter(
    (child): child is AstNode =>
      isElement(child, "td") || isElement(child, "th"),
  );
}

function getOwnRows(table: AstNode): AstNode[] {
  return ["thead", "tbody", "tfoot"].flatMap((section) =>
    getDirectElements(table, section).flatMap((group) =>
      getDirectElements(group, "tr"),
    ),
  );
}

function applyAnswerMark(table: AstNode): void {
  const answerRow = getDataProperty(table, "answer-row");
  const answerCell = getDataProperty(table, "answer-cell");
  const position =
    typeof answerRow === "string"
      ? parsePaperTableAnswerPosition("answerRow", answerRow)
      : typeof answerCell === "string"
        ? parsePaperTableAnswerPosition("answerCell", answerCell)
        : undefined;
  if (!position) return;

  const tableBody = getDirectElement(table, "tbody");
  const row = tableBody && getDirectElements(tableBody, "tr")[position.row - 1];
  if (!row) return;
  if (position.column === undefined) {
    getProperties(row).dataMark = "answer";
    return;
  }
  const cell = getRowCells(row)[position.column - 1];
  if (cell) getProperties(cell).dataMark = "answer";
}

function prependHiddenText(cell: AstNode, text: string): void {
  // The trailing space keeps the hidden words apart from the cell's own
  // content when assistive tech joins them; it collapses visually.
  cell.children = [
    {
      children: [{ type: "text", value: text }],
      properties: { dataPaperTableHiddenText: "" },
      tagName: "span",
      type: "element",
    },
    { type: "text", value: " " },
    ...(cell.children ?? []),
  ];
}

/**
 * Words for each meaning, in the order the web components render them:
 * "Answer cell", then "shaded", then the row's "Answer row", then content.
 */
function addMeaningHiddenText(table: AstNode): void {
  for (const row of getOwnRows(table)) {
    const cells = getRowCells(row);
    if (getDataProperty(row, "mark") === "answer" && cells[0]) {
      prependHiddenText(cells[0], PAPER_TABLE_HIDDEN_TEXT.answerRow);
    }
    for (const cell of cells) {
      if (getDataProperty(cell, "tone") === "blocked") {
        prependHiddenText(cell, PAPER_TABLE_HIDDEN_TEXT.blocked);
      }
      if (getDataProperty(cell, "mark") === "answer") {
        prependHiddenText(cell, PAPER_TABLE_HIDDEN_TEXT.answerCell);
      }
    }
  }
}

function prepareHastTable(table: AstNode): AstNode {
  const configured = hasDataProperty(table, "paper-table");
  const structured = hasDataProperty(table, "paper-structured-table");
  const gfmConfig = Object.fromEntries(
    PAPER_TABLE_PROP_NAMES.map((name) => [
      name,
      resolvedDataValue(table, name),
    ]),
  ) as PaperTableConfig;
  const renderConfig = structured
    ? Object.fromEntries(
        PAPER_TABLE_PROP_NAMES.map((name) => [
          name,
          directDataValue(table, name),
        ]),
      )
    : gfmConfig;
  const cellAlignAuthored = hasDataProperty(table, "cell-align-authored");
  const borderModel = getDataProperty(table, "border-model");
  const cellBorder = getDataProperty(table, "cell-border");

  if (configured && !structured) {
    applyColumnHeaderSemantics(
      table,
      gfmConfig.columnHeaders,
      gfmConfig.blankCorner,
    );
    applyRowHeaderSemantics(table, gfmConfig.rowHeaders);
    applyAnswerMark(table);
  }
  addMeaningHiddenText(table);

  for (const name of [
    "align",
    "answer-cell",
    "answer-row",
    "blank-corner",
    "border-model",
    "cell-border",
    "cell-align",
    "cell-align-authored",
    "column-headers",
    "density",
    "first-column-start-padding",
    "grid",
    "indent",
    "paper-table",
    "paper-structured-table",
    "row-headers",
    "totals",
    "width",
  ]) {
    deleteDataProperty(table, name);
  }

  return {
    children: [table],
    properties: {
      className: ["rtq-paper-table"],
      dataAlign: renderConfig.align,
      dataBlankCorner: renderConfig.blankCorner,
      ...(structured
        ? {
            dataBorderModel: borderModel ?? "table",
            ...((borderModel ?? "table") === "cells"
              ? { dataCellBorder: cellBorder ?? "all" }
              : {}),
          }
        : {}),
      dataCellAlign: renderConfig.cellAlign,
      ...(cellAlignAuthored ? { dataCellAlignAuthored: "" } : {}),
      dataDensity: renderConfig.density,
      dataFirstColumnStartPadding: renderConfig.firstColumnStartPadding,
      ...(renderConfig.grid === undefined
        ? {}
        : { dataGrid: renderConfig.grid }),
      dataIndent: renderConfig.indent,
      ...(configured || structured ? { dataPaperTable: "" } : {}),
      ...(renderConfig.totals === undefined
        ? {}
        : { dataTotals: renderConfig.totals }),
      dataWidth: renderConfig.width,
    },
    tagName: "div",
    type: "element",
  };
}

function transformHastTables(parent: AstNode): void {
  if (!Array.isArray(parent.children)) return;
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];
    if (!isAstNode(child)) continue;
    if (isElement(child, "table")) {
      transformHastTables(child);
      parent.children[index] = prepareHastTable(child);
      continue;
    }
    transformHastTables(child);
  }
}

export function rehypePaperTable() {
  return (tree: unknown): void => {
    if (isAstNode(tree)) transformHastTables(tree);
  };
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

function hasActiveToken(markdown: string, token: RegExp): boolean {
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
    } else if (token.test(content)) {
      return true;
    }
  }
  return false;
}

export function hasActivePaperTable(markdown: string): boolean {
  return hasActiveToken(markdown, PAPER_TABLE_TOKEN);
}

export function hasActivePaperStructuredTable(markdown: string): boolean {
  return hasActiveToken(markdown, PAPER_STRUCTURED_TABLE_TOKEN);
}

export function stripPaperTableWrapperLines(markdown: string): string {
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
      continue;
    }
    const strippedContent = content.replace(PAPER_TABLE_TAG, "");
    if (strippedContent === content) {
      output.push(line);
    } else if (strippedContent.trim()) {
      output.push(`${strippedContent}${line.slice(content.length)}`);
    }
  }
  return output.join("");
}
