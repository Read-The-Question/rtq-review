import { normalizePaperBrowserSearchParameters } from '@rtq/review-paper-browser/model';

import { PaperIndex } from '@/components/paper-index';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    q?: string | string[];
  }>;
}) {
  const search = normalizePaperBrowserSearchParameters(await searchParams);

  return (
    <PaperIndex
      initialContentPattern={search.content?.pattern}
      initialContentScope={search.content?.scope}
      initialQuery={search.query}
    />
  );
}
