import {
  normalizeContentSearchScope,
  type ContentSearchScope,
} from '@rtq/review-paper-model';

import { CorpusSearch } from '@/components/corpus-search';
import {
  isCorpusSearchLimit,
  type CorpusSearchLimit,
} from '@/lib/corpus-search-types';
import { emptyCanonicalQuestionCorpus } from '@/lib/corpus-search';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function stringParameter(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

export default async function CorpusSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    cursor?: string | string[];
    limit?: string | string[];
  }>;
}) {
  const parameters = await searchParams;
  const requestedLimit = Number(stringParameter(parameters.limit) || '20');
  const limit: CorpusSearchLimit = isCorpusSearchLimit(requestedLimit)
    ? requestedLimit
    : 20;
  const scope: ContentSearchScope = normalizeContentSearchScope(
    stringParameter(parameters['content-scope']),
  );
  const pattern = stringParameter(parameters.content).trim();
  const cursor = stringParameter(parameters.cursor).trim() || undefined;

  return (
    <CorpusSearch
      cursor={cursor}
      initialResponse={
        pattern ? undefined : emptyCanonicalQuestionCorpus(limit)
      }
      key={`${pattern}:${scope}:${limit}:${cursor ?? ''}`}
      limit={limit}
      pattern={pattern}
      scope={scope}
    />
  );
}
