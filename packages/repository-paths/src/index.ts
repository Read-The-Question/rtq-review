import { readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REVIEW_WORKSPACE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

type Environment = Readonly<Record<string, string | undefined>>;

export type ResolveRtqContentOptions = {
  environment?: Environment;
  workspaceRoot?: string;
};

export type RtqContentPaths = {
  assetsPackageRoot: string;
  assetsRoot: string;
  contentRoot: string;
  papersPackageRoot: string;
  papersRoot: string;
};

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function readPackageName(root: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    );

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "name" in parsed &&
      typeof parsed.name === "string"
    ) {
      return parsed.name;
    }
  } catch {
    // The contract error below reports paths and expected identities only.
  }

  return undefined;
}

function requireMarker(root: string, relativePath: string): void {
  const marker = join(root, relativePath);
  if (!isFile(marker) && !isDirectory(marker)) {
    throw new Error(
      `RTQ_CONTENT_ROOT resolved to ${root}, but required marker ${relativePath} is missing. ` +
        "Set RTQ_CONTENT_ROOT to a complete rtq-content checkout.",
    );
  }
}

export function resolveRtqContentRoot(
  options: ResolveRtqContentOptions = {},
): string {
  const environment = options.environment ?? process.env;
  const workspaceRoot = resolve(options.workspaceRoot ?? REVIEW_WORKSPACE_ROOT);
  const configured = environment.RTQ_CONTENT_ROOT?.trim();
  const defaultPath = resolve(workspaceRoot, "..", "rtq-content");
  const candidate = configured
    ? isAbsolute(configured)
      ? resolve(configured)
      : resolve(workspaceRoot, configured)
    : defaultPath;
  const origin = configured
    ? `RTQ_CONTENT_ROOT=${JSON.stringify(configured)}`
    : `sibling default ${defaultPath}`;

  if (!isDirectory(candidate)) {
    throw new Error(
      `RTQ_CONTENT_ROOT repository root is unavailable at ${candidate} (resolved from ${origin}). ` +
        `Set RTQ_CONTENT_ROOT to the rtq-content Git root; relative values are resolved from ${workspaceRoot}.`,
    );
  }

  const canonicalRoot = realpathSync(candidate);
  const actualPackageName = readPackageName(canonicalRoot);
  if (actualPackageName !== "@rtq/content-workspace") {
    throw new Error(
      `RTQ_CONTENT_ROOT expected package @rtq/content-workspace at ${canonicalRoot}, ` +
        `but found ${actualPackageName ?? "no readable package identity"} (resolved from ${origin}).`,
    );
  }

  for (const marker of [
    "pnpm-workspace.yaml",
    "packages/papers/package.json",
    "packages/papers/papers/toml",
    "packages/assets/package.json",
    "packages/assets/assets",
  ]) {
    requireMarker(canonicalRoot, marker);
  }

  return canonicalRoot;
}

export function resolveRtqContentPaths(
  options: ResolveRtqContentOptions = {},
): RtqContentPaths {
  const contentRoot = resolveRtqContentRoot(options);
  const papersPackageRoot = join(contentRoot, "packages", "papers");
  const assetsPackageRoot = join(contentRoot, "packages", "assets");

  if (readPackageName(papersPackageRoot) !== "@rtq/papers") {
    throw new Error(
      `RTQ_CONTENT_ROOT expected @rtq/papers at ${papersPackageRoot}.`,
    );
  }
  if (readPackageName(assetsPackageRoot) !== "@rtq/maths-assets") {
    throw new Error(
      `RTQ_CONTENT_ROOT expected @rtq/maths-assets at ${assetsPackageRoot}.`,
    );
  }

  return {
    assetsPackageRoot,
    assetsRoot: join(assetsPackageRoot, "assets"),
    contentRoot,
    papersPackageRoot,
    papersRoot: join(papersPackageRoot, "papers"),
  };
}
