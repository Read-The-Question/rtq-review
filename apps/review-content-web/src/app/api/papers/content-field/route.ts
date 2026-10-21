import {
  PaperContentEditorError,
  loadPaperContentField,
  savePaperContentField,
} from '@/lib/paper-content-editor';
import { parseContentFieldApiTarget } from '@/lib/content-field-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' } as const;
const MAX_VALUE_LENGTH = 1_000_000;

function errorResponse(error: unknown): Response {
  if (error instanceof SyntaxError) {
    return Response.json(
      { message: 'The request body is not valid JSON.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  if (error instanceof PaperContentEditorError) {
    return Response.json(
      { message: error.message },
      { headers: responseHeaders, status: error.status },
    );
  }
  return Response.json(
    { message: 'The displayed TOML could not be updated.' },
    { headers: responseHeaders, status: 500 },
  );
}

export async function GET(request: Request): Promise<Response> {
  try {
    const rawTarget = new URL(request.url).searchParams.get('target');
    const target = rawTarget
      ? parseContentFieldApiTarget(JSON.parse(rawTarget))
      : undefined;
    if (!target) {
      return Response.json(
        { message: 'The selected displayed content field is not editable.' },
        { headers: responseHeaders, status: 400 },
      );
    }
    return Response.json(await loadPaperContentField(target), {
      headers: responseHeaders,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const record =
      body && typeof body === 'object' && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : undefined;
    const target = parseContentFieldApiTarget(record?.target);
    const expectedVersion = record?.expectedVersion;
    const value = record?.value;
    if (
      !target ||
      typeof expectedVersion !== 'string' ||
      !expectedVersion ||
      typeof value !== 'string'
    ) {
      return Response.json(
        { message: 'The content edit request is not valid.' },
        { headers: responseHeaders, status: 400 },
      );
    }
    if (value.length > MAX_VALUE_LENGTH) {
      return Response.json(
        { message: 'The edited content is too large to save here.' },
        { headers: responseHeaders, status: 413 },
      );
    }
    return Response.json(
      await savePaperContentField({ expectedVersion, target, value }),
      { headers: responseHeaders },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
