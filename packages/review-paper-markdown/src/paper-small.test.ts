import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { remarkPaperListMdx, remarkPaperSmall } from "./index.ts";

async function render(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperSmall)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

test("renders inline and standalone PaperSmall as semantic small text", async () => {
  const html = await render(
    [
      'Before <PaperSmall aria-label="Inline note">inline $x^2$</PaperSmall>.',
      "",
      "<PaperSmall>Standalone $y^2$</PaperSmall>",
    ].join("\n"),
  );

  assert.match(
    html,
    /Before <small aria-label="Inline note" data-paper-small="">inline <code class="language-math math-inline">x\^2<\/code><\/small>\./,
  );
  assert.match(
    html,
    /<small data-paper-small="">Standalone <code class="language-math math-inline">y\^2<\/code><\/small>/,
  );
  assert.doesNotMatch(html, /PaperSmall/);
});

test("keeps only inert native attributes on PaperSmall", async () => {
  const html = await render(
    '<PaperSmall className="note" data-context="answer" style="color:red" onClick="bad">Safe</PaperSmall>',
  );

  assert.match(html, /class="note"/);
  assert.match(html, /data-context="answer"/);
  assert.doesNotMatch(html, /style=|onClick|onclick/);
});

test("unwraps unsupported flow children so malformed content stays readable", async () => {
  const html = await render("<PaperSmall>\n\n- One\n- Two\n\n</PaperSmall>");

  assert.match(html, /<ul>/);
  assert.match(html, /<li>One<\/li>/);
  assert.doesNotMatch(html, /<small|PaperSmall/);
});

test("leaves fenced PaperSmall examples literal", async () => {
  const html = await render(
    "```mdx\n<PaperSmall>Example only</PaperSmall>\n```",
  );

  assert.match(html, /&#x3C;PaperSmall>Example only&#x3C;\/PaperSmall>/);
  assert.doesNotMatch(html, /data-paper-small/);
});
