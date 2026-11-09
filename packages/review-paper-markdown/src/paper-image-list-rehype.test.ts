import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import {
  type HastNode,
  type PaperImageListVersion,
  rehypePaperImageList,
  remarkPaperImageList,
  remarkPaperListMdx,
} from "./index.ts";

const WIDTHS: Record<string, number> = { a: 128, b: 230, c: 234 };

function versionsFor(src: string): PaperImageListVersion[] {
  const width = WIDTHS[src] ?? 100;
  const versions: PaperImageListVersion[] = [
    { label: "Original", version: "original", width: 256 },
  ];
  if (src !== "c") {
    versions.push({ label: "V2", version: "v2", width });
  }
  return versions;
}

async function render(markdown: string, withChrome = false): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkPaperListMdx)
    .use(remarkPaperImageList)
    .use(remarkRehype)
    .use(rehypePaperImageList, {
      ...(withChrome
        ? {
            chrome: (image: HastNode) => ({
              children: [
                { type: "text", value: `tags ${image.properties?.src}` },
              ],
              properties: { className: ["tags"] },
              tagName: "span",
              type: "element",
            }),
          }
        : {}),
      resolve: (image) =>
        image.tagName === "img"
          ? versionsFor(String(image.properties?.src))
          : undefined,
      select: (image, version) => ({
        ...image,
        properties: { ...image.properties, dataImageVersion: version },
      }),
    })
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

const ROW = [
  '<PaperImageList listStyleType="upper-alpha">',
  "",
  "- ![A](a)",
  "- ![B](b)",
  "  angle **B**",
  "- ![C](c)",
  "",
  "</PaperImageList>",
].join("\n");

test("draws one labelled list per visible version", async () => {
  const html = await render(ROW);
  const sets = html.match(/data-slot="paper-image-list"/g) ?? [];
  assert.equal(sets.length, 2);
  assert.match(html, /<span class="rtq-image-list-label">Original<\/span>/);
  assert.match(html, /<span class="rtq-image-list-label">V2<\/span>/);
  assert.match(html, /data-image-version="original"/);
  assert.match(html, /data-image-version="v2"/);
  // C has no V2: the V2 list shows a placeholder sized like its other version.
  assert.match(html, /<span class="rtq-image-list-missing">No V2<\/span>/);
});

test("keeps list semantics, captions and standalone widths, with no generated CSS", async () => {
  const html = await render(ROW);
  assert.match(html, /<ul[^>]*class="rtq-image-list-list"/);
  assert.match(html, /--rtq-image-list-list-style: upper-alpha/);
  assert.match(html, /data-image-list=""/);
  assert.match(html, /data-list-style-type="upper-alpha"/);
  assert.match(
    html,
    /<figcaption class="rtq-image-list-caption">angle <strong>B<\/strong><\/figcaption>/,
  );
  assert.match(html, /--rtq-image-list-item-width: 230px/);
  assert.match(html, /--rtq-image-list-item-width: 256px/);
  assert.doesNotMatch(html, /<style>/);
  assert.match(
    html,
    /<div class="rtq-image-list" data-slot="paper-image-list">/,
  );
});

test("omits the version label when only one version is visible", async () => {
  const html = await unified()
    .use(remarkParse)
    .use(remarkPaperListMdx)
    .use(remarkPaperImageList)
    .use(remarkRehype)
    .use(rehypePaperImageList, {
      resolve: (image) =>
        image.tagName === "img"
          ? [{ label: "V2", version: "v2", width: 100 }]
          : undefined,
      select: (image) => image,
    })
    .use(rehypeStringify)
    .process(
      '<PaperImageList listStyleType="none" columns="2">\n\n- ![A](a)\n- ![B](b)\n\n</PaperImageList>',
    );
  assert.doesNotMatch(String(html), /rtq-image-list-label/);
  assert.match(String(html), /--rtq-image-list-columns: 2/);
  assert.match(String(html), /--rtq-image-list-cell: 100px/);
});

test("draws per-image review chrome after the sets", async () => {
  const html = await render(ROW, true);
  assert.match(
    html,
    /<ol class="rtq-image-list-chrome"><li><span class="tags">tags a<\/span><\/li>/,
  );
  assert.ok(
    html.indexOf("rtq-image-list-chrome") >
      html.lastIndexOf('data-slot="paper-image-list"'),
  );
});

test("leaves stack lists and lists without resolvable images alone", async () => {
  const stack = await render(
    '<PaperList listStyleType="disc">\n\n- ![A](a)\n\n</PaperList>',
  );
  assert.doesNotMatch(stack, /rtq-image-list/);
});
