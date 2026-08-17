import type {
  EditableFolderKey,
  ExemplarFolderKey,
  FolderKey,
} from '@/lib/paper-types';

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

const FOLDER_LABELS: Record<EditableFolderKey, string> = {
  focusToml: 'Focus Papers',
  focusTopicToml: 'Focus Topic Papers',
  focusRagToml: 'Focus RAG Papers',
  focusRagTopicToml: 'Focus RAG Topic Papers',
  ragToml: 'RAG Papers',
  ragTopicToml: 'RAG Topic Papers',
  toml: 'Papers',
  topicToml: 'Topic Papers',
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
  return value in FOLDER_LABELS;
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

  return FOLDER_LABELS[folderKey as EditableFolderKey];
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
