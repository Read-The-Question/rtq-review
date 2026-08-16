import { normalizePaperRelativePath } from '@/lib/paper-paths';
import type { ViewerSessionSummary, ViewerTarget } from '@/lib/paper-types';

export const DEFAULT_SESSION_ID = '1';

type ViewerSessionState = {
  createdAt: number;
  target: ViewerTarget | null;
  updatedAt: number | null;
};

declare global {
  var __rtqQuestionViewerSessions: Map<string, ViewerSessionState> | undefined;
}

export function normalizeSessionId(sessionId: string | null | undefined) {
  const normalized = sessionId?.trim() || DEFAULT_SESSION_ID;

  if (normalized.length > 128) {
    throw new Error('sessionId must be 128 characters or fewer.');
  }

  return normalized;
}

function getSessions() {
  globalThis.__rtqQuestionViewerSessions ??= new Map();
  return globalThis.__rtqQuestionViewerSessions;
}

function createSession(): ViewerSessionState {
  return {
    createdAt: Date.now(),
    target: null,
    updatedAt: null,
  };
}

function getSession(sessionId: string) {
  const sessions = getSessions();
  let state = sessions.get(sessionId);

  if (!state) {
    state = createSession();
    sessions.set(sessionId, state);
  }

  return state;
}

export function getViewerTarget(sessionId: string = DEFAULT_SESSION_ID) {
  return getSession(normalizeSessionId(sessionId)).target;
}

export function setViewerTarget(sessionId: string, target: ViewerTarget) {
  const state = getSession(normalizeSessionId(sessionId));
  state.target = {
    questionUuid: target.questionUuid.trim(),
    relativePathFromPapers: normalizePaperRelativePath(
      target.relativePathFromPapers,
    ),
  };
  state.updatedAt = Date.now();
  return state.target;
}

export function getViewerUpdatedAt(sessionId: string = DEFAULT_SESSION_ID) {
  return getSession(normalizeSessionId(sessionId)).updatedAt;
}

export function listViewerSessions(): ViewerSessionSummary[] {
  return [...getSessions().entries()]
    .map(([sessionId, state]) => ({
      createdAt: state.createdAt,
      hasTarget: Boolean(state.target),
      sessionId,
      target: state.target,
      updatedAt: state.updatedAt,
    }))
    .sort((left, right) =>
      left.sessionId.localeCompare(right.sessionId, undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );
}
