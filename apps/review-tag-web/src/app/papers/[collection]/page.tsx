import { normalizePaperBrowserSearchParameters } from '@rtq/review-paper-browser/model';
import { isPaperCollectionId } from '@rtq/review-paper-model';
import { notFound } from 'next/navigation';

import { PaperIndex } from '@/components/paper-index';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    q?: string | string[];
  }>;
}) {
  const { collection } = await params;
  if (!isPaperCollectionId(collection)) notFound();
  const search = normalizePaperBrowserSearchParameters(await searchParams);

  return (
    <PaperIndex
      initialCollectionId={collection}
      initialContentPattern={search.content?.pattern}
      initialContentScope={search.content?.scope}
      initialQuery={search.query}
    />
  );
}
