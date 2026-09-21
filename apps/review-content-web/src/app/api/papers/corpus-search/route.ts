import {
  normalizeContentSearchScope,
  PaperContentSearchError,
} from '@rtq/review-paper-model';

import {
  emptyCanonicalQuestionCorpus,
  searchCanonicalQuestionCorpus,
} from '@/lib/corpus-search';
import { isCorpusSearchLimit } from '@/lib/corpus-search-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

export async function GET(request: Request): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const pattern = parameters.get('content')?.trim() ?? '';
  const scope = normalizeContentSearchScope(parameters.get('content-scope'));
  const requestedLimit = Number(parameters.get('limit') ?? '20');
  const cursor = parameters.get('cursor')?.trim() || undefined;

  if (!isCorpusSearchLimit(requestedLimit)) {
    return Response.json(
      { error: 'Choose a result limit of 20, 50, or 100.' },
      { headers: responseHeaders, status: 400 },
    );
  }

  try {
    if (!pattern) {
      return Response.json(emptyCanonicalQuestionCorpus(requestedLimit), {
        headers: responseHeaders,
      });
    }
    return Response.json(
      await searchCanonicalQuestionCorpus(
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
          ...emptyCanonicalQuestionCorpus(requestedLimit),
          searchError: error.message,
        },
        { headers: responseHeaders },
      );
    }
    return Response.json(
      {
        error: 'The canonical question corpus could not be searched.',
      },
      { headers: responseHeaders, status: 500 },
    );
  }
}
