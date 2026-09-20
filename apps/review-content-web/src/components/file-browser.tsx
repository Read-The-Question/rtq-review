'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import {
  compileContentSearch,
  CONTENT_SEARCH_SCOPES,
  normalizeContentSearchScope,
  type CollectionContentSearchResult,
  type ContentSearchQuery,
  type ContentSearchScope,
} from '@rtq/review-paper-model/client';

import { collectionRoute, paperRoute } from '@/lib/review-view-model';

export type BrowserCollection = Readonly<{
  count: number;
  description: string;
  id: string;
  label: string;
}>;

export type BrowserPaper = Readonly<{
  collectionId: string;
  detail: string;
  fileName: string;
  focusGroups: readonly string[];
  provenance: string;
  questionCount?: number;
  relativePath: string;
  state: 'invalid' | 'ready';
  title: string;
}>;

const PAGE_SIZE = 80;

const contentScopeLabels: Readonly<Record<ContentSearchScope, string>> = {
  all: 'All content',
  answer: 'Answers',
  question: 'Questions',
  working: 'Workings',
};

function contentSearchUrl(
  collectionId: string,
  search: ContentSearchQuery,
): string {
  const parameters = new URLSearchParams({
    collection: collectionId,
    content: search.pattern,
    'content-scope': search.scope,
  });
  return `/api/papers/content-search?${parameters.toString()}`;
}

export function FileBrowser({
  activeCollectionId,
  collections,
  initialContentPattern = '',
  initialContentScope,
  initialQuery = '',
  papers,
}: {
  activeCollectionId: string;
  collections: readonly BrowserCollection[];
  initialContentPattern?: string;
  initialContentScope?: string;
  initialQuery?: string;
  papers: readonly BrowserPaper[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const initialScope = normalizeContentSearchScope(initialContentScope);
  const normalizedInitialPattern = initialContentPattern.trim();
  const [contentDraft, setContentDraft] = useState(normalizedInitialPattern);
  const [contentScopeDraft, setContentScopeDraft] =
    useState<ContentSearchScope>(initialScope);
  const [contentSearch, setContentSearch] = useState<
    ContentSearchQuery | undefined
  >(
    normalizedInitialPattern
      ? { pattern: normalizedInitialPattern, scope: initialScope }
      : undefined,
  );
  const [contentResult, setContentResult] =
    useState<CollectionContentSearchResult>();
  const [contentError, setContentError] = useState<string>();
  const [contentSearching, setContentSearching] = useState(
    Boolean(normalizedInitialPattern),
  );
  const metadataMatches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return papers.filter(
      (paper) =>
        paper.collectionId === activeCollectionId &&
        (!needle ||
          [
            paper.title,
            paper.fileName,
            paper.detail,
            ...paper.focusGroups,
          ].some((value) => value.toLocaleLowerCase().includes(needle))),
    );
  }, [activeCollectionId, papers, query]);
  const contentMatchByPath = useMemo(
    () =>
      new Map(
        contentResult?.matches.map((match) => [match.relativePath, match]) ??
          [],
      ),
    [contentResult],
  );
  const matches = useMemo(
    () =>
      contentSearch && contentResult
        ? metadataMatches.filter((paper) =>
            contentMatchByPath.has(paper.relativePath),
          )
        : metadataMatches,
    [contentMatchByPath, contentResult, contentSearch, metadataMatches],
  );
  const active = collections.find(
    (collection) => collection.id === activeCollectionId,
  );

  useEffect(() => {
    if (!contentSearch) return;
    const controller = new AbortController();

    void fetch(contentSearchUrl(activeCollectionId, contentSearch), {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            payload &&
            typeof payload === 'object' &&
            'message' in payload &&
            typeof payload.message === 'string'
              ? payload.message
              : 'The collection could not be searched.';
          throw new Error(message);
        }
        setContentResult(payload as CollectionContentSearchResult);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setContentResult(undefined);
        setContentError(
          error instanceof Error
            ? error.message
            : 'The collection could not be searched.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setContentSearching(false);
      });

    return () => controller.abort();
  }, [activeCollectionId, contentSearch]);

  function replaceUrl(parameters: URLSearchParams) {
    const serialized = parameters.toString();
    window.history.replaceState(
      null,
      '',
      serialized
        ? `${window.location.pathname}?${serialized}`
        : window.location.pathname,
    );
  }

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
    const parameters = new URLSearchParams(window.location.search);
    const normalized = value.trim();
    if (normalized) parameters.set('q', normalized);
    else parameters.delete('q');
    replaceUrl(parameters);
  }

  function applyContentSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const compiled = compileContentSearch({
      pattern: contentDraft,
      scope: contentScopeDraft,
    });
    if (compiled.state === 'invalid') {
      setContentError(compiled.message);
      return;
    }

    const next = {
      pattern: compiled.search.pattern,
      scope: compiled.search.scope,
    };
    setContentSearch(next);
    setContentResult(undefined);
    setContentError(undefined);
    setContentSearching(true);
    setVisibleCount(PAGE_SIZE);
    const parameters = new URLSearchParams(window.location.search);
    parameters.set('content', next.pattern);
    if (next.scope === 'all') parameters.delete('content-scope');
    else parameters.set('content-scope', next.scope);
    replaceUrl(parameters);
  }

  function clearContentSearch() {
    setContentDraft('');
    setContentSearch(undefined);
    setContentResult(undefined);
    setContentError(undefined);
    setContentSearching(false);
    setVisibleCount(PAGE_SIZE);
    const parameters = new URLSearchParams(window.location.search);
    parameters.delete('content');
    parameters.delete('content-scope');
    replaceUrl(parameters);
  }

  return (
    <section className="browser" aria-labelledby="browser-title">
      <aside className="collection-rail" aria-label="Paper collections">
        <div className="rail-heading">
          <p>Collections</p>
          <span>{papers.length.toLocaleString()} files</span>
        </div>
        <div className="collection-list">
          {collections.map((collection) => (
            <Link
              aria-current={
                collection.id === activeCollectionId ? 'page' : undefined
              }
              className="collection-button"
              href={collectionRoute(collection.id, query, contentSearch)}
              key={collection.id}
            >
              <span>{collection.label}</span>
              <strong>{collection.count}</strong>
            </Link>
          ))}
        </div>
        <nav className="reference-list" aria-label="Review work">
          <p>Reviews</p>
          <Link className="reference-link" href="/reviews/global">
            <span>Global findings</span>
            <strong>Open</strong>
          </Link>
          <Link className="reference-link" href="/reviews/change-requests">
            <span>Change requests</span>
            <strong>View</strong>
          </Link>
        </nav>
        <nav className="reference-list" aria-label="Reference content">
          <p>Reference</p>
          <Link className="reference-link" href="/macros">
            <span>Macros</span>
            <strong>1 file</strong>
          </Link>
        </nav>
      </aside>

      <div className="file-index">
        <div className="file-index-heading">
          <div>
            <p className="eyebrow">Live TOML index</p>
            <h2 id="browser-title">{active?.label ?? 'Paper files'}</h2>
            <span>{active?.description}</span>
          </div>
          <div className="collection-searches">
            <label className="search-field">
              <span>Find papers</span>
              <input
                onChange={(event) => {
                  updateQuery(event.target.value);
                }}
                placeholder="Title, filename, focus group…"
                type="search"
                value={query}
              />
            </label>
            <form
              className="raw-content-search raw-content-search--collection"
              onSubmit={applyContentSearch}
            >
              <label>
                <span>Search raw content</span>
                <input
                  aria-describedby={
                    contentError ? 'content-search-error' : undefined
                  }
                  onChange={(event) => setContentDraft(event.target.value)}
                  placeholder="Regular expression…"
                  type="search"
                  value={contentDraft}
                />
              </label>
              <label>
                <span>Scope</span>
                <select
                  onChange={(event) =>
                    setContentScopeDraft(
                      normalizeContentSearchScope(event.target.value),
                    )
                  }
                  value={contentScopeDraft}
                >
                  {CONTENT_SEARCH_SCOPES.map((scope) => (
                    <option key={scope} value={scope}>
                      {contentScopeLabels[scope]}
                    </option>
                  ))}
                </select>
              </label>
              <button
                disabled={!contentDraft.trim() || contentSearching}
                type="submit"
              >
                {contentSearching ? 'Searching…' : 'Search'}
              </button>
              {contentSearch ? (
                <button onClick={clearContentSearch} type="button">
                  Clear
                </button>
              ) : null}
            </form>
            {contentError ? (
              <p
                className="raw-content-search-error"
                id="content-search-error"
                role="alert"
              >
                {contentError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="result-summary" aria-live="polite">
          <span>
            {contentSearching
              ? 'Searching current TOML files…'
              : `${matches.length.toLocaleString()} matching files`}
          </span>
          <span>
            {contentResult
              ? `${contentResult.matches.reduce((count, match) => count + match.matchingQuestionCount, 0).toLocaleString()} questions matched across ${contentResult.scannedFileCount.toLocaleString()} files`
              : 'Filename filters update immediately'}
          </span>
        </div>

        {contentSearching ? (
          <div className="empty-index empty-index--searching" role="status">
            <strong>Scanning authored question content.</strong>
            <p>The working tree is read again for every folder search.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-index">
            <strong>No files match this view.</strong>
            <p>Clear the search or choose another source collection.</p>
          </div>
        ) : (
          <ol className="paper-list">
            {matches.slice(0, visibleCount).map((paper, index) => (
              <li key={`${paper.collectionId}:${paper.relativePath}`}>
                {paper.state === 'ready' ? (
                  <Link
                    className="paper-row"
                    href={paperRoute(
                      paper.collectionId,
                      paper.relativePath,
                      query,
                      contentSearch,
                    )}
                  >
                    <span className="paper-number">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    <span className="paper-identity">
                      <strong>{paper.title}</strong>
                      <code>{paper.fileName}</code>
                    </span>
                    <span className="paper-detail">{paper.detail}</span>
                    <span className="paper-count">
                      {contentSearch && contentResult
                        ? `${contentMatchByPath.get(paper.relativePath)?.matchingQuestionCount ?? 0} matching / ${paper.questionCount}`
                        : `${paper.questionCount} questions`}
                    </span>
                    <span className="paper-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                ) : (
                  <div className="paper-row paper-row--invalid">
                    <span className="paper-number">!</span>
                    <span className="paper-identity">
                      <strong>{paper.title}</strong>
                      <code>{paper.fileName}</code>
                    </span>
                    <span className="paper-detail">{paper.detail}</span>
                    <span className="paper-count">Invalid TOML</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}

        {visibleCount < matches.length ? (
          <button
            className="load-more"
            onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}
            type="button"
          >
            Show {Math.min(PAGE_SIZE, matches.length - visibleCount)} more
          </button>
        ) : null}
      </div>
    </section>
  );
}
