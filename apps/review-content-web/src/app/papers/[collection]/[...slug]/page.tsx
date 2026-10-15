import { Suspense } from 'react';

import { isPaperCollectionId, readReviewPaper } from '@rtq/review-paper-model';
import { notFound } from 'next/navigation';

import { ReviewSurface } from '@/components/review-surface';
import { prepareReviewPaperForDisplay } from '@/lib/prepare-paper';
import { reviewContentReviewer } from '@/lib/review-config';
import { loadReviewCommentsForPaper } from '@/lib/review-comments';
import { loadReviewOutcomesForPaper } from '@/lib/review-outcomes';
import {
  resolveDerivedPaperPdfOptions,
  resolvePaperPdf,
} from '@/lib/paper-pdf-reader';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function PaperPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string[] }>;
}) {
  const { collection, slug } = await params;
  if (!isPaperCollectionId(collection) || slug.length === 0) notFound();

  let paper;
  try {
    paper = await readReviewPaper(collection, slug.join('/'));
  } catch (error) {
    if (
      error instanceof Error &&
      /unsupported|unavailable|safe repository-relative/i.test(error.message)
    ) {
      notFound();
    }
    throw error;
  }

  const pdfPromise = resolvePaperPdf(paper.source);
  const pdfsPromise = resolveDerivedPaperPdfOptions(paper);
  const displayPaper = prepareReviewPaperForDisplay(paper);
  const commentLoad = loadReviewCommentsForPaper(paper);
  const outcomeLoad = loadReviewOutcomesForPaper(paper);
  const [pdf, pdfs] = await Promise.all([pdfPromise, pdfsPromise]);
  return (
    <Suspense fallback={<div className="route-loading">Preparing review…</div>}>
      <ReviewSurface
        commentLoad={commentLoad}
        key={`${paper.source.collection.id}:${paper.source.relativePath}:${paper.source.version}`}
        outcomeLoad={outcomeLoad}
        paper={displayPaper}
        pdf={pdf}
        pdfSessionKey={`${paper.source.collection.id}:${paper.source.relativePath}`}
        pdfs={pdfs}
        reviewer={reviewContentReviewer}
      />
    </Suspense>
  );
}
