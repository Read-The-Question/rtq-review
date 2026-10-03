import {
  isPaperCollectionId,
  listPaperCollections,
  normalizeContentSearchScope,
  PaperContentSearchError,
} from '@rtq/review-paper-model';

import {
  emptyCanonicalQuestionCorpus,
  emptyCanonicalQuestionUuidCorpus,
  searchCanonicalQuestionCorpus,
  searchCanonicalQuestionCorpusByUuids,
} from '@/lib/corpus-search';
import { isCorpusSearchLimit } from '@/lib/corpus-search-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

export async function GET(request: Request): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const requestedCollection = parameters.get('collection')?.trim() || 'toml';
  const pattern = parameters.get('content')?.trim() ?? '';
  const uuidInput = parameters.get('uuids')?.trim() ?? '';
  const scope = normalizeContentSearchScope(parameters.get('content-scope'));
  const requestedLimit = Number(parameters.get('limit') ?? '20');
  const cursor = parameters.get('cursor')?.trim() || undefined;

  if (!isPaperCollectionId(requestedCollection)) {
    return Response.json(
      { error: 'Choose a supported paper collection.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  const collectionId = requestedCollection;

  if (!isCorpusSearchLimit(requestedLimit)) {
    return Response.json(
      { error: 'Choose a result limit of 20, 50, or 100.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  if (pattern && uuidInput) {
    return Response.json(
      { error: 'Choose either content search or UUID search, not both.' },
      { headers: responseHeaders, status: 400 },
    );
  }

  try {
    const collections = await listPaperCollections();
    if (!collections.some((collection) => collection.id === collectionId)) {
      return Response.json(
        { error: 'Choose an available paper collection.' },
        { headers: responseHeaders, status: 400 },
      );
    }
    if (uuidInput) {
      return Response.json(
        await searchCanonicalQuestionCorpusByUuids(collectionId, uuidInput),
        { headers: responseHeaders },
      );
    }
    if (!pattern) {
      return Response.json(
        emptyCanonicalQuestionCorpus(collectionId, requestedLimit),
        { headers: responseHeaders },
      );
    }
    return Response.json(
      await searchCanonicalQuestionCorpus(
        collectionId,
        { pattern, scope },
        { ...(cursor ? { cursor } : {}), limit: requestedLimit },
      ),
      { headers: responseHeaders },
    );
  } catch (error) {
    const invalid = error instanceof PaperContentSearchError;
    if (invalid) {
      return Response.json(
        {
          ...(uuidInput
            ? emptyCanonicalQuestionUuidCorpus(collectionId, uuidInput)
            : emptyCanonicalQuestionCorpus(collectionId, requestedLimit)),
          searchError: error.message,
        },
        { headers: responseHeaders },
      );
    }
    return Response.json(
      {
        error: 'The selected question collection could not be searched.',
      },
      { headers: responseHeaders, status: 500 },
    );
  }
}
