import type {
  EditableFolderKey,
  ExemplarFolderKey,
  FolderKey,
  RegisteredFolderKey,
} from '@/lib/paper-types';

export const EDITABLE_FOLDER_ORDER: EditableFolderKey[] = [
  'toml',
  'focusToml',
  'focusTopicToml',
  'focusRagToml',
  'focusRagTopicToml',
  'topicToml',
  'ragToml',
  'ragTopicToml',
];

export const FOLDER_ORDER: RegisteredFolderKey[] = [
  'toml',
  'allTagsToml',
  'focusToml',
  'focusTopicToml',
  'focusRagToml',
  'focusRagTopicToml',
  'topicToml',
  'ragToml',
  'ragTopicToml',
];

const FOLDER_LABELS: Record<RegisteredFolderKey, string> = {
  allTagsToml: 'All Tags Papers',
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
