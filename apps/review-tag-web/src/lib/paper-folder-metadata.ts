import {
  isExemplarPaperCollectionId,
  isPaperCollectionId,
} from '@rtq/review-paper-model/client';

import type {
  EditableFolderKey,
  ExemplarFolderKey,
  FolderKey,
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
  'corpusQuestionReviewRagToml',
  'corpusAnswerReviewRagToml',
  'corpusQuestionImageReviewRagToml',
  'corpusAnswerImageReviewRagToml',
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

export function isExemplarFolderKey(value: string): value is ExemplarFolderKey {
  return isExemplarPaperCollectionId(value);
}

export function isEditableFolderKey(value: string): value is EditableFolderKey {
  return (EDITABLE_FOLDER_ORDER as readonly string[]).includes(value);
}

export function isFolderKey(value: string): value is FolderKey {
  return isPaperCollectionId(value);
}

export function isReadOnlyFolder(folderKey: FolderKey) {
  return !isEditableFolderKey(folderKey);
}
