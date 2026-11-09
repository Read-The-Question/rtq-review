import assert from "node:assert/strict";
import test from "node:test";

import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import {
  type HastNode,
  PAPER_IMAGE_GROUP_LIST_OPTIONS,
  rehypePaperImageList,
} from "./index.ts";

function el(
  tagName: string,
  properties: Record<string, unknown>,
  children: HastNode[] = [],
): HastNode {
  return { children, properties, tagName, type: "element" };
}

function variant(provenance: string, width: number | "fill") {
  const natural = width === "fill" ? 320 : width;
  return el(
    "div",
    {
      className: ["paper-image-variant"],
      dataProvenance: provenance,
      dataImageListWidth: String(width),
    },
    [
      el("span", { className: ["paper-image-format"] }, [
        { type: "text", value: `${provenance} · SVG` },
      ]),
      el(
        "div",
        {
          className: ["paper-svg-scroll"],
          role: "group",
          style: `max-width:${natural}px;margin:1rem auto 1rem 0;height:auto;`,
          tabIndex: 0,
        },
        [
          el(
            "div",
            {
              className: ["paper-svg-graphic"],
              style: `min-width:${natural * 0.75}px`,
            },
            [el("img", { src: `/${provenance}.svg` })],
          ),
        ],
      ),
    ],
  );
}

function group(...variants: HastNode[]): HastNode {
  return el("div", { className: ["paper-image-group"] }, variants);
}

function tree(): HastNode {
  return {
    children: [
      el("ul", { dataImageList: "", dataListStyleType: "upper-alpha" }, [
        el("li", {}, [group(variant("manual", 256), variant("v2", 128))]),
        el("li", {}, [
          group(variant("manual", "fill"), variant("v2", 230)),
          { type: "text", value: " angle B" },
        ]),
      ]),
    ],
    type: "root",
  };
}

function run(): string {
  const root = tree();
  rehypePaperImageList(PAPER_IMAGE_GROUP_LIST_OPTIONS)(root);
  return unified()
    .use(rehypeStringify)
    .stringify(root as never);
}

test("draws one list per provenance from the raw-HTML image groups", () => {
  const html = run();
  assert.equal(html.match(/data-slot="paper-image-list"/g)?.length, 2);
  assert.match(html, /class="rtq-image-list-label">Original</);
  assert.match(html, /class="rtq-image-list-label">V2</);
  assert.match(html, /--rtq-image-list-item-width: 230px/);
  assert.match(html, /--rtq-image-list-item-width: 256px/);
  assert.match(html, /<figcaption class="rtq-image-list-caption">angle B/);
});

test("keeps one variant per list with its standalone sizing", () => {
  const html = run();
  const [original, v2] = html.split('data-version="v2"');
  assert.match(original!, /\/manual\.svg/);
  assert.doesNotMatch(original!, /\/v2\.svg/);
  assert.match(v2!, /\/v2\.svg/);
  assert.doesNotMatch(html, /paper-image-format/);
  // Each image keeps its own scroll region and natural/minimum widths.
  assert.match(html, /max-width:230px;height:auto;/);
  assert.doesNotMatch(html, /margin:/);
  assert.match(html, /min-width:172.5px/);
  assert.equal(html.match(/role="group"/g)?.length, 4);
  // A full-width raster fills its line: no item width on its figure.
  assert.equal(html.match(/--rtq-image-list-item-width/g)?.length, 3);
});

test("leaves groups without a list width as they are", () => {
  const root: HastNode = {
    children: [
      el("ul", { dataImageList: "" }, [
        el("li", {}, [
          group(el("div", { className: ["paper-image-variant"] }, [])),
        ]),
      ]),
    ],
    type: "root",
  };
  rehypePaperImageList(PAPER_IMAGE_GROUP_LIST_OPTIONS)(root);
  assert.equal(root.children?.[0]?.tagName, "ul");
});
