export type DocumentationSource = Readonly<{
  key: string;
  label: string;
  collectionDirectory: string;
  repositoryDirectory: string;
  repository: Readonly<{
    user: string;
    name: string;
    branch: string;
  }>;
  landingFile?: string;
  files: readonly string[];
}>;

export const reviewTagDocumentationSource = {
  key: "review-tag",
  label: "Review - Tag",
  collectionDirectory: "../review-tag-web",
  repositoryDirectory: "apps/review-tag-web",
  repository: {
    user: "Read-The-Question",
    name: "rtq-review",
    branch: "develop",
  },
  landingFile: "README.md",
  files: ["README.md"],
} as const satisfies DocumentationSource;

export const rtqDocsDocumentationSource = {
  key: "rtq-docs",
  label: "RTQ Docs",
  collectionDirectory: "docs",
  repositoryDirectory: "apps/docs-web/docs",
  repository: {
    user: "Read-The-Question",
    name: "rtq-review",
    branch: "develop",
  },
  files: ["**/*.md"],
} as const satisfies DocumentationSource;

export const documentationSources: readonly DocumentationSource[] = [
  reviewTagDocumentationSource,
  rtqDocsDocumentationSource,
];

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function toVirtualDocumentationPath(
  source: DocumentationSource,
  filePath: string,
): string {
  const relativePath = normalizeRelativePath(filePath);

  return `${source.key}/${relativePath}`;
}

export function toDocumentationSlugs(
  source: DocumentationSource,
  virtualPath: string,
  fallback: () => string[],
): string[] {
  if (
    source.landingFile &&
    normalizeRelativePath(virtualPath) === `${source.key}/${source.landingFile}`
  ) {
    return [source.key];
  }

  return fallback();
}

export function toRepositoryDocumentationPath(
  source: DocumentationSource,
  virtualPath: string,
): string {
  const normalizedPath = normalizeRelativePath(virtualPath);
  const sourcePrefix = `${source.key}/`;
  const relativePath = normalizedPath.startsWith(sourcePrefix)
    ? normalizedPath.slice(sourcePrefix.length)
    : normalizedPath;

  return `${source.repositoryDirectory}/${relativePath}`;
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
  const [sourceKey] = normalizeRelativePath(virtualPath).split("/");
  return getDocumentationSourceByKey(sourceKey);
}

export function isRepositoryDocumentationPath(
  source: DocumentationSource,
  repositoryPath: string,
): boolean {
  const normalizedPath = normalizeRelativePath(repositoryPath);
  const sourceDirectory = normalizeRelativePath(source.repositoryDirectory);

  return (
    !normalizedPath.split("/").includes("..") &&
    normalizedPath.startsWith(`${sourceDirectory}/`)
  );
}
