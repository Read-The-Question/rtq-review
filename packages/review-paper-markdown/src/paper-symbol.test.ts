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

test("renders full and half lorry symbols", async () => {
  const html = await render(
    '<PaperSymbolGroup gap="md"><PaperSymbol name="lorry" size="xl" /><PaperSymbol name="lorry" variant="half" size="xl" /></PaperSymbolGroup>',
  );

  assert.equal(html.match(/data-paper-symbol-name="lorry"/g)?.length, 2);
  assert.match(html, /One full lorry pictogram symbol/);
  assert.match(html, /One half of a lorry pictogram symbol/);
  assert.match(html, /height:48px;width:24px/);
  assert.match(html, /<path[^>]*d="M14 18V6a2 2 0 0 0-2-2H4/);
  assert.match(html, /<path[^>]*fill="none"/);
});

test("renders full and half filled woodlouse symbols", async () => {
  const html = await render(
    '<PaperSymbolGroup gap="sm"><PaperSymbol name="woodlouse" size="xl" /><PaperSymbol name="woodlouse" variant="half" size="xl" /></PaperSymbolGroup>',
  );

  assert.equal(html.match(/data-paper-symbol-name="woodlouse"/g)?.length, 2);
  assert.match(html, /One full woodlouse pictogram symbol/);
  assert.match(html, /One half of a woodlouse pictogram symbol/);
  assert.match(html, /height:48px;width:24px/);
  assert.match(html, /<svg[^>]*fill="currentColor"/);
  assert.match(html, /<path[^>]*fill="currentColor"[^>]*d="M12 20v-9"/);
});

test("renders the filled Lucide club suit", async () => {
  const html = await render('<PaperSymbol name="club-suit" size="lg" />');

  assert.match(html, /data-paper-symbol-name="club-suit"/);
  assert.match(html, /One full club-suit pictogram symbol/);
  assert.match(html, /<svg[^>]*fill="currentColor"/);
  assert.match(html, /<path[^>]*d="M17\.28 9\.05a5\.5 5\.5/);
});

test("renders the outline Lucide smiling face", async () => {
  const html = await render('<PaperSymbol name="smiling-face" size="md" />');

  assert.match(html, /data-paper-symbol-name="smiling-face"/);
  assert.match(html, /One full smiling-face pictogram symbol/);
  assert.match(html, /<svg[^>]*fill="none"/);
  assert.match(html, /<path[^>]*d="M8 14s1\.5 2 4 2 4-2 4-2"/);
});

test("renders a separate filled black smiling face with inverse details", async () => {
  const html = await render(
    '<PaperSymbol name="black-smiling-face" size="lg" />',
  );

  assert.match(html, /One full black smiling-face pictogram symbol/);
  assert.match(html, /<circle[^>]*fill="currentColor"[^>]*r="10"/);
  assert.match(
    html,
    /<path[^>]*d="M8 14s1\.5 2 4 2 4-2 4-2"[^>]*stroke="var\(--background, #fff\)"/,
  );
});

test("renders the filled Lucide triangle and heart", async () => {
  const html = await render(
    '<PaperSymbol name="black-triangle" size="lg" /><PaperSymbol name="black-heart" size="lg" />',
  );

  assert.match(html, /data-paper-symbol-name="black-triangle"/);
  assert.match(html, /data-paper-symbol-name="black-heart"/);
  assert.equal(html.match(/<svg[^>]*fill="currentColor"/g)?.length, 2);
  assert.match(html, /<path[^>]*d="M13\.73 4a2 2/);
  assert.match(html, /<path[^>]*d="M2 9\.5a5\.5 5\.5/);
});

test("renders a club suit between adjacent inline maths spans", async () => {
  const html = await render(
    '$a + b$<PaperSymbol name="club-suit" size="md" />,$c + d$',
  );

  assert.match(html, /data-paper-symbol-name="club-suit"/);
  assert.match(html, /data-paper-symbol-size="md"/);
  assert.doesNotMatch(html, /PaperSymbol/);
});

test("renders the six geometric Lucide symbols as outlines", async () => {
  const html = await render(
    [
      '<PaperSymbol name="square" size="lg" />',
      '<PaperSymbol name="circle" size="lg" />',
      '<PaperSymbol name="triangle" size="lg" />',
      '<PaperSymbol name="hexagon" size="lg" />',
      '<PaperSymbol name="diamond" size="lg" />',
      '<PaperSymbol name="sun" size="lg" />',
    ].join(" "),
  );

  for (const name of [
    "square",
    "circle",
    "triangle",
    "hexagon",
    "diamond",
    "sun",
  ]) {
    assert.match(html, new RegExp(`data-paper-symbol-name="${name}"`));
    assert.match(html, new RegExp(`One full ${name} pictogram symbol`));
  }
  assert.equal(html.match(/<svg[^>]*fill="none"/g)?.length, 6);
  assert.match(html, /<rect[^>]*height="18"[^>]*rx="2"/);
  assert.match(html, /<circle[^>]*cx="12"[^>]*r="10"/);
  assert.match(html, /<path[^>]*d="M13\.73 4a2 2/);
  assert.match(html, /<path[^>]*d="M21 16V8a2 2/);
  assert.match(html, /<path[^>]*d="M2\.7 10\.3a2\.41 2\.41/);
  assert.match(html, /<circle[^>]*cx="12"[^>]*r="4"/);
  assert.match(html, /<path[^>]*d="M12 2v2"/);
});

test("renders fixed-footprint four-pane variants with shared edges once", async () => {
  const html = await render(
    [
      '<PaperSymbol name="four-pane-pictogram" variant="quarter" size="lg" />',
      '<PaperSymbol name="four-pane-pictogram" variant="half" size="lg" />',
      '<PaperSymbol name="four-pane-pictogram" variant="three-quarters" size="lg" />',
      '<PaperSymbol name="four-pane-pictogram" variant="full" size="lg" />',
    ].join(" "),
  );

  assert.match(html, /One quarter of a four-pane pictogram symbol/);
  assert.match(html, /Three quarters of a four-pane pictogram symbol/);
  assert.equal(html.match(/height:28px;width:28px/g)?.length, 4);
  for (const path of [
    "M3 3H12V12H3Z",
    "M3 3H12V21H3Z M3 12H12",
    "M3 3H21V12H12V21H3Z M12 3V12 M3 12H12",
    "M3 3H21V21H3Z M12 3V21 M3 12H21",
  ]) {
    assert.ok(html.includes(`d="${path}"`), path);
  }
  assert.equal(html.match(/shape-rendering="geometricPrecision"/g)?.length, 4);
});

test("reserves an accessibility-hidden symbol space", async () => {
  const html = await render('<PaperSymbolSpace size="xl" />');

  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /data-paper-symbol-space=""/);
  assert.match(html, /data-paper-symbol-space-size="xl"/);
  assert.match(html, /height:48px;width:48px/);
  assert.doesNotMatch(html, /PaperSymbolSpace/);
});

test("rejects invalid symbols, props, expressions, and group children", async () => {
  const cases = [
    ['<PaperSymbol name="screen" />', 'prop "name"'],
    ['<PaperSymbol name="computer" variant="quarter" />', 'prop "variant"'],
    [
      '<PaperSymbol name="four-pane-pictogram" variant="four-fifths" />',
      'prop "variant"',
    ],
    [
      '<PaperSymbol name="black-smiling-face" variant="half" />',
      'prop "variant"',
    ],
    ['<PaperSymbol name="computer" size="xxl" />', 'prop "size"'],
    ['<PaperSymbolSpace size="xxl" />', 'PaperSymbolSpace prop "size"'],
    [
      '<PaperSymbolSpace name="lorry" />',
      'PaperSymbolSpace prop "name" is unsupported',
    ],
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
