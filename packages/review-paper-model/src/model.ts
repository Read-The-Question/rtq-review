export const DIMENSIONAL_TAG_AXES = [
  'family',
  'math',
  'frame',
  'marker',
  'reasoning',
] as const;

export type DimensionalTagAxis = (typeof DIMENSIONAL_TAG_AXES)[number];

export type DimensionalTagOrigin = 'explicit' | 'inherited' | 'implicit';

export type EffectiveDimensionalTag = Readonly<{
  axis: DimensionalTagAxis;
  inheritedFromNodeId?: string;
  origin: DimensionalTagOrigin;
  value: string;
}>;

export type PaperCollection = Readonly<{
  directory: string;
  generated: boolean;
  id: string;
  label: string;
  readOnly: true;
}>;

export type PaperSource = Readonly<{
  collectionId: string;
  relativePath: string;
  version: string;
}>;

export type ReviewContentField = Readonly<{
  raw: string;
}>;

export type ReviewTargetState = Readonly<{
  comments: readonly string[];
  contentRag?: string;
  reviewOutcome?: string;
  uuid?: string;
}>;

export type ReviewPaperNode = Readonly<{
  answer?: ReviewContentField;
  children: readonly ReviewPaperNode[];
  effectiveTags: readonly EffectiveDimensionalTag[];
  id: string;
  kind: 'question' | 'subquestion' | 'sub-subquestion';
  label: string;
  question?: ReviewContentField;
  review: Readonly<{
    answer: ReviewTargetState;
    question: ReviewTargetState;
  }>;
}>;

export type ReviewPaper = Readonly<{
  metadata: Readonly<Record<string, string>>;
  sections: readonly Readonly<{
    id: string;
    label: string;
    questions: readonly ReviewPaperNode[];
  }>[];
  source: PaperSource;
  title: string;
}>;

export type DimensionalFilterSelection = Readonly<
  Record<DimensionalTagAxis, readonly string[]>
>;

export type ContentWorkspaceStatus =
  | Readonly<{
      assetsPackage: '@rtq/maths-assets';
      papersPackage: '@rtq/papers';
      source: 'rtq-content';
      state: 'ready';
    }>
  | Readonly<{
      message: string;
      source: 'rtq-content';
      state: 'unavailable';
    }>;
