import {
  NestedQuestionUuidError,
  QuestionUuidNotFoundError,
  readQuestionPayload,
} from '@/lib/paper-data';
import type { CurrentQuestionResponse } from '@/lib/paper-types';
import { getViewerTarget, normalizeSessionId } from '@/lib/viewer-state';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function statusForError(error: unknown) {
  if (error instanceof NestedQuestionUuidError) return 422;
  if (error instanceof QuestionUuidNotFoundError) return 404;
  return 400;
}

function messageForError(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to read the current question.';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = normalizeSessionId(
    searchParams.get('sessionId') ?? searchParams.get('session'),
  );
  const target = getViewerTarget(sessionId);

  if (!target) {
    return Response.json({
      error: `No active question target for session ${sessionId}. Set one with POST /api/view-target or open a target URL.`,
      ok: false,
      sessionId,
      target: null,
    } satisfies CurrentQuestionResponse);
  }

  try {
    const payload = await readQuestionPayload(target);

    return Response.json({
      ok: true,
      payload,
      sessionId,
    } satisfies CurrentQuestionResponse);
  } catch (error) {
    return Response.json(
      {
        error: messageForError(error),
        ok: false,
        sessionId,
        target,
      } satisfies CurrentQuestionResponse,
      { status: statusForError(error) },
    );
  }
}
