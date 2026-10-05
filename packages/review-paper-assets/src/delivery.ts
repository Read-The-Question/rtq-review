export type PaperImageRenderMode = "inline" | "external";

export function paperImageRenderMode(component: string): PaperImageRenderMode {
  let remaining = component.slice("<PaperImage".length, -2);
  const attributes = new Map<string, string>();
  while (remaining.trim()) {
    const match = /^\s+([A-Za-z][A-Za-z0-9_-]*)="([^"]*)"/.exec(remaining);
    if (!match)
      throw new Error("PaperImage requires static double-quoted attributes.");
    const [, name, value] = match;
    if (attributes.has(name))
      throw new Error(`Duplicate PaperImage attribute ${name}.`);
    attributes.set(name, value);
    remaining = remaining.slice(match[0].length);
  }
  const mode = attributes.get("renderMode") ?? "external";
  if (mode !== "inline" && mode !== "external")
    throw new Error('PaperImage renderMode must be "inline" or "external".');
  return mode;
}

export function assertPaperImageDelivery(
  requested: PaperImageRenderMode,
  actual: PaperImageRenderMode,
  format: string | undefined,
  source: string,
) {
  if (requested === "inline" && format !== "svg")
    throw new Error(
      `PaperImage ${source}: inline delivery requires an existing SVG, not a raster or missing asset.`,
    );
  if (requested !== actual)
    throw new Error(
      `PaperImage delivery mismatch at ${source}: paper requests "${requested}", artifact records "${actual}". Regenerate diagrams from current canonical TOML, or update the manual artwork and its metadata.`,
    );
}
