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
  searchCanonicalQuestionCorpusByImageAvailability,
  searchCanonicalQuestionCorpusByUuids,
} from '@/lib/corpus-search';
import {
  getImageAvailabilityIndex,
  imageAvailabilityIndexSummary,
} from '@/lib/image-availability-index';
import { normalizeImageAvailabilityFilter } from '@/lib/image-availability-types';
import { isCorpusSearchLimit } from '@/lib/corpus-search-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

async function corpusSearchResponse(
  request: Request,
  rebuildImageIndex: boolean,
): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const requestedCollection = parameters.get('collection')?.trim() || 'toml';
  const pattern = parameters.get('content')?.trim() ?? '';
  const uuidInput = parameters.get('uuids')?.trim() ?? '';
  const scope = normalizeContentSearchScope(parameters.get('content-scope'));
  const requestedLimit = Number(parameters.get('limit') ?? '20');
  const cursor = parameters.get('cursor')?.trim() || undefined;
  const imageAvailability = normalizeImageAvailabilityFilter(
    parameters.get('image-availability'),
  );

  if (!isPaperCollectionId(requestedCollection)) {
    return Response.json(
      { error: 'Choose a supported paper collection.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  const collectionId = requestedCollection;
  let imageIndexSummary = imageAvailabilityIndexSummary(collectionId);

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
    const imageIndex =
      rebuildImageIndex || imageAvailability === 'v2'
        ? await getImageAvailabilityIndex(collectionId, {
            rebuild: rebuildImageIndex,
          })
        : undefined;
    imageIndexSummary = imageIndex?.summary ?? imageIndexSummary;
    const imageOptions = {
      availability: imageAvailability,
      index: imageIndexSummary,
    } as const;
    if (uuidInput) {
      return Response.json(
        await searchCanonicalQuestionCorpusByUuids(collectionId, uuidInput, {
          ...(imageIndex
            ? { candidateQuestionKeys: imageIndex.questionKeys }
            : {}),
          imageAvailability,
          ...(imageIndexSummary ? { imageIndex: imageIndexSummary } : {}),
        }),
        { headers: responseHeaders },
      );
    }
    if (pattern) {
      return Response.json(
        await searchCanonicalQuestionCorpus(
          collectionId,
          { pattern, scope },
          {
            ...(imageIndex
              ? { candidateQuestionKeys: imageIndex.questionKeys }
              : {}),
            ...(cursor ? { cursor } : {}),
            imageAvailability,
            ...(imageIndexSummary ? { imageIndex: imageIndexSummary } : {}),
            limit: requestedLimit,
          },
        ),
        { headers: responseHeaders },
      );
    }
    if (imageAvailability === 'v2' && imageIndex) {
      return Response.json(
        await searchCanonicalQuestionCorpusByImageAvailability(
          collectionId,
          imageIndex,
          { ...(cursor ? { cursor } : {}), limit: requestedLimit },
        ),
        { headers: responseHeaders },
      );
    }
    return Response.json(
      emptyCanonicalQuestionCorpus(collectionId, requestedLimit, imageOptions),
      { headers: responseHeaders },
    );
  } catch (error) {
    const invalid = error instanceof PaperContentSearchError;
    if (invalid) {
      return Response.json(
        {
          ...(uuidInput
            ? emptyCanonicalQuestionUuidCorpus(collectionId, uuidInput, {
                availability: imageAvailability,
                index: imageIndexSummary,
              })
            : emptyCanonicalQuestionCorpus(collectionId, requestedLimit, {
                availability: imageAvailability,
                index: imageIndexSummary,
              })),
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

export async function GET(request: Request): Promise<Response> {
  return corpusSearchResponse(request, false);
}

export async function POST(request: Request): Promise<Response> {
  return corpusSearchResponse(request, true);
}
