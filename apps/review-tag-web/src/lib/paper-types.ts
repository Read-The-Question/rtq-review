export type EditableFolderKey =
  | 'toml'
  | 'focusToml'
  | 'focusTopicToml'
  | 'focusRagToml'
  | 'focusRagTopicToml'
  | 'topicToml'
  | 'ragToml'
  | 'ragTopicToml';
export type ReadOnlyGeneratedFolderKey = 'allTagsToml';
export type RegisteredFolderKey =
  EditableFolderKey | ReadOnlyGeneratedFolderKey;
export type ExemplarFolderKey = `exemplarsLevel${number}Toml`;
export type FolderKey = RegisteredFolderKey | ExemplarFolderKey;
export type StatusTone =
  | 'status'
  | 'statusAmber'
  | 'statusBlocked'
  | 'statusGray'
  | 'statusGreen1'
  | 'statusGreen2'
  | 'statusGreen3'
  | 'statusGreen4'
  | 'statusRed';

export type TagDimension = 'family' | 'math' | 'frame' | 'marker' | 'reasoning';
export type TagKind = TagDimension | 'legacy';
export type TagSource = 'explicit' | 'implicit' | 'inherited';
export type NodeKind = 'question' | 'subquestion' | 'subsubquestion';

export type TagCatalog = Record<TagDimension, string[]>;

export type FileIndexItem = {
  fileName: string;
  folderKey: FolderKey;
  href: string;
  navFocusGroups: string[];
  navMeta: string;
  navStatusKey: string | null;
  navStatus: string | null;
  navStatusTone: StatusTone | null;
  navTopicKey: string | null;
  navTopicLabel: string | null;
  navTitle: string;
  questionCount: number;
  relativePath: string;
  searchText: string;
  slugSegments: string[];
  stem: string;
  title: string;
};

export type PaperNodeContent = {
  answers: string[];
  formulas: string[];
  question: string;
  tips: string[];
  workings: string[];
};

export type OriginalQuestionSource = {
  paperStem: string | null;
  questionNumber: number | null;
  rawValue: string;
  sectionNumber: number | null;
};

export type PaperNode = {
  children: PaperNode[];
  content: PaperNodeContent;
  depth: number;
  effectiveDisplayTags: DisplayTag[];
  effectiveTags: string[];
  explicitDisplayTags: DisplayTag[];
  explicitInherit: boolean | null;
  explicitTags: string[];
  hierarchyLabel: string;
  inheritedDisplayTags: DisplayTag[];
  inheritedTags: string[];
  isRootNode: boolean;
  kind: NodeKind;
  path: string;
  originalSource: OriginalQuestionSource | null;
  questionId: string | null;
  sectionIndex: number;
  shortLabel: string;
  subquestionIndex: number | null;
  subsubquestionIndex: number | null;
  uuid: string | null;
};

export type PaperSection = {
  index: number;
  name: string;
  path: string;
  questions: PaperNode[];
};

export type PaperDocument = {
  fileName: string;
  folderKey: FolderKey;
  meta: {
    accessTier: string | null;
    paperId: string | null;
    schoolId: string | null;
    year: string | null;
  };
  nodesFlat: PaperNode[];
  questionCount: number;
  relativePath: string;
  sections: PaperSection[];
  slugSegments: string[];
  title: string;
  versionHash: string;
};

export type DisplayTag = {
  active: boolean;
  dimensionLabel: string;
  implicitLabel: string | null;
  kind: TagKind;
  source: TagSource;
  value: string;
};

export type PersistedNodeUpdate = {
  explicitInherit: boolean | null;
  explicitTags: string[];
};

export type NodeMutationPayload = {
  explicitInherit: boolean | null;
  explicitTags: string[];
  folderKey: FolderKey;
  nodePath: string;
  relativePath: string;
  versionHash: string;
};
