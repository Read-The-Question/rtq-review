import assert from "node:assert/strict";
import test from "node:test";

import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { remarkPaperListMdx, remarkPaperShape } from "./index.ts";
import {
  hasActivePaperShapeMarkdown,
  validatePaperShapeMarkdown,
} from "./validate.ts";

async function render(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperShape)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

test("preserves inline maths and formatting inside a same-line GFM cell", async () => {
  const html = await render(
    [
      "| Shape | Value |",
      "| --- | --- |",
      '| Shaded | <PaperShape name="hexagon" pattern="wavy-hatch" size="2xl">**$56$**</PaperShape> |',
    ].join("\n"),
  );

  assert.match(html, /<table>/);
  assert.match(
    html,
    /<span data-paper-shape="" data-paper-shape-name="hexagon" data-paper-shape-pattern="wavy-hatch" data-paper-shape-size="2xl"><strong><span class="katex">/,
  );
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.match(html, /<mn>56<\/mn>/);
  assert.doesNotMatch(html, /PaperShape/);
});

test("uses default pattern and size, and supports self-closing blanks", async () => {
  const html = await render(
    '<PaperShape name="square" /> <PaperShape name="circle">caption</PaperShape> <PaperShape name="triangle" pattern="vertical-stripes" />',
  );
  assert.equal(html.match(/data-paper-shape=""/g)?.length, 3);
  assert.match(
    html,
    /data-paper-shape-name="square" data-paper-shape-pattern="plain" data-paper-shape-size="xl"><\/span>/,
  );
  assert.match(
    html,
    /data-paper-shape-name="circle" data-paper-shape-pattern="plain" data-paper-shape-size="xl">caption<\/span>/,
  );
  assert.match(
    html,
    /data-paper-shape-name="triangle" data-paper-shape-pattern="vertical-stripes"/,
  );
});

test("rejects unsupported, dynamic, duplicated and block content", async () => {
  const cases = [
    ["<PaperShape />", 'prop "name"'],
    ['<PaperShape name="diamond" />', 'prop "name"'],
    ['<PaperShape name="circle" pattern="dots" />', 'prop "pattern"'],
    ['<PaperShape name="circle" size="lg" />', 'prop "size"'],
    ['<PaperShape name="circle" value="56" />', 'prop "value"'],
    ['<PaperShape name="circle" name="square" />', "authored once"],
    ['<PaperShape name={"circle"} />', "static quoted-string props"],
    ['<PaperShape name="circle" pattern />', "static quoted-string props"],
    [
      '<PaperShape name="square">\n\n- list\n\n</PaperShape>',
      "only inline children",
    ],
    [
      '<PaperShape name="square"><div>not inline</div></PaperShape>',
      "only inline children",
    ],
  ] as const;

  for (const [source, message] of cases) {
    assert.throws(
      () => validatePaperShapeMarkdown(source),
      new RegExp(message),
    );
  }
});

test("keeps fenced PaperShape examples literal", async () => {
  const markdown = '```mdx\n<PaperShape name="unknown" />\n```';
  assert.doesNotThrow(() => validatePaperShapeMarkdown(markdown));
  const html = await render(markdown);
  assert.match(html, /&#x3C;PaperShape name="unknown" \/>/);
  assert.doesNotMatch(html, /data-paper-shape=/);
});

test("recognizes only authored shape nodes, not inline-code lookalikes", () => {
  assert.equal(
    hasActivePaperShapeMarkdown(
      '| Shape |\n| --- |\n| `<PaperShape name="square" />` |',
    ),
    false,
  );
  assert.equal(
    hasActivePaperShapeMarkdown(
      '| Shape |\n| --- |\n| <PaperShape name="square" /> |',
    ),
    true,
  );
});
