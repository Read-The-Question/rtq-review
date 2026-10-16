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
import type { ImageAvailabilityFilter } from '../lib/image-availability-types';

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
  imageAvailability: ImageAvailabilityFilter;
  limit: CorpusSearchLimit;
  pattern: string;
  scope: ContentSearchScope;
  uuidInput: string;
}>;

function contentSearchRoute(
  currentQuery: string,
  search: ContentSearchQuery | undefined,
  limit: CorpusSearchLimit,
  collectionId: PaperCollectionId,
  imageAvailability: ImageAvailabilityFilter,
  cursor?: string,
): string {
  const params = new URLSearchParams(currentQuery);
  params.set('collection', collectionId);
  if (search) {
    params.set('content', search.pattern);
    params.set('content-scope', search.scope);
  } else {
    params.delete('content');
    params.delete('content-scope');
  }
  params.set('limit', String(limit));
  if (imageAvailability === 'v2') {
    params.set('image-availability', 'v2');
  } else {
    params.delete('image-availability');
  }
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
  imageAvailability: ImageAvailabilityFilter,
): string {
  const params = new URLSearchParams(currentQuery);
  params.set('collection', collectionId);
  if (uuidInput) params.set('uuids', uuidInput);
  else params.delete('uuids');
  if (imageAvailability === 'v2') {
    params.set('image-availability', 'v2');
  } else {
    params.delete('image-availability');
  }
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
    'image-availability',
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
  imageAvailability,
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
  const [rebuildingImageIndex, setRebuildingImageIndex] = useState(false);

  const navigate = useCallback(
    (
      search: ContentSearchQuery | undefined,
      nextLimit: CorpusSearchLimit,
      nextCollectionId: PaperCollectionId,
      nextImageAvailability: ImageAvailabilityFilter,
      nextCursor?: string,
    ) => {
      startTransition(() => {
        router.push(
          contentSearchRoute(
            currentQuery,
            search,
            nextLimit,
            nextCollectionId,
            nextImageAvailability,
            nextCursor,
          ),
        );
      });
    },
    [currentQuery, router],
  );
  const navigateToUuids = useCallback(
    (
      nextUuidInput: string,
      nextCollectionId: PaperCollectionId,
      nextImageAvailability: ImageAvailabilityFilter,
    ) => {
      startTransition(() => {
        router.push(
          uuidSearchRoute(
            currentQuery,
            nextUuidInput,
            nextCollectionId,
            nextImageAvailability,
          ),
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
    if (imageAvailability === 'v2') {
      params.set('image-availability', 'v2');
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
  }, [
    collectionId,
    cursor,
    imageAvailability,
    initialResponse,
    limit,
    pattern,
    scope,
    uuidInput,
  ]);

  const rebuildImageIndex = useCallback(async () => {
    setRebuildingImageIndex(true);
    setError(undefined);
    const params = new URLSearchParams({
      collection: collectionId,
      limit: String(limit),
    });
    if (uuidInput) params.set('uuids', uuidInput);
    else if (pattern) {
      params.set('content', pattern);
      params.set('content-scope', scope);
    }
    if (imageAvailability === 'v2') {
      params.set('image-availability', 'v2');
    }
    try {
      const searchResponse = await fetch(
        `/api/papers/corpus-search?${params.toString()}`,
        { cache: 'no-store', method: 'POST' },
      );
      const payload = (await searchResponse.json()) as
        CorpusSearchResponse | { error?: string };
      if (!('paper' in payload)) {
        throw new Error(payload.error ?? 'Image index rebuild failed.');
      }
      if (!searchResponse.ok) throw new Error('Image index rebuild failed.');
      setResponse(payload);
      const refreshedQuery = new URLSearchParams(currentQuery);
      if (refreshedQuery.has('cursor')) {
        refreshedQuery.delete('cursor');
        router.replace(`/search?${refreshedQuery.toString()}`);
      }
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Image index rebuild failed.',
      );
    } finally {
      setRebuildingImageIndex(false);
    }
  }, [
    collectionId,
    currentQuery,
    imageAvailability,
    limit,
    pattern,
    router,
    scope,
    uuidInput,
  ]);

  if (response) {
    const search: ContentSearchQuery = { pattern, scope };
    return (
      <ReviewSurface
        commentLoad={response.commentLoad}
        corpus={{
          collectionId,
          collections,
          endPosition: response.endPosition,
          excludedUuidCount: response.excludedUuidCount,
          imageAvailability: response.imageAvailability,
          imageIndex: response.imageIndex,
          invalidFileCount: response.invalidFileCount,
          limit: response.limit,
          missingUuids: response.missingUuids,
          nextCursor: response.nextCursor,
          onClearSearch: () => router.push(clearedSearchRoute(currentQuery)),
          onContentSearch: (
            nextSearch,
            nextLimit,
            nextCollectionId,
            nextImageAvailability,
          ) =>
            navigate(
              nextSearch,
              nextLimit,
              nextCollectionId,
              nextImageAvailability,
            ),
          onPage: (nextCursor) =>
            navigate(
              pattern ? search : undefined,
              response.limit,
              collectionId,
              response.imageAvailability,
              nextCursor,
            ),
          onRebuildImageIndex: rebuildImageIndex,
          onUuidSearch: navigateToUuids,
          previousCursor: response.previousCursor,
          scannedFileCount: response.scannedFileCount,
          searchError: error ?? response.searchError,
          searchMode: response.searchMode,
          startPosition: response.startPosition,
          uuidInput: response.uuidInput ?? uuidInput,
          uuidRequestCount: response.uuidRequestCount,
          rebuildingImageIndex,
        }}
        outcomeLoad={response.outcomeLoad}
        paper={response.paper}
        pdfSessionKey={`${collectionId}:${uuidInput ? `uuid:${uuidInput}` : `content:${scope}:${pattern}`}:images:${response.imageAvailability}`}
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
          {pattern || uuidInput || imageAvailability !== 'any'
            ? 'Searching selected papers…'
            : 'Loading search…'}
        </h1>
        {error ? <p className="error-message">{error}</p> : null}
      </section>
    </main>
  );
}
