'use client';

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  compileContentSearch,
  CONTENT_SEARCH_SCOPES,
  normalizeContentSearchScope,
  type CollectionContentSearchResult,
  type ContentSearchQuery,
  type ContentSearchScope,
  type ReviewStateFilterSide,
} from '@rtq/review-paper-model/client';

import {
  EMPTY_PAPER_BROWSER_RAG_VIEW,
  filterPaperBrowserPapers,
  normalizePaperBrowserRagView,
  PAPER_BROWSER_RAG_TRACKS,
  paginatePaperBrowserPapers,
  paperBrowserCollectionHref,
  paperBrowserPaperHref,
  paperBrowserRagStateLabel,
  paperBrowserRagStatePending,
  PAPER_BROWSER_PAGE_SIZE,
  type PaperBrowserModel,
  type PaperBrowserPaper,
  type PaperBrowserRagView,
  type PaperBrowserRouteContract,
  type PaperBrowserSearchState,
} from './model.ts';

const contentScopeLabels: Readonly<Record<ContentSearchScope, string>> = {
  all: 'All content',
  answer: 'Answers',
  question: 'Questions',
  working: 'Workings',
};

const ragTrackOptions: readonly Readonly<{
  label: string;
  shortLabel: string;
  value: ReviewStateFilterSide;
}>[] = [
  { label: 'Question', shortLabel: 'Q', value: 'question' },
  { label: 'Answer', shortLabel: 'A', value: 'answer' },
  { label: 'Question image', shortLabel: 'QI', value: 'question-image' },
  { label: 'Answer image', shortLabel: 'AI', value: 'answer-image' },
];

function PaperRagStateSummary({
  paper,
  tracks,
}: {
  paper: PaperBrowserPaper;
  tracks: PaperBrowserRagView;
}) {
  const selectedTrackOptions = ragTrackOptions.filter((track) =>
    tracks.includes(track.value),
  );

  return (
    <span className="paper-browser-rag-summary">
      {selectedTrackOptions.map((track) => {
        const stateCounts = paper.ragStateCounts?.[track.value] ?? [];
        return (
          <span className="paper-browser-rag-track" key={track.value}>
            <span
              aria-label={track.label}
              className="paper-browser-rag-track-label"
              title={track.label}
            >
              {track.shortLabel}
            </span>
            <span className="paper-browser-rag-values">
              {stateCounts.length > 0 ? (
                stateCounts.map(({ count, state }) => (
                  <span
                    className="paper-browser-rag-value"
                    data-pending={
                      paperBrowserRagStatePending(state) ? 'true' : undefined
                    }
                    key={state}
                    title={`${track.label}: ${state}`}
                  >
                    <span>{paperBrowserRagStateLabel(state)}</span>
                    <strong>{count.toLocaleString()}</strong>
                  </span>
                ))
              ) : (
                <span
                  aria-label={`${track.label}: no states`}
                  className="paper-browser-rag-empty"
                >
                  —
                </span>
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function contentSearchUrl(
  routes: PaperBrowserRouteContract,
  collectionId: string,
  search: ContentSearchQuery,
): string {
  const parameters = new URLSearchParams({
    collection: collectionId,
    content: search.pattern,
    'content-scope': search.scope,
  });
  return `${routes.contentSearchPath}?${parameters.toString()}`;
}

export function PaperBrowser({
  initialContentPattern = '',
  initialContentScope,
  initialQuery = '',
  initialRagView = EMPTY_PAPER_BROWSER_RAG_VIEW,
  model,
  routes,
  secondaryNavigation,
}: {
  initialContentPattern?: string;
  initialContentScope?: string;
  initialQuery?: string;
  initialRagView?: PaperBrowserRagView;
  model: PaperBrowserModel;
  routes: PaperBrowserRouteContract;
  secondaryNavigation?: ReactNode;
}) {
  const activeCollectionId = model.activeCollectionId;
  const [query, setQuery] = useState(initialQuery);
  const [ragView, setRagView] = useState<PaperBrowserRagView>(initialRagView);
  const [visibleCount, setVisibleCount] = useState(PAPER_BROWSER_PAGE_SIZE);
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
  const contentMatchPaths = useMemo(
    () =>
      contentSearch && contentResult
        ? new Set(contentResult.matches.map((match) => match.relativePath))
        : undefined,
    [contentResult, contentSearch],
  );
  const matches = useMemo(
    () =>
      activeCollectionId
        ? filterPaperBrowserPapers(
            model.papers,
            activeCollectionId,
            query,
            contentMatchPaths,
          )
        : [],
    [activeCollectionId, contentMatchPaths, model.papers, query],
  );
  const visiblePapers = useMemo(
    () => paginatePaperBrowserPapers(matches, visibleCount),
    [matches, visibleCount],
  );
  const contentMatchByPath = useMemo(
    () =>
      new Map(
        contentResult?.matches.map((match) => [match.relativePath, match]) ??
          [],
      ),
    [contentResult],
  );
  const active = model.collections.find(
    (collection) => collection.id === activeCollectionId,
  );
  const searchState: PaperBrowserSearchState = {
    content: contentSearch,
    query: query.trim(),
    ragView,
  };

  useEffect(() => {
    if (!contentSearch || !activeCollectionId) return;
    const controller = new AbortController();

    void fetch(contentSearchUrl(routes, activeCollectionId, contentSearch), {
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
  }, [activeCollectionId, contentSearch, routes]);

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
    setVisibleCount(PAPER_BROWSER_PAGE_SIZE);
    const parameters = new URLSearchParams(window.location.search);
    const normalized = value.trim();
    if (normalized) parameters.set('q', normalized);
    else parameters.delete('q');
    replaceUrl(parameters);
  }

  function updateRagView(value: string | readonly string[]) {
    const next = normalizePaperBrowserRagView(value);
    setRagView(next);
    const parameters = new URLSearchParams(window.location.search);
    parameters.delete('rag-view');
    if (next.length === PAPER_BROWSER_RAG_TRACKS.length) {
      parameters.set('rag-view', 'all');
    } else {
      next.forEach((track) => parameters.append('rag-view', track));
    }
    replaceUrl(parameters);
  }

  function updateRagTrack(track: ReviewStateFilterSide, selected: boolean) {
    updateRagView(
      selected
        ? [...ragView, track]
        : ragView.filter((current) => current !== track),
    );
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
    setVisibleCount(PAPER_BROWSER_PAGE_SIZE);
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
    setVisibleCount(PAPER_BROWSER_PAGE_SIZE);
    const parameters = new URLSearchParams(window.location.search);
    parameters.delete('content');
    parameters.delete('content-scope');
    replaceUrl(parameters);
  }

  return (
    <section className="paper-browser" aria-labelledby="paper-browser-title">
      <aside className="paper-browser-rail" aria-label="Paper collections">
        <div className="paper-browser-rail-heading">
          <p>Content</p>
          <span>{model.totalFileCount.toLocaleString()} files</span>
        </div>
        <div className="paper-browser-collection-groups">
          {model.navigationSections.map((section) => (
            <section
              className="paper-browser-collection-group"
              key={section.id}
            >
              <h2>{section.label}</h2>
              {section.subsections.map((subsection) =>
                subsection.collections.length > 0 ? (
                  <div
                    className="paper-browser-collection-subgroup"
                    key={subsection.id}
                  >
                    {subsection.label ? <h3>{subsection.label}</h3> : null}
                    <div className="paper-browser-collection-list">
                      {subsection.collections.map((collection) => (
                        <a
                          aria-current={
                            collection.id === activeCollectionId
                              ? 'page'
                              : undefined
                          }
                          className="paper-browser-collection-link"
                          href={paperBrowserCollectionHref(
                            routes,
                            collection.id,
                            searchState,
                          )}
                          key={collection.id}
                        >
                          <span>{collection.label}</span>
                          <strong>{collection.count}</strong>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </section>
          ))}
        </div>
        {secondaryNavigation}
      </aside>

      <div className="paper-browser-index">
        <div className="paper-browser-index-heading">
          <div>
            <p className="paper-browser-eyebrow">Live TOML index</p>
            <h2 id="paper-browser-title">{active?.label ?? 'Paper files'}</h2>
            <span>{active?.description}</span>
          </div>
          <div className="paper-browser-searches">
            <label className="paper-browser-search-field">
              <span>Find papers</span>
              <input
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Title, filename, focus group…"
                type="search"
                value={query}
              />
            </label>
            <details
              className="paper-browser-content-search"
              open={contentSearch || contentError ? true : undefined}
            >
              <summary>
                <span>Search questions in this collection</span>
                {contentSearch ? <strong>Active</strong> : null}
              </summary>
              <div>
                <form
                  className="paper-browser-content-search-form"
                  onSubmit={applyContentSearch}
                >
                  <label>
                    <span>Regular expression</span>
                    <input
                      aria-describedby={
                        contentError
                          ? 'paper-browser-content-search-error'
                          : undefined
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
                    className="paper-browser-search-error"
                    id="paper-browser-content-search-error"
                    role="alert"
                  >
                    {contentError}
                  </p>
                ) : null}
              </div>
            </details>
          </div>
        </div>

        <div className="paper-browser-result-summary">
          <div aria-live="polite">
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
          <fieldset
            className="paper-browser-rag-view-control"
            title="Counts include questions and nested subquestions"
          >
            <legend>RAG state counts</legend>
            <div className="paper-browser-rag-view-options">
              {ragTrackOptions.map((track) => (
                <label
                  data-selected={
                    ragView.includes(track.value) ? 'true' : undefined
                  }
                  key={track.value}
                  title={track.label}
                >
                  <input
                    aria-label={`Show ${track.label.toLocaleLowerCase()} RAG state counts`}
                    checked={ragView.includes(track.value)}
                    onChange={(event) =>
                      updateRagTrack(track.value, event.target.checked)
                    }
                    type="checkbox"
                    value={track.value}
                  />
                  <span>{track.shortLabel}</span>
                </label>
              ))}
              <button
                aria-pressed={
                  ragView.length === PAPER_BROWSER_RAG_TRACKS.length
                }
                onClick={() =>
                  updateRagView(
                    ragView.length === PAPER_BROWSER_RAG_TRACKS.length
                      ? EMPTY_PAPER_BROWSER_RAG_VIEW
                      : PAPER_BROWSER_RAG_TRACKS,
                  )
                }
                type="button"
              >
                All
              </button>
            </div>
          </fieldset>
        </div>

        {contentSearching ? (
          <div
            className="paper-browser-empty paper-browser-empty--searching"
            role="status"
          >
            <strong>Scanning authored question content.</strong>
            <p>The working tree is read again for every folder search.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="paper-browser-empty">
            <strong>No files match this view.</strong>
            <p>Clear the search or choose another source collection.</p>
          </div>
        ) : (
          <ol className="paper-browser-paper-list">
            {visiblePapers.map((paper, index) => (
              <li key={`${paper.collectionId}:${paper.relativePath}`}>
                {paper.state === 'ready' ? (
                  <a
                    className={`paper-browser-paper-row${
                      ragView.length === 0
                        ? ''
                        : ' paper-browser-paper-row--with-rag'
                    }`}
                    href={paperBrowserPaperHref(
                      routes,
                      paper.collectionId,
                      paper.relativePath,
                      searchState,
                    )}
                  >
                    <span className="paper-browser-paper-number">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    <span className="paper-browser-paper-identity">
                      <strong>{paper.title}</strong>
                      <code>{paper.fileName}</code>
                    </span>
                    <span className="paper-browser-paper-detail">
                      {paper.detail}
                    </span>
                    <span className="paper-browser-paper-count">
                      {contentSearch && contentResult
                        ? `${contentMatchByPath.get(paper.relativePath)?.matchingQuestionCount ?? 0} matching / ${paper.questionCount}`
                        : `${paper.questionCount} questions`}
                    </span>
                    {ragView.length > 0 ? (
                      <PaperRagStateSummary paper={paper} tracks={ragView} />
                    ) : null}
                    <span
                      className="paper-browser-paper-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                ) : (
                  <div className="paper-browser-paper-row paper-browser-paper-row--invalid">
                    <span className="paper-browser-paper-number">!</span>
                    <span className="paper-browser-paper-identity">
                      <strong>{paper.title}</strong>
                      <code>{paper.fileName}</code>
                    </span>
                    <span className="paper-browser-paper-detail">
                      {paper.detail}
                    </span>
                    <span className="paper-browser-paper-count">
                      Invalid TOML
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}

        {visibleCount < matches.length ? (
          <button
            className="paper-browser-load-more"
            onClick={() =>
              setVisibleCount((value) => value + PAPER_BROWSER_PAGE_SIZE)
            }
            type="button"
          >
            Show{' '}
            {Math.min(PAPER_BROWSER_PAGE_SIZE, matches.length - visibleCount)}{' '}
            more
          </button>
        ) : null}
      </div>
    </section>
  );
}
