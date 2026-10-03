import {
  type PaperBrowserRouteContract,
  normalizePaperBrowserSearchParameters,
  paperBrowserPaperHref,
} from '@rtq/review-paper-browser/model';
import { notFound, permanentRedirect } from 'next/navigation';

import { isFolderKey } from '@/lib/paper-paths';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const routes: PaperBrowserRouteContract = {
  collectionBasePath: '/papers',
  contentSearchPath: '/api/papers/content-search',
};

export default async function LegacyFilePage({
  params,
  searchParams,
}: {
  params: Promise<{ folder: string; slug: string[] }>;
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    q?: string | string[];
  }>;
}) {
  const { folder, slug } = await params;
  if (!isFolderKey(folder) || slug.length === 0) notFound();
  const search = normalizePaperBrowserSearchParameters(await searchParams);

  permanentRedirect(
    paperBrowserPaperHref(routes, folder, `${slug.join('/')}.toml`, search),
  );
}
