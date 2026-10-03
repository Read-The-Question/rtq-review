'use client';

import {
  CONTENT_SEARCH_SCOPES,
  type ContentSearchScope,
  type PaperCollectionId,
} from '@rtq/review-paper-model/client';
import Link from 'next/link';
import { useState } from 'react';

const RESULT_LIMITS = [20, 50, 100] as const;
type ResultLimit = (typeof RESULT_LIMITS)[number];

const scopeLabels: Record<ContentSearchScope, string> = {
  all: 'Question, working, and answer',
  answer: 'Answer only',
  question: 'Question only',
  working: 'Working only',
};

export function TagCorpusSearchForm({
  collectionId,
  collections,
  limit,
  pattern,
  scope,
  uuidInput,
}: {
  collectionId: PaperCollectionId;
  collections: readonly Readonly<{
    id: PaperCollectionId;
    label: string;
  }>[];
  limit: ResultLimit;
  pattern: string;
  scope: ContentSearchScope;
  uuidInput: string;
}) {
  const [mode, setMode] = useState<'content' | 'uuid'>(
    uuidInput ? 'uuid' : 'content',
  );
  const [selectedCollection, setSelectedCollection] = useState(collectionId);
  const [contentPattern, setContentPattern] = useState(pattern);
  const [contentScope, setContentScope] = useState(scope);
  const [resultLimit, setResultLimit] = useState(limit);
  const [uuids, setUuids] = useState(uuidInput);

  return (
    <section className="tag-corpus-search__form">
      <div className="tag-corpus-search__form-heading">
        <div>
          <p className="paper-browser-eyebrow">
            {mode === 'content' ? 'Raw source search' : 'Canonical identifiers'}
          </p>
          <h2>
            {mode === 'content' ? 'Regular expression' : 'Question UUIDs'}
          </h2>
          <span>
            {mode === 'content'
              ? 'Search question text, workings, or answers.'
              : 'Paste up to 100 UUIDs separated by commas, spaces, or new lines.'}
          </span>
        </div>
        <div
          aria-label="Search method"
          className="tag-corpus-search__mode"
          role="group">
          <button
            aria-pressed={mode === 'content'}
            onClick={() => setMode('content')}
            type="button">
            Content
          </button>
          <button
            aria-pressed={mode === 'uuid'}
            onClick={() => setMode('uuid')}
            type="button">
            UUIDs
          </button>
        </div>
      </div>

      <form action="/search">
        <label>
          <span>Collection</span>
          <select
            name="collection"
            onChange={event =>
              setSelectedCollection(event.target.value as PaperCollectionId)
            }
            value={selectedCollection}>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.label}
              </option>
            ))}
          </select>
        </label>

        {mode === 'content' ? (
          <>
            <label className="tag-corpus-search__pattern">
              <span>Pattern</span>
              <input
                name="content"
                onChange={event => setContentPattern(event.target.value)}
                placeholder={String.raw`For example: PaperImage.*family`}
                required
                type="search"
                value={contentPattern}
              />
            </label>
            <div className="tag-corpus-search__form-row">
              <label>
                <span>Scope</span>
                <select
                  name="content-scope"
                  onChange={event =>
                    setContentScope(event.target.value as ContentSearchScope)
                  }
                  value={contentScope}>
                  {CONTENT_SEARCH_SCOPES.map(value => (
                    <option key={value} value={value}>
                      {scopeLabels[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Results</span>
                <select
                  name="limit"
                  onChange={event =>
                    setResultLimit(Number(event.target.value) as ResultLimit)
                  }
                  value={resultLimit}>
                  {RESULT_LIMITS.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        ) : (
          <label className="tag-corpus-search__uuid">
            <span>UUIDs</span>
            <textarea
              name="uuids"
              onChange={event => setUuids(event.target.value)}
              placeholder="6A4D3A4B-ED56-4425-A042-95E7B753ADB3, …"
              required
              rows={3}
              value={uuids}
            />
          </label>
        )}

        <div className="tag-corpus-search__actions">
          <button type="submit">
            {mode === 'content' ? 'Search corpus' : 'Find UUIDs'}
          </button>
          {pattern || uuidInput ? (
            <Link href={`/search?collection=${selectedCollection}`}>Clear</Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
