import Link from 'next/link';

import { GlobalFindingsInbox } from '@/components/global-findings-inbox';
import { SiteHeader } from '@/components/site-header';
import { reviewContentReviewer } from '@/lib/review-api-config';
import { listGlobalReviewFindings } from '@/lib/global-review-findings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function GlobalFindingsPage() {
  const findings = listGlobalReviewFindings();

  return (
    <main className="paper-shell review-work-shell">
      <SiteHeader compact />
      <header className="review-work-hero">
        <div className="paper-breadcrumb">
          <Link href="/">Paper index</Link>
          <span>/</span>
          <span>Reviews</span>
          <span>/</span>
          <span>Global findings</span>
        </div>
        <div>
          <p className="eyebrow">Review operations</p>
          <h1>Global findings</h1>
          <p>
            Product-wide work captured during paper review. Mark an item
            processed once it has moved into the delivery workflow.
          </p>
        </div>
        <nav className="review-work-switcher" aria-label="Review work views">
          <Link aria-current="page" href="/reviews/global">
            Global findings
          </Link>
          <Link href="/reviews/change-requests">Change requests</Link>
        </nav>
      </header>
      <GlobalFindingsInbox
        initialFindings={findings}
        reviewer={reviewContentReviewer}
      />
    </main>
  );
}
