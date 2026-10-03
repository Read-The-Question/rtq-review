import {
  type PaperBrowserRouteContract,
  normalizePaperBrowserSearchParameters,
  paperBrowserCollectionHref,
} from '@rtq/review-paper-browser/model';
import { notFound } from 'next/navigation';

import { TagEditorApp } from '@/components/tag-editor-app';
import { getImageTagCatalog } from '@/lib/image-tag-catalog';
import { readPaperDocument } from '@/lib/paper-data';
import { isFolderKey } from '@/lib/paper-paths';
import { resolvePaperPdf } from '@/lib/paper-pdf-reader';
import { getTagCatalog } from '@/lib/tag-taxonomy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const routes: PaperBrowserRouteContract = {
  collectionBasePath: '/papers',
  contentSearchPath: '/api/papers/content-search',
};

export default async function PaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; slug: string[] }>;
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    q?: string | string[];
  }>;
}) {
  const { collection, slug } = await params;
  if (!isFolderKey(collection) || slug.length === 0) notFound();
  const relativePath = slug.join('/');
  const search = normalizePaperBrowserSearchParameters(await searchParams);
  const [document, tagCatalog, imageTagCatalog] = await Promise.all([
    readPaperDocument(collection, relativePath),
    getTagCatalog(),
    getImageTagCatalog(),
  ]);
  const pdf = await resolvePaperPdf(collection, document.fileName);

  return (
    <TagEditorApp
      browseHref={paperBrowserCollectionHref(routes, collection, search)}
      imageTagCatalog={imageTagCatalog}
      initialDocument={document}
      key={`${collection}/${relativePath}`}
      pdf={pdf}
      tagCatalog={tagCatalog}
    />
  );
}
