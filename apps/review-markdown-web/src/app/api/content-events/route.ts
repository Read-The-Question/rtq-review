import {
  ensureContentWatcher,
  subscribeToContentEvents,
} from '@/lib/rtq-content-events';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  ensureContentWatcher();

  const encoder = new TextEncoder();
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let unsubscribe: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const push = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      push({ changes: [], ok: true, timestamp: Date.now() });

      unsubscribe = subscribeToContentEvents(batch => {
        push(batch);
      });

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      }, 15000);
    },
    cancel() {
      if (heartbeat) {
        clearInterval(heartbeat);
      }

      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
  });
}
