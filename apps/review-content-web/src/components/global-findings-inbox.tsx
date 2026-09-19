'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';

import type {
  GlobalReviewFinding,
  GlobalReviewFindingStatus,
} from '@rtq/review-store/types';

const STORAGE_KEY = 'rtq.review-content.global-findings-filter.v1';

function subscribeToStatus(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(STORAGE_KEY, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(STORAGE_KEY, onStoreChange);
  };
}

function storedStatus(): GlobalReviewFindingStatus {
  return window.localStorage.getItem(STORAGE_KEY) === 'processed'
    ? 'processed'
    : 'todo';
}

function findingDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function sourceRoute(finding: GlobalReviewFinding) {
  const slug = finding.sourceRelativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/papers/${encodeURIComponent(finding.sourceCollectionId)}/${slug}#question-${encodeURIComponent(finding.sourceNodeId)}`;
}

export function GlobalFindingsInbox({
  initialFindings,
  reviewer,
}: {
  initialFindings: readonly GlobalReviewFinding[];
  reviewer: string;
}) {
  const [findings, setFindings] = useState(initialFindings);
  const status = useSyncExternalStore(
    subscribeToStatus,
    storedStatus,
    () => 'todo',
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      processed: findings.filter((finding) => finding.status === 'processed')
        .length,
      todo: findings.filter((finding) => finding.status === 'todo').length,
    }),
    [findings],
  );
  const visible = findings.filter((finding) => finding.status === status);

  function selectStatus(nextStatus: GlobalReviewFindingStatus) {
    window.localStorage.setItem(STORAGE_KEY, nextStatus);
    window.dispatchEvent(new Event(STORAGE_KEY));
  }

  async function markProcessed(id: string) {
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch('/api/review/findings', {
        body: JSON.stringify({ id, processedBy: reviewer }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message =
          payload &&
          typeof payload === 'object' &&
          'message' in payload &&
          typeof payload.message === 'string'
            ? payload.message
            : 'The finding could not be marked processed.';
        throw new Error(message);
      }
      const updated =
        payload && typeof payload === 'object' && 'finding' in payload
          ? (payload.finding as GlobalReviewFinding)
          : null;
      if (!updated) throw new Error('The updated finding was not returned.');
      setFindings((current) =>
        current.map((finding) => (finding.id === id ? updated : finding)),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The finding could not be marked processed.',
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="review-inbox" aria-labelledby="finding-list-title">
      <div className="review-inbox-toolbar">
        <div>
          <p className="eyebrow">Product-wide work</p>
          <h2 id="finding-list-title">Global findings</h2>
        </div>
        <div className="inbox-segmented" aria-label="Finding status">
          {(['todo', 'processed'] as const).map((value) => (
            <button
              aria-pressed={status === value}
              key={value}
              onClick={() => selectStatus(value)}
              type="button"
            >
              <span>{value === 'todo' ? 'To do' : 'Processed'}</span>
              <strong>{counts[value]}</strong>
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="inbox-error">{error}</p> : null}

      {visible.length === 0 ? (
        <div className="inbox-empty">
          <strong>
            {status === 'todo'
              ? 'No global findings need processing.'
              : 'No findings have been processed yet.'}
          </strong>
          <p>
            {status === 'todo'
              ? 'New findings created during paper review will appear here.'
              : 'Processed findings remain available as a simple history.'}
          </p>
        </div>
      ) : (
        <ol className="finding-list">
          {visible.map((finding, index) => (
            <li className="finding-card" key={finding.id}>
              <div className="finding-sequence">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="finding-body">
                <p className="finding-copy">{finding.finding}</p>
                <div className="finding-context">
                  <span>{finding.sourcePaperTitle}</span>
                  <span>{finding.sourceNodeLabel}</span>
                  <span>{finding.sourceSide.replace('-', ' ')}</span>
                </div>
                <div className="finding-audit">
                  <span>
                    Raised by {finding.reviewer} ·{' '}
                    {findingDate(finding.createdAt)}
                  </span>
                  {finding.processedAt ? (
                    <span>
                      Processed by {finding.processedBy} ·{' '}
                      {findingDate(finding.processedAt)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="finding-actions">
                <Link href={sourceRoute(finding)}>Open source ↗</Link>
                {finding.status === 'todo' ? (
                  <button
                    disabled={pendingId === finding.id}
                    onClick={() => void markProcessed(finding.id)}
                    type="button"
                  >
                    {pendingId === finding.id
                      ? 'Processing…'
                      : 'Mark processed'}
                  </button>
                ) : (
                  <span className="processed-stamp">Processed</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
