import assert from 'node:assert/strict';
import test from 'node:test';

import type { CorpusQuestionContentSearchMatch } from '@rtq/review-paper-model';
import {
  compileContentSearch,
  parsedQuestionTreeContentMatchNodeIds,
} from '@rtq/review-paper-model';

import type { PaperDocument, PaperNode } from './paper-types.ts';
import {
  buildTagCorpusDocument,
  mergeTagCorpusSourceDocument,
} from './tag-corpus-document.ts';

function question(explicitTags: string[] = []): PaperNode {
  return {
    children: [],
    content: {
      answerIndexes: [],
      answers: [],
      formulas: [],
      question: 'Question content',
      tips: [],
      workingIndexes: [],
      workings: [],
    },
    depth: 0,
    effectiveDisplayTags: [],
    effectiveTags: explicitTags,
    explicitDisplayTags: [],
    explicitInherit: null,
    explicitTags,
    hierarchyLabel: '1',
    imageOccurrences: [],
    inheritedDisplayTags: [],
    inheritedTags: [],
    isRootNode: true,
    kind: 'question',
    originalSource: null,
    path: 's0.q0',
    questionId: null,
    sectionIndex: 0,
    shortLabel: '1',
    subquestionIndex: null,
    subsubquestionIndex: null,
    uuid: 'BBBBBBBB-BBBB-4BBB-8BBB-BBBBBBBBBBBB',
  };
}

function paper(
  explicitTags: string[] = [],
  versionHash = 'version-1',
  title = 'Alpha School Paper',
): PaperDocument {
  const node = question(explicitTags);
  return {
    fileName: 'alpha-school.toml',
    folderKey: 'focusPaperToml',
    imageOccurrences: [],
    meta: {
      accessTier: null,
      paperId: null,
      schoolId: 'alpha-school',
      year: null,
    },
    nodesFlat: [node],
    questionCount: 1,
    relativePath: 'alpha-school.toml',
    sections: [
      {
        index: 0,
        name: 'Arithmetic',
        path: 'section-0',
        questions: [node],
      },
    ],
    slugSegments: ['alpha-school'],
    title,
    versionHash,
  };
}

const matches: CorpusQuestionContentSearchMatch[] = [
  {
    matchingNodeIds: ['s0.q0'],
    questionIndex: 0,
    relativePath: 'alpha-school.toml',
    sectionIndex: 0,
  },
];

test('projects corpus matches into one editable Tag Review document', () => {
  const document = buildTagCorpusDocument(
    'focusPaperToml',
    matches,
    new Map([['alpha-school.toml', paper()]]),
    1,
  );

  assert.equal(document.corpus?.kind, 'search');
  assert.equal(document.sections[0]?.name, 'Alpha School Paper');
  assert.equal(document.sections[0]?.questions[0]?.path, 'result-1.s0.q0');
  assert.deepEqual(document.sections[0]?.questions[0]?.source, {
    fileName: 'alpha-school.toml',
    folderKey: 'focusPaperToml',
    nodePath: 's0.q0',
    paperTitle: 'Alpha School Paper',
    questionIndex: 0,
    relativePath: 'alpha-school.toml',
    resultKey: 'result-1',
    sectionIndex: 0,
    versionHash: 'version-1',
  });
});

test('merges a saved source paper back into the projected corpus', () => {
  const document = buildTagCorpusDocument(
    'focusPaperToml',
    matches,
    new Map([['alpha-school.toml', paper()]]),
    1,
  );
  const merged = mergeTagCorpusSourceDocument(
    document,
    paper(
      ['family.number'],
      'version-2',
      'alpha-school--11-plus--maths--paper-1',
    ),
  );

  assert.deepEqual(merged.sections[0]?.questions[0]?.explicitTags, [
    'family.number',
  ]);
  assert.equal(
    merged.sections[0]?.questions[0]?.source?.versionHash,
    'version-2',
  );
  assert.equal(merged.sections[0]?.questions[0]?.path, 'result-1.s0.q0');
  assert.equal(merged.sections[0]?.name, 'Alpha School Paper');
  assert.equal(
    merged.sections[0]?.questions[0]?.source?.paperTitle,
    'Alpha School Paper',
  );
});

test('rejects a search result whose source paper changed before projection', () => {
  assert.throws(
    () =>
      buildTagCorpusDocument(
        'focusPaperToml',
        [
          {
            matchingNodeIds: ['s0.q0'],
            questionIndex: 0,
            relativePath: 'missing.toml',
            sectionIndex: 0,
          },
        ],
        new Map(),
        1,
      ),
    /Tag Review search result changed/,
  );
});

test('matches authored PaperImage family attributes with the documented regex', () => {
  const compiled = compileContentSearch({
    pattern: 'PaperImage.*family',
    scope: 'all',
  });
  assert.equal(compiled.state, 'ready');
  if (compiled.state !== 'ready') return;

  assert.deepEqual(
    parsedQuestionTreeContentMatchNodeIds(
      {
        question:
          '<PaperImage assetScope="question" kind="essential" family="geometry" type="triangle" />',
      },
      compiled.search,
      's0.q0',
    ),
    ['s0.q0'],
  );
});

test('type search matches membership rather than the entire joined string', () => {
  const compiled = compileContentSearch({
    pattern:
      'PaperImage\\b[^>\\r\\n]*\\btype="(?:[^" ]+ )*triangle(?: [^" ]+)*"',
    scope: 'all',
  });
  assert.equal(compiled.state, 'ready');
  if (compiled.state !== 'ready')
    throw new Error('fixture search did not compile');
  for (const type of [
    'triangle',
    'triangle dimension',
    'dimension triangle',
    'square triangle dimension',
  ]) {
    assert.deepEqual(
      parsedQuestionTreeContentMatchNodeIds(
        { question: `<PaperImage assetScope="question" type="${type}" />` },
        compiled.search,
        's0.q0',
      ),
      ['s0.q0'],
    );
  }
  for (const type of ['square', 'supertriangle', 'triangular']) {
    assert.deepEqual(
      parsedQuestionTreeContentMatchNodeIds(
        { question: `<PaperImage assetScope="question" type="${type}" />` },
        compiled.search,
        's0.q0',
      ),
      [],
    );
  }
});
