import {
  NestedQuestionUuidError,
  QuestionUuidNotFoundError,
  readQuestionPayload,
} from '@/lib/paper-data';
import type { ViewerTarget } from '@/lib/paper-types';
import {
  getViewerTarget,
  normalizeSessionId,
  setViewerTarget,
} from '@/lib/viewer-state';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ViewTargetRequest = ViewerTarget & {
  sessionId: string;
};

function validatePayload(value: unknown): ViewTargetRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected a JSON object.');
  }

  const record = value as Record<string, unknown>;
  const relativePathFromPapers = record.relativePathFromPapers;
  const questionUuid = record.questionUuid;
  const sessionId =
    record.sessionId ?? record.session ?? record.contextId ?? record.context;

  if (
    typeof relativePathFromPapers !== 'string' ||
    !relativePathFromPapers.trim()
  ) {
    throw new Error('relativePathFromPapers is required.');
  }

  if (typeof questionUuid !== 'string' || !questionUuid.trim()) {
    throw new Error('questionUuid is required.');
  }

  return {
    questionUuid: questionUuid.trim(),
    relativePathFromPapers: relativePathFromPapers.trim(),
    sessionId:
      typeof sessionId === 'string'
        ? normalizeSessionId(sessionId)
        : normalizeSessionId(null),
  };
}

function statusForError(error: unknown) {
  if (error instanceof NestedQuestionUuidError) return 422;
  if (error instanceof QuestionUuidNotFoundError) return 404;
  return 400;
}

function messageForError(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to set the viewer target.';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = normalizeSessionId(
    searchParams.get('sessionId') ?? searchParams.get('session'),
  );

  return Response.json({
    ok: true,
    sessionId,
    target: getViewerTarget(sessionId),
  });
}

export async function POST(request: Request) {
  let sessionId = normalizeSessionId(null);

  try {
    const target = validatePayload(await request.json());
    sessionId = target.sessionId;
    const payload = await readQuestionPayload(target);
    const normalizedTarget = setViewerTarget(sessionId, payload.target);

    return Response.json({
      ok: true,
      payload,
      sessionId,
      target: normalizedTarget,
    });
  } catch (error) {
    return Response.json(
      {
        error: messageForError(error),
        ok: false,
        sessionId,
        target: getViewerTarget(sessionId),
      },
      { status: statusForError(error) },
    );
  }
}
