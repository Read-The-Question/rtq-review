import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("review compilers discover canonical SVG utilities through the configured content root", async () => {
  const fixture = mkdtempSync(join(tmpdir(), "rtq-review-svg-tailwind-"));
  const previousRoot = process.env.RTQ_CONTENT_ROOT;
  const write = (path, content) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  };
  const assets = join(fixture, "packages/assets/assets");
  const consumer = join(fixture, "consumer");
  const svg = join(
    assets,
    "papers/paper/workings/generated/long-division/working.svg",
  );
  const nextUtilitySvg = join(assets, "papers/paper/questions/manual/new.svg");
  const applications = [
    "review-tag-web",
    "review-question-viewer-web",
  ];

  try {
    write(join(fixture, "package.json"), '{"name":"@rtq/content-workspace"}');
    write(join(fixture, "pnpm-workspace.yaml"), 'packages: ["packages/*"]');
    write(
      join(fixture, "packages/papers/package.json"),
      '{"name":"@rtq/papers"}',
    );
    write(
      join(fixture, "packages/assets/package.json"),
      '{"name":"@rtq/maths-assets"}',
    );
    mkdirSync(join(fixture, "packages/papers/papers/toml"), {
      recursive: true,
    });
    mkdirSync(assets, { recursive: true });
    mkdirSync(consumer);
    write(join(fixture, ".gitignore"), "/packages/assets/assets/");
    mkdirSync(join(fixture, ".git"));
    write(
      join(fixture, "retired-assets/papers/old.svg"),
      '<svg class="underline"/>',
    );
    process.env.RTQ_CONTENT_ROOT = fixture;

    for (const application of applications) {
      rmSync(svg, { force: true });
      rmSync(nextUtilitySvg, { force: true });
      const app = join(workspace, "apps", application);
      const require = createRequire(join(app, "package.json"));
      const stylesheet = join(app, "src/app/globals.css");
      const input = readFileSync(stylesheet, "utf8");
      const compile = () => {
        const plugin = require("@tailwindcss/postcss")({
          base: consumer,
          optimize: false,
        });
        return postcss([plugin]).process(input, { from: stylesheet });
      };

      const before = await compile();
      assert.ok(
        !before.css.includes(".text-maths-working-carry {"),
        application,
      );
      write(
        svg,
        '<svg class="text-maths-working-carry text-maths-working-remainder text-foreground-strong"/>',
      );
      const result = await compile();
      for (const utility of [
        "text-maths-working-carry",
        "text-maths-working-remainder",
        "text-foreground-strong",
      ]) {
        assert.ok(
          result.css.includes(`.${utility} {`),
          `${application}: ${utility}`,
        );
      }
      assert.ok(
        !result.css.includes("[data-rtq-long-division-role="),
        application,
      );
      assert.ok(result.css.includes("var(--maths-working-carry)"), application);
      assert.ok(
        result.css.includes("var(--maths-working-remainder)"),
        application,
      );
      assert.ok(
        result.css.includes("var(--long-division-working-rule)"),
        application,
      );
      assert.ok(!result.css.includes(".underline {"), application);

      write(nextUtilitySvg, '<svg class="stroke-maths-working-carry"/>');
      assert.ok(
        (await compile()).css.includes(".stroke-maths-working-carry {"),
        application,
      );
    }
  } finally {
    if (previousRoot === undefined) delete process.env.RTQ_CONTENT_ROOT;
    else process.env.RTQ_CONTENT_ROOT = previousRoot;
    rmSync(fixture, { recursive: true, force: true });
  }
});
