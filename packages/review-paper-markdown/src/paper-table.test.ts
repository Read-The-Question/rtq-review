import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import {
  PAPER_TABLE_DEFAULTS,
  PAPER_TABLE_PROP_VALUES,
  rehypePaperTable,
  remarkPaperTable,
  stripPaperTableWrapperLines,
} from "./paper-table.ts";
import { remarkPaperListMdx } from "./index.ts";
import { hasMarkdownTable, validatePaperTableMarkdown } from "./validate.ts";

function tableSource(
  attributes = "",
  options: Readonly<{ header?: string; rows?: readonly string[] }> = {},
): string {
  return [
    attributes ? `<PaperTable ${attributes}>` : "<PaperTable>",
    "",
    options.header ?? "| Label | Value |",
    "| :--- | ---: |",
    ...(options.rows ?? ["| Alpha | $12$ |"]),
    "",
    "</PaperTable>",
  ].join("\n");
}

async function render(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperTable)
    .use(remarkRehype)
    .use(rehypePaperTable)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

test("uses the exact RTQ web PaperTable values and defaults", () => {
  assert.deepEqual(PAPER_TABLE_DEFAULTS, {
    align: "start",
    blankCorner: "ruled",
    cellAlign: "center",
    columnHeaders: "first-row",
    density: "roomy",
    firstColumnStartPadding: "default",
    indent: "none",
    rowHeaders: "none",
    width: "fit",
  });
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.density, [
    "compact",
    "regular",
    "roomy",
  ]);
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.grid, [
    "framed",
    "horizontal",
    "interior",
    "none",
    "outline",
    "rows",
    "vertical",
  ]);
});

test("accepts every canonical PaperTable prop value", () => {
  for (const [name, values] of Object.entries(PAPER_TABLE_PROP_VALUES)) {
    for (const value of values) {
      const blankCornerContext =
        name === "blankCorner" && value === "open"
          ? ' columnHeaders="first-row" rowHeaders="first-column"'
          : "";
      const source = tableSource(`${name}="${value}"${blankCornerContext}`, {
        header:
          name === "blankCorner" && value === "open"
            ? "| | Value |"
            : undefined,
        rows: ["| Alpha | $12$ |", "| Beta | $20$ |"],
      });
      assert.doesNotThrow(() => validatePaperTableMarkdown(source));
    }
  }
});

test("renders configured presentation state and preserves GFM alignment", async () => {
  const html = await render(
    tableSource(
      'align="end" cellAlign="right" density="compact" firstColumnStartPadding="none" grid="interior" indent="md" width="full"',
    ),
  );

  assert.match(
    html,
    /<div class="rtq-paper-table" data-align="end" data-blank-corner="ruled" data-cell-align="right" data-cell-align-authored="" data-density="compact" data-first-column-start-padding="none" data-grid="interior" data-indent="md" data-paper-table="" data-width="full">/,
  );
  assert.match(html, /<th align="left" scope="col">Label<\/th>/);
  assert.match(html, /<th align="right" scope="col">Value<\/th>/);
  assert.match(html, /<td align="left">Alpha<\/td>/);
  assert.match(html, /<td align="right">/);
  assert.doesNotMatch(html, /data-column-headers|data-row-headers/);
});

test("applies column, row, and open-corner semantics", async () => {
  const html = await render(
    tableSource(
      'columnHeaders="first-row" rowHeaders="first-column" blankCorner="open"',
      { header: "| | Value |", rows: ["| Alpha | 12 |", "| Beta | 20 |"] },
    ),
  );

  assert.match(html, /<th align="left"><\/th>/);
  assert.match(html, /<th align="right" scope="col">Value<\/th>/);
  assert.match(html, /<th align="left" scope="row">Alpha<\/th>/);
  assert.match(html, /<th align="left" scope="row">Beta<\/th>/);
});

test("demotes the GFM header row when columnHeaders is none", async () => {
  const html = await render(tableSource('columnHeaders="none"'));

  assert.doesNotMatch(html, /<thead>/);
  assert.match(html, /<tbody>\s*<tr>\s*<td align="left">Label<\/td>/);
});

test("leaves an unset grid to the voice default", async () => {
  const html = await render(tableSource());

  assert.match(html, /data-density="roomy"/);
  assert.match(html, /data-paper-table=""/);
  assert.doesNotMatch(html, /data-grid/);
});

test("accepts the deprecated density default as regular", async () => {
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(tableSource('density="default"')),
  );
  assert.match(
    await render(tableSource('density="default"')),
    /data-density="regular"/,
  );
  assert.throws(
    () => validatePaperTableMarkdown(tableSource('density="giant"')),
    /allowed values: compact, regular, roomy\./,
  );
});

test("wraps raw GFM tables with the same visual defaults", async () => {
  const html = await render("| A | B |\n| - | - |\n| 1 | 2 |");

  assert.match(html, /<div class="rtq-paper-table" data-align="start"/);
  assert.match(html, /data-density="roomy"/);
  assert.doesNotMatch(html, /data-grid/);
  assert.match(html, /data-width="fit"/);
  assert.doesNotMatch(html, /data-paper-table/);
  assert.doesNotMatch(html, /scope="col"/);
});

test("detects rendered tables without treating fenced examples as tables", () => {
  assert.equal(hasMarkdownTable("| A |\n| - |\n| 1 |"), true);
  assert.equal(hasMarkdownTable(tableSource()), true);
  assert.equal(
    hasMarkdownTable(
      "<PaperViewStructuredTable><PaperViewTableBody /></PaperViewStructuredTable>",
    ),
    true,
  );
  assert.equal(hasMarkdownTable("```md\n| A |\n| - |\n| 1 |\n```"), false);
  assert.equal(hasMarkdownTable("<PaperViewStructuredTable>"), false);
  assert.equal(hasMarkdownTable("A paragraph without a table."), false);
});

test("rejects non-canonical attributes and invalid structures", () => {
  const invalidSources = [
    tableSource('density="giant"'),
    tableSource('density=" compact"'),
    tableSource('densitty="compact"'),
    tableSource('density="compact" density="roomy"'),
    tableSource("density"),
    tableSource("density={value}"),
    tableSource("{...props}"),
    "<PaperTable>\n\nParagraph\n\n</PaperTable>",
    "<PaperTable>\n\n| A |\n| - |\n| 1 |\n\n| B |\n| - |\n| 2 |\n\n</PaperTable>",
    tableSource('blankCorner="open"'),
    tableSource(
      'blankCorner="open" columnHeaders="first-row" rowHeaders="first-column"',
    ),
  ];

  for (const source of invalidSources) {
    assert.throws(() => validatePaperTableMarkdown(source), /PaperTable/);
  }
});

test("renders totals on the wrapper only when authored", async () => {
  const rows = ["| Alpha | 12 |", "| Total | 12 |"];
  for (const totals of PAPER_TABLE_PROP_VALUES.totals) {
    const html = await render(tableSource(`totals="${totals}"`, { rows }));
    assert.match(
      html,
      new RegExp(`<div class="rtq-paper-table"[^>]*data-totals="${totals}"`),
    );
    assert.doesNotMatch(html, /<table[^>]*data-totals/);
  }
  assert.doesNotMatch(await render(tableSource()), /data-totals/);
});

test("marks the answer row after header semantics and names it for assistive tech", async () => {
  const html = await render(
    tableSource('rowHeaders="first-column" answerRow="2"', {
      rows: ["| Alpha | 12 |", "| Beta | 20 |"],
    }),
  );

  assert.match(
    html,
    /<tr data-mark="answer">\s*<th align="left" scope="row"><span data-paper-table-hidden-text="">Answer row<\/span> Beta<\/th>\s*<td align="right">20<\/td>/,
  );
  assert.equal(html.match(/data-mark=/g)?.length, 1);
  assert.doesNotMatch(html, /data-answer-(row|cell)/);
});

test("counts answerCell positions in the body after header demotion", async () => {
  const html = await render(
    tableSource('columnHeaders="none" answerCell="2,2" totals="column"'),
  );

  assert.match(
    html,
    /<td align="right" data-mark="answer"><span data-paper-table-hidden-text="">Answer cell<\/span> <code/,
  );
  assert.match(html, /data-totals="column"/);
});

test("rejects malformed, out-of-range, and doubled answer marks", () => {
  const rows = ["| Alpha | 12 |", "| Beta | 20 |"];
  const cases: ReadonlyArray<readonly [string, RegExp]> = [
    [
      'answerRow="0"',
      /PaperTable prop "answerRow" received "0"; expected "<body row>", counted from 1\./,
    ],
    ['answerRow="1.5"', /"answerRow" received "1\.5"/],
    [
      'answerCell="1"',
      /"answerCell" received "1"; expected "<body row>,<column>"/,
    ],
    ['answerCell="1, 2"', /"answerCell" received "1, 2"/],
    [
      'answerRow="3"',
      /PaperTable prop "answerRow" received "3", but the table body has 2 rows\./,
    ],
    [
      'answerCell="1,3"',
      /PaperTable prop "answerCell" received "1,3", but body row 1 has 2 columns\./,
    ],
    [
      'answerRow="1" answerCell="1,2"',
      /PaperTable allows one answer mark; received both answerRow and answerCell\./,
    ],
    ["answerRow={1}", /"answerRow" must use a static quoted string/],
  ];

  for (const [attributes, message] of cases) {
    assert.throws(
      () => validatePaperTableMarkdown(tableSource(attributes, { rows })),
      message,
    );
  }
});

test("rejects totals the table is too small to have", () => {
  assert.throws(
    () => validatePaperTableMarkdown(tableSource('totals="row"')),
    /PaperTable prop "totals" received "row", but a totals row needs at least two body rows; the body has 1\./,
  );
  assert.throws(
    () =>
      validatePaperTableMarkdown(
        '<PaperTable totals="column">\n\n| A |\n| - |\n| 1 |\n| 2 |\n\n</PaperTable>',
      ),
    /a totals column needs at least two columns; the table has 1\./,
  );
  assert.throws(
    () => validatePaperTableMarkdown(tableSource('totals="rows"')),
    /allowed values: row, column, both\./,
  );
  // A one-row frequency table can still end in a Total column.
  assert.doesNotThrow(() =>
    validatePaperTableMarkdown(tableSource('totals="column"')),
  );
});

test("leaves fenced examples literal and strips only active fallback wrappers", async () => {
  const fenced = '```md\n<PaperTable width="full">\n</PaperTable>\n```';
  assert.doesNotThrow(() => validatePaperTableMarkdown(fenced));
  assert.match(await render(fenced), /&#x3C;PaperTable width="full">/);

  const source = `Before\n\n${tableSource('width="full"')}\n\nAfter`;
  const stripped = stripPaperTableWrapperLines(source);
  assert.doesNotMatch(stripped, /<\/?PaperTable/);
  assert.match(stripped, /Before[\s\S]*\| Label \| Value \|[\s\S]*After/);
});

test("mirrors the RTQ web table rules and voice defaults", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );

  assert.match(
    css,
    /:where\(\[data-variant="question"\]\) \.rtq-paper-table:not\(\[data-grid\]\)/,
  );
  for (const grid of [
    "framed",
    "interior",
    "rows",
    "vertical",
    "outline",
    "none",
  ]) {
    assert.match(css, new RegExp(`\\[data-grid="${grid}"\\][ ,]`));
  }
  assert.doesNotMatch(css, /data-grid="horizontal"/);
  assert.match(css, /--rtq-paper-table-rule-strong-width: 2px;/);
  assert.match(css, /--rtq-paper-table-rule-strong-width-working: 1\.5px;/);
  assert.match(css, /--rtq-paper-table-rule-width: 1px;/);
  for (const role of ["strong", "inner", "quiet"]) {
    assert.match(
      css,
      new RegExp(`var\\(\\s*--rtq-paper-table-rule-${role},\\s*var\\(--line`),
    );
  }
  assert.match(
    css,
    /\.rtq-paper-table\.rtq-paper-table table \{[^}]*font: inherit;[^}]*line-height: 1\.5;/s,
  );
  assert.match(
    css,
    /:where\(th, td\) \{[^}]*padding-block: 0\.75rem;[^}]*padding-inline: 1\.25rem;[^}]*vertical-align: middle;/s,
  );
  assert.match(
    css,
    /\[data-density="regular"\] :where\(th, td\) \{[^}]*padding-block: 0\.5rem;/s,
  );
  assert.doesNotMatch(
    css.replace(/\[data-paper-table-hidden-text\] \{[^}]*\}/, ""),
    /\[data-density[^\]]*\] table|white-space: nowrap/,
  );
  assert.match(css, /thead :where\(th\) \{[^}]*font-weight: 600;/s);
  assert.match(
    css,
    /th\[scope="row"\]\) \{[^}]*font-weight: normal;[^}]*max-width: var\(--rtq-paper-table-label-max-width\);/s,
  );
  assert.match(css, /:has\(tbody th\[scope="row"\]\)/);
  assert.match(
    css,
    /\[data-blank-corner="open"\][^{]*\{[^}]*border-block-start: hidden;[^}]*border-inline-start: hidden;/s,
  );
  assert.match(
    css,
    /:where\(\[data-variant="answer"\]\) \.rtq-paper-table\.rtq-paper-table table \{[^}]*font-weight: normal;/s,
  );
});

test("draws the table meanings from the paper-table tokens", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );

  assert.match(
    css,
    /:is\(\[data-totals="row"\], \[data-totals="both"\]\)\s*tbody\s*> tr:last-child:not\(:first-child\)\s*> :where\(th, td\) \{\s*border-block-start: var\(--rtq-paper-table-rule-strong-width\)/,
  );
  assert.match(
    css,
    /:is\(\[data-totals="column"\], \[data-totals="both"\]\)\s*tr\s*> :where\(th, td\):last-child:not\(:first-child\) \{\s*border-inline-start: var\(--rtq-paper-table-rule-strong-width\)/,
  );
  assert.match(
    css,
    /tr\[data-mark="answer"\] > :where\(th, td\),\s*\.rtq-paper-table :where\(th, td\)\[data-mark="answer"\] \{[^}]*background-color: var\(\s*--rtq-paper-table-fill-answer,/,
  );
  assert.match(
    css,
    /\[data-mark="answer"\]::before \{[^}]*border-inline-start: var\(--rtq-paper-table-mark-answer-width\) solid\s*var\(--rtq-paper-table-mark-answer, currentColor\);/,
  );
  assert.match(
    css,
    /td\[data-tone="blocked"\] \{[^}]*background-color: var\(\s*--rtq-paper-table-fill-blocked,/,
  );
  assert.doesNotMatch(css, /data-tone="muted"|muted-surface/);
  assert.match(
    css,
    /\[data-paper-table-hidden-text\] \{[^}]*clip-path: inset\(50%\);[^}]*position: absolute;/s,
  );
});
