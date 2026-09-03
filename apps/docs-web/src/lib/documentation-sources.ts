export const conventionalDocumentationFiles = [
  "README.md",
  "docs/**/*.md",
] as const;

export type DocumentationOwnerType = "repository" | "app" | "package";

export type DocumentationSource = Readonly<{
  key: string;
  route: string;
  label: string;
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
    label: "RTQ Content",
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
    label: "Assets",
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
    label: "Papers",
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
    label: "RTQ Environment",
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
    label: "RTQ Review",
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
    label: "RTQ Docs",
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
    label: "Review API",
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
    label: "Review - Legacy Gatsby",
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
    label: "Review - Question Viewer",
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
    label: "Review - Tag",
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
    label: "Review",
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
    label: "Repository Paths",
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
    label: "RTQ Web",
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
    label: "Website",
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
    label: "Feature Config",
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

function humanizePathSegment(segment: string): string {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}

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
  const source = documentationSources.find(
    (candidate) => candidate.route === normalizedPath,
  );
  if (source) return source.label;

  const lastSegment = normalizedPath.split("/").at(-1) ?? normalizedPath;
  if (lastSegment === "apps") return "Apps";
  if (lastSegment === "packages") return "Packages";
  if (lastSegment === "docs") return "Docs";

  return humanizePathSegment(lastSegment);
}

export function getFileNavigationLabel<T>(
  filePath: string,
  fallback: T,
): "README.md" | T {
  const fileName = normalizeRelativePath(filePath).split("/").at(-1);

  return fileName === "README.md" ? "README.md" : fallback;
}

export function getExpectedDocumentationPaths(
  source: DocumentationSource,
): readonly string[] {
  const prefix = normalizeRelativePath(source.repositoryDirectory);

  return ["README.md", "docs"].map((path) =>
    [prefix, path].filter(Boolean).join("/"),
  );
}
