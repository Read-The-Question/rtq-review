import { createPaperAssetResponse } from '@/lib/paper-asset-reader';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PaperAssetRouteProps = {
  params: Promise<{
    assetPath: string[];
  }>;
};

export async function GET(_: Request, { params }: PaperAssetRouteProps) {
  const { assetPath } = await params;

  return createPaperAssetResponse(['papers', ...assetPath].join('/'));
}
