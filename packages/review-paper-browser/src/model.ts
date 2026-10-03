import type {
  ContentSearchQuery,
  ContentSearchScope,
  PaperCollection,
  PaperCollectionId,
  PaperSourceSummary,
} from '@rtq/review-paper-model';

export const PAPER_BROWSER_PAGE_SIZE = 80;

export type PaperBrowserCollection = Readonly<{
  count: number;
  description: string;
  id: PaperCollectionId;
  label: string;
}>;

export type PaperBrowserPaper = Readonly<{
  collectionId: PaperCollectionId;
  detail: string;
  fileName: string;
  focusGroups: readonly string[];
  provenance: 'canonical' | 'derived' | 'exemplar' | 'invalid';
  questionCount?: number;
  relativePath: string;
  state: 'invalid' | 'ready';
  title: string;
}>;

export type PaperBrowserNavigationSection = Readonly<{
  id: 'collections' | 'exemplars' | 'focus' | 'subsections';
  label: string;
  subsections: readonly Readonly<{
    collections: readonly PaperBrowserCollection[];
    id: string;
    label?: string;
  }>[];
}>;

export type PaperBrowserModel = Readonly<{
  activeCollectionId?: PaperCollectionId;
  collections: readonly PaperBrowserCollection[];
  navigationSections: readonly PaperBrowserNavigationSection[];
  papers: readonly PaperBrowserPaper[];
  totalFileCount: number;
}>;

export type PaperBrowserSearchState = Readonly<{
  content?: ContentSearchQuery;
  query: string;
}>;

export type PaperBrowserSearchParameters = Readonly<{
  content?: string | string[];
  'content-scope'?: string | string[];
  q?: string | string[];
}>;

export type PaperBrowserRouteContract = Readonly<{
  collectionBasePath: string;
  contentSearchPath: string;
}>;

function browserPaper(summary: PaperSourceSummary): PaperBrowserPaper {
  if (summary.state === 'invalid') {
    return {
      collectionId: summary.collection.id,
      detail: summary.message,
      fileName: summary.fileName,
      focusGroups: [],
      provenance: 'invalid',
      relativePath: summary.relativePath,
      state: 'invalid',
      title: summary.title,
    };
  }

  const source = summary.source;
  const detail = [
    source.topic ? `Topic · ${source.topic}` : undefined,
    source.ragGrouping ? `RAG · ${source.ragGrouping}` : undefined,
    source.focusGroups.length
      ? `Focus · ${source.focusGroups.join(', ')}`
      : undefined,
    !source.topic && !source.ragGrouping && source.focusGroups.length === 0
      ? source.collection.description
      : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

  return {
    collectionId: source.collection.id,
    detail,
    fileName: source.fileName,
    focusGroups: source.focusGroups,
    provenance: source.provenance.kind,
    questionCount: source.questionCount,
    relativePath: source.relativePath,
    state: 'ready',
    title: source.title,
  };
}

export function paperBrowserNavigationSections(
  collections: readonly PaperBrowserCollection[],
): readonly PaperBrowserNavigationSection[] {
  const canonicalCollections = collections.filter(
    (collection) =>
      !collection.id.startsWith('focus') &&
      !collection.id.startsWith('exemplars') &&
      collection.id !== 'paperAnswerRagToml' &&
      !collection.id.endsWith('ReviewRagToml'),
  );
  const corpusReviewRag = collections.filter(
    (collection) =>
      collection.id.startsWith('corpus') &&
      collection.id.endsWith('ReviewRagToml'),
  );
  const focusPapers = collections.filter(
    (collection) => collection.id === 'focusPaperToml',
  );
  const focusCorpus = collections.filter(
    (collection) => collection.id === 'focusCorpusPrimaryTopicToml',
  );
  const focusRag = collections.filter(
    (collection) =>
      collection.id.startsWith('focusCorpus') &&
      collection.id.endsWith('RagToml') &&
      !collection.id.endsWith('ReviewRagToml'),
  );
  const focusReviewRag = collections.filter(
    (collection) =>
      collection.id.startsWith('focusCorpus') &&
      collection.id.endsWith('ReviewRagToml'),
  );
  const subsectionCollections = collections.filter(
    (collection) =>
      collection.id === 'paperAnswerRagToml' ||
      collection.id === 'focusPaperAnswerRagToml',
  );
  const exemplars = collections.filter((collection) =>
    collection.id.startsWith('exemplars'),
  );

  return [
    {
      id: 'collections',
      label: 'Collections',
      subsections: [
        { collections: canonicalCollections, id: 'collections' },
        {
          collections: corpusReviewRag,
          id: 'corpus-review-rag',
          label: 'Review RAG',
        },
      ],
    },
    {
      id: 'focus',
      label: 'Focus',
      subsections: [
        { collections: focusPapers, id: 'focus-papers', label: 'Papers' },
        { collections: focusCorpus, id: 'focus-corpus', label: 'Corpus' },
        { collections: focusRag, id: 'focus-rag', label: 'RAG' },
        {
          collections: focusReviewRag,
          id: 'focus-review-rag',
          label: 'Review RAG',
        },
      ],
    },
    {
      id: 'subsections',
      label: 'Subsections',
      subsections: [{ collections: subsectionCollections, id: 'subsections' }],
    },
    {
      id: 'exemplars',
      label: 'Exemplars',
      subsections: [{ collections: exemplars, id: 'exemplars' }],
    },
  ].filter((section) =>
    section.subsections.some((subsection) => subsection.collections.length > 0),
  ) as readonly PaperBrowserNavigationSection[];
}

export function buildPaperBrowserModel(
  availableCollections: readonly PaperCollection[],
  sources: readonly PaperSourceSummary[],
  requestedCollectionId?: string,
): PaperBrowserModel {
  const collectionRank = new Map(
    availableCollections.map((collection, index) => [collection.id, index]),
  );
  const collectionMap = new Map<PaperCollectionId, PaperBrowserCollection>(
    availableCollections.map((collection) => [
      collection.id,
      {
        count: 0,
        description: collection.description,
        id: collection.id,
        label: collection.label,
      },
    ]),
  );

  for (const summary of sources) {
    const collection =
      summary.state === 'ready'
        ? summary.source.collection
        : summary.collection;
    const current = collectionMap.get(collection.id);
    collectionMap.set(collection.id, {
      count: (current?.count ?? 0) + 1,
      description: collection.description,
      id: collection.id,
      label: collection.label,
    });
  }

  const collections = [...collectionMap.values()].sort(
    (left, right) =>
      (collectionRank.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (collectionRank.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
  const papers = sources.map(browserPaper).sort((left, right) => {
    const collectionDifference =
      (collectionRank.get(left.collectionId) ?? Number.MAX_SAFE_INTEGER) -
      (collectionRank.get(right.collectionId) ?? Number.MAX_SAFE_INTEGER);
    return (
      collectionDifference ||
      left.fileName.localeCompare(right.fileName, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });
  const requested = collections.find(
    (collection) => collection.id === requestedCollectionId,
  )?.id;
  const activeCollectionId = requested ?? collections[0]?.id;

  return {
    activeCollectionId,
    collections,
    navigationSections: paperBrowserNavigationSections(collections),
    papers,
    totalFileCount: papers.length,
  };
}

export function normalizePaperBrowserSearchParameters(
  parameters: PaperBrowserSearchParameters,
): PaperBrowserSearchState {
  const query = typeof parameters.q === 'string' ? parameters.q.trim() : '';
  const pattern =
    typeof parameters.content === 'string' ? parameters.content.trim() : '';
  const requestedScope =
    typeof parameters['content-scope'] === 'string'
      ? parameters['content-scope']
      : 'all';
  const scope: ContentSearchScope = [
    'all',
    'answer',
    'question',
    'working',
  ].includes(requestedScope)
    ? (requestedScope as ContentSearchScope)
    : 'all';

  return {
    content: pattern ? { pattern, scope } : undefined,
    query,
  };
}

export function filterPaperBrowserPapers(
  papers: readonly PaperBrowserPaper[],
  activeCollectionId: PaperCollectionId,
  query: string,
  contentMatchPaths?: ReadonlySet<string>,
): readonly PaperBrowserPaper[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);

  return papers.filter((paper) => {
    if (paper.collectionId !== activeCollectionId) return false;
    if (contentMatchPaths && !contentMatchPaths.has(paper.relativePath)) {
      return false;
    }
    if (terms.length === 0) return true;
    const searchable = [
      paper.title,
      paper.fileName,
      paper.detail,
      ...paper.focusGroups,
    ]
      .join(' ')
      .toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}

export function paginatePaperBrowserPapers(
  papers: readonly PaperBrowserPaper[],
  visibleCount: number,
): readonly PaperBrowserPaper[] {
  return papers.slice(0, Math.max(0, visibleCount));
}

function normalizedBasePath(value: string): string {
  const trimmed = value.trim().replace(/\/+$/u, '');
  if (
    !trimmed.startsWith('/') ||
    trimmed.includes('?') ||
    trimmed.includes('#')
  ) {
    throw new Error('Paper browser route bases must be absolute URL paths.');
  }
  return trimmed || '/';
}

function withSearchState(
  path: string,
  search: PaperBrowserSearchState,
): string {
  const parameters = new URLSearchParams();
  if (search.query) parameters.set('q', search.query);
  if (search.content?.pattern) {
    parameters.set('content', search.content.pattern);
    if (search.content.scope !== 'all') {
      parameters.set('content-scope', search.content.scope);
    }
  }
  const serialized = parameters.toString();
  return serialized ? `${path}?${serialized}` : path;
}

export function paperBrowserCollectionHref(
  routes: PaperBrowserRouteContract,
  collectionId: string,
  search: PaperBrowserSearchState,
): string {
  return withSearchState(
    `${normalizedBasePath(routes.collectionBasePath)}/${encodeURIComponent(collectionId)}`,
    search,
  );
}

export function paperBrowserPaperHref(
  routes: PaperBrowserRouteContract,
  collectionId: string,
  relativePath: string,
  search: PaperBrowserSearchState,
): string {
  const slug = relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return withSearchState(
    `${normalizedBasePath(routes.collectionBasePath)}/${encodeURIComponent(collectionId)}/${slug}`,
    search,
  );
}
