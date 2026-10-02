'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { RtqMarkdown } from '@/components/rtq-markdown';
import type {
  CurrentQuestionResponse,
  OriginalQuestionSource,
  QuestionNode,
  QuestionPayload,
  RagState,
  SessionsResponse,
  ViewerSessionSummary,
  ViewerTarget,
} from '@/lib/paper-types';

const DEBUG_STORAGE_KEY = 'rtq-question-viewer:raw-source-visible';
const HIDE_EMPTY_STORAGE_KEY = 'rtq-question-viewer:hide-empty-review-items';
const PREFERENCES_CHANGE_EVENT = 'rtq-question-viewer:preferences-change';
const POLL_INTERVAL_MS = 2000;
const EMPTY_PLACEHOLDER = '%empty%';
const DEFAULT_SESSION_ID = '1';
const PRIMARY_SESSION_IDS = Array.from({ length: 10 }, (_, index) =>
  String(index + 1),
);
type LoadState =
  | { error: string; kind: 'error'; target: ViewerTarget | null }
  | { kind: 'loading' }
  | { kind: 'ready'; payload: QuestionPayload; sessionId: string }
  | { kind: 'waiting' };

function normalizeSessionId(sessionId: string | null | undefined) {
  return sessionId?.trim() || DEFAULT_SESSION_ID;
}

function targetKey(target: ViewerTarget) {
  return `${target.relativePathFromPapers}::${target.questionUuid}`;
}

function sessionTargetKey(sessionId: string, target: ViewerTarget) {
  return `${sessionId}::${targetKey(target)}`;
}

function readUrlSessionId() {
  if (typeof window === 'undefined') {
    return DEFAULT_SESSION_ID;
  }

  const params = new URLSearchParams(window.location.search);
  return normalizeSessionId(
    params.get('session') ??
      params.get('sessionId') ??
      params.get('context') ??
      params.get('contextId'),
  );
}

function readUrlTarget(): ViewerTarget | null {
  const params = new URLSearchParams(window.location.search);
  const relativePathFromPapers =
    params.get('file') ??
    params.get('relativePathFromPapers') ??
    params.get('path');
  const questionUuid = params.get('uuid') ?? params.get('questionUuid');

  if (!relativePathFromPapers || !questionUuid) {
    return null;
  }

  return {
    questionUuid,
    relativePathFromPapers,
  };
}

function targetUrl(sessionId: string, target: ViewerTarget | null) {
  const params = new URLSearchParams();
  params.set('session', normalizeSessionId(sessionId));

  if (target) {
    params.set('file', target.relativePathFromPapers);
    params.set('uuid', target.questionUuid);
  }

  return `/?${params.toString()}`;
}

function formatSourceId(value: string) {
  return value || 'unknown source';
}

function formatOriginalSource(source: OriginalQuestionSource) {
  if (
    source.paperStem &&
    source.sectionNumber !== null &&
    source.questionNumber !== null
  ) {
    return `${source.paperStem} / S${source.sectionNumber} Q${source.questionNumber} (${source.rawValue})`;
  }

  return source.rawValue;
}

function chipToneClass(tone: RagState['tone']) {
  return `rag-chip rag-chip--${tone}`;
}

function tagDimensionClass(tag: string) {
  if (tag.startsWith('family.')) return 'tag-chip--family';
  if (tag.startsWith('math.')) return 'tag-chip--math';
  if (tag.startsWith('frame.')) return 'tag-chip--frame';
  if (tag.startsWith('marker.')) return 'tag-chip--marker';
  if (tag.startsWith('reasoning.')) return 'tag-chip--reasoning';
  return 'tag-chip--legacy';
}

function subscribeToPreferences(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(PREFERENCES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(PREFERENCES_CHANGE_EVENT, onStoreChange);
  };
}

function readStoredBoolean(key: string) {
  return window.localStorage.getItem(key) === 'true';
}

function serverBooleanSnapshot() {
  return false;
}

function useStoredBoolean(key: string) {
  const getSnapshot = useCallback(() => readStoredBoolean(key), [key]);
  const value = useSyncExternalStore(
    subscribeToPreferences,
    getSnapshot,
    serverBooleanSnapshot,
  );
  const setValue = useCallback(
    (updater: boolean | ((current: boolean) => boolean)) => {
      const current = readStoredBoolean(key);
      const next = typeof updater === 'function' ? updater(current) : updater;

      window.localStorage.setItem(key, next ? 'true' : 'false');
      window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}

function isEmptyPlaceholder(value: string) {
  return value.trim().toLowerCase() === EMPTY_PLACEHOLDER;
}

function DebugBlock({ label, value }: { label: string; value: string }) {
  return (
    <details className="debug-block" open>
      <summary>{label}</summary>
      <pre>{value}</pre>
    </details>
  );
}

function RenderedList({
  emptyLabel,
  hideEmpty,
  label,
  values,
}: {
  emptyLabel: string;
  hideEmpty: boolean;
  label: string;
  values: string[];
}) {
  const visibleValues = hideEmpty
    ? values.filter(value => !isEmptyPlaceholder(value))
    : values;

  if (!visibleValues.length && hideEmpty && values.length > 0) {
    return null;
  }

  if (!visibleValues.length) {
    return (
      <section className="content-section content-section--empty">
        <h4>{label}</h4>
        <p>{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="content-section">
      <h4>{label}</h4>
      <div className="content-section__stack">
        {visibleValues.map((value, index) => (
          <div className="content-entry" key={`${label}-${index}`}>
            {visibleValues.length > 1 ? (
              <div className="entry-label">
                {label} {index + 1}
              </div>
            ) : null}
            <RtqMarkdown markdown={value} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Tags({ node }: { node: QuestionNode }) {
  const explicit = node.effectiveTags.filter(tag => tag.source === 'explicit');
  const inherited = node.effectiveTags.filter(
    tag => tag.source === 'inherited',
  );
  const implicit = node.effectiveTags.filter(tag => tag.source === 'implicit');

  if (!node.effectiveTags.length) {
    return <span className="tag-empty">No tags</span>;
  }

  return (
    <div className="tag-groups" aria-label="Tags">
      {explicit.length ? (
        <div className="tag-group">
          <span className="tag-group__label">Own</span>
          {explicit.map(tag => (
            <span
              className={`tag-chip tag-chip--explicit ${tagDimensionClass(tag.value)}`}
              key={`explicit-${tag.value}`}>
              {tag.value}
            </span>
          ))}
        </div>
      ) : null}
      {inherited.length ? (
        <div className="tag-group">
          <span className="tag-group__label">Inherited</span>
          {inherited.map(tag => (
            <span
              className={`tag-chip tag-chip--inherited ${tagDimensionClass(tag.value)}`}
              key={`inherited-${tag.value}`}>
              {tag.value}
            </span>
          ))}
        </div>
      ) : null}
      {implicit.length ? (
        <div className="tag-group">
          <span className="tag-group__label">Implicit</span>
          {implicit.map(tag => (
            <span
              className={`tag-chip tag-chip--implicit ${tagDimensionClass(tag.value)}`}
              key={`implicit-${tag.value}`}>
              {tag.value}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RagStates({ states }: { states: RagState[] }) {
  return (
    <div className="rag-list" aria-label="RAG states">
      {states.map(state => (
        <span
          className={chipToneClass(state.tone)}
          key={`${state.key}-${state.value}`}>
          <strong>{state.value}</strong>
        </span>
      ))}
    </div>
  );
}

function ReviewPane({ node }: { node: QuestionNode }) {
  if (!node.uuid || !node.review) {
    return null;
  }

  return (
    <section className="review-pane">
      <header className="review-pane__header">
        <div>
          <p className="review-pane__eyebrow">Review metadata</p>
          <h3>Current source state</h3>
        </div>
        <code>{node.uuid}</code>
      </header>
      <div className="review-pane__grid">
        {(
          [
            ['Answer', node.review.answer],
            ['Question image', node.review.questionImage],
            ['Answer image', node.review.answerImage],
          ] as const
        )
          .filter(
            ([, metadata]) =>
              metadata.sourceRag?.rawValue !== 'rag_wf_notapplicable',
          )
          .map(([label, metadata]) => (
            <section className="review-scope" key={label}>
              <header className="review-scope__header">
                <div>
                  <p className="review-scope__eyebrow">Read only</p>
                  <h4>{label}</h4>
                </div>
                <div className="review-scope__state">
                  <span>Source {metadata.sourceRag?.value ?? 'missing'}</span>
                  <strong>{metadata.reviewRag?.value ?? 'PRNS'}</strong>
                </div>
              </header>
              {metadata.comments ? (
                <div className="review-comments">
                  <pre>{metadata.comments}</pre>
                </div>
              ) : null}
              {metadata.imageTypes ||
              metadata.imageNotes ||
              metadata.imageIgnored ? (
                <dl>
                  <div>
                    <dt>Types</dt>
                    <dd>
                      {metadata.imageTypes?.length
                        ? metadata.imageTypes.join(', ')
                        : 'Unclassified at NG2 / none confirmed after NG2'}
                    </dd>
                  </div>
                  {metadata.imageNotes ? (
                    <div>
                      <dt>Notes</dt>
                      <dd>{metadata.imageNotes}</dd>
                    </div>
                  ) : null}
                  {metadata.imageIgnored?.length ? (
                    <div>
                      <dt>Ignored</dt>
                      <dd>{metadata.imageIgnored.join(', ')}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </section>
          ))}
      </div>
    </section>
  );
}

function SessionSwitcher({
  onSelect,
  selectedSessionId,
  sessions,
}: {
  onSelect: (sessionId: string) => void;
  selectedSessionId: string;
  sessions: ViewerSessionSummary[];
}) {
  const sessionsById = useMemo(
    () => new Map(sessions.map(session => [session.sessionId, session])),
    [sessions],
  );
  const visibleSessionIds = useMemo(() => {
    const discoveredSessionIds = sessions
      .map(session => session.sessionId)
      .filter(sessionId => !PRIMARY_SESSION_IDS.includes(sessionId));

    return [...PRIMARY_SESSION_IDS, ...discoveredSessionIds];
  }, [sessions]);

  return (
    <div className="session-switcher" aria-label="Viewer sessions">
      <span className="session-switcher__label">Session</span>
      <div className="session-switcher__buttons">
        {visibleSessionIds.map(sessionId => {
          const session = sessionsById.get(sessionId);
          const isSelected = sessionId === selectedSessionId;
          const hasTarget = Boolean(session?.hasTarget);

          return (
            <button
              aria-label={`Show session ${sessionId}`}
              aria-pressed={isSelected}
              className={`session-button${hasTarget ? 'session-button--has-target' : ''}`}
              key={sessionId}
              onClick={() => onSelect(sessionId)}
              title={
                hasTarget
                  ? `Session ${sessionId} has an active target`
                  : `Show session ${sessionId}`
              }
              type="button">
              <span>{sessionId}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RawSource({ node }: { node: QuestionNode }) {
  return (
    <section className="raw-source">
      <h4>Raw source</h4>
      <DebugBlock label="Question" value={node.content.raw.question} />
      {node.content.raw.workings.map((working, index) => (
        <div className="debug-grid" key={`working-${index}`}>
          {working.formulas.map((formula, itemIndex) => (
            <DebugBlock
              key={`formula-${itemIndex}`}
              label={`Working ${index + 1} · Formula ${itemIndex + 1}`}
              value={formula.formula}
            />
          ))}
          {working.tips.map((tip, itemIndex) => (
            <DebugBlock
              key={`tip-${itemIndex}`}
              label={`Working ${index + 1} · Tip ${itemIndex + 1}`}
              value={tip.tip}
            />
          ))}
          <DebugBlock label={`Working ${index + 1}`} value={working.working} />
        </div>
      ))}
      {node.content.raw.answers.map((answer, index) => (
        <div className="debug-grid" key={`answer-${index}`}>
          <DebugBlock label={`Answer ${index + 1}`} value={answer.answer} />
          <DebugBlock label={`Option ${index + 1}`} value={answer.option} />
          <DebugBlock label={`Key ${index + 1}`} value={answer.key} />
        </div>
      ))}
    </section>
  );
}

function NodeCard({
  hideEmpty,
  node,
  rawVisible,
}: {
  hideEmpty: boolean;
  node: QuestionNode;
  rawVisible: boolean;
}) {
  const rendered = node.content.rendered;

  return (
    <article className={`question-node question-node--depth-${node.depth}`}>
      <header className="node-header">
        <div>
          <div className="node-eyebrow">{node.kind}</div>
          <h2>{node.hierarchyLabel}</h2>
        </div>
        <div className="node-identifiers">
          <span>
            UUID <strong className="node-uuid">{node.uuid ?? 'missing'}</strong>
          </span>
          {node.originalSource ? (
            <span>
              Original{' '}
              <strong>{formatOriginalSource(node.originalSource)}</strong>
            </span>
          ) : node.isRootNode ? (
            <span>
              Source <strong>{formatSourceId(node.sourceId)}</strong>
            </span>
          ) : null}
        </div>
      </header>

      <div className="node-meta-grid">
        {node.isRootNode && node.ragStates.length ? (
          <section>
            <h3>RAG state</h3>
            <RagStates states={node.ragStates} />
          </section>
        ) : null}
        <section>
          <h3>Tags</h3>
          <Tags node={node} />
        </section>
      </div>

      <section className="content-section">
        <h4>Question</h4>
        <RtqMarkdown markdown={rendered.question} />
      </section>
      <RenderedList
        emptyLabel="No formulas array present"
        hideEmpty={hideEmpty}
        label="Formulas"
        values={rendered.formulas}
      />
      <RenderedList
        emptyLabel="No tips array present"
        hideEmpty={hideEmpty}
        label="Tips"
        values={rendered.tips}
      />
      <RenderedList
        emptyLabel="No workings array present"
        hideEmpty={hideEmpty}
        label="Working"
        values={rendered.workings}
      />
      <RenderedList
        emptyLabel="No answers array present"
        hideEmpty={hideEmpty}
        label="Answers"
        values={rendered.answers}
      />

      {rawVisible ? <RawSource node={node} /> : null}

      {node.children.length ? (
        <div className="node-children">
          {node.children.map(child => (
            <NodeCard
              hideEmpty={hideEmpty}
              key={child.path}
              node={child}
              rawVisible={rawVisible}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

async function postTarget(sessionId: string, target: ViewerTarget) {
  const response = await fetch('/api/view-target', {
    body: JSON.stringify({
      ...target,
      sessionId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const body = await response.json();

  if (!response.ok || !body.ok) {
    throw new Error(body.error ?? 'Unable to set target.');
  }

  return body.payload as QuestionPayload;
}

async function fetchCurrent(sessionId: string) {
  const params = new URLSearchParams();
  params.set('sessionId', sessionId);
  const response = await fetch(`/api/current-question?${params.toString()}`, {
    cache: 'no-store',
  });
  const body = (await response.json()) as CurrentQuestionResponse;

  if (!response.ok || !body.ok) {
    return body;
  }

  return body;
}

async function fetchSessions() {
  const response = await fetch('/api/sessions', {
    cache: 'no-store',
  });
  const body = (await response.json()) as SessionsResponse;

  if (!response.ok || !body.ok) {
    throw new Error('Unable to load sessions.');
  }

  return body.sessions;
}

export function QuestionViewerApp({
  initialSessionId,
}: {
  initialSessionId?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [selectedSessionId, setSelectedSessionId] = useState(() =>
    normalizeSessionId(initialSessionId),
  );
  const [sessions, setSessions] = useState<ViewerSessionSummary[]>([]);
  const [rawVisible, setRawVisible] = useStoredBoolean(DEBUG_STORAGE_KEY);
  const [hideEmpty, setHideEmpty] = useStoredBoolean(HIDE_EMPTY_STORAGE_KEY);
  const lastPostedUrlTargetRef = useRef<string | null>(null);

  const currentPayload =
    state.kind === 'ready' && state.sessionId === selectedSessionId
      ? state.payload
      : null;
  const currentTarget = currentPayload?.target ?? null;
  const statusCopy = useMemo(() => {
    if (state.kind === 'waiting') return 'Waiting for target';
    if (state.kind === 'loading') return 'Loading';
    if (state.kind === 'error') return 'Target error';
    return 'Live';
  }, [state.kind]);

  const loadSessions = useCallback(async () => {
    setSessions(await fetchSessions());
  }, []);

  const loadCurrent = useCallback(async () => {
    const result = await fetchCurrent(selectedSessionId);

    if (!result.ok) {
      setState(
        result.target
          ? { error: result.error, kind: 'error', target: result.target }
          : { kind: 'waiting' },
      );
      return;
    }

    setState({
      kind: 'ready',
      payload: result.payload,
      sessionId: result.sessionId,
    });
  }, [selectedSessionId]);

  useEffect(() => {
    const urlSessionId = readUrlSessionId();
    const urlTarget = readUrlTarget();

    if (urlTarget && urlSessionId !== selectedSessionId) {
      const timeoutId = window.setTimeout(() => {
        setState({ kind: 'loading' });
        void loadCurrent();
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    if (!urlTarget) {
      const timeoutId = window.setTimeout(() => {
        setState({ kind: 'loading' });
        void loadCurrent();
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    if (
      lastPostedUrlTargetRef.current ===
      sessionTargetKey(selectedSessionId, urlTarget)
    ) {
      const timeoutId = window.setTimeout(() => void loadCurrent(), 0);
      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      const key = sessionTargetKey(selectedSessionId, urlTarget);
      lastPostedUrlTargetRef.current = key;
      setState({ kind: 'loading' });
      postTarget(selectedSessionId, urlTarget)
        .then(payload => {
          setState({ kind: 'ready', payload, sessionId: selectedSessionId });
          void loadSessions().catch(() => undefined);
        })
        .catch(error => {
          setState({
            error:
              error instanceof Error
                ? error.message
                : 'Unable to set target from URL.',
            kind: 'error',
            target: urlTarget,
          });
        });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCurrent, loadSessions, selectedSessionId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSessions().catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadSessions]);

  useEffect(() => {
    document.title = `Session ${selectedSessionId} - RTQ Question Viewer`;
  }, [selectedSessionId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      void loadSessions().catch(() => undefined);
      void loadCurrent().catch(error => {
        setState({
          error:
            error instanceof Error
              ? error.message
              : 'Unable to refresh the current question.',
          kind: 'error',
          target: currentTarget,
        });
      });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [currentTarget, loadCurrent, loadSessions]);

  useEffect(() => {
    const nextUrl = targetUrl(selectedSessionId, currentTarget);
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [currentTarget, router, selectedSessionId]);

  return (
    <main className="viewer-shell">
      <header className="viewer-topbar">
        <div className="viewer-topbar__main">
          <div>
            <p className="viewer-eyebrow">RTQ question viewport</p>
            <h1>Question Review</h1>
          </div>
        </div>
        <div className="viewer-session-row">
          <SessionSwitcher
            onSelect={sessionId => {
              setState({ kind: 'loading' });
              setSelectedSessionId(normalizeSessionId(sessionId));
            }}
            selectedSessionId={selectedSessionId}
            sessions={sessions}
          />
        </div>
        <div className="viewer-actions">
          <span className={`live-pill live-pill--${state.kind}`}>
            {statusCopy}
          </span>
          <button
            aria-pressed={rawVisible}
            className="toggle-button"
            onClick={() => setRawVisible(current => !current)}
            type="button">
            <span className="toggle-button__dot" />
            Raw source
          </button>
          <button
            aria-pressed={hideEmpty}
            className="toggle-button"
            onClick={() => setHideEmpty(current => !current)}
            type="button">
            <span className="toggle-button__dot" />
            Hide empty
          </button>
        </div>
      </header>

      {currentPayload ? (
        <>
          <section className="document-strip">
            <span>
              File{' '}
              <strong>{currentPayload.document.relativePathFromPapers}</strong>
            </span>
            <span>
              Hash{' '}
              <strong>
                {currentPayload.document.versionHash.slice(0, 10)}
              </strong>
            </span>
          </section>
          <NodeCard
            hideEmpty={hideEmpty}
            node={currentPayload.question}
            rawVisible={rawVisible}
          />
          <ReviewPane node={currentPayload.question} />
        </>
      ) : null}

      {state.kind === 'waiting' ? (
        <section className="empty-state">
          <p className="empty-state__label">No active target</p>
          <h2>Waiting for an agent or URL to select a question.</h2>
          <code>POST /api/view-target</code>
        </section>
      ) : null}

      {state.kind === 'loading' ? (
        <section className="empty-state">
          <p className="empty-state__label">Loading</p>
          <h2>Preparing the current question.</h2>
        </section>
      ) : null}

      {state.kind === 'error' ? (
        <section className="empty-state empty-state--error">
          <p className="empty-state__label">Error</p>
          <h2>{state.error}</h2>
          {state.target ? <code>{targetKey(state.target)}</code> : null}
        </section>
      ) : null}
    </main>
  );
}
