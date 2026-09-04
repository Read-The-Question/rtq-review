export const conventionalDocumentationFiles = [
  "README.md",
  "docs/**/*.md",
] as const;

export type DocumentationOwnerType = "repository" | "app" | "package";

export type DocumentationSource = Readonly<{
  key: string;
  route: string;
  ownerType: DocumentationOwnerType;
  repositoryKey: string;
  collectionDirectory: string;
  repositoryDirectory: string;
  repository: Readonly<{
    user: string;
    name: string;
    branch: string;
  }>;
  files: typeof conventionalDocumentationFiles;
}>;

const readTheQuestion = "Read-The-Question";
const develop = "develop";

export const documentationSources = [
  {
    key: "rtq-content",
    route: "rtq-content",
    ownerType: "repository",
    repositoryKey: "rtq-content",
    collectionDirectory: "../../../rtq-content",
    repositoryDirectory: "",
    repository: {
      user: readTheQuestion,
      name: "rtq-content",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-content-assets",
    route: "rtq-content/packages/assets",
    ownerType: "package",
    repositoryKey: "rtq-content",
    collectionDirectory: "../../../rtq-content/packages/assets",
    repositoryDirectory: "packages/assets",
    repository: {
      user: readTheQuestion,
      name: "rtq-content",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-content-papers",
    route: "rtq-content/packages/papers",
    ownerType: "package",
    repositoryKey: "rtq-content",
    collectionDirectory: "../../../rtq-content/packages/papers",
    repositoryDirectory: "packages/papers",
    repository: {
      user: readTheQuestion,
      name: "rtq-content",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-env",
    route: "rtq-env",
    ownerType: "repository",
    repositoryKey: "rtq-env",
    collectionDirectory: "../../../rtq-env",
    repositoryDirectory: "",
    repository: {
      user: readTheQuestion,
      name: "rtq-env",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review",
    route: "rtq-review",
    ownerType: "repository",
    repositoryKey: "rtq-review",
    collectionDirectory: "../..",
    repositoryDirectory: "",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-docs-web",
    route: "rtq-review/apps/docs-web",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: ".",
    repositoryDirectory: "apps/docs-web",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-review-api",
    route: "rtq-review/apps/review-api",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: "../review-api",
    repositoryDirectory: "apps/review-api",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-review-legacy-gatsby-web",
    route: "rtq-review/apps/review-legacy-gatsby-web",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: "../review-legacy-gatsby-web",
    repositoryDirectory: "apps/review-legacy-gatsby-web",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-review-question-viewer-web",
    route: "rtq-review/apps/review-question-viewer-web",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: "../review-question-viewer-web",
    repositoryDirectory: "apps/review-question-viewer-web",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-review-tag-web",
    route: "rtq-review/apps/review-tag-web",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: "../review-tag-web",
    repositoryDirectory: "apps/review-tag-web",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-review-web",
    route: "rtq-review/apps/review-web",
    ownerType: "app",
    repositoryKey: "rtq-review",
    collectionDirectory: "../review-web",
    repositoryDirectory: "apps/review-web",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-review-repository-paths",
    route: "rtq-review/packages/repository-paths",
    ownerType: "package",
    repositoryKey: "rtq-review",
    collectionDirectory: "../../packages/repository-paths",
    repositoryDirectory: "packages/repository-paths",
    repository: {
      user: readTheQuestion,
      name: "rtq-review",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-web",
    route: "rtq-web",
    ownerType: "repository",
    repositoryKey: "rtq-web",
    collectionDirectory: "../../../rtq-web",
    repositoryDirectory: "",
    repository: {
      user: readTheQuestion,
      name: "rtq-web",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-web-web",
    route: "rtq-web/apps/web",
    ownerType: "app",
    repositoryKey: "rtq-web",
    collectionDirectory: "../../../rtq-web/apps/web",
    repositoryDirectory: "apps/web",
    repository: {
      user: readTheQuestion,
      name: "rtq-web",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
  {
    key: "rtq-web-feature-config",
    route: "rtq-web/packages/feature-config",
    ownerType: "package",
    repositoryKey: "rtq-web",
    collectionDirectory: "../../../rtq-web/packages/feature-config",
    repositoryDirectory: "packages/feature-config",
    repository: {
      user: readTheQuestion,
      name: "rtq-web",
      branch: develop,
    },
    files: conventionalDocumentationFiles,
  },
] as const satisfies readonly DocumentationSource[];

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "");
}

export const repositoryNavigationOrder = [
  "rtq-web",
  "rtq-content",
  "rtq-env",
  "rtq-review",
] as const;

export function toVirtualDocumentationPath(
  source: DocumentationSource,
  filePath: string,
): string {
  return `${source.route}/${normalizeRelativePath(filePath)}`;
}

export function toRepositoryDocumentationPath(
  source: DocumentationSource,
  virtualPath: string,
): string {
  const normalizedPath = normalizeRelativePath(virtualPath);
  const sourcePrefix = `${source.route}/`;
  const relativePath = normalizedPath.startsWith(sourcePrefix)
    ? normalizedPath.slice(sourcePrefix.length)
    : normalizedPath;

  return [normalizeRelativePath(source.repositoryDirectory), relativePath]
    .filter(Boolean)
    .join("/");
}

export function toRepositoryDocumentationUrl(
  source: DocumentationSource,
  virtualPath: string,
): string {
  const repositoryPath = toRepositoryDocumentationPath(source, virtualPath);

  return `https://github.com/${source.repository.user}/${source.repository.name}/blob/${source.repository.branch}/${repositoryPath}`;
}

export function getDocumentationSourceByKey(
  key: string,
): DocumentationSource | undefined {
  return documentationSources.find((source) => source.key === key);
}

export function getDocumentationSourceForVirtualPath(
  virtualPath: string,
): DocumentationSource | undefined {
  const normalizedPath = normalizeRelativePath(virtualPath);

  return [...documentationSources]
    .sort((left, right) => right.route.length - left.route.length)
    .find(
      (source) =>
        normalizedPath === source.route ||
        normalizedPath.startsWith(`${source.route}/`),
    );
}

export function isRepositoryDocumentationPath(
  source: DocumentationSource,
  repositoryPath: string,
): boolean {
  const normalizedPath = normalizeRelativePath(repositoryPath);
  if (normalizedPath.split("/").includes("..")) return false;

  const sourceDirectory = normalizeRelativePath(source.repositoryDirectory);
  const sourcePrefix = sourceDirectory ? `${sourceDirectory}/` : "";
  if (!normalizedPath.startsWith(sourcePrefix)) return false;

  const relativePath = normalizedPath.slice(sourcePrefix.length);

  return (
    relativePath === "README.md" ||
    (relativePath.startsWith("docs/") && relativePath.endsWith(".md"))
  );
}

export function getFolderNavigationLabel(folderPath: string): string {
  const normalizedPath = normalizeRelativePath(folderPath);
  return normalizedPath.split("/").at(-1) ?? normalizedPath;
}

export function getFileNavigationLabel<T>(
  filePath: string,
  fallback: T,
): string | T {
  const fileName = normalizeRelativePath(filePath).split("/").at(-1);
  if (!fileName) return fallback;

  return fileName.endsWith(".md") ? fileName.slice(0, -3) : fileName;
}

export function shouldOpenNavigationFolder(folderPath: string): boolean {
  const segments = normalizeRelativePath(folderPath).split("/").filter(Boolean);

  return !segments.includes("docs") && segments.length <= 3;
}

export function compareTopLevelNavigationLabels(
  left: string,
  right: string,
): number {
  const leftIndex = repositoryNavigationOrder.indexOf(
    left as (typeof repositoryNavigationOrder)[number],
  );
  const rightIndex = repositoryNavigationOrder.indexOf(
    right as (typeof repositoryNavigationOrder)[number],
  );

  return (
    (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
    (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
  );
}

export function getExpectedDocumentationPaths(
  source: DocumentationSource,
): readonly string[] {
  const prefix = normalizeRelativePath(source.repositoryDirectory);

  return ["README.md", "docs"].map((path) =>
    [prefix, path].filter(Boolean).join("/"),
  );
}
