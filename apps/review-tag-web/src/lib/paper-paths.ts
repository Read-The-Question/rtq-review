import path from 'node:path';

import type {
  EditableFolderKey,
  ExemplarFolderKey,
  FolderKey,
} from '@/lib/paper-types';

export const REPO_ROOT = process.cwd();
const configuredMathsAssetsRoot = process.env.RTQ_MATHS_ASSETS_ROOT?.trim();
export const SOURCE_PAPERS_PACKAGE_ROOT = path.resolve(
  REPO_ROOT,
  '../../../rtq-content/packages/papers',
);
export const SOURCE_PAPERS_ROOT = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'papers',
);
export const DIMENSIONAL_MAPPING_PATH = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'docs/ai/tags/dimensional-tags/dimensional-tag-mapping.json',
);
export const DIMENSIONAL_STYLE_GUIDES_ROOT = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'docs/ai/answers/dimensional-style-guides',
);
export const MACROS_TOML_PATH = path.join(
  SOURCE_PAPERS_PACKAGE_ROOT,
  'scripts/papers/lib/model/macros.toml',
);
export const EXTERNAL_ASSETS_ROOT = path.resolve(
  configuredMathsAssetsRoot ||
    path.join(REPO_ROOT, '../../../rtq-content/packages/assets/assets'),
);

export const SOURCE_FOLDERS: Record<
  EditableFolderKey,
  {
    absolutePath: string;
    description: string;
    label: string;
  }
> = {
  focusToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusToml'),
    description: 'Focus-group derived papers',
    label: 'Focus Papers',
  },
  focusTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusTopicToml'),
    description: 'Focus-group topic-derived papers',
    label: 'Focus Topic Papers',
  },
  focusRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusRagToml'),
    description: 'Focus-group RAG/status variants',
    label: 'Focus RAG Papers',
  },
  focusRagTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusRagTopicToml'),
    description: 'Focus-group topic RAG/status variants',
    label: 'Focus RAG Topic Papers',
  },
  ragToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'ragToml'),
    description: 'Per-paper RAG/status variants',
    label: 'RAG Papers',
  },
  ragTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'ragTopicToml'),
    description: 'Topic-grouped RAG/status variants',
    label: 'RAG Topic Papers',
  },
  toml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'toml'),
    description: 'Canonical paper source-of-truth',
    label: 'Papers',
  },
  topicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'topicToml'),
    description: 'Topic-grouped derived papers',
    label: 'Topic Papers',
  },
};

export const FOLDER_ORDER: EditableFolderKey[] = [
  'toml',
  'focusToml',
  'focusTopicToml',
  'focusRagToml',
  'focusRagTopicToml',
  'topicToml',
  'ragToml',
  'ragTopicToml',
];

const EXEMPLAR_FOLDER_PATTERN = /^exemplarsLevel(\d+)Toml$/;

function exemplarLevel(folderKey: string) {
  const match = EXEMPLAR_FOLDER_PATTERN.exec(folderKey);
  return match ? Number(match[1]) : null;
}

export function isExemplarFolderKey(value: string): value is ExemplarFolderKey {
  return exemplarLevel(value) !== null;
}

export function isEditableFolderKey(value: string): value is EditableFolderKey {
  return value in SOURCE_FOLDERS;
}

export function isFolderKey(value: string): value is FolderKey {
  return isEditableFolderKey(value) || isExemplarFolderKey(value);
}

export function isReadOnlyFolder(folderKey: FolderKey) {
  return isExemplarFolderKey(folderKey);
}

export function folderLabel(folderKey: FolderKey) {
  const level = exemplarLevel(folderKey);

  if (level !== null) {
    return `Exemplars Level ${level}`;
  }

  return SOURCE_FOLDERS[folderKey as EditableFolderKey].label;
}

export function resolveFolderPath(folderKey: FolderKey) {
  if (isExemplarFolderKey(folderKey)) {
    return path.join(SOURCE_PAPERS_ROOT, folderKey);
  }

  return SOURCE_FOLDERS[folderKey as EditableFolderKey].absolutePath;
}

export function resolvePaperFilePath(
  folderKey: FolderKey,
  relativePath: string,
) {
  const folderRoot = resolveFolderPath(folderKey);
  const portablePath = relativePath.replace(/\\/g, '/');
  const absolutePath = path.resolve(folderRoot, ...portablePath.split('/'));
  const relativeToFolder = path.relative(folderRoot, absolutePath);

  if (
    !portablePath ||
    path.isAbsolute(relativePath) ||
    !portablePath.toLowerCase().endsWith('.toml') ||
    relativeToFolder === '' ||
    relativeToFolder.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToFolder)
  ) {
    throw new Error(
      'Paper path must resolve to a TOML file inside its folder.',
    );
  }

  return absolutePath;
}

export function compareFolderKeys(left: FolderKey, right: FolderKey) {
  const leftIndex = FOLDER_ORDER.indexOf(left as EditableFolderKey);
  const rightIndex = FOLDER_ORDER.indexOf(right as EditableFolderKey);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return folderLabel(left).localeCompare(folderLabel(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function relativePaperSlug(fileName: string) {
  return fileName.replace(/\.toml$/i, '');
}

export function buildFileHref(folderKey: FolderKey, slugSegments: string[]) {
  return `/files/${folderKey}/${slugSegments.map(encodeURIComponent).join('/')}`;
}

export function buildSlugSegments(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/').replace(/\.toml$/i, '');
  return normalized.split('/').filter(Boolean);
}

export function buildRelativePathFromSlug(slugSegments: string[]) {
  return `${slugSegments.join('/')}.toml`;
}
