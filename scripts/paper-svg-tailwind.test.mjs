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
import { fileURLToPath, pathToFileURL } from "node:url";
import postcss from "postcss";

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixedSwatches = {
  "--color-diagrams-swatch-black": "#0a0a0a",
  "--color-diagrams-swatch-white": "#f5f5f5",
  "--color-diagrams-swatch-grey": "#929292",
  "--color-diagrams-swatch-red": "#f53e39",
  "--color-diagrams-swatch-orange": "#e97200",
  "--color-diagrams-swatch-yellow": "#f7d710",
  "--color-diagrams-swatch-green": "#01a943",
  "--color-diagrams-swatch-blue": "#2288f8",
  "--color-diagrams-swatch-purple": "#a661e8",
  "--color-diagrams-swatch-pink": "#f47db9",
  "--color-diagrams-swatch-brown": "#b6744b",
};
const fixedDiagnosticColours = {
  "--color-diagrams-debug-annotation-label": "rgba(240, 228, 66, 0.35)",
  "--color-diagrams-debug-axis-tick": "rgba(0, 114, 178, 0.35)",
  "--color-diagrams-debug-axis-title": "rgba(123, 44, 191, 0.35)",
  "--color-diagrams-debug-chart-title": "rgba(0, 143, 140, 0.35)",
  "--color-diagrams-debug-custom-text": "rgba(215, 38, 61, 0.45)",
  "--color-diagrams-debug-data-label": "rgba(0, 180, 216, 0.35)",
  "--color-diagrams-debug-key": "rgba(204, 121, 167, 0.35)",
  "--color-diagrams-debug-point": "rgba(0, 158, 115, 0.35)",
  "--color-diagrams-debug-point-label": "rgba(230, 159, 0, 0.35)",
};

function retainedSnapshot(debugBounds) {
  return {
    version: 2,
    themes: {
      light: {
        "--color-diagrams-debug-bounds": debugBounds,
        ...fixedDiagnosticColours,
        ...fixedSwatches,
      },
      dark: {
        "--color-diagrams-debug-bounds": debugBounds,
        ...fixedDiagnosticColours,
        ...fixedSwatches,
      },
    },
  };
}

test("review compilers discover canonical SVG utilities through the configured content root", async () => {
  const fixture = mkdtempSync(join(tmpdir(), "rtq-review-svg-tailwind-"));
  const previousRoot = process.env.RTQ_CONTENT_ROOT;
  const write = (path, content) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  };
  const assets = join(fixture, "packages/assets/assets");
  const snapshotPath = join(assets, "design-tokens/svg-colours.json");
  const consumer = join(fixture, "consumer");
  const svg = join(
    assets,
    "papers/paper/workings/generated/long-division/working.svg",
  );
  const nextUtilitySvg = join(assets, "papers/paper/questions/manual/new.svg");
  const applications = ["review-tag-web", "review-question-viewer-web"];

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
    write(
      snapshotPath,
      JSON.stringify(retainedSnapshot("rgba(10, 10, 10, 0.25)")),
    );
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
        '<svg class="text-maths-working-carry text-diagrams-debug-bounds"><path class="fill-diagrams-swatch-red stroke-diagrams-swatch-blue"/><path class="fill-diagrams-debug-point-label"/><path class="fill-diagrams-debug-custom-text"/></svg>',
      );
      const result = await compile();
      for (const utility of [
        "text-maths-working-carry",
        "text-diagrams-debug-bounds",
        "fill-diagrams-swatch-red",
        "stroke-diagrams-swatch-blue",
        "fill-diagrams-debug-point-label",
        "fill-diagrams-debug-custom-text",
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
      assert.ok(
        result.css.includes("var(--rtq-maths-working-carry)"),
        application,
      );
      assert.ok(!result.css.includes(".underline {"), application);
      assert.match(
        result.css,
        /\.text-diagrams-debug-bounds\s*\{\s*color:\s*rgba\(10, 10, 10, 0\.25\);/,
        application,
      );
      assert.match(
        result.css,
        /\.fill-diagrams-swatch-red\s*\{\s*fill:\s*#f53e39;/,
        application,
      );
      assert.match(
        result.css,
        /\.stroke-diagrams-swatch-blue\s*\{\s*stroke:\s*#2288f8;/,
        application,
      );
      assert.match(
        result.css,
        /\.fill-diagrams-debug-point-label\s*\{\s*fill:\s*rgba\(230, 159, 0, 0\.35\);/,
        application,
      );
      assert.match(
        result.css,
        /\.fill-diagrams-debug-custom-text\s*\{\s*fill:\s*rgba\(215, 38, 61, 0\.45\);/,
        application,
      );

      write(nextUtilitySvg, '<svg class="stroke-maths-working-carry"/>');
      assert.ok(
        (await compile()).css.includes(".stroke-maths-working-carry {"),
        application,
      );
    }
    const configUrl = pathToFileURL(
      join(workspace, "packages/repository-paths/src/tailwind-svg-sources.ts"),
    ).href;
    write(
      snapshotPath,
      JSON.stringify(retainedSnapshot("rgba(12, 24, 36, 0.4)")),
    );
    const { default: recalibrated } = await import(`${configUrl}?recalibrated`);
    assert.equal(
      recalibrated.theme.extend.colors["diagrams-debug-bounds"],
      "rgba(12, 24, 36, 0.4)",
    );
    assert.equal(
      recalibrated.theme.extend.colors["diagrams-debug-point-label"],
      fixedDiagnosticColours["--color-diagrams-debug-point-label"],
    );
    for (const [name, colour] of [
      ["missing", undefined],
      ["invalid", "red; } body { display: none; }"],
    ]) {
      write(
        snapshotPath,
        JSON.stringify({
          ...retainedSnapshot("rgba(12, 24, 36, 0.4)"),
          themes: {
            ...retainedSnapshot("rgba(12, 24, 36, 0.4)").themes,
            light: {
              ...retainedSnapshot("rgba(12, 24, 36, 0.4)").themes.light,
              "--color-diagrams-debug-bounds": colour,
            },
          },
        }),
      );
      await assert.rejects(
        import(`${configUrl}?${name}`),
        /Missing or invalid diagrams-debug-bounds/,
      );
    }
    const missingSwatch = retainedSnapshot("rgba(12, 24, 36, 0.4)");
    delete missingSwatch.themes.light["--color-diagrams-swatch-brown"];
    write(snapshotPath, JSON.stringify(missingSwatch));
    await assert.rejects(
      import(`${configUrl}?missing-swatch`),
      /Missing or invalid diagrams-swatch-brown/,
    );
    const missingDiagnostic = retainedSnapshot("rgba(12, 24, 36, 0.4)");
    delete missingDiagnostic.themes.light["--color-diagrams-debug-custom-text"];
    write(snapshotPath, JSON.stringify(missingDiagnostic));
    await assert.rejects(
      import(`${configUrl}?missing-diagnostic`),
      /Missing or invalid diagrams-debug-custom-text/,
    );
    const driftingSwatch = retainedSnapshot("rgba(12, 24, 36, 0.4)");
    driftingSwatch.themes.dark["--color-diagrams-swatch-red"] = "#000000";
    write(snapshotPath, JSON.stringify(driftingSwatch));
    await assert.rejects(
      import(`${configUrl}?drifting-swatch`),
      /Expected mode-invariant diagrams-swatch-red/,
    );
  } finally {
    if (previousRoot === undefined) delete process.env.RTQ_CONTENT_ROOT;
    else process.env.RTQ_CONTENT_ROOT = previousRoot;
    rmSync(fixture, { recursive: true, force: true });
  }
});
