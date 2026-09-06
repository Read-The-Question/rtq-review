'use client';

import { useState } from 'react';

import type { ReviewMacroEntry } from '@rtq/review-paper-model';

import { RtqMarkdown } from './rtq-markdown';

const KIND_LABELS = {
  formula: 'Formula',
  shared: 'Shared / placeholder',
  tip: 'Tip',
  working: 'Working',
} as const;

export function MacroReviewList({
  entries,
}: {
  entries: readonly ReviewMacroEntry[];
}) {
  const [showOriginalSource, setShowOriginalSource] = useState(false);

  return (
    <>
      <section
        aria-label="Macro display settings"
        className="review-toolbar macro-toolbar"
      >
        <div className="review-toolbar-group">
          <span className="toolbar-label">Display</span>
          <label className="preference-toggle">
            <input
              checked={showOriginalSource}
              onChange={(event) =>
                setShowOriginalSource(event.currentTarget.checked)
              }
              role="switch"
              type="checkbox"
            />
            <span aria-hidden="true" className="preference-toggle-control">
              <span />
            </span>
            <span className="preference-toggle-label">
              Show original source
            </span>
          </label>
          <span className="feedback-mode-copy" role="status">
            {showOriginalSource
              ? 'Original source is visible for every macro'
              : 'Original source is hidden'}
          </span>
        </div>
      </section>

      <ol className="macro-list">
        {entries.map((entry, index) => (
          <li
            className="macro-entry"
            id={`macro-${index + 1}`}
            key={entry.name}
          >
            <header>
              <span className="entry-number">
                {String(index + 1).padStart(3, '0')}
              </span>
              <h3>
                <code>{entry.name}</code>
              </h3>
              <span className={`macro-kind macro-kind--${entry.kind}`}>
                {KIND_LABELS[entry.kind]}
              </span>
            </header>
            <div className="macro-preview">
              <p className="content-field-label">Expanded preview</p>
              {entry.expanded.trim() ? (
                <RtqMarkdown markdown={entry.expanded} />
              ) : (
                <p className="macro-empty">This macro expands to no content.</p>
              )}
            </div>
            {showOriginalSource ? (
              <div className="macro-entry-source">
                <p className="content-field-label">Original source</p>
                <pre>{entry.source}</pre>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </>
  );
}
