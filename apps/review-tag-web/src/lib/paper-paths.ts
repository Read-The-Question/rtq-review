import path from 'node:path';

import {
  REVIEW_WORKSPACE_ROOT,
  resolveRtqContentPaths,
} from '@rtq/review-repository-paths';

import type { FolderKey, RegisteredFolderKey } from '@/lib/paper-types';

import {
  EDITABLE_FOLDER_ORDER,
  FOLDER_ORDER,
  compareFolderKeys,
  folderLabel,
  isEditableFolderKey,
  isExemplarFolderKey,
  isFolderKey,
  isReadOnlyFolder,
} from './paper-folder-metadata.ts';

export {
  EDITABLE_FOLDER_ORDER,
  FOLDER_ORDER,
  compareFolderKeys,
  folderLabel,
  isEditableFolderKey,
  isExemplarFolderKey,
  isFolderKey,
  isReadOnlyFolder,
};

const contentPaths = resolveRtqContentPaths();

export const REPO_ROOT = REVIEW_WORKSPACE_ROOT;
export const SOURCE_PAPERS_PACKAGE_ROOT = contentPaths.papersPackageRoot;
export const SOURCE_PAPERS_ROOT = contentPaths.papersRoot;
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
  'macros/content/expansions.toml',
);
export const EXTERNAL_ASSETS_ROOT = contentPaths.assetsRoot;

export const SOURCE_FOLDERS: Record<
  RegisteredFolderKey,
  {
    absolutePath: string;
    description: string;
    label: string;
  }
> = {
  corpusAllTopicsToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'corpusAllTopicsToml'),
    description: 'Corpus questions grouped across every active tag',
    label: 'Corpus All Topics',
  },
  corpusAnswerRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'corpusAnswerRagToml'),
    description: 'Corpus questions grouped by answer RAG',
    label: 'Corpus Answer RAG',
  },
  corpusPrimaryTopicAnswerRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'corpusPrimaryTopicAnswerRagToml',
    ),
    description: 'Corpus questions grouped by primary topic and answer RAG',
    label: 'Corpus Primary Topic Answer RAG',
  },
  corpusPrimaryTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'corpusPrimaryTopicToml'),
    description: 'Corpus questions grouped by primary topic',
    label: 'Corpus Primary Topic',
  },
  corpusQuestionRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'corpusQuestionRagToml'),
    description: 'Corpus questions grouped by question RAG',
    label: 'Corpus Question RAG',
  },
  focusCorpusAnswerRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusCorpusAnswerRagToml'),
    description: 'Focused corpus questions grouped by answer RAG',
    label: 'Focus Corpus Answer RAG',
  },
  focusCorpusAnswerImageRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusAnswerImageRagToml',
    ),
    description: 'Focused corpus questions grouped by answer-image RAG',
    label: 'Focus Corpus Answer Image RAG',
  },
  focusCorpusAnswerImageReviewRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusAnswerImageReviewRagToml',
    ),
    description:
      'Focused PRCR and PRCC questions grouped by answer-image RAG and review outcome',
    label: 'Focus Corpus Answer Image Review RAG',
  },
  focusCorpusAnswerReviewRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusAnswerReviewRagToml',
    ),
    description:
      'Focused PRCR and PRCC questions grouped by answer RAG and review outcome',
    label: 'Focus Corpus Answer Review RAG',
  },
  focusCorpusPrimaryTopicAnswerRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusPrimaryTopicAnswerRagToml',
    ),
    description:
      'Focused corpus questions grouped by primary topic and answer RAG',
    label: 'Focus Corpus Primary Topic Answer RAG',
  },
  focusCorpusPrimaryTopicToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusCorpusPrimaryTopicToml'),
    description: 'Focused corpus questions grouped by primary topic',
    label: 'Focus Corpus Primary Topic',
  },
  focusCorpusQuestionRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusCorpusQuestionRagToml'),
    description: 'Focused corpus questions grouped by question RAG',
    label: 'Focus Corpus Question RAG',
  },
  focusCorpusQuestionImageRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusQuestionImageRagToml',
    ),
    description: 'Focused corpus questions grouped by question-image RAG',
    label: 'Focus Corpus Question Image RAG',
  },
  focusCorpusQuestionImageReviewRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusQuestionImageReviewRagToml',
    ),
    description:
      'Focused PRCR and PRCC questions grouped by question-image RAG and review outcome',
    label: 'Focus Corpus Question Image Review RAG',
  },
  focusCorpusQuestionReviewRagToml: {
    absolutePath: path.join(
      SOURCE_PAPERS_ROOT,
      'focusCorpusQuestionReviewRagToml',
    ),
    description:
      'Focused PRCR and PRCC questions grouped by question RAG and review outcome',
    label: 'Focus Corpus Question Review RAG',
  },
  focusPaperAnswerRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusPaperAnswerRagToml'),
    description: 'Focused papers split independently by answer RAG',
    label: 'Focus Paper Answer RAG',
  },
  focusPaperToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'focusPaperToml'),
    description: 'Complete copies of focused papers',
    label: 'Focus Papers',
  },
  paperAnswerRagToml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'paperAnswerRagToml'),
    description: 'Papers split independently by answer RAG',
    label: 'Paper Answer RAG',
  },
  toml: {
    absolutePath: path.join(SOURCE_PAPERS_ROOT, 'toml'),
    description: 'Canonical paper source-of-truth',
    label: 'Papers',
  },
};

export function resolveFolderPath(folderKey: FolderKey) {
  if (isExemplarFolderKey(folderKey)) {
    return path.join(SOURCE_PAPERS_ROOT, folderKey);
  }

  return SOURCE_FOLDERS[folderKey as RegisteredFolderKey].absolutePath;
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
