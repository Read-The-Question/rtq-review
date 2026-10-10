import { join } from "node:path";
import { readFileSync } from "node:fs";

import { resolveRtqContentPaths } from "./index.ts";

const { assetsRoot } = resolveRtqContentPaths();
const snapshotPath = join(assetsRoot, "design-tokens/svg-colours.json");
const snapshot: unknown = JSON.parse(readFileSync(snapshotPath, "utf8"));

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function retainedColour(name: string): string {
  if (
    !isRecord(snapshot) ||
    snapshot.version !== 2 ||
    !isRecord(snapshot.themes) ||
    !isRecord(snapshot.themes.light)
  )
    throw new Error(`Invalid retained SVG colour snapshot: ${snapshotPath}`);
  const colour = snapshot.themes.light[`--color-${name}`];
  if (
    typeof colour !== "string" ||
    !/^(?:#[a-f0-9]{6}|rgba\(\d+, \d+, \d+, (?:0|1|0\.\d{1,6})\))$/.test(colour)
  )
    throw new Error(
      `Missing or invalid ${name} colour in ${snapshotPath}; refresh SVG colours explicitly.`,
    );
  if (
    name.startsWith("diagrams-swatch-") &&
    (!isRecord(snapshot.themes.dark) ||
      snapshot.themes.dark[`--color-${name}`] !== colour)
  )
    throw new Error(
      `Expected mode-invariant ${name} colour in ${snapshotPath}; refresh SVG colours explicitly.`,
    );
  return colour;
}

const diagramSwatches = [
  "black",
  "white",
  "grey",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
] as const;

const diagramDiagnosticRoles = [
  "axis-tick",
  "axis-title",
  "chart-title",
  "point",
  "point-label",
  "data-label",
  "key",
  "annotation-label",
  "custom-text",
] as const;

export default {
  content: [join(assetsRoot, "papers", "**/*.svg").replaceAll("\\", "/")],
  theme: {
    extend: {
      colors: {
        "diagrams-debug-bounds": retainedColour("diagrams-debug-bounds"),
        ...Object.fromEntries(
          diagramDiagnosticRoles.map((role) => [
            `diagrams-debug-${role}`,
            retainedColour(`diagrams-debug-${role}`),
          ]),
        ),
        ...Object.fromEntries(
          diagramSwatches.map((swatch) => [
            `diagrams-swatch-${swatch}`,
            retainedColour(`diagrams-swatch-${swatch}`),
          ]),
        ),
      },
    },
  },
};
