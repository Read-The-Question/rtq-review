import { notFound } from 'next/navigation';

import { TagEditorApp } from '@/components/tag-editor-app';
import { listPaperFiles, readPaperDocumentBySlug } from '@/lib/paper-data';
import { isFolderKey } from '@/lib/paper-paths';
import { getTagCatalog } from '@/lib/tag-taxonomy';

export const dynamic = 'force-dynamic';

type FilePageProps = {
  params: Promise<{
    folder: string;
    slug: string[];
  }>;
};

export default async function FilePage({ params }: FilePageProps) {
  const { folder, slug } = await params;

  if (!isFolderKey(folder)) {
    notFound();
  }

  const [files, document, tagCatalog] = await Promise.all([
    listPaperFiles(),
    readPaperDocumentBySlug(folder, slug),
    getTagCatalog(),
  ]);

  return (
    <TagEditorApp
      files={files}
      initialDocument={document}
      key={`${folder}/${slug.join('/')}`}
      tagCatalog={tagCatalog}
    />
  );
}
