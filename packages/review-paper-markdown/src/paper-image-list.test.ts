import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import {
  PAPER_IMAGE_LIST_MESSAGES,
  getPaperImageListWidth,
  remarkPaperImageList,
  remarkPaperList,
  remarkPaperListMdx,
  stripPaperImageListWrapperLines,
  toPaperImageListCompatibilityMarkdown,
} from "./index.ts";
import { validatePaperImageListMarkdown } from "./validate.ts";

const IMAGE = '<PaperImage assetScope="question" />';

function imageList(attributes: string, items: string[], loose = false) {
  return [
    `<PaperImageList ${attributes}>`,
    "",
    items.join(loose ? "\n\n" : "\n"),
    "",
    "</PaperImageList>",
  ].join("\n");
}

async function render(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperList)
    .use(remarkPaperImageList)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

function rejects(markdown: string, message: string): void {
  assert.throws(() => validatePaperImageListMarkdown(markdown), { message });
}

test("marks the wrapped list for the review renderers", async () => {
  const lettered = await render(
    imageList('listStyleType="upper-alpha"', ["- ![A](a)", "- ![B](b)"]),
  );
  assert.match(lettered, /data-image-list=""/);
  assert.match(lettered, /data-list-style-type="upper-alpha"/);
  assert.doesNotMatch(lettered, /data-columns/);

  const pair = await render(
    imageList('listStyleType="none" columns="2"', ["- ![A](a)", "- ![B](b)"]),
  );
  assert.match(pair, /data-columns="2"/);
});

test("leaves PaperList exactly as before", async () => {
  assert.equal(
    await render('<PaperList listStyleType="disc">\n\n- One\n\n</PaperList>'),
    '<ul style="list-style-type: disc">\n<li>One</li>\n</ul>',
  );
});

test("accepts authored PaperImage items with captions", () => {
  validatePaperImageListMarkdown(
    imageList('listStyleType="none"', [
      `- ${IMAGE}\n  angle **P** $x$`,
      `- ${IMAGE}`,
    ]),
  );
  validatePaperImageListMarkdown(
    imageList(
      'listStyleType="upper-alpha"',
      [`- ${IMAGE}`, `- ${IMAGE}\n\n  angle Q`],
      true,
    ),
  );
});

test("rejects the same authoring errors as the production build", () => {
  rejects(
    imageList("", [`- ${IMAGE}`]),
    PAPER_IMAGE_LIST_MESSAGES.listStyleType,
  );
  rejects(
    imageList('listStyleType="disc"', [`- ${IMAGE}`]),
    PAPER_IMAGE_LIST_MESSAGES.listStyleType,
  );
  rejects(
    imageList('listStyleType="none" columns="7"', [`- ${IMAGE}`]),
    PAPER_IMAGE_LIST_MESSAGES.columnsRange,
  );
  rejects(
    imageList('listStyleType="none" layout="row"', [`- ${IMAGE}`]),
    PAPER_IMAGE_LIST_MESSAGES.unknownAttribute("layout"),
  );
  rejects(
    imageList('listStyleType="none"', ["- text only"]),
    PAPER_IMAGE_LIST_MESSAGES.item,
  );
  rejects(
    imageList('listStyleType="none"', [`- ${IMAGE}\n  ${IMAGE}`]),
    PAPER_IMAGE_LIST_MESSAGES.item,
  );
  rejects(
    imageList('listStyleType="none"', [`- ${IMAGE}\n  - nested`]),
    PAPER_IMAGE_LIST_MESSAGES.caption,
  );
  rejects(
    imageList(
      'listStyleType="none"',
      [`- ${IMAGE}\n\n  first\n\n  second`],
      true,
    ),
    PAPER_IMAGE_LIST_MESSAGES.caption,
  );
  rejects(
    '<PaperImageList listStyleType="none">\n\nJust text.\n\n</PaperImageList>',
    PAPER_IMAGE_LIST_MESSAGES.list,
  );
});

test("carries listStyleType and columns through the compatibility comment", async () => {
  const compatibility = toPaperImageListCompatibilityMarkdown(
    imageList('listStyleType="none" columns="2"', ["- ![A](a)", "- ![B](b)"]),
  );
  assert.match(compatibility, /<!-- RTQ_PAPER_IMAGE_LIST: none columns=2 -->/);
  assert.doesNotMatch(compatibility, /PaperImageList>/);
  const result = await unified()
    .use(remarkParse)
    .use(remarkPaperImageList)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(compatibility);
  assert.match(String(result), /data-image-list=""/);
  assert.match(String(result), /data-columns="2"/);
});

test("strips wrappers for readable Markdown and leaves fences alone", () => {
  const fenced = '```\n<PaperImageList listStyleType="none">\n```\n';
  assert.equal(stripPaperImageListWrapperLines(fenced), fenced);
  assert.equal(toPaperImageListCompatibilityMarkdown(fenced), fenced);
  assert.equal(
    stripPaperImageListWrapperLines(
      imageList('listStyleType="none"', ["- ![A](a)"]),
    ),
    "\n- ![A](a)\n\n",
  );
});

test("an image's list width is its standalone width", () => {
  assert.equal(
    getPaperImageListWidth({ displaySize: "sm", naturalWidth: 230 }),
    230,
  );
  assert.equal(
    getPaperImageListWidth({ displaySize: "sm", naturalWidth: 230, scale: 2 }),
    460,
  );
  assert.equal(getPaperImageListWidth({ displaySize: "sm" }), 256);
  assert.equal(getPaperImageListWidth({ displaySize: "md" }), 320);
  assert.equal(getPaperImageListWidth({ displaySize: "full" }), null);
  assert.equal(getPaperImageListWidth({ displaySize: "unknown" }), 256);
  assert.equal(
    getPaperImageListWidth({ displaySize: "sm", intrinsicWidth: 58 }),
    58,
  );
  assert.equal(
    getPaperImageListWidth({ displaySize: "sm", intrinsicWidth: 900 }),
    256,
  );
  assert.equal(
    getPaperImageListWidth({
      displaySize: "sm",
      intrinsicWidth: 58,
      rasterFloor: 576,
    }),
    576,
  );
});
