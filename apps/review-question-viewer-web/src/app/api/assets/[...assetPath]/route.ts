import { createPaperAssetResponse } from '@/lib/paper-asset-reader';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ assetPath: string[] }> },
) {
  const { assetPath } = await context.params;

  return createPaperAssetResponse(assetPath.join('/'));
}
