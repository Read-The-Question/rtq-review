'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { paperRoute } from '@/lib/review-view-model';

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

export function FileBrowser({
  collections,
  papers,
}: {
  collections: readonly BrowserCollection[];
  papers: readonly BrowserPaper[];
}) {
  const [activeCollection, setActiveCollection] = useState(
    collections[0]?.id ?? '',
  );
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return papers.filter(
      (paper) =>
        paper.collectionId === activeCollection &&
        (!needle ||
          [
            paper.title,
            paper.fileName,
            paper.detail,
            ...paper.focusGroups,
          ].some((value) => value.toLocaleLowerCase().includes(needle))),
    );
  }, [activeCollection, papers, query]);
  const active = collections.find(
    (collection) => collection.id === activeCollection,
  );

  function chooseCollection(id: string) {
    setActiveCollection(id);
    setVisibleCount(PAGE_SIZE);
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
            <button
              aria-pressed={collection.id === activeCollection}
              className="collection-button"
              key={collection.id}
              onClick={() => chooseCollection(collection.id)}
              type="button"
            >
              <span>{collection.label}</span>
              <strong>{collection.count}</strong>
            </button>
          ))}
        </div>
      </aside>

      <div className="file-index">
        <div className="file-index-heading">
          <div>
            <p className="eyebrow">Live TOML index</p>
            <h2 id="browser-title">{active?.label ?? 'Paper files'}</h2>
            <span>{active?.description}</span>
          </div>
          <label className="search-field">
            <span>Find within collection</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Title, filename, focus group…"
              type="search"
              value={query}
            />
          </label>
        </div>

        <div className="result-summary" aria-live="polite">
          <span>{matches.length.toLocaleString()} matching files</span>
          <span>Updated from the working tree on refresh</span>
        </div>

        {matches.length === 0 ? (
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
                    href={paperRoute(paper.collectionId, paper.relativePath)}
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
                      {paper.questionCount} questions
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
