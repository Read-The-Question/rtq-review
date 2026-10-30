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
    columnWidths: "content",
    density: "roomy",
    firstColumnStartPadding: "default",
    indent: "none",
    rowHeaderWeight: "normal",
    rowHeaders: "none",
    width: "fit",
  });
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.rowHeaderWeight, [
    "normal",
    "strong",
  ]);
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.columnWidths, ["content", "equal"]);
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.density, [
    "compact",
    "regular",
    "roomy",
  ]);
  assert.deepEqual(PAPER_TABLE_PROP_VALUES.grid, [
    "axes",
    "framed",
    "framed-rows",
    "framed-columns",
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
          : name === "rowHeaderWeight" && value === "strong"
            ? ' rowHeaders="first-column"'
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

test("marks strong row labels on the wrapper only when authored", async () => {
  const strong = await render(
    tableSource('rowHeaders="first-column" rowHeaderWeight="strong"'),
  );
  assert.match(
    strong,
    /<div class="rtq-paper-table"[^>]*data-row-header-weight="strong"/,
  );
  assert.match(strong, /<th align="left" scope="row">Alpha<\/th>/);
  assert.doesNotMatch(strong, /<table[^>]*data-row-header-weight/);
  for (const source of [
    tableSource('rowHeaders="first-column" rowHeaderWeight="normal"'),
    tableSource('rowHeaders="first-column"'),
  ]) {
    assert.doesNotMatch(await render(source), /data-row-header-weight/);
  }
});

test("writes equal columns as a colgroup and the column count", async () => {
  const html = await render(
    tableSource('columnHeaders="none" columnWidths="equal"', {
      header: "| 5 | 4 |",
      rows: ["| 10 |  |"],
    }),
  );

  assert.match(
    html,
    /<div class="rtq-paper-table"[^>]*data-column-widths="equal"/,
  );
  assert.match(
    html,
    /<table style="--rtq-paper-table-column-count: 2">\s*<colgroup data-slot="paper-table-columns"><col><col><\/colgroup>\s*<tbody>/,
  );
  assert.match(html, /<td align="right"><\/td>/);
  for (const source of [
    tableSource('columnWidths="content"'),
    tableSource(),
    "| A | B |\n| - | - |\n| 1 | 2 |",
  ]) {
    const plain = await render(source);
    assert.doesNotMatch(plain, /data-column-widths|colgroup|column-count/);
  }
});

test("counts the row-label column in equal widths", async () => {
  const html = await render(
    tableSource('columnWidths="equal" rowHeaders="first-column"'),
  );

  assert.match(
    html,
    /<colgroup data-slot="paper-table-columns"><col><col><\/colgroup>/,
  );
  assert.match(html, /<th[^>]*scope="row">Alpha<\/th>/);
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

test("rejects the retired density default and names regular", () => {
  assert.throws(
    () => validatePaperTableMarkdown(tableSource('density="default"')),
    /PaperTable prop "density" received "default"; "default" was renamed to "regular"; allowed values: compact, regular, roomy\./,
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
    tableSource('rowHeaderWeight="semibold" rowHeaders="first-column"'),
    tableSource('columnWidths="fixed"'),
    tableSource('horizontalDensity="slim"'),
    tableSource('verticalDensity="tight"'),
  ];

  for (const source of invalidSources) {
    assert.throws(() => validatePaperTableMarkdown(source), /PaperTable/);
  }
  for (const rowHeaders of ["", 'rowHeaders="none" ']) {
    assert.throws(
      () =>
        validatePaperTableMarkdown(
          tableSource(`${rowHeaders}rowHeaderWeight="strong"`),
        ),
      /PaperTable prop "rowHeaderWeight" received "strong"; strong requires rowHeaders="first-column"/,
    );
  }
  assert.throws(
    () => validatePaperTableMarkdown(tableSource('columnWidths="fixed"')),
    /PaperTable prop "columnWidths" received "fixed"; allowed values: content, equal\./,
  );
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

test("renders each axis density on the wrapper only when authored", async () => {
  for (const [name, attribute] of [
    ["horizontalDensity", "horizontal-density"],
    ["verticalDensity", "vertical-density"],
  ] as const) {
    for (const value of PAPER_TABLE_PROP_VALUES[name]) {
      const html = await render(tableSource(`${name}="${value}"`));
      const wrapper = html.match(/<div class="rtq-paper-table"[^>]*>/)?.[0];
      assert.match(wrapper ?? "", new RegExp(`data-${attribute}="${value}"`));
      assert.match(wrapper ?? "", /data-density="roomy"/);
      assert.doesNotMatch(html, new RegExp(`<table[^>]*data-${attribute}`));
    }
  }
  const unset = await render(tableSource());
  assert.doesNotMatch(unset, /data-horizontal-density/);
  assert.doesNotMatch(unset, /data-vertical-density/);
});

test("lets each axis density set one padding axis, before the first-column override", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );
  const spacing = css.indexOf('[data-horizontal-density="tight"]');

  assert.match(
    css,
    /\[data-horizontal-density="tight"\]\s+:where\(th, td\) \{\s*padding-inline: 0\.375rem;\s*\}/,
  );
  assert.match(
    css,
    /\.rtq-paper-table\[data-horizontal-density="tight"\]\s+tr\s+>\s+:where\(th, td\):first-child \{\s*padding-inline-start: 0\.75rem;\s*\}/,
  );
  assert.match(
    css,
    /\.rtq-paper-table\[data-horizontal-density="tight"\]\s+tr\s+>\s+:where\(th, td\):last-child \{\s*padding-inline-end: 0\.75rem;\s*\}/,
  );
  for (const [value, padding] of [
    ["compact", "0.75rem"],
    ["regular", "1rem"],
    ["roomy", "1.25rem"],
  ]) {
    assert.match(
      css,
      new RegExp(
        `\\[data-horizontal-density="${value}"\\]\\s+:where\\(th, td\\) \\{\\s*padding-inline: ${padding.replace(".", "\\.")};\\s*\\}`,
      ),
    );
  }
  for (const [value, padding] of [
    ["compact", "0.25rem"],
    ["regular", "0.5rem"],
    ["roomy", "0.75rem"],
  ]) {
    assert.match(
      css,
      new RegExp(
        `\\.rtq-paper-table\\.rtq-paper-table\\[data-vertical-density="${value}"\\]\\s+:where\\(th, td\\) \\{\\s*padding-block: ${padding.replace(".", "\\.")};\\s*\\}`,
      ),
    );
  }
  const vertical = css.lastIndexOf("[data-vertical-density=");
  assert.ok(spacing > css.indexOf('[data-density="regular"]'));
  assert.ok(vertical < css.indexOf('[data-first-column-start-padding="none"]'));
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
    "axes",
    "framed",
    "framed-rows",
    "framed-columns",
    "interior",
    "rows",
    "vertical",
    "outline",
    "none",
  ]) {
    assert.match(css, new RegExp(`\\[data-grid="${grid}"\\][ ,]`));
  }
  assert.doesNotMatch(css, /data-grid="horizontal"/);
  assert.match(css, /--rtq-paper-table-stroke-width-firm: 2px;/);
  assert.match(css, /--rtq-paper-table-stroke-width-firm-working: 1\.5px;/);
  assert.match(css, /--rtq-paper-table-stroke-width: 1px;/);
  for (const role of ["ink", "medium", "soft"]) {
    assert.match(
      css,
      new RegExp(`var\\(\\s*--rtq-paper-table-stroke-${role},\\s*var\\(--line`),
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
  assert.match(css, /--rtq-paper-table-label-weight-strong: 600;/);
  assert.match(
    css,
    /\[data-row-header-weight="strong"\]\s*tbody\s*:where\(th\[scope="row"\]\) \{\s*font-weight: var\(--rtq-paper-table-label-weight-strong\);/,
  );
  assert.match(css, /:has\(tbody th\[scope="row"\]\)/);
  assert.match(
    css,
    /\[data-column-widths="equal"\] col \{\s*width: calc\(100% \/ var\(--rtq-paper-table-column-count\)\);/,
  );
  assert.match(
    css,
    /:where\(th, td\):where\(\s*:empty,\s*:has\(> \[data-paper-table-hidden-text\]:only-child\)\s*\)::after \{\s*content: "\\200b";\s*content: "\\200b" \/ "";/,
  );
  assert.match(
    css,
    /\[data-blank-corner="open"\][^{]*\{[^}]*border-block-start: hidden;[^}]*border-inline-start: hidden;/s,
  );
  assert.match(
    css,
    /:where\(\[data-variant="answer"\]\) \.rtq-paper-table\.rtq-paper-table table \{\s*font-family: var\(--rtq-font-body, [^;]*\);\s*font-size: 1rem;\s*font-weight: normal;/s,
  );
});

test("draws the table meanings from the paper-table tokens", () => {
  const css = readFileSync(
    new URL("./paper-table.css", import.meta.url),
    "utf8",
  );

  assert.match(
    css,
    /:is\(\[data-totals="row"\], \[data-totals="both"\]\)\s*tbody\s*> tr:last-child:not\(:first-child\)\s*> :where\(th, td\) \{\s*border-block-start: var\(--rtq-paper-table-stroke-width-firm\)/,
  );
  assert.match(
    css,
    /:is\(\[data-totals="column"\], \[data-totals="both"\]\)\s*tr\s*> :where\(th, td\):last-child:not\(:first-child\) \{\s*border-inline-start: var\(--rtq-paper-table-stroke-width-firm\)/,
  );
  assert.match(
    css,
    /\.rtq-paper-table tbody:not\(:first-of-type\) > tr:first-child > :is\(th, td\) \{\s*border-block-start: var\(--rtq-paper-table-stroke-width-firm\)/,
  );
  assert.match(
    css,
    /\.rtq-paper-table:not\(\[data-border-model="cells"\]\)\s*tbody\s*> tr\s*> :where\(th\[scope="row"\]\):has\(\+ th\[scope="row"\]\) \{\s*border-inline-end: none;/,
  );
  assert.match(
    css,
    /\.rtq-paper-table\[data-border-model="cells"\]\s*tbody\s*> tr\s*> :where\(th\[scope="row"\]\):has\(\+ th\[scope="row"\]\) \{\s*border-inline-end: var\(--rtq-paper-table-stroke-width\)\s*var\(--rtq-paper-table-cell-rule-style, solid\)/,
  );
  assert.match(
    css,
    /tr\[data-mark="answer"\] > :where\(th, td\),\s*\.rtq-paper-table :where\(th, td\)\[data-mark="answer"\] \{[^}]*background-color: var\(\s*--rtq-paper-table-fill-answer,/,
  );
  assert.match(
    css,
    /\[data-mark="answer"\]::before \{[^}]*border-inline-start: var\(--rtq-paper-table-stroke-width-answer\) solid\s*var\(--rtq-paper-table-stroke-answer, currentColor\);/,
  );
  assert.match(
    css,
    /td\[data-tone="blocked"\] \{[^}]*background-color: var\(\s*--rtq-paper-table-fill-medium,/,
  );
  assert.match(
    css,
    /td\[data-tone="shaded"\] \{[^}]*background-color: var\(\s*--rtq-paper-table-fill-soft,/,
  );
  // Swatches keep a fixed ink so the named colour reads the same in both themes.
  assert.match(
    css,
    /td\[data-swatch\] \{\s*color: var\(--rtq-paper-table-swatch-black, #0a0a0a\);/,
  );
  assert.match(
    css,
    /td\[data-swatch="black"\] \{\s*background-color: var\(--rtq-paper-table-swatch-black, #0a0a0a\);\s*color: var\(--rtq-paper-table-swatch-white, #f5f5f5\);/,
  );
  assert.match(
    css,
    /td\[data-swatch="grey"\] \{\s*background-color: var\(--rtq-paper-table-swatch-grey, #929292\);/,
  );
  assert.match(
    css,
    /td\[data-swatch="pale-grey"\] \{\s*background-color: var\(--rtq-paper-table-swatch-pale-grey, #e4e4e4\);/,
  );
  assert.doesNotMatch(css, /data-tone="muted"|muted-surface/);
  assert.match(
    css,
    /\[data-paper-table-hidden-text\] \{[^}]*clip-path: inset\(50%\);[^}]*position: absolute;/s,
  );
});
