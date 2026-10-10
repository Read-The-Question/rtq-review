'use client';

import type {
  ContentSearchQuery,
  ContentSearchScope,
  PaperCollectionId,
} from '@rtq/review-paper-model/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { ReviewSurface } from './review-surface';
import type {
  CorpusSearchLimit,
  CorpusSearchResponse,
} from '../lib/corpus-search-types';

type CorpusSearchProps = Readonly<{
  collectionId: PaperCollectionId;
  collections: ReadonlyArray<
    Readonly<{
      id: PaperCollectionId;
      label: string;
    }>
  >;
  cursor?: string;
  initialResponse?: CorpusSearchResponse;
  limit: CorpusSearchLimit;
  pattern: string;
  scope: ContentSearchScope;
  uuidInput: string;
}>;

function contentSearchRoute(
  currentQuery: string,
  pattern: string,
  scope: ContentSearchScope,
  limit: CorpusSearchLimit,
  collectionId: PaperCollectionId,
  cursor?: string,
): string {
  const params = new URLSearchParams(currentQuery);
  params.set('collection', collectionId);
  params.set('content', pattern);
  params.set('content-scope', scope);
  params.set('limit', String(limit));
  params.delete('uuids');
  params.delete('question');
  if (cursor) params.set('cursor', cursor);
  else params.delete('cursor');
  return `/search?${params.toString()}`;
}

function uuidSearchRoute(
  currentQuery: string,
  uuidInput: string,
  collectionId: PaperCollectionId,
): string {
  const params = new URLSearchParams(currentQuery);
  params.set('collection', collectionId);
  params.set('uuids', uuidInput);
  for (const key of ['content', 'content-scope', 'cursor', 'question']) {
    params.delete(key);
  }
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
    'uuids',
  ]) {
    params.delete(key);
  }
  const query = params.toString();
  return query ? `/search?${query}` : '/search';
}

export function CorpusSearch({
  collectionId,
  collections,
  cursor,
  initialResponse,
  limit,
  pattern,
  scope,
  uuidInput,
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
      nextCollectionId: PaperCollectionId,
      nextCursor?: string,
    ) => {
      startTransition(() => {
        router.push(
          contentSearchRoute(
            currentQuery,
            search.pattern,
            search.scope,
            nextLimit,
            nextCollectionId,
            nextCursor,
          ),
        );
      });
    },
    [currentQuery, router],
  );
  const navigateToUuids = useCallback(
    (nextUuidInput: string, nextCollectionId: PaperCollectionId) => {
      startTransition(() => {
        router.push(
          uuidSearchRoute(currentQuery, nextUuidInput, nextCollectionId),
        );
      });
    },
    [currentQuery, router],
  );

  useEffect(() => {
    if (initialResponse && !pattern && !uuidInput) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      collection: collectionId,
      limit: String(limit),
    });
    if (uuidInput) {
      params.set('uuids', uuidInput);
    } else {
      params.set('content', pattern);
      params.set('content-scope', scope);
      if (cursor) params.set('cursor', cursor);
    }

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
  }, [collectionId, cursor, initialResponse, limit, pattern, scope, uuidInput]);

  if (response) {
    const search: ContentSearchQuery = { pattern, scope };
    return (
      <ReviewSurface
        commentLoad={response.commentLoad}
        corpus={{
          collectionId,
          collections,
          endPosition: response.endPosition,
          invalidFileCount: response.invalidFileCount,
          limit: response.limit,
          missingUuids: response.missingUuids,
          nextCursor: response.nextCursor,
          onClearSearch: () => router.push(clearedSearchRoute(currentQuery)),
          onContentSearch: (nextSearch, nextLimit, nextCollectionId) =>
            navigate(nextSearch, nextLimit, nextCollectionId),
          onPage: (nextCursor) =>
            navigate(search, response.limit, collectionId, nextCursor),
          onUuidSearch: navigateToUuids,
          previousCursor: response.previousCursor,
          scannedFileCount: response.scannedFileCount,
          searchError: response.searchError,
          searchMode: response.searchMode,
          startPosition: response.startPosition,
          uuidInput: response.uuidInput ?? uuidInput,
          uuidRequestCount: response.uuidRequestCount,
        }}
        outcomeLoad={response.outcomeLoad}
        paper={response.paper}
        pdfSessionKey={`${collectionId}:${uuidInput ? `uuid:${uuidInput}` : `content:${scope}:${pattern}`}`}
        pdfs={response.pdfs}
        reviewer={response.reviewer}
      />
    );
  }

  return (
    <main className="paper-shell">
      <section className="paper-hero" aria-live="polite">
        <p className="eyebrow">Question collection</p>
        <h1>
          {pattern || uuidInput
            ? 'Searching selected papers…'
            : 'Loading search…'}
        </h1>
        {error ? <p className="error-message">{error}</p> : null}
      </section>
    </main>
  );
}
