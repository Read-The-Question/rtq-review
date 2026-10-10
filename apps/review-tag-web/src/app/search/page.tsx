import { PaperBrowserFrame } from '@rtq/review-paper-browser/frame';
import { loadPaperBrowserWorkspace } from '@rtq/review-paper-browser/server';
import {
  type ContentSearchScope,
  type PaperCollectionId,
  PaperContentSearchError,
  normalizeContentSearchScope,
} from '@rtq/review-paper-model';
import Link from 'next/link';

import { TagCorpusSearchForm } from '@/components/tag-corpus-search-form';
import { TagEditorApp } from '@/components/tag-editor-app';
import { getImageTagCatalog } from '@/lib/image-tag-catalog';
import { isEditableFolderKey } from '@/lib/paper-folder-metadata';
import type { PaperPdfOption } from '@/lib/paper-pdf';
import type { PaperDocument } from '@/lib/paper-types';
import {
  searchTagCorpusContent,
  searchTagCorpusUuids,
} from '@/lib/tag-corpus-search';
import { getTagCatalog } from '@/lib/tag-taxonomy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const RESULT_LIMITS = [20, 50, 100] as const;
type ResultLimit = (typeof RESULT_LIMITS)[number];

type SearchView = Readonly<{
  document?: PaperDocument;
  endPosition: number;
  error?: string;
  invalidFileCount: number;
  missingUuids: readonly string[];
  nextCursor?: string;
  previousCursor?: string;
  requestedUuidCount: number;
  pdfs: readonly PaperPdfOption[];
  scannedFileCount: number;
  startPosition: number;
}>;

const emptySearch: SearchView = {
  endPosition: 0,
  invalidFileCount: 0,
  missingUuids: [],
  pdfs: [],
  requestedUuidCount: 0,
  scannedFileCount: 0,
  startPosition: 0,
};

function stringParameter(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

function resultLimit(value: string): ResultLimit {
  const parsed = Number(value);
  return RESULT_LIMITS.includes(parsed as ResultLimit)
    ? (parsed as ResultLimit)
    : 20;
}

function pageHref(
  collectionId: PaperCollectionId,
  pattern: string,
  scope: ContentSearchScope,
  limit: ResultLimit,
  cursor: string,
) {
  const parameters = new URLSearchParams({
    collection: collectionId,
    content: pattern,
    'content-scope': scope,
    cursor,
    limit: String(limit),
  });
  return `/search?${parameters.toString()}`;
}

async function loadSearch(
  collectionId: PaperCollectionId,
  pattern: string,
  scope: ContentSearchScope,
  uuidInput: string,
  limit: ResultLimit,
  cursor?: string,
): Promise<SearchView> {
  try {
    if (uuidInput) {
      const response = await searchTagCorpusUuids(collectionId, uuidInput);
      return {
        ...emptySearch,
        endPosition: response.matches.length,
        document: response.document,
        invalidFileCount: response.invalidFileCount,
        missingUuids: response.missingUuids,
        pdfs: response.pdfs,
        requestedUuidCount: response.requestedUuids.length,
        scannedFileCount: response.scannedFileCount,
        startPosition: response.matches.length ? 1 : 0,
      };
    }
    if (!pattern) {
      return emptySearch;
    }

    const response = await searchTagCorpusContent(
      collectionId,
      { pattern, scope },
      { ...(cursor ? { cursor } : {}), limit },
    );
    return {
      ...emptySearch,
      endPosition: response.endPosition,
      document: response.document,
      invalidFileCount: response.invalidFileCount,
      pdfs: response.pdfs,
      ...(response.nextCursor ? { nextCursor: response.nextCursor } : {}),
      ...(response.previousCursor
        ? { previousCursor: response.previousCursor }
        : {}),
      scannedFileCount: response.scannedFileCount,
      startPosition: response.startPosition,
    };
  } catch (error) {
    if (error instanceof PaperContentSearchError) {
      return { ...emptySearch, error: error.message };
    }
    throw error;
  }
}

function SearchPanel({
  collectionId,
  collectionLabel,
  collections,
  hasSearch,
  limit,
  pattern,
  scope,
  search,
  uuidInput,
}: {
  collectionId: PaperCollectionId;
  collectionLabel: string;
  collections: Awaited<
    ReturnType<typeof loadPaperBrowserWorkspace>
  >['model']['collections'];
  hasSearch: boolean;
  limit: ResultLimit;
  pattern: string;
  scope: ContentSearchScope;
  search: SearchView;
  uuidInput: string;
}) {
  const resultCount = search.document?.questionCount ?? 0;

  return (
    <section className="tag-corpus-search tag-corpus-search--editor">
      <header className="tag-corpus-search__header">
        <Link href="/">Back to papers</Link>
        <p>
          Matching questions form one editable review document. Use the rail to
          move between source papers and questions.
        </p>
      </header>

      <TagCorpusSearchForm
        collectionId={collectionId}
        collections={collections}
        limit={limit}
        pattern={pattern}
        scope={scope}
        uuidInput={uuidInput}
      />

      {search.error ? (
        <p className="tag-corpus-search__error" role="alert">
          {search.error}
        </p>
      ) : null}

      {uuidInput && search.missingUuids.length ? (
        <p className="tag-corpus-search__warning" role="status">
          <strong>{search.missingUuids.length} UUIDs not found:</strong>{' '}
          {search.missingUuids.join(', ')}
        </p>
      ) : null}

      <div className="tag-corpus-search__summary">
        <div>
          <p className="paper-browser-eyebrow">{collectionLabel}</p>
          <strong>
            {!hasSearch
              ? 'Enter a search'
              : resultCount
                ? uuidInput
                  ? `${resultCount} question trees`
                  : `Results ${search.startPosition}–${search.endPosition}`
                : 'No matching questions'}
          </strong>
        </div>
        {hasSearch && !search.error ? (
          <p>
            Scanned {search.scannedFileCount} files
            {search.invalidFileCount
              ? ` · ${search.invalidFileCount} unreadable`
              : ''}
            {uuidInput ? ` · ${search.requestedUuidCount} UUIDs requested` : ''}
          </p>
        ) : null}
      </div>

      {pattern && (search.previousCursor || search.nextCursor) ? (
        <nav
          aria-label="Search result pages"
          className="tag-corpus-results__pagination">
          {search.previousCursor ? (
            <Link
              href={pageHref(
                collectionId,
                pattern,
                scope,
                limit,
                search.previousCursor,
              )}>
              Previous
            </Link>
          ) : (
            <span />
          )}
          {search.nextCursor ? (
            <Link
              href={pageHref(
                collectionId,
                pattern,
                scope,
                limit,
                search.nextCursor,
              )}>
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}

export default async function TagCorpusSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string | string[];
    content?: string | string[];
    'content-scope'?: string | string[];
    cursor?: string | string[];
    limit?: string | string[];
    uuids?: string | string[];
  }>;
}) {
  const parameters = await searchParams;
  const requestedCollection = stringParameter(parameters.collection);
  const collectionId = isEditableFolderKey(requestedCollection)
    ? requestedCollection
    : 'focusPaperToml';
  const pattern = stringParameter(parameters.content).trim();
  const uuidInput = stringParameter(parameters.uuids).trim();
  const scope = normalizeContentSearchScope(
    stringParameter(parameters['content-scope']),
  );
  const limit = resultLimit(stringParameter(parameters.limit));
  const cursor = stringParameter(parameters.cursor).trim() || undefined;
  const [workspace, search, tagCatalog, imageTagCatalog] = await Promise.all([
    loadPaperBrowserWorkspace('toml'),
    loadSearch(collectionId, pattern, scope, uuidInput, limit, cursor),
    getTagCatalog(),
    getImageTagCatalog(),
  ]);
  const detail = workspace.issue ?? workspace.status.detail;
  const hasSearch = Boolean(pattern || uuidInput);
  const searchCollections = workspace.model.collections.filter(collection =>
    isEditableFolderKey(collection.id),
  );
  const collectionLabel =
    searchCollections.find(collection => collection.id === collectionId)
      ?.label ?? collectionId;
  const searchPanel = (
    <SearchPanel
      collectionId={collectionId}
      collectionLabel={collectionLabel}
      collections={searchCollections}
      hasSearch={hasSearch}
      limit={limit}
      pattern={pattern}
      scope={scope}
      search={search}
      uuidInput={uuidInput}
    />
  );

  if (search.document?.questionCount) {
    return (
      <TagEditorApp
        browseHref="/"
        imageTagCatalog={imageTagCatalog}
        initialDocument={search.document}
        key={`${collectionId}:${pattern}:${scope}:${uuidInput}:${cursor ?? ''}`}
        pdfSessionKey={`${collectionId}:${uuidInput ? `uuid:${uuidInput}` : `content:${scope}:${pattern}`}`}
        pdfs={search.pdfs}
        searchPanel={searchPanel}
        tagCatalog={tagCatalog}
      />
    );
  }

  return (
    <PaperBrowserFrame
      appLabel="Review tags"
      connectionDetail={detail}
      connectionLabel={workspace.status.label}
      connectionTone={workspace.status.tone}
      eyebrow="Review tags"
      heading="Search all questions"
      status={<span>Live TOML · combined editable results</span>}
      summary="Find questions by UUID or regular expression, then review all matches as one navigable document.">
      {searchPanel}
    </PaperBrowserFrame>
  );
}
