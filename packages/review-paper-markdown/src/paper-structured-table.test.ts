import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { remarkPaperListMdx, remarkPaperStructuredTable } from "./index.ts";
import { rehypePaperTable } from "./paper-table.ts";
import { validatePaperTableMarkdown } from "./validate.ts";

const structuredTable = [
  '<PaperViewStructuredTable aria-label="Number grid" borderModel="cells" cellBorder="all" cellAlign="center" density="roomy">',
  "  <PaperViewTableCaption>Crossnumber</PaperViewTableCaption>",
  "  <PaperViewTableHead>",
  "    <PaperViewTableRow>",
  '      <PaperViewTableHeaderCell scope="col">Column</PaperViewTableHeaderCell>',
  "    </PaperViewTableRow>",
  "  </PaperViewTableHead>",
  "  <PaperViewTableBody>",
  '    <PaperViewTableRow cellBorder="none">',
  '      <PaperViewTableCell cellBorder="all" tone="blocked" />',
  "      <PaperViewTableCell>",
  "        <PaperViewTableCellLabel>$1$</PaperViewTableCellLabel>",
  "        $49$",
  "      </PaperViewTableCell>",
  "    </PaperViewTableRow>",
  "  </PaperViewTableBody>",
  "</PaperViewStructuredTable>",
].join("\n");

async function render(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperStructuredTable)
    .use(remarkRehype)
    .use(rehypePaperTable)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

test("renders the structured vocabulary as native table semantics", async () => {
  const html = await render(structuredTable);

  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-cell-align="center"/,
  );
  assert.match(html, /data-density="roomy"/);
  assert.doesNotMatch(html, /data-grid/);
  assert.match(html, /data-border-model="cells"/);
  assert.match(html, /data-cell-border="all"/);
  assert.match(html, /data-paper-table=""/);
  assert.match(html, /<table aria-label="Number grid">/);
  assert.match(html, /<caption>Crossnumber<\/caption>/);
  assert.match(html, /<thead>/);
  assert.match(html, /<tbody>/);
  assert.match(html, /<tr data-cell-border="none">/);
  assert.match(html, /<th scope="col">Column<\/th>/);
  assert.match(
    html,
    /<td data-cell-border="all" data-tone="blocked"><span data-paper-table-hidden-text="">shaded<\/span> <\/td>/,
  );
  assert.match(
    html,
    /<span data-paper-table-cell-label="">[\s\S]*>1<\/code><\/span>/,
  );
  assert.match(html, /49/);
  assert.doesNotMatch(html, /PaperViewStructuredTable|PaperViewTableCell/);
});

test("passes an authored density and grid through", async () => {
  const html = await render(
    '<PaperViewStructuredTable density="regular" grid="framed"><PaperViewTableBody /></PaperViewStructuredTable>',
  );

  assert.match(html, /data-density="regular"/);
  assert.match(html, /data-grid="framed"/);
});

test("renders without validating direct structure or presentation values", async () => {
  const html = await render(
    '<PaperViewStructuredTable density="authored-value"><PaperViewTableCell tone="custom">Value</PaperViewTableCell></PaperViewStructuredTable>',
  );

  assert.match(html, /data-density="authored-value"/);
  assert.match(html, /data-border-model="table"/);
  assert.doesNotMatch(html, /data-cell-border=/);
  assert.match(html, /<table><td data-tone="custom">Value<\/td><\/table>/);
});

function meaningsTable(
  options: Readonly<{
    bodyRows?: readonly string[];
    headCell?: string;
    root?: string;
  }> = {},
): string {
  return [
    `<PaperViewStructuredTable${options.root ? ` ${options.root}` : ""}>`,
    "  <PaperViewTableHead>",
    "    <PaperViewTableRow>",
    `      ${options.headCell ?? "<PaperViewTableHeaderCell>Item</PaperViewTableHeaderCell>"}`,
    "      <PaperViewTableHeaderCell>Count</PaperViewTableHeaderCell>",
    "    </PaperViewTableRow>",
    "  </PaperViewTableHead>",
    "  <PaperViewTableBody>",
    ...(options.bodyRows ?? [
      "    <PaperViewTableRow>",
      "      <PaperViewTableCell>Red</PaperViewTableCell>",
      "      <PaperViewTableCell>4</PaperViewTableCell>",
      "    </PaperViewTableRow>",
      '    <PaperViewTableRow mark="answer">',
      "      <PaperViewTableCell>Total</PaperViewTableCell>",
      '      <PaperViewTableCell tone="blocked" />',
      "    </PaperViewTableRow>",
    ]),
    "  </PaperViewTableBody>",
    "</PaperViewStructuredTable>",
  ].join("\n");
}

test("carries strong row labels from the structured root", async () => {
  const labelled = [
    '<PaperViewStructuredTable aria-label="Labelled" rowHeaderWeight="strong">',
    "  <PaperViewTableBody>",
    "    <PaperViewTableRow>",
    '      <PaperViewTableHeaderCell scope="row">Label</PaperViewTableHeaderCell>',
    "      <PaperViewTableCell>Value</PaperViewTableCell>",
    "    </PaperViewTableRow>",
    "  </PaperViewTableBody>",
    "</PaperViewStructuredTable>",
  ].join("\n");
  const html = await render(labelled);

  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-row-header-weight="strong"/,
  );
  assert.match(html, /<table aria-label="Labelled">/);
  assert.doesNotMatch(await render(structuredTable), /data-row-header-weight/);
});

test("writes equal structured columns from the widest row with colSpan", async () => {
  const teams = [
    '<PaperViewStructuredTable aria-label="Teams" columnWidths="equal">',
    "  <PaperViewTableCaption>Scores</PaperViewTableCaption>",
    "  <PaperViewTableHead>",
    "    <PaperViewTableRow>",
    '      <PaperViewTableHeaderCell colSpan="2" scope="col">Team A</PaperViewTableHeaderCell>',
    '      <PaperViewTableHeaderCell colSpan="2" scope="col">Team B</PaperViewTableHeaderCell>',
    "    </PaperViewTableRow>",
    "  </PaperViewTableHead>",
    "  <PaperViewTableBody>",
    "    <PaperViewTableRow>",
    "      <PaperViewTableCell>1</PaperViewTableCell>",
    "      <PaperViewTableCell>12</PaperViewTableCell>",
    "      <PaperViewTableCell />",
    "      <PaperViewTableCell>4</PaperViewTableCell>",
    "    </PaperViewTableRow>",
    "  </PaperViewTableBody>",
    "</PaperViewStructuredTable>",
  ].join("\n");
  const html = await render(teams);

  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-column-widths="equal"/,
  );
  assert.match(
    html,
    /<table aria-label="Teams" style="--rtq-paper-table-column-count: 4">\s*<caption>Scores<\/caption>\s*<colgroup data-slot="paper-table-columns"><col><col><col><col><\/colgroup>\s*<thead>/,
  );
  assert.doesNotThrow(() => validatePaperTableMarkdown(teams));
  assert.doesNotMatch(
    await render(structuredTable),
    /data-column-widths|colgroup|column-count/,
  );
});

test("renders structured meanings with their words for assistive tech", async () => {
  const html = await render(meaningsTable({ root: 'totals="both"' }));

  assert.match(html, /<div class="rtq-paper-table"[^>]*data-totals="both"/);
  assert.doesNotMatch(html, /<table[^>]*data-totals/);
  assert.match(
    html,
    /<tr data-mark="answer">\s*<td data-tone="default"><span data-paper-table-hidden-text="">Answer row<\/span> Total<\/td>\s*<td data-tone="blocked"><span data-paper-table-hidden-text="">shaded<\/span> <\/td>/,
  );

  const cell = await render(
    meaningsTable({
      bodyRows: [
        "    <PaperViewTableRow>",
        '      <PaperViewTableCell mark="answer" tone="blocked">12</PaperViewTableCell>',
        "    </PaperViewTableRow>",
      ],
    }),
  );
  assert.match(
    cell,
    /<td data-mark="answer" data-tone="blocked"><span data-paper-table-hidden-text="">Answer cell<\/span> <span data-paper-table-hidden-text="">shaded<\/span> 12<\/td>/,
  );
});

test("validates structured meanings with the RTQ web build rules", () => {
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(meaningsTable({ root: 'totals="both"' })),
  );
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(structuredTable.replace('tone="blocked"', "")),
  );

  const twoMarks = [
    '    <PaperViewTableRow mark="answer">',
    "      <PaperViewTableCell>Red</PaperViewTableCell>",
    '      <PaperViewTableCell mark="answer">4</PaperViewTableCell>',
    "    </PaperViewTableRow>",
  ];
  const cases: ReadonlyArray<readonly [string, RegExp]> = [
    [
      meaningsTable({ root: 'totals="rows"' }),
      /PaperViewStructuredTable prop "totals" received "rows"; allowed values: row, column, both\./,
    ],
    [
      meaningsTable({
        bodyRows: [
          "    <PaperViewTableRow>",
          "      <PaperViewTableCell>Red</PaperViewTableCell>",
          "    </PaperViewTableRow>",
        ],
        root: 'totals="row"',
      }),
      /PaperViewStructuredTable prop "totals" received "row", but a totals row needs at least two body rows; the body has 1\./,
    ],
    [
      structuredTable.replace('tone="blocked"', 'tone="grey"'),
      /PaperViewTableCell prop "tone" received "grey"; allowed values: default, blocked\./,
    ],
    [
      structuredTable.replace('tone="blocked"', 'tone="muted"'),
      /PaperViewTableCell prop "tone" received "muted"; "muted" was renamed to "blocked"; allowed values: default, blocked\./,
    ],
    [
      meaningsTable({ bodyRows: twoMarks }),
      /PaperViewStructuredTable allows one answer mark; received 2\. Mark one row or one cell\./,
    ],
    [
      meaningsTable({
        bodyRows: [
          '    <PaperViewTableRow mark="correct">',
          "      <PaperViewTableCell>Red</PaperViewTableCell>",
          "    </PaperViewTableRow>",
        ],
      }),
      /PaperViewTableRow prop "mark" received "correct"; allowed values: answer\./,
    ],
    [
      meaningsTable({
        headCell: '<PaperViewTableCell mark="answer">Item</PaperViewTableCell>',
        bodyRows: [],
      }),
      /PaperViewTableCell mark="answer" must be inside PaperViewTableBody/,
    ],
    [
      meaningsTable({ root: 'columnWidths="fixed"' }),
      /PaperViewStructuredTable prop "columnWidths" received "fixed"; allowed values: content, equal\./,
    ],
    [
      meaningsTable({
        bodyRows: [
          "    <PaperViewTableRow>",
          '      <PaperViewTableHeaderCell scope="row">Red</PaperViewTableHeaderCell>',
          "      <PaperViewTableCell>4</PaperViewTableCell>",
          "    </PaperViewTableRow>",
        ],
        root: 'columnWidths="equal"',
      }),
      /PaperViewStructuredTable prop "columnWidths" received "equal" with a PaperViewTableHeaderCell scope="row"; equal cannot be combined with row labels in v1/,
    ],
  ];

  for (const [source, message] of cases) {
    assert.throws(() => validatePaperTableMarkdown(source), message);
  }
});

test("shares adjacent-table rhythm and muted annotation colours", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );

  assert.match(
    css,
    /\.rtq-paper-table \+ \.rtq-paper-table\s*\{[^}]*margin-block-start: var\(--rtq-paper-rich-text-table-space, 1\.75rem\);/s,
  );
  assert.match(
    css,
    /\.rtq-maths-cell-label-number,[\s\S]*\.rtq-maths-equation-number,[\s\S]*\.rtq-maths-working-annotation\s*\{[^}]*color: var\(--muted, currentColor\);/s,
  );
  assert.match(
    css,
    /\[data-border-model="cells"\]\[data-cell-border="all"\][\s\S]*border-block: var\(--rtq-paper-table-border-medium\);/,
  );
  assert.match(css, /tr\[data-cell-border="none"\][\s\S]*border: 0;/);
  assert.match(
    css,
    /:where\(th, td\)\[data-cell-border="all"\][\s\S]*border-inline: var\(--rtq-paper-table-border-medium\);/,
  );
});
