'use client';

import type {
  ContentSearchQuery,
  ContentSearchScope,
} from '@rtq/review-paper-model/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { ReviewSurface } from './review-surface';
import type {
  CorpusSearchLimit,
  CorpusSearchResponse,
} from '../lib/corpus-search-types';

type CorpusSearchProps = Readonly<{
  cursor?: string;
  initialResponse?: CorpusSearchResponse;
  limit: CorpusSearchLimit;
  pattern: string;
  scope: ContentSearchScope;
}>;

function searchRoute(
  currentQuery: string,
  pattern: string,
  scope: ContentSearchScope,
  limit: CorpusSearchLimit,
  cursor?: string,
): string {
  const params = new URLSearchParams(currentQuery);
  params.set('content', pattern);
  params.set('content-scope', scope);
  params.set('limit', String(limit));
  params.delete('question');
  if (cursor) params.set('cursor', cursor);
  else params.delete('cursor');
  return `/search?${params.toString()}`;
}

function clearedSearchRoute(currentQuery: string): string {
  const params = new URLSearchParams(currentQuery);
  for (const key of [
    'content',
    'content-scope',
    'cursor',
    'limit',
    'question',
  ]) {
    params.delete(key);
  }
  const query = params.toString();
  return query ? `/search?${query}` : '/search';
}

export function CorpusSearch({
  cursor,
  initialResponse,
  limit,
  pattern,
  scope,
}: CorpusSearchProps) {
  const router = useRouter();
  const currentQuery = useSearchParams().toString();
  const [response, setResponse] = useState<CorpusSearchResponse | undefined>(
    initialResponse,
  );
  const [error, setError] = useState<string>();

  const navigate = useCallback(
    (
      search: ContentSearchQuery,
      nextLimit: CorpusSearchLimit,
      nextCursor?: string,
    ) => {
      startTransition(() => {
        router.push(
          searchRoute(
            currentQuery,
            search.pattern,
            search.scope,
            nextLimit,
            nextCursor,
          ),
        );
      });
    },
    [currentQuery, router],
  );

  useEffect(() => {
    if (initialResponse && !pattern) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      content: pattern,
      'content-scope': scope,
      limit: String(limit),
    });
    if (cursor) params.set('cursor', cursor);

    void fetch(`/api/papers/corpus-search?${params.toString()}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (searchResponse) => {
        const payload = (await searchResponse.json()) as
          CorpusSearchResponse | { error?: string };
        if (!('paper' in payload)) {
          throw new Error(payload.error ?? 'Corpus search failed.');
        }
        if (!searchResponse.ok) throw new Error('Corpus search failed.');
        setResponse(payload);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          reason instanceof Error ? reason.message : 'Corpus search failed.',
        );
      });

    return () => controller.abort();
  }, [cursor, initialResponse, limit, pattern, scope]);

  if (response) {
    const search: ContentSearchQuery = { pattern, scope };
    return (
      <ReviewSurface
        commentLoad={response.commentLoad}
        corpus={{
          endPosition: response.endPosition,
          invalidFileCount: response.invalidFileCount,
          limit: response.limit,
          nextCursor: response.nextCursor,
          onClearSearch: () => router.push(clearedSearchRoute(currentQuery)),
          onPage: (nextCursor) => navigate(search, response.limit, nextCursor),
          onSearch: (nextSearch, nextLimit) => navigate(nextSearch, nextLimit),
          previousCursor: response.previousCursor,
          scannedFileCount: response.scannedFileCount,
          searchError: response.searchError,
          startPosition: response.startPosition,
        }}
        outcomeLoad={response.outcomeLoad}
        paper={response.paper}
        reviewer={response.reviewer}
      />
    );
  }

  return (
    <main className="paper-shell">
      <section className="paper-hero" aria-live="polite">
        <p className="eyebrow">Canonical question corpus</p>
        <h1>{pattern ? 'Searching canonical papers…' : 'Loading search…'}</h1>
        {error ? <p className="error-message">{error}</p> : null}
      </section>
    </main>
  );
}
