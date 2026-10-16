import type {
  ReviewAnswer,
  ReviewContentField,
  ReviewPaper,
  ReviewPaperNode,
  ReviewWorking,
} from '@rtq/review-paper-model';

import type { WorkingSectionPhase } from './working-sections';

export type DisplayPaperImageTag = Readonly<{
  dimensionKey: string;
  dimensionLabel: string;
  supported: boolean;
  value: string;
  valueLabel: string;
}>;

export type DisplayPaperImageVariant = Readonly<{
  provenance:
    'debug-v1' | 'debug-v2' | 'manual' | 'v1' | 'v2' | 'retired' | 'missing';
  alt: string;
  altReview?: 'pending' | 'reviewed-decorative' | 'reviewed-informative';
  description: string;
  naturalWidth?: number;
  naturalHeight?: number;
  minimumReadableWidth?: number;
  svgMarkup?: string;
  svgCss?: string;
  format: 'JPEG' | 'Missing' | 'PNG' | 'SVG' | 'WebP';
  height?: number;
  src: string;
  surface?: 'paper' | 'transparent';
  width?: number;
}>;

export type DisplayPaperImage = Readonly<{
  align: 'center' | 'end' | 'start';
  alt: string;
  altReview?: 'pending' | 'reviewed-decorative' | 'reviewed-informative';
  description: string;
  displaySize: 'full' | 'lg' | 'md' | 'sm';
  indent: 'md' | 'none' | 'sm';
  referenceSrc: string;
  retiredVariants?: readonly DisplayPaperImageVariant[];
  tags: readonly DisplayPaperImageTag[];
  variants: readonly DisplayPaperImageVariant[];
}>;

export type DisplayRetiredPaperImage = Readonly<{
  image: DisplayPaperImage;
  reason: string;
  scope: 'answer' | 'question' | 'working';
}>;

export type DisplayWorkingSegment = Readonly<
  | {
      kind: 'flat';
      rendered: string;
    }
  | {
      kind: 'section';
      phase: WorkingSectionPhase;
      rendered: string;
      title?: string;
      visibility: 'hidden' | 'visible';
    }
>;

export type DisplayContentField = ReviewContentField &
  Readonly<{
    hasTable: boolean;
    paperImages?: readonly DisplayPaperImage[];
    preparationIssue?: string;
    rendered: string;
    workingSegments?: readonly DisplayWorkingSegment[];
  }>;

export type DisplayWorking = Omit<
  ReviewWorking,
  'formulas' | 'tips' | 'working'
> &
  Readonly<{
    formulas: readonly DisplayContentField[];
    tips: readonly DisplayContentField[];
    working: DisplayContentField;
  }>;

export type DisplayAnswer = Omit<ReviewAnswer, 'answer' | 'key' | 'option'> &
  Readonly<{
    answer: DisplayContentField;
    key: DisplayContentField;
    option: DisplayContentField;
  }>;

export type DisplayPaperNode = Omit<ReviewPaperNode, 'children' | 'content'> &
  Readonly<{
    children: readonly DisplayPaperNode[];
    content: Readonly<{
      answers: readonly DisplayAnswer[];
      question: DisplayContentField;
      workings: readonly DisplayWorking[];
    }>;
    retiredPaperImages?: readonly DisplayRetiredPaperImage[];
  }>;

export type DisplayReviewPaper = Omit<ReviewPaper, 'sections'> &
  Readonly<{
    sections: readonly Readonly<{
      id: string;
      label: string;
      questions: readonly DisplayPaperNode[];
    }>[];
  }>;
