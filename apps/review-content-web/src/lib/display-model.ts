import type {
  ReviewAnswer,
  ReviewContentField,
  ReviewPaper,
  ReviewPaperNode,
  ReviewWorking,
} from '@rtq/review-paper-model';

import type { WorkingSectionPhase } from './working-sections';

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
  }>;

export type DisplayReviewPaper = Omit<ReviewPaper, 'sections'> &
  Readonly<{
    sections: readonly Readonly<{
      id: string;
      label: string;
      questions: readonly DisplayPaperNode[];
    }>[];
  }>;
