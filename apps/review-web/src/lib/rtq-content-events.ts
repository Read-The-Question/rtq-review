import path from 'node:path';

import chokidar from 'chokidar';

import { rtqPaths } from '@/lib/rtq-config';

type WatchRoot = 'assets' | 'content';
type WatchKind = 'add' | 'change' | 'unlink';

type ChangeRecord = {
  event: WatchKind;
  relativePath: string;
  root: WatchRoot;
};

export type ContentChangeBatch = {
  changes: ChangeRecord[];
  timestamp: number;
};

type Listener = (batch: ContentChangeBatch) => void;

type ContentEventState = {
  flushTimer: NodeJS.Timeout | null;
  listeners: Set<Listener>;
  pendingChanges: Map<string, ChangeRecord>;
  watcherStarted: boolean;
};

declare global {
  var __rtqContentEvents: ContentEventState | undefined;
}

function getState(): ContentEventState {
  if (!globalThis.__rtqContentEvents) {
    globalThis.__rtqContentEvents = {
      flushTimer: null,
      listeners: new Set(),
      pendingChanges: new Map(),
      watcherStarted: false,
    };
  }

  return globalThis.__rtqContentEvents;
}

function normalizeRelativePath(root: string, targetPath: string) {
  return path.relative(root, targetPath).split(path.sep).join('/');
}

function scheduleFlush(state: ContentEventState) {
  if (state.flushTimer) {
    return;
  }

  state.flushTimer = setTimeout(() => {
    state.flushTimer = null;

    if (state.pendingChanges.size === 0) {
      return;
    }

    const batch: ContentChangeBatch = {
      changes: [...state.pendingChanges.values()].sort((a, b) => {
        const rootCompare = a.root.localeCompare(b.root);
        if (rootCompare !== 0) {
          return rootCompare;
        }

        return a.relativePath.localeCompare(b.relativePath, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }),
      timestamp: Date.now(),
    };

    state.pendingChanges.clear();

    for (const listener of state.listeners) {
      listener(batch);
    }
  }, 150);
}

function queueChange(root: WatchRoot, event: WatchKind, targetPath: string) {
  const state = getState();
  const rootPath =
    root === 'content' ? rtqPaths.contentRoot : rtqPaths.mathsAssetsRoot;
  const relativePath = normalizeRelativePath(rootPath, targetPath);

  if (!relativePath || relativePath.startsWith('.')) {
    return;
  }

  const key = `${root}:${relativePath}`;
  state.pendingChanges.set(key, {
    event,
    relativePath,
    root,
  });

  scheduleFlush(state);
}

export function ensureContentWatcher() {
  const state = getState();

  if (state.watcherStarted) {
    return;
  }

  state.watcherStarted = true;

  const contentWatcher = chokidar.watch(rtqPaths.contentRoot, {
    ignoreInitial: true,
    persistent: true,
  });

  contentWatcher.on('add', filePath => queueChange('content', 'add', filePath));
  contentWatcher.on('change', filePath =>
    queueChange('content', 'change', filePath),
  );
  contentWatcher.on('unlink', filePath =>
    queueChange('content', 'unlink', filePath),
  );

  const assetsWatcher = chokidar.watch(rtqPaths.mathsAssetsRoot, {
    ignoreInitial: true,
    persistent: true,
  });

  assetsWatcher.on('add', filePath => queueChange('assets', 'add', filePath));
  assetsWatcher.on('change', filePath =>
    queueChange('assets', 'change', filePath),
  );
  assetsWatcher.on('unlink', filePath =>
    queueChange('assets', 'unlink', filePath),
  );
}

export function subscribeToContentEvents(listener: Listener) {
  const state = getState();
  state.listeners.add(listener);

  return () => {
    state.listeners.delete(listener);
  };
}
