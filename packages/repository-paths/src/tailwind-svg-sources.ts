import { join } from "node:path";
import { readFileSync } from "node:fs";

import { resolveRtqContentPaths } from "./index.ts";

const { assetsRoot } = resolveRtqContentPaths();
const snapshotPath = join(assetsRoot, "design-tokens/svg-colours.json");
const snapshot: unknown = JSON.parse(readFileSync(snapshotPath, "utf8"));

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function debugBoundsColour(): string {
  if (
    !isRecord(snapshot) ||
    snapshot.version !== 2 ||
    !isRecord(snapshot.themes) ||
    !isRecord(snapshot.themes.light)
  )
    throw new Error(`Invalid retained SVG colour snapshot: ${snapshotPath}`);
  const colour = snapshot.themes.light["--color-diagrams-debug-bounds"];
  if (
    typeof colour !== "string" ||
    !/^(?:#[a-f0-9]{6}|rgba\(\d+, \d+, \d+, (?:0|1|0\.\d{1,6})\))$/.test(colour)
  )
    throw new Error(
      `Missing or invalid diagrams-debug-bounds colour in ${snapshotPath}; refresh SVG colours explicitly.`,
    );
  return colour;
}

export default {
  content: [join(assetsRoot, "papers", "**/*.svg").replaceAll("\\", "/")],
  theme: {
    extend: {
      colors: {
        "diagrams-debug-bounds": debugBoundsColour(),
      },
    },
  },
};
