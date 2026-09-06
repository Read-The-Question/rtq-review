export type SourceFreshnessPayload =
  | Readonly<{ state: 'invalid'; message: string; version: string }>
  | Readonly<{ state: 'ready'; version: string }>
  | Readonly<{ state: 'unavailable'; message: string }>;

export type SourceFreshnessStatus =
  | Readonly<{ state: 'changed'; version: string }>
  | Readonly<{ state: 'current' }>
  | Readonly<{ state: 'error'; message: string }>
  | Readonly<{ state: 'invalid'; message: string; version: string }>
  | Readonly<{ state: 'unavailable'; message: string }>;

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function nonemptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function evaluateSourceFreshness(
  currentVersion: string,
  value: unknown,
): SourceFreshnessStatus {
  const payload = record(value);
  if (!payload) {
    return {
      message: 'The source freshness response was not valid.',
      state: 'error',
    };
  }
  const state = payload.state;

  if (state === 'ready') {
    const version = nonemptyString(payload.version);
    if (version) {
      return version === currentVersion
        ? { state: 'current' }
        : { state: 'changed', version };
    }
  }

  if (state === 'invalid') {
    const message = nonemptyString(payload.message);
    const version = nonemptyString(payload.version);
    if (message && version) return { message, state, version };
  }

  if (state === 'unavailable') {
    const message = nonemptyString(payload.message);
    if (message) return { message, state };
  }

  return {
    message: 'The source freshness response was not valid.',
    state: 'error',
  };
}

export function sourceVersionUrl(
  collectionId: string,
  relativePath: string,
): string {
  const parameters = new URLSearchParams({
    collection: collectionId,
    path: relativePath,
  });
  return `/api/papers/source-version?${parameters.toString()}`;
}
