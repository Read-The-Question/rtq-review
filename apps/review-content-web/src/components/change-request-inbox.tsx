'use client';

import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';

import type { ReviewSide } from '@rtq/review-store/types';

import type {
  ReviewWorkGroup,
  ReviewWorkLifecycle,
  ReviewWorkStateGroup,
} from '@/lib/review-work';
import { reviewStateLabel } from '@/lib/review-view-model';

type ReviewWorkScope = 'all' | 'answer' | 'question';

const SCOPE_KEY = 'rtq.review-content.change-requests-scope.v1';
const LIFECYCLE_KEY = 'rtq.review-content.change-requests-lifecycle.v1';

function subscribeToPreference(key: string, onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(key, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(key, onStoreChange);
  };
}

function subscribeToScope(onStoreChange: () => void) {
  return subscribeToPreference(SCOPE_KEY, onStoreChange);
}

function subscribeToLifecycle(onStoreChange: () => void) {
  return subscribeToPreference(LIFECYCLE_KEY, onStoreChange);
}

function storedScope(): ReviewWorkScope {
  const value = window.localStorage.getItem(SCOPE_KEY);
  return value === 'question' || value === 'answer' ? value : 'all';
}

function storedLifecycle(): ReviewWorkLifecycle {
  return window.localStorage.getItem(LIFECYCLE_KEY) === 'archived'
    ? 'archived'
    : 'active';
}

const SIDE_LABELS: Readonly<Record<ReviewSide, string>> = {
  answer: 'Answer',
  'answer-image': 'Answer image',
  question: 'Question',
  'question-image': 'Question image',
};

function sideMatchesScope(side: ReviewSide, scope: ReviewWorkScope) {
  return scope === 'all' || side.startsWith(scope);
}

function reviewDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function itemCount(state: ReviewWorkStateGroup) {
  return state.comments.length + (state.changeRequest ? 1 : 0);
}

function SourceFiles({
  label,
  sources,
}: {
  label: string;
  sources: ReviewWorkGroup['sourceFiles']['toml'];
}) {
  return (
    <div className="review-work-file-row">
      <span>{label}</span>
      <div>
        {sources.length > 0 ? (
          sources.map((source) => (
            <Link href={source.route} key={source.relativePath}>
              <code>{source.relativePath}</code>
            </Link>
          ))
        ) : (
          <em>Not found</em>
        )}
      </div>
    </div>
  );
}

export function ChangeRequestInbox({
  groups,
}: {
  groups: readonly ReviewWorkGroup[];
}) {
  const scope = useSyncExternalStore<ReviewWorkScope>(
    subscribeToScope,
    storedScope,
    () => 'all',
  );
  const lifecycle = useSyncExternalStore<ReviewWorkLifecycle>(
    subscribeToLifecycle,
    storedLifecycle,
    () => 'active',
  );

  const counts = useMemo(() => {
    const result = { active: 0, archived: 0 };
    for (const group of groups) {
      for (const lane of group.lanes) {
        if (!sideMatchesScope(lane.side, scope)) continue;
        for (const state of lane.states) {
          result[state.lifecycle] += itemCount(state);
        }
      }
    }
    return result;
  }, [groups, scope]);

  const visibleGroups = groups.flatMap((group): readonly ReviewWorkGroup[] => {
    const lanes = group.lanes.flatMap((lane) => {
      if (!sideMatchesScope(lane.side, scope)) return [];
      const states = lane.states.filter(
        (state) => state.lifecycle === lifecycle,
      );
      return states.length > 0 ? [{ ...lane, states }] : [];
    });
    return lanes.length > 0 ? [{ ...group, lanes }] : [];
  });

  function selectScope(nextScope: ReviewWorkScope) {
    window.localStorage.setItem(SCOPE_KEY, nextScope);
    window.dispatchEvent(new Event(SCOPE_KEY));
  }

  function selectLifecycle(nextLifecycle: ReviewWorkLifecycle) {
    window.localStorage.setItem(LIFECYCLE_KEY, nextLifecycle);
    window.dispatchEvent(new Event(LIFECYCLE_KEY));
  }

  return (
    <section className="review-inbox" aria-labelledby="change-list-title">
      <div className="review-inbox-toolbar review-inbox-toolbar--stacked">
        <div>
          <p className="eyebrow">Read-only review queue</p>
          <h2 id="change-list-title">Change requests & comments</h2>
        </div>
        <div className="inbox-filter-row">
          <div className="inbox-segmented" aria-label="Review target">
            {(['all', 'question', 'answer'] as const).map((value) => (
              <button
                aria-pressed={scope === value}
                key={value}
                onClick={() => selectScope(value)}
                type="button"
              >
                {value === 'all'
                  ? 'All'
                  : value === 'question'
                    ? 'Question + image'
                    : 'Answer + image'}
              </button>
            ))}
          </div>
          <div className="inbox-segmented" aria-label="Review lifecycle">
            {(['active', 'archived'] as const).map((value) => (
              <button
                aria-pressed={lifecycle === value}
                key={value}
                onClick={() => selectLifecycle(value)}
                type="button"
              >
                <span>{value === 'active' ? 'Active' : 'Archived'}</span>
                <strong>{counts[value]}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="inbox-rule-note">
        Active items match the question’s current RAG state. When the source
        state advances, the stored review work moves to Archived automatically.
      </p>

      {visibleGroups.length === 0 ? (
        <div className="inbox-empty">
          <strong>No {lifecycle} review work matches this view.</strong>
          <p>Try another target filter or lifecycle.</p>
        </div>
      ) : (
        <ol className="review-work-list">
          {visibleGroups.map((group) => (
            <li className="review-work-card" key={group.uuid}>
              <header className="review-work-heading">
                <div>
                  <p className="review-work-paper">
                    {group.source?.paperTitle ?? 'Source paper not found'}
                  </p>
                  <h3>{group.source?.nodeLabel ?? 'Unresolved question'}</h3>
                </div>
                <code>{group.uuid}</code>
              </header>
              <div className="review-work-files" aria-label="Source files">
                <SourceFiles label="toml" sources={group.sourceFiles.toml} />
                <SourceFiles
                  label="topicToml"
                  sources={group.sourceFiles.topicToml}
                />
              </div>
              <div className="review-work-lanes">
                {group.lanes.map((lane) => (
                  <section
                    className={`review-work-lane review-work-lane--${lane.side}`}
                    key={lane.side}
                  >
                    <h4>{SIDE_LABELS[lane.side]}</h4>
                    {lane.states.map((state) => (
                      <div className="review-work-state" key={state.ragState}>
                        <div className="review-work-state-heading">
                          <span className="rag-chip">
                            {reviewStateLabel(state.ragState)}
                          </span>
                          {state.source ? (
                            <Link href={state.source.route}>Open source ↗</Link>
                          ) : null}
                        </div>
                        {state.lifecycle === 'archived' ? (
                          <p className="archived-state-note">
                            Current:{' '}
                            {state.currentRagStates.length > 0
                              ? state.currentRagStates
                                  .map(reviewStateLabel)
                                  .join(', ')
                              : 'source not found'}
                          </p>
                        ) : null}
                        {state.changeRequest ? (
                          <article className="review-entry review-entry--request">
                            <div>
                              <strong>Change requested</strong>
                              <span>PRCR</span>
                            </div>
                            <p>
                              Recorded by {state.changeRequest.reviewer} ·{' '}
                              {reviewDate(state.changeRequest.updatedAt)}
                            </p>
                          </article>
                        ) : null}
                        {state.comments.map((comment) => (
                          <article className="review-entry" key={comment.id}>
                            <p>{comment.comment}</p>
                            <span>
                              {comment.reviewer} ·{' '}
                              {reviewDate(comment.createdAt)}
                            </span>
                          </article>
                        ))}
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
