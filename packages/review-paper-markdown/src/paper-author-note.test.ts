import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { remarkPaperAuthorNote, remarkPaperListMdx } from "./index.ts";

async function render(markdown: string, mdx: boolean): Promise<string> {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
  if (mdx) processor.use(remarkPaperListMdx);

  const result = await processor
    .use(remarkPaperAuthorNote)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

const richNote = [
  "<PaperAuthorNote>",
  "",
  "Check **all variants** of $x^2$.",
  "",
  "- Keep the wording internal",
  "- Verify the diagram",
  "",
  "| Item | State |",
  "| --- | --- |",
  "| Diagram | Pending |",
  "",
  "</PaperAuthorNote>",
].join("\n");

for (const mdx of [true, false]) {
  test(`renders a rich ${mdx ? "MDX" : "raw Markdown"} author note`, async () => {
    const html = await render(richNote, mdx);

    assert.match(
      html,
      /<aside aria-label="Paper author note — internal only" class="paper-author-note" data-paper-author-note="" role="note">/,
    );
    assert.match(
      html,
      /<header class="paper-author-note__label">Paper author note · internal only<\/header>/,
    );
    assert.match(html, /<strong>all variants<\/strong>/);
    assert.match(html, /<code class="language-math math-inline">x\^2<\/code>/);
    assert.match(html, /<ul>/);
    assert.match(html, /<table>/);
    assert.doesNotMatch(html, /<\/?PaperAuthorNote/);
  });
}

test("leaves fenced PaperAuthorNote examples literal", async () => {
  const html = await render(
    "```mdx\n<PaperAuthorNote>\n\nExample\n\n</PaperAuthorNote>\n```",
    true,
  );

  assert.match(html, /&#x3C;PaperAuthorNote>/);
  assert.doesNotMatch(html, /data-paper-author-note/);
});

test("rejects unsupported author note shapes", async () => {
  for (const [source, mdx] of [
    ['<PaperAuthorNote kind="warning">\n\nText\n\n</PaperAuthorNote>', true],
    ["<PaperAuthorNote></PaperAuthorNote>", true],
    ["<PaperAuthorNote>\n\n</PaperAuthorNote>", false],
    ["Before <PaperAuthorNote>inline</PaperAuthorNote>", false],
    ["</PaperAuthorNote>", false],
    ["<PaperAuthorNote extra>", false],
  ] as const) {
    await assert.rejects(() => render(source, mdx));
  }
});

test("rejects nested PaperAuthorNote blocks", async () => {
  await assert.rejects(
    () =>
      render(
        [
          "<PaperAuthorNote>",
          "",
          "Outer",
          "",
          "<PaperAuthorNote>",
          "",
          "Inner",
          "",
          "</PaperAuthorNote>",
          "",
          "</PaperAuthorNote>",
        ].join("\n"),
        false,
      ),
    /cannot be nested/,
  );
});
