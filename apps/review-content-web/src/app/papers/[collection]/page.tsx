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
  const parameters = await searchParams;
  if (!isPaperCollectionId(collection)) notFound();

  return (
    <PaperIndex
      initialCollectionId={collection}
      initialContentPattern={
        typeof parameters.content === 'string' ? parameters.content : undefined
      }
      initialContentScope={
        typeof parameters['content-scope'] === 'string'
          ? parameters['content-scope']
          : undefined
      }
      initialQuery={typeof parameters.q === 'string' ? parameters.q : undefined}
    />
  );
}
