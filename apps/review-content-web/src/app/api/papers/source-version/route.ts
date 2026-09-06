import {
  inspectPaperSource,
  isPaperCollectionId,
} from '@rtq/review-paper-model';

import type { SourceFreshnessPayload } from '@/lib/source-freshness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

function unavailable(message: string, status: number): Response {
  const payload: SourceFreshnessPayload = { message, state: 'unavailable' };
  return Response.json(payload, { headers: responseHeaders, status });
}

export async function GET(request: Request): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const collection = parameters.get('collection') ?? '';
  const relativePath = parameters.get('path') ?? '';

  if (!isPaperCollectionId(collection) || !relativePath) {
    return unavailable('The selected paper route is not reviewable.', 400);
  }

  try {
    const summary = await inspectPaperSource(collection, relativePath);
    const payload: SourceFreshnessPayload =
      summary.state === 'ready'
        ? { state: 'ready', version: summary.source.version }
        : {
            message:
              'The source TOML is temporarily invalid. Save a valid file and check again.',
            state: 'invalid',
            version: summary.version,
          };
    return Response.json(payload, { headers: responseHeaders });
  } catch (error) {
    const unsafe =
      error instanceof Error &&
      /safe repository-relative|must be a TOML file|escapes/i.test(
        error.message,
      );
    return unavailable(
      unsafe
        ? 'The selected paper route is not reviewable.'
        : 'The source file is unavailable. It may have been moved or deleted.',
      unsafe ? 400 : 404,
    );
  }
}
