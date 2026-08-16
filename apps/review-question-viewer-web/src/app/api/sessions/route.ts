import type { SessionsResponse } from '@/lib/paper-types';
import { listViewerSessions } from '@/lib/viewer-state';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    ok: true,
    sessions: listViewerSessions(),
  } satisfies SessionsResponse);
}
