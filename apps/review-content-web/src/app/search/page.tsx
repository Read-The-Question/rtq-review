import {
  isPaperCollectionId,
  listPaperCollections,
  normalizeContentSearchScope,
  type ContentSearchScope,
} from '@rtq/review-paper-model';

import { CorpusSearch } from '@/components/corpus-search';
import {
  isCorpusSearchLimit,
  type CorpusSearchLimit,
} from '@/lib/corpus-search-types';
import { emptyCanonicalQuestionCorpus } from '@/lib/corpus-search';
import { imageAvailabilityIndexSummary } from '@/lib/image-availability-index';
import { normalizeImageAvailabilityFilter } from '@/lib/image-availability-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function stringParameter(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

export default async function CorpusSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string | string[];
    content?: string | string[];
    'content-scope'?: string | string[];
    cursor?: string | string[];
    'image-availability'?: string | string[];
    limit?: string | string[];
    uuids?: string | string[];
  }>;
}) {
  const parameters = await searchParams;
  const collections = await listPaperCollections();
  const requestedCollection = stringParameter(parameters.collection);
  const collectionId =
    isPaperCollectionId(requestedCollection) &&
    collections.some((collection) => collection.id === requestedCollection)
      ? requestedCollection
      : 'toml';
  const requestedLimit = Number(stringParameter(parameters.limit) || '20');
  const limit: CorpusSearchLimit = isCorpusSearchLimit(requestedLimit)
    ? requestedLimit
    : 20;
  const scope: ContentSearchScope = normalizeContentSearchScope(
    stringParameter(parameters['content-scope']),
  );
  const pattern = stringParameter(parameters.content).trim();
  const uuidInput = stringParameter(parameters.uuids).trim();
  const imageAvailability = normalizeImageAvailabilityFilter(
    stringParameter(parameters['image-availability']),
  );
  const cursor = stringParameter(parameters.cursor).trim() || undefined;
  const imageIndex = imageAvailabilityIndexSummary(collectionId);

  return (
    <CorpusSearch
      collectionId={collectionId}
      collections={collections.map((collection) => ({
        id: collection.id,
        label: collection.label,
      }))}
      cursor={cursor}
      initialResponse={
        pattern || uuidInput || imageAvailability !== 'any'
          ? undefined
          : emptyCanonicalQuestionCorpus(collectionId, limit, {
              index: imageIndex,
            })
      }
      imageAvailability={imageAvailability}
      key={`${collectionId}:${pattern}:${scope}:${uuidInput}:${imageAvailability}:${limit}:${cursor ?? ''}`}
      limit={limit}
      pattern={pattern}
      scope={scope}
      uuidInput={uuidInput}
    />
  );
}
