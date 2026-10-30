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

test("counts a structured row-label column in equal widths", async () => {
  const labelled = meaningsTable({
    bodyRows: [
      "    <PaperViewTableRow>",
      '      <PaperViewTableHeaderCell scope="row">Red</PaperViewTableHeaderCell>',
      "      <PaperViewTableCell>4</PaperViewTableCell>",
      "    </PaperViewTableRow>",
    ],
    root: 'columnWidths="equal"',
  });

  assert.doesNotThrow(() => validatePaperTableMarkdown(labelled));
  assert.match(
    await render(labelled),
    /<colgroup data-slot="paper-table-columns"><col><col><\/colgroup>/,
  );
});

test("renders structured meanings with their words for assistive tech", async () => {
  const html = await render(
    meaningsTable({
      root: 'horizontalDensity="tight" totals="both" verticalDensity="regular"',
    }),
  );

  assert.match(html, /<div class="rtq-paper-table"[^>]*data-totals="both"/);
  assert.doesNotMatch(html, /<table[^>]*data-totals/);
  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-horizontal-density="tight"/,
  );
  assert.doesNotMatch(html, /<table[^>]*data-horizontal-density/);
  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-vertical-density="regular"/,
  );
  assert.doesNotMatch(html, /<table[^>]*data-vertical-density/);
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

  const fills = await render(
    meaningsTable({
      bodyRows: [
        "    <PaperViewTableRow>",
        '      <PaperViewTableCell tone="shaded">3</PaperViewTableCell>',
        '      <PaperViewTableCell mark="answer" swatch="grey">12</PaperViewTableCell>',
        '      <PaperViewTableCell swatch="pale-grey">7</PaperViewTableCell>',
        "    </PaperViewTableRow>",
      ],
    }),
  );
  assert.match(
    fills,
    /<td data-tone="shaded"><span data-paper-table-hidden-text="">shaded<\/span> 3<\/td>/,
  );
  assert.match(
    fills,
    /<td data-mark="answer" data-swatch="grey" data-tone="default"><span data-paper-table-hidden-text="">Answer cell<\/span> <span data-paper-table-hidden-text="">grey<\/span> 12<\/td>/,
  );
  assert.match(
    fills,
    /<td data-swatch="pale-grey" data-tone="default"><span data-paper-table-hidden-text="">pale grey<\/span> 7<\/td>/,
  );
  assert.doesNotMatch(fills, / swatch=/);
});

test("validates structured meanings with the RTQ web build rules", () => {
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(meaningsTable({ root: 'totals="both"' })),
  );
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(structuredTable.replace('tone="blocked"', "")),
  );
  for (const fill of [
    'tone="shaded"',
    'swatch="grey"',
    'swatch="grey" tone="default"',
  ]) {
    assert.doesNotThrow(() =>
      validatePaperTableMarkdown(
        structuredTable.replace('tone="blocked"', fill),
      ),
    );
  }

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
      /PaperViewTableCell prop "tone" received "grey"; allowed values: default, shaded, blocked\./,
    ],
    [
      structuredTable.replace('tone="blocked"', 'tone="muted"'),
      /PaperViewTableCell prop "tone" received "muted"; "muted" was renamed to "blocked"; allowed values: default, shaded, blocked\./,
    ],
    [
      structuredTable.replace('tone="blocked"', 'swatch="light-grey"'),
      /PaperViewTableCell prop "swatch" received "light-grey"; allowed values: black, white, grey, pale-grey, red, orange, yellow, green, blue, purple, pink, brown\./,
    ],
    [
      structuredTable.replace('tone="blocked"', 'swatch="grey" tone="shaded"'),
      /PaperViewTableCell takes swatch or tone, not both; both fill the cell\. Use swatch when the question names the colour, otherwise tone\./,
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
      meaningsTable({ root: 'horizontalDensity="slim"' }),
      /PaperViewStructuredTable prop "horizontalDensity" received "slim"; allowed values: tight, compact, regular, roomy\./,
    ],
    [
      meaningsTable({ root: 'verticalDensity="tight"' }),
      /PaperViewStructuredTable prop "verticalDensity" received "tight"; allowed values: compact, regular, roomy\./,
    ],
    [
      meaningsTable({
        headCell:
          '<PaperViewTableHeaderCell cellAlign="start">Item</PaperViewTableHeaderCell>',
      }),
      /PaperViewTableHeaderCell prop "cellAlign" received "start"; allowed values: center, left, right\./,
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

test("lets cell-owned borders decide the label, totals and row-group rules", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );

  assert.match(
    css,
    /tr\[data-cell-border="none"\]\s*> :where\(th, td\) \{\s*--rtq-paper-table-cell-rule-style: none;/,
  );
  assert.match(
    css,
    /\[data-border-model="cells"\]\s*tbody\s*> tr\s*> :where\(th\[scope="row"\]\):not\(:last-child\),[\s\S]*?border-inline-end: var\(--rtq-paper-table-stroke-width-firm\)\s*var\(--rtq-paper-table-cell-rule-style, solid\)/,
  );
  assert.equal(
    css.match(
      /border-(block|inline)-start: var\(--rtq-paper-table-stroke-width-firm\)\s*var\(--rtq-paper-table-cell-rule-style, solid\)/g,
    )?.length,
    3,
  );
});

test("lets a row or cell set its own alignment over the table cellAlign", async () => {
  const source = [
    '<PaperViewStructuredTable aria-label="Ingredients" cellAlign="left">',
    "  <PaperViewTableHead>",
    '    <PaperViewTableRow cellAlign="center">',
    '      <PaperViewTableHeaderCell colSpan="2" scope="colgroup">Ingredients</PaperViewTableHeaderCell>',
    "    </PaperViewTableRow>",
    "  </PaperViewTableHead>",
    "  <PaperViewTableBody>",
    "    <PaperViewTableRow>",
    '      <PaperViewTableCell cellAlign="right">180 g</PaperViewTableCell>',
    "      <PaperViewTableCell>flour</PaperViewTableCell>",
    "    </PaperViewTableRow>",
    "  </PaperViewTableBody>",
    "</PaperViewStructuredTable>",
  ].join("\n");
  const html = await render(source);
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  ).replace(/\s+/g, " ");

  assert.doesNotThrow(() => validatePaperTableMarkdown(source));
  assert.match(html, /<tr data-cell-align="center">/);
  assert.match(
    html,
    /<td data-cell-align="right" data-tone="default">180 g<\/td>/,
  );
  assert.match(html, /<td data-tone="default">flour<\/td>/);
  for (const value of ["center", "left", "right"]) {
    assert.ok(
      css.includes(
        `.rtq-paper-table tr > :is(th, td):is( [data-cell-align="${value}"], tr[data-cell-align="${value}"] > :not([data-cell-align]) ) { text-align: ${value}; }`,
      ),
    );
  }
});

test("lets a row or cell draw its own box over the table-model grid", async () => {
  const html = await render(
    [
      '<PaperViewStructuredTable aria-label="Timetable" grid="axes">',
      "  <PaperViewTableBody>",
      "    <PaperViewTableRow>",
      '      <PaperViewTableHeaderCell scope="row">Haymarket</PaperViewTableHeaderCell>',
      '      <PaperViewTableCell cellBorder="all" />',
      "    </PaperViewTableRow>",
      "  </PaperViewTableBody>",
      "</PaperViewStructuredTable>",
    ].join("\n"),
  );
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  ).replace(/\s+/g, " ");

  assert.match(html, /data-border-model="table"/);
  assert.match(html, /data-grid="axes"/);
  assert.match(html, /<td data-cell-border="all"/);
  assert.ok(
    css.includes(
      '.rtq-paper-table:not([data-border-model="cells"]) :is(thead, tbody) > tr[data-cell-border="all"] > :is(th, td), .rtq-paper-table:not([data-border-model="cells"]) :is(thead, tbody) > tr > :is(th, td)[data-cell-border="all"] { border-block: var(--rtq-paper-table-border-medium); border-inline: var(--rtq-paper-table-border-medium); }',
    ),
  );
});
