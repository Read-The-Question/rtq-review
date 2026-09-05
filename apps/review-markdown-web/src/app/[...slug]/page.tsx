import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReviewRuntime } from '@/components/review-runtime';
import { getContentDocumentBySlugSegments } from '@/lib/rtq-content';

export const dynamic = 'force-dynamic';

type DocumentPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params;
  const document = await getContentDocumentBySlugSegments(slug);

  if (!document) {
    notFound();
  }

  return (
    <>
      <ReviewRuntime
        contentRelativePath={document.relativePath}
        watchMode="document"
      />
      <main className="rtq-shell">
        <div className="rtq-page-header rtq-page-header-compact">
          <div>
            <p className="rtq-eyebrow">{document.sourceLabel}</p>
            <h1>{document.title}</h1>
            <p className="rtq-subtitle">
              {document.rawQuestionCount
                ? `${document.rawQuestionCount} question${
                    document.rawQuestionCount === '1' ? '' : 's'
                  }`
                : 'Runtime markdown document'}
              {document.date ? ` • Built at ${document.date}` : ''}
            </p>
          </div>
          <Link href="/" className="rtq-back-link">
            All review sections
          </Link>
        </div>

        <section className="rtq-document-meta-panel">
          <span>
            <strong>Slug:</strong> /{document.slug}
          </span>
          <span>
            <strong>Source:</strong> {document.relativePath}
          </span>
        </section>

        <article
          className="rtq-document"
          dangerouslySetInnerHTML={{ __html: document.html }}
        />
      </main>
    </>
  );
}
