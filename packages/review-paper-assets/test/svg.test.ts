import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  prepareReviewSvg,
  paperImageRenderMode,
  assertPaperImageDelivery,
} from "../src/svg.ts";
import { installSvgToolFixture } from "./svg-tool-fixture.mjs";

test("paper delivery defaults externally and rejects malformed or incompatible requests", () => {
  assert.equal(
    paperImageRenderMode('<PaperImage assetScope="question" />'),
    "external",
  );
  for (const mode of ["inline", "external"] as const) {
    assert.equal(
      paperImageRenderMode(`<PaperImage renderMode="${mode}" />`),
      mode,
    );
    assert.doesNotThrow(() =>
      assertPaperImageDelivery(mode, mode, "svg", "fixture"),
    );
    assert.throws(
      () =>
        assertPaperImageDelivery(
          mode,
          mode === "inline" ? "external" : "inline",
          "svg",
          "fixture",
        ),
      /delivery mismatch/,
    );
  }
  for (const component of [
    '<PaperImage renderMode="other" />',
    '<PaperImage renderMode="" />',
    '<PaperImage renderMode={"inline"} />',
    '<PaperImage renderMode="inline" renderMode="external" />',
  ])
    assert.throws(() => paperImageRenderMode(component), /PaperImage/);
  for (const format of ["png", "jpg", "jpeg", undefined])
    assert.throws(
      () => assertPaperImageDelivery("inline", "external", format, "fixture"),
      /inline delivery requires/,
    );
});

test("prepares both deliveries, caches unchanged inputs and invalidates edited SVGs or colours", (t) => {
  const root = mkdtempSync(join(tmpdir(), "rtq-review-svg-"));
  const previous = process.env.RTQ_CONTENT_ROOT;
  process.env.RTQ_CONTENT_ROOT = root;
  t.after(() => {
    if (previous === undefined) delete process.env.RTQ_CONTENT_ROOT;
    else process.env.RTQ_CONTENT_ROOT = previous;
    rmSync(root, { recursive: true, force: true });
  });
  mkdirSync(join(root, "packages/papers/papers/toml"), { recursive: true });
  writeFileSync(
    join(root, "package.json"),
    '{"name":"@rtq/content-workspace"}',
  );
  writeFileSync(join(root, "pnpm-workspace.yaml"), "packages: []\n");
  writeFileSync(
    join(root, "packages/papers/package.json"),
    '{"name":"@rtq/papers"}',
  );
  const assets = join(root, "packages/assets");
  installSvgToolFixture(assets);
  const source = join(assets, "assets/example.svg");
  writeFileSync(source, '<svg width="100.5" height="50" />');
  const external = prepareReviewSvg(source, "example", "external");
  assert.deepEqual(external, {
    naturalWidth: 100.5,
    naturalHeight: 50,
    minimumReadableWidth: 75.375,
  });
  assert.equal(prepareReviewSvg(source, "example", "external"), external);
  const inline = prepareReviewSvg(source, "example", "inline");
  assert.match(inline.svgMarkup!, /<svg/);
  assert.equal(inline.svgCss, "");
  writeFileSync(
    join(assets, "assets/design-tokens/svg-colours.json"),
    '{"updated":true}',
  );
  assert.notEqual(prepareReviewSvg(source, "example", "inline"), inline);
  writeFileSync(source, '<svg width="200" height="100" />');
  assert.equal(
    prepareReviewSvg(source, "example", "external").naturalWidth,
    200,
  );
  writeFileSync(source, "<svg />");
  assert.throws(
    () => prepareReviewSvg(source, "example", "external"),
    /requires absolute SVG dimensions/,
  );
  writeFileSync(
    join(assets, "svg-tool-fixture.mjs"),
    'console.log("invalid-json")',
  );
  assert.throws(
    () => prepareReviewSvg(source, "example", "external"),
    /Invalid SVG preparation response/,
  );
  writeFileSync(
    join(assets, "svg-tool-fixture.mjs"),
    "console.log(JSON.stringify({naturalWidth:10,naturalHeight:10,minimumReadableWidth:20}))",
  );
  assert.throws(
    () => prepareReviewSvg(source, "example", "external"),
    /Invalid natural SVG dimensions/,
  );
});
