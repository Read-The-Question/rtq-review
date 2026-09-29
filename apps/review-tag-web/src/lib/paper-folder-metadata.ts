import type {
  EditableFolderKey,
  ExemplarFolderKey,
  FolderKey,
  RegisteredFolderKey,
} from '@/lib/paper-types';

export const EDITABLE_FOLDER_ORDER: EditableFolderKey[] = [
  'toml',
  'focusPaperToml',
  'paperAnswerRagToml',
  'focusPaperAnswerRagToml',
  'corpusPrimaryTopicToml',
  'focusCorpusPrimaryTopicToml',
  'corpusQuestionRagToml',
  'corpusAnswerRagToml',
  'focusCorpusQuestionRagToml',
  'focusCorpusAnswerRagToml',
  'focusCorpusQuestionImageRagToml',
  'focusCorpusAnswerImageRagToml',
  'focusCorpusQuestionReviewRagToml',
  'focusCorpusAnswerReviewRagToml',
  'focusCorpusQuestionImageReviewRagToml',
  'focusCorpusAnswerImageReviewRagToml',
  'corpusPrimaryTopicAnswerRagToml',
  'focusCorpusPrimaryTopicAnswerRagToml',
];

export const FOLDER_ORDER: RegisteredFolderKey[] = [
  'toml',
  'focusPaperToml',
  'paperAnswerRagToml',
  'focusPaperAnswerRagToml',
  'corpusPrimaryTopicToml',
  'focusCorpusPrimaryTopicToml',
  'corpusAllTopicsToml',
  'corpusQuestionRagToml',
  'corpusAnswerRagToml',
  'focusCorpusQuestionRagToml',
  'focusCorpusAnswerRagToml',
  'focusCorpusQuestionImageRagToml',
  'focusCorpusAnswerImageRagToml',
  'focusCorpusQuestionReviewRagToml',
  'focusCorpusAnswerReviewRagToml',
  'focusCorpusQuestionImageReviewRagToml',
  'focusCorpusAnswerImageReviewRagToml',
  'corpusPrimaryTopicAnswerRagToml',
  'focusCorpusPrimaryTopicAnswerRagToml',
];

const FOLDER_LABELS: Record<RegisteredFolderKey, string> = {
  corpusAllTopicsToml: 'Corpus All Topics',
  corpusAnswerRagToml: 'Corpus Answer RAG',
  corpusPrimaryTopicAnswerRagToml: 'Corpus Primary Topic Answer RAG',
  corpusPrimaryTopicToml: 'Corpus Primary Topic',
  corpusQuestionRagToml: 'Corpus Question RAG',
  focusCorpusAnswerRagToml: 'Focus Corpus Answer RAG',
  focusCorpusAnswerImageRagToml: 'Focus Corpus Answer Image RAG',
  focusCorpusAnswerImageReviewRagToml: 'Focus Corpus Answer Image Review RAG',
  focusCorpusAnswerReviewRagToml: 'Focus Corpus Answer Review RAG',
  focusCorpusPrimaryTopicAnswerRagToml: 'Focus Corpus Primary Topic Answer RAG',
  focusCorpusPrimaryTopicToml: 'Focus Corpus Primary Topic',
  focusCorpusQuestionRagToml: 'Focus Corpus Question RAG',
  focusCorpusQuestionImageRagToml: 'Focus Corpus Question Image RAG',
  focusCorpusQuestionImageReviewRagToml:
    'Focus Corpus Question Image Review RAG',
  focusCorpusQuestionReviewRagToml: 'Focus Corpus Question Review RAG',
  focusPaperAnswerRagToml: 'Focus Paper Answer RAG',
  focusPaperToml: 'Focus Papers',
  paperAnswerRagToml: 'Paper Answer RAG',
  toml: 'Papers',
};

const EXEMPLAR_FOLDER_PATTERN = /^exemplarsLevel(\d+)Toml$/;

function exemplarLevel(folderKey: string) {
  const match = EXEMPLAR_FOLDER_PATTERN.exec(folderKey);
  return match ? Number(match[1]) : null;
}

export function isExemplarFolderKey(value: string): value is ExemplarFolderKey {
  return exemplarLevel(value) !== null;
}

export function isEditableFolderKey(value: string): value is EditableFolderKey {
  return (EDITABLE_FOLDER_ORDER as readonly string[]).includes(value);
}

export function isFolderKey(value: string): value is FolderKey {
  return value in FOLDER_LABELS || isExemplarFolderKey(value);
}

export function isReadOnlyFolder(folderKey: FolderKey) {
  return !isEditableFolderKey(folderKey);
}

export function folderLabel(folderKey: FolderKey) {
  const level = exemplarLevel(folderKey);

  if (level !== null) {
    return `Exemplars Level ${level}`;
  }

  return FOLDER_LABELS[folderKey as RegisteredFolderKey];
}

export function compareFolderKeys(left: FolderKey, right: FolderKey) {
  const leftIndex = FOLDER_ORDER.indexOf(left as RegisteredFolderKey);
  const rightIndex = FOLDER_ORDER.indexOf(right as RegisteredFolderKey);

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
