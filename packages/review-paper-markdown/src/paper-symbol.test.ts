import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import {
  remarkPaperListMdx,
  remarkPaperSymbol,
  toPaperSymbolCompatibilityMarkdown,
} from "./index.ts";

async function render(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkPaperListMdx)
    .use(remarkPaperSymbol)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

test("renders atomic symbols and explicit groups inside table cells", async () => {
  const html = await render(
    [
      "| Country | Symbols |",
      "| :--- | :--- |",
      '| Italy | <PaperSymbolGroup gap="lg"><PaperSymbol name="computer" size="lg" /><PaperSymbol name="computer" variant="half" size="lg" /></PaperSymbolGroup> |',
    ].join("\n"),
  );

  assert.match(html, /<table>/);
  assert.match(html, /data-paper-symbol-group=""/);
  assert.match(html, /data-paper-symbol-group-gap="lg"/);
  assert.match(html, /column-gap:12px/);
  assert.equal(html.match(/data-paper-symbol=""/g)?.length, 2);
  assert.match(html, /data-paper-symbol-variant="full"/);
  assert.match(html, /data-paper-symbol-variant="half"/);
  assert.match(html, /height:28px;width:14px/);
  assert.equal(html.match(/<svg/g)?.length, 2);
  assert.match(html, /<svg[^>]*fill="currentColor"/);
  assert.match(html, /<rect[^>]*fill="currentColor"/);
  assert.doesNotMatch(html, /PaperSymbol/);
});

test("uses the documented symbol defaults", async () => {
  const html = await render('<PaperSymbol name="computer" />');

  assert.match(html, /data-paper-symbol-size="md"/);
  assert.match(html, /data-paper-symbol-variant="full"/);
  assert.match(html, /height:20px;width:20px/);
  assert.match(html, /One full computer pictogram symbol/);
});

test("rejects invalid symbols, props, expressions, and group children", async () => {
  const cases = [
    ['<PaperSymbol name="screen" />', 'prop "name"'],
    ['<PaperSymbol name="computer" variant="quarter" />', 'prop "variant"'],
    ['<PaperSymbol name="computer" size="xl" />', 'prop "size"'],
    [
      '<PaperSymbol name="computer" title="Monitor" />',
      'prop "title" is unsupported',
    ],
    ['<PaperSymbol name={"computer"} />', "static quoted-string props"],
    [
      '<PaperSymbolGroup gap="wide"><PaperSymbol name="computer" /></PaperSymbolGroup>',
      'prop "gap"',
    ],
    [
      "<PaperSymbolGroup><strong>wrong</strong></PaperSymbolGroup>",
      "requires one or more direct PaperSymbol children",
    ],
  ] as const;

  for (const [source, message] of cases) {
    await assert.rejects(() => render(source), new RegExp(message));
  }
});

test("leaves fenced PaperSymbol examples literal", async () => {
  const html = await render(
    '```mdx\n<PaperSymbol name="computer" variant="half" />\n```',
  );

  assert.match(html, /&#x3C;PaperSymbol name="computer" variant="half" \/>/);
  assert.doesNotMatch(html, /data-paper-symbol/);
});

test("converts symbols for non-MDX renderers without changing fenced examples", () => {
  const markdown = [
    '<PaperSymbolGroup gap="md">',
    '  <PaperSymbol name="computer" size="lg" />',
    '  <PaperSymbol name="computer" variant="four-fifths" size="lg" />',
    "</PaperSymbolGroup>",
    "",
    "```mdx",
    '<PaperSymbol name="computer" variant="half" />',
    "```",
  ].join("\n");
  const compatible = toPaperSymbolCompatibilityMarkdown(markdown);

  assert.match(compatible, /data-paper-symbol-group-gap="md"/);
  assert.match(compatible, /data-paper-symbol-variant="four-fifths"/);
  assert.equal(compatible.match(/<svg/g)?.length, 2);
  assert.match(compatible, /<svg[^>]*fill="currentColor"/);
  assert.match(
    compatible,
    /```mdx\n<PaperSymbol name="computer" variant="half" \/>\n```/,
  );
});
