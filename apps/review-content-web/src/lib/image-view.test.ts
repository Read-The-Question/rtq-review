import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperNode,
} from './display-model.ts';
import {
  imageComparisonVersionForProvenance,
  parseImageComparisonVersions,
  serializeImageComparisonVersions,
  visualOccurrencesForNode,
} from './image-view.ts';

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

test('normalizes URL-backed image comparison versions', () => {
  assert.deepEqual(parseImageComparisonVersions(null), [
    'original',
    'v1',
    'v2',
  ]);
  assert.deepEqual(parseImageComparisonVersions('debug,original,unknown'), [
    'original',
    'debug',
  ]);
  assert.deepEqual(parseImageComparisonVersions('unknown'), [
    'original',
    'v1',
    'v2',
  ]);
  assert.equal(
    serializeImageComparisonVersions(['original', 'v1', 'v2']),
    undefined,
  );
  assert.equal(
    serializeImageComparisonVersions(['debug', 'original']),
    'original,debug',
  );
});

test('maps stored provenance to reviewer-facing versions', () => {
  assert.equal(imageComparisonVersionForProvenance('manual'), 'original');
  assert.equal(imageComparisonVersionForProvenance('retired'), 'original');
  assert.equal(imageComparisonVersionForProvenance('v1'), 'v1');
  assert.equal(imageComparisonVersionForProvenance('v2'), 'v2');
  assert.equal(imageComparisonVersionForProvenance('missing'), 'v1');
  assert.equal(imageComparisonVersionForProvenance('debug-v1'), 'debug');
  assert.equal(imageComparisonVersionForProvenance('debug-v2'), 'debug');
});

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
      {
        image: { ...image, referenceSrc: '/retired-working.png' },
        reason: 'Replaced by authored working.',
        scope: 'working',
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
        fieldLabel: 'Original',
        referenceSrc: '/retired.png',
        scope: 'question',
      },
      {
        fieldLabel: 'Original',
        referenceSrc: '/retired-working.png',
        scope: 'working',
      },
    ],
  );
  assert.deepEqual(
    visualOccurrencesForNode(node, { includeSolutions: false }).map(
      (occurrence) => ({
        referenceSrc: occurrence.image.referenceSrc,
        scope: occurrence.scope,
      }),
    ),
    [
      { referenceSrc: '/question.png', scope: 'question' },
      { referenceSrc: '/retired.png', scope: 'question' },
    ],
  );
});
