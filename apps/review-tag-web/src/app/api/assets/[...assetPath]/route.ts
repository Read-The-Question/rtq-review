import { createPaperAssetResponse } from '@/lib/paper-asset-reader';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type AssetRouteProps = {
  params: Promise<{
    assetPath: string[];
  }>;
};

export async function GET(_: Request, { params }: AssetRouteProps) {
  const { assetPath } = await params;

  return createPaperAssetResponse(assetPath.join('/'));
}
