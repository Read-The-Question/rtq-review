import { createPaperPdfResponse } from '@/lib/paper-pdf-reader';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ paperStem: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { paperStem } = await context.params;
  return createPaperPdfResponse(request, paperStem);
}

export async function HEAD(request: Request, context: RouteContext) {
  const { paperStem } = await context.params;
  return createPaperPdfResponse(request, paperStem);
}
