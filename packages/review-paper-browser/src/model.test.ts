import assert from 'node:assert/strict';
import test from 'node:test';

import type {
  PaperCollection,
  PaperCollectionId,
  PaperSourceSummary,
} from '@rtq/review-paper-model';

import {
  buildPaperBrowserModel,
  filterPaperBrowserPapers,
  normalizePaperBrowserSearchParameters,
  paginatePaperBrowserPapers,
  paperBrowserCollectionHref,
  paperBrowserPaperHref,
  paperBrowserRagStateLabel,
  paperBrowserRagStatePending,
} from './model.ts';

function collection(id: PaperCollectionId, label: string): PaperCollection {
  return {
    description: `${label} description`,
    directory: id,
    generated: id !== 'toml',
    id,
    label,
    readOnly: true,
    supportsOriginalPdf: id === 'toml' || id === 'focusPaperToml',
  };
}

function source(
  paperCollection: PaperCollection,
  fileName: string,
  options: { focusGroups?: readonly string[]; title?: string } = {},
): PaperSourceSummary {
  return {
    source: {
      collection: paperCollection,
      fileName,
      focusGroups: options.focusGroups ?? [],
      provenance: {
        kind: paperCollection.id === 'toml' ? 'canonical' : 'derived',
        sourcePaperStems: [],
      },
      questionCount: 4,
      ragStateCounts: {
        answer: [{ count: 2, state: 'rag_wf_ng3' }],
        'answer-image': [],
        question: [
          { count: 3, state: 'rag_wf_g0' },
          { count: 1, state: 'rag_wf_ng4' },
        ],
        'question-image': [{ count: 1, state: 'rag_wf_notapplicable' }],
      },
      relativePath: fileName,
      title: options.title ?? fileName.replace(/\.toml$/u, ''),
      version: 'version',
    },
    state: 'ready',
  };
}

const routes = {
  collectionBasePath: '/papers',
  contentSearchPath: '/api/papers/content-search',
} as const;

test('builds the shared collection hierarchy, counts, invalid rows, and ordering', () => {
  const papers = collection('toml', 'Papers');
  const focus = collection('focusPaperToml', 'Focus Papers');
  const subsection = collection('paperAnswerRagToml', 'Paper Answer RAG');
  const exemplar = collection('exemplarsLevel2Toml', 'Exemplars Level 2');
  const model = buildPaperBrowserModel(
    [papers, focus, subsection, exemplar],
    [
      source(papers, 'z.toml'),
      source(papers, 'a.toml'),
      source(focus, 'focus.toml'),
      {
        collection: exemplar,
        fileName: 'broken.toml',
        message: 'Invalid source',
        relativePath: 'broken.toml',
        state: 'invalid',
        title: 'Broken',
        version: 'version',
      },
    ],
    'focusPaperToml',
  );

  assert.equal(model.activeCollectionId, 'focusPaperToml');
  assert.equal(model.totalFileCount, 4);
  assert.deepEqual(
    model.collections.map((entry) => [entry.id, entry.count]),
    [
      ['toml', 2],
      ['focusPaperToml', 1],
      ['paperAnswerRagToml', 0],
      ['exemplarsLevel2Toml', 1],
    ],
  );
  assert.deepEqual(
    model.navigationSections.map((section) => section.label),
    ['Collections', 'Focus', 'Subsections', 'Exemplars'],
  );
  assert.deepEqual(
    model.papers.slice(0, 2).map((paper) => paper.fileName),
    ['a.toml', 'z.toml'],
  );
  assert.deepEqual(model.papers[0]?.ragStateCounts?.question, [
    { count: 3, state: 'rag_wf_g0' },
    { count: 1, state: 'rag_wf_ng4' },
  ]);
  assert.equal(model.papers.at(-1)?.state, 'invalid');
});

test('normalizes URL search state and filters every metadata term', () => {
  assert.deepEqual(
    normalizePaperBrowserSearchParameters({
      content: '  perimeter  ',
      'content-scope': 'working',
      q: '  school alpha ',
      'rag-view': 'question-image',
    }),
    {
      content: { pattern: 'perimeter', scope: 'working' },
      query: 'school alpha',
      ragView: 'question-image',
    },
  );
  assert.deepEqual(
    normalizePaperBrowserSearchParameters({
      content: ['ignored'],
      'content-scope': 'unsupported',
      q: ['ignored'],
    }),
    { content: undefined, query: '', ragView: 'none' },
  );

  const papers = collection('toml', 'Papers');
  const model = buildPaperBrowserModel(
    [papers],
    [
      source(papers, 'alpha.toml', {
        focusGroups: ['11 plus'],
        title: 'Alpha School',
      }),
      source(papers, 'beta.toml', { title: 'Beta School' }),
    ],
  );

  assert.deepEqual(
    filterPaperBrowserPapers(model.papers, 'toml', 'school 11').map(
      (paper) => paper.fileName,
    ),
    ['alpha.toml'],
  );
  assert.deepEqual(
    filterPaperBrowserPapers(
      model.papers,
      'toml',
      '',
      new Set(['beta.toml']),
    ).map((paper) => paper.fileName),
    ['beta.toml'],
  );
});

test('paginates without mutation and produces stable collection and paper links', () => {
  const papers = collection('toml', 'Papers');
  const model = buildPaperBrowserModel(
    [papers],
    [source(papers, 'a.toml'), source(papers, 'b.toml')],
  );

  assert.deepEqual(
    paginatePaperBrowserPapers(model.papers, 1).map((paper) => paper.fileName),
    ['a.toml'],
  );
  assert.equal(model.papers.length, 2);
  assert.equal(
    paperBrowserCollectionHref(routes, 'toml', {
      content: { pattern: 'x + y', scope: 'question' },
      query: 'Dulwich',
      ragView: 'question',
    }),
    '/papers/toml?q=Dulwich&content=x+%2B+y&content-scope=question&rag-view=question',
  );
  assert.equal(
    paperBrowserPaperHref(routes, 'toml', 'nested/paper one.toml', {
      query: '',
      ragView: 'none',
    }),
    '/papers/toml/nested/paper%20one.toml',
  );
  assert.throws(
    () =>
      paperBrowserCollectionHref(
        { ...routes, collectionBasePath: 'papers' },
        'toml',
        { query: '', ragView: 'none' },
      ),
    /absolute URL paths/,
  );
});

test('labels RAG states and identifies pending states', () => {
  assert.equal(paperBrowserRagStateLabel('rag_wf_ng4'), 'NG4');
  assert.equal(paperBrowserRagStateLabel('rag_wf_notapplicable'), 'N/A');
  assert.equal(paperBrowserRagStatePending('rag_wf_ng3'), true);
  assert.equal(paperBrowserRagStatePending('rag_wf_blocked'), true);
  assert.equal(paperBrowserRagStatePending('rag_wf_missing'), true);
  assert.equal(paperBrowserRagStatePending('rag_wf_not_started'), true);
  assert.equal(paperBrowserRagStatePending('rag_wf_g0'), false);
});
