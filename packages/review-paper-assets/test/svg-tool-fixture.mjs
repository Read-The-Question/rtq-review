import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Consumer tests exercise the process boundary without requiring a sibling
// content checkout. Canonical SVG parsing/sanitizing is tested in rtq-content.
export function installSvgToolFixture(assetsPackageRoot) {
  mkdirSync(assetsPackageRoot, { recursive: true });
  mkdirSync(join(assetsPackageRoot, "assets/design-tokens"), {
    recursive: true,
  });
  writeFileSync(
    join(assetsPackageRoot, "assets/design-tokens/svg-colours.json"),
    "{}",
  );
  writeFileSync(
    join(assetsPackageRoot, "package.json"),
    JSON.stringify({
      name: "@rtq/maths-assets",
      scripts: { "papers:images:svg:prepare": "node svg-tool-fixture.mjs" },
    }),
  );
  writeFileSync(
    join(assetsPackageRoot, "svg-tool-fixture.mjs"),
    `
    import { readFileSync } from 'node:fs';
    const args = Object.fromEntries(process.argv.slice(2)
      .filter(value => value.startsWith('--') && value.includes('='))
      .map(value => [value.slice(2, value.indexOf('=')), value.slice(value.indexOf('=') + 1)]));
    const svg = readFileSync(args.input, 'utf8');
    const naturalWidth = Number(svg.match(/\\bwidth="([0-9.]+)"/)?.[1]);
    const naturalHeight = Number(svg.match(/\\bheight="([0-9.]+)"/)?.[1]);
    if (!naturalWidth || !naturalHeight) throw new Error('Fixture requires absolute SVG dimensions');
    console.log(JSON.stringify({
      naturalWidth, naturalHeight, minimumReadableWidth: naturalWidth * 0.75,
      ...(args['render-mode'] === 'inline' ? { svgMarkup: svg, svgCss: '' } : {}),
    }));
  `,
  );
}
