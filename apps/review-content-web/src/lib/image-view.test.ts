import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperNode,
} from './display-model.ts';
import { visualOccurrencesForNode } from './image-view.ts';

const image: DisplayPaperImage = {
  align: 'start',
  alt: 'Diagram',
  description: '',
  displaySize: 'sm',
  indent: 'none',
  referenceSrc: '/image.png',
  tags: [],
  variants: [],
};

function field(
  scope: DisplayContentField['context']['scope'],
  paperImages: readonly DisplayPaperImage[] = [],
): DisplayContentField {
  return {
    context: {
      paperStem: 'paper',
      questionIndex: 0,
      scope,
      sectionIndex: 0,
    },
    expanded: '',
    hasTable: false,
    paperImages,
    preparations: [],
    raw: '',
    rendered: '',
  };
}

test('projects only PaperImage occurrences in reading order', () => {
  const node = {
    children: [],
    content: {
      answers: [
        {
          answer: field('answer', [{ ...image, referenceSrc: '/answer.png' }]),
          key: field('answer'),
          option: field('answer'),
        },
      ],
      question: field('question', [
        { ...image, referenceSrc: '/question.png' },
      ]),
      workings: [
        {
          formulas: [],
          tips: [],
          working: field('working', [
            { ...image, referenceSrc: '/working.png' },
          ]),
        },
      ],
    },
    retiredPaperImages: [
      {
        image: { ...image, referenceSrc: '/retired.png' },
        reason: 'Replaced by authored content.',
        scope: 'question',
      },
    ],
  } as unknown as DisplayPaperNode;

  assert.deepEqual(
    visualOccurrencesForNode(node).map((occurrence) => ({
      fieldLabel: occurrence.fieldLabel,
      referenceSrc: occurrence.image.referenceSrc,
      scope: occurrence.scope,
    })),
    [
      {
        fieldLabel: 'Question',
        referenceSrc: '/question.png',
        scope: 'question',
      },
      {
        fieldLabel: 'Working 1',
        referenceSrc: '/working.png',
        scope: 'working',
      },
      {
        fieldLabel: 'Answer 1',
        referenceSrc: '/answer.png',
        scope: 'answer',
      },
      {
        fieldLabel: 'Retired original',
        referenceSrc: '/retired.png',
        scope: 'question',
      },
    ],
  );
  assert.equal(
    visualOccurrencesForNode(node).at(-1)?.archiveReason,
    'Replaced by authored content.',
  );
});
