import {
  isPaperCollectionId,
  normalizeContentSearchScope,
  PaperContentSearchError,
  searchPaperCollectionContent,
} from '@rtq/review-paper-model';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

export async function GET(request: Request): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const collection = parameters.get('collection') ?? '';
  const pattern = parameters.get('content')?.trim() ?? '';
  const scope = normalizeContentSearchScope(parameters.get('content-scope'));

  if (!isPaperCollectionId(collection)) {
    return Response.json(
      { message: 'The selected paper collection is not reviewable.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  if (!pattern) {
    return Response.json(
      { message: 'Enter a regular expression to search.' },
      { headers: responseHeaders, status: 400 },
    );
  }

  try {
    return Response.json(
      await searchPaperCollectionContent(collection, { pattern, scope }),
      { headers: responseHeaders },
    );
  } catch (error) {
    const invalid = error instanceof PaperContentSearchError;
    return Response.json(
      {
        message: invalid
          ? error.message
          : 'The raw paper content could not be searched.',
      },
      { headers: responseHeaders, status: invalid ? 400 : 500 },
    );
  }
}
