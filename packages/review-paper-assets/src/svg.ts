import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import { resolveRtqContentPaths } from "@rtq/review-repository-paths";
export { paperImageRenderMode, assertPaperImageDelivery } from "./delivery.ts";

export type PreparedReviewSvg = Readonly<{
  minimumReadableWidth: number;
  naturalHeight: number;
  naturalWidth: number;
  svgMarkup?: string;
  svgCss?: string;
}>;

const cache = new Map<
  string,
  { signature: string; value: PreparedReviewSvg }
>();

export function prepareReviewSvg(
  inputPath: string,
  namespace: string,
  renderMode: "inline" | "external",
): PreparedReviewSvg {
  const { assetsPackageRoot } = resolveRtqContentPaths();
  const stats = statSync(inputPath);
  const colourStats =
    renderMode === "inline"
      ? statSync(
          join(assetsPackageRoot, "assets/design-tokens/svg-colours.json"),
        )
      : undefined;
  const signature = `${stats.mtimeMs}:${stats.ctimeMs}:${stats.size}:${colourStats?.mtimeMs}:${colourStats?.ctimeMs}`;
  const key = `${assetsPackageRoot}:${inputPath}:${namespace}:${renderMode}`;
  const cached = cache.get(key);
  if (cached?.signature === signature) return cached.value;
  const result = spawnSync(
    "pnpm",
    [
      "--silent",
      "--dir",
      assetsPackageRoot,
      "papers:images:svg:prepare",
      "--",
      `--input=${inputPath}`,
      `--namespace=${namespace}`,
      `--render-mode=${renderMode}`,
      ...(renderMode === "inline" ? ["--review-css"] : []),
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  if (result.error || result.status !== 0) {
    throw new Error(
      `SVG preparation failed for ${inputPath}: ${result.error?.message || result.stderr.trim() || result.stdout.trim() || `exit ${result.status}`}`,
    );
  }
  let raw: unknown;
  try {
    raw = JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`Invalid SVG preparation response for ${inputPath}.`, {
      cause: error,
    });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`Invalid SVG preparation response for ${inputPath}.`);
  }
  const value = raw as Record<string, unknown>;
  const {
    minimumReadableWidth,
    naturalHeight,
    naturalWidth,
    svgMarkup,
    svgCss,
  } = value;
  if (
    typeof minimumReadableWidth !== "number" ||
    !Number.isFinite(minimumReadableWidth) ||
    minimumReadableWidth <= 0 ||
    typeof naturalWidth !== "number" ||
    !Number.isFinite(naturalWidth) ||
    naturalWidth < minimumReadableWidth ||
    typeof naturalHeight !== "number" ||
    !Number.isFinite(naturalHeight) ||
    naturalHeight <= 0 ||
    (renderMode === "inline" &&
      (typeof svgMarkup !== "string" ||
        !svgMarkup ||
        typeof svgCss !== "string"))
  ) {
    throw new Error(
      `Invalid natural SVG dimensions or inline markup for ${inputPath}.`,
    );
  }
  const prepared: PreparedReviewSvg = Object.freeze({
    minimumReadableWidth,
    naturalHeight,
    naturalWidth,
    ...(renderMode === "inline" &&
    typeof svgMarkup === "string" &&
    typeof svgCss === "string"
      ? { svgMarkup: svgMarkup.replace(/>\s+</g, "><"), svgCss }
      : {}),
  });
  if (cache.size >= 256) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { signature, value: prepared });
  return prepared;
}
