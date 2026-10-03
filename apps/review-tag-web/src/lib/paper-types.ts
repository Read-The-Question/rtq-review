import type {
  ExemplarPaperCollectionId,
  PaperCollectionId,
  RegisteredPaperCollectionId,
} from '@rtq/review-paper-model/client';

export type ReadOnlyGeneratedFolderKey = 'corpusAllTopicsToml';
export type RegisteredFolderKey = RegisteredPaperCollectionId;
export type EditableFolderKey = Exclude<
  RegisteredFolderKey,
  ReadOnlyGeneratedFolderKey
>;
export type ExemplarFolderKey = ExemplarPaperCollectionId;
export type FolderKey = PaperCollectionId;

export type TagDimension = 'family' | 'math' | 'frame' | 'marker' | 'reasoning';
export type TagKind = TagDimension | 'legacy';
export type TagSource = 'explicit' | 'implicit' | 'inherited';
export type NodeKind = 'question' | 'subquestion' | 'subsubquestion';

export type TagCatalog = Record<TagDimension, string[]>;

export type ImageTagGuide = {
  path: string | null;
  status: 'available' | 'missing' | 'placeholder';
};

export type ImageTagCatalogValue = {
  description: string;
  guide: ImageTagGuide;
  label: string;
  lastUpdated: string;
  requires: Record<string, string>;
  status: 'approved' | 'pending-approval';
  value: string;
};

export type ImageTagCatalogDimension = {
  attribute: string;
  cardinality: 'zero-or-one';
  inheritance: 'none';
  key: string;
  label: string;
  omission: 'unclassified';
  values: ImageTagCatalogValue[];
};

export type ImageTagCatalog = {
  assignment: {
    scopes: PaperImageScope[];
    syntax: 'static-double-quoted-prop';
  };
  component: 'PaperImage';
  dimensions: ImageTagCatalogDimension[];
  version: 3;
};

export type PaperImageScope = 'answer' | 'question' | 'working';

export type PaperImageFieldLocator =
  { kind: 'question' } | { index: number; kind: 'answer' | 'working' };

export type ImageTagOccurrence = {
  assetState: 'available' | 'missing';
  attributes: Record<string, string>;
  contextMarkdown: string;
  field: PaperImageFieldLocator;
  fieldLabel: string;
  hierarchyLabel: string;
  id: string;
  imageNumber: number;
  nodeUuid: string | null;
  occurrenceIndex: number;
  previewMarkdown: string;
  scope: PaperImageScope;
};

export type PaperNodeContent = {
  answerIndexes: number[];
  answers: string[];
  formulas: string[];
  question: string;
  tips: string[];
  workingIndexes: number[];
  workings: string[];
};

export type PaperNodeSource = {
  fileName: string;
  folderKey: FolderKey;
  nodePath: string;
  paperTitle: string;
  questionIndex: number;
  relativePath: string;
  resultKey: string;
  sectionIndex: number;
  versionHash: string;
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
  imageOccurrences: ImageTagOccurrence[];
  isRootNode: boolean;
  kind: NodeKind;
  path: string;
  originalSource: OriginalQuestionSource | null;
  questionId: string | null;
  sectionIndex: number;
  shortLabel: string;
  source?: PaperNodeSource;
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
  corpus?: {
    kind: 'search';
  };
  fileName: string;
  folderKey: FolderKey;
  imageOccurrences: ImageTagOccurrence[];
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

export type ImageTagMutationPayload = {
  dimensionKey: string;
  field: PaperImageFieldLocator;
  folderKey: FolderKey;
  nodeUuid: string;
  occurrenceIndex: number;
  relativePath: string;
  value: string | null;
  versionHash: string;
};
