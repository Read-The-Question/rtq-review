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

const structuredTable = [
  '<PaperViewStructuredTable aria-label="Number grid" cellAlign="center" density="roomy" grid="framed">',
  "  <PaperViewTableCaption>Crossnumber</PaperViewTableCaption>",
  "  <PaperViewTableHead>",
  "    <PaperViewTableRow>",
  '      <PaperViewTableHeaderCell scope="col">Column</PaperViewTableHeaderCell>',
  "    </PaperViewTableRow>",
  "  </PaperViewTableHead>",
  "  <PaperViewTableBody>",
  "    <PaperViewTableRow>",
  '      <PaperViewTableCell tone="muted" />',
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
  assert.match(html, /data-grid="framed"/);
  assert.match(html, /data-paper-table=""/);
  assert.match(html, /<table aria-label="Number grid">/);
  assert.match(html, /<caption>Crossnumber<\/caption>/);
  assert.match(html, /<thead>/);
  assert.match(html, /<tbody>/);
  assert.match(html, /<tr>/);
  assert.match(html, /<th scope="col">Column<\/th>/);
  assert.match(html, /<td data-tone="muted"><\/td>/);
  assert.match(
    html,
    /<span data-paper-table-cell-label="">[\s\S]*>1<\/code><\/span>/,
  );
  assert.match(html, /49/);
  assert.doesNotMatch(html, /PaperViewStructuredTable|PaperViewTableCell/);
});

test("does not validate direct structure or presentation values", async () => {
  const html = await render(
    '<PaperViewStructuredTable density="authored-value"><PaperViewTableCell tone="custom">Value</PaperViewTableCell></PaperViewStructuredTable>',
  );

  assert.match(html, /data-density="authored-value"/);
  assert.match(html, /<table><td data-tone="custom">Value<\/td><\/table>/);
});

test("shares adjacent-table rhythm and muted cell-label colour", () => {
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
    /\.rtq-maths-cell-label-number,[\s\S]*\.rtq-maths-equation-number\s*\{[^}]*color: var\(--muted, currentColor\);/s,
  );
});
