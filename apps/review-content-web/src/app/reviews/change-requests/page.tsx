import Link from 'next/link';

import { ChangeRequestInbox } from '@/components/change-request-inbox';
import { SiteHeader } from '@/components/site-header';
import { loadReviewWorkGroups } from '@/lib/review-work';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ChangeRequestsPage() {
  const groups = await loadReviewWorkGroups();

  return (
    <main className="paper-shell review-work-shell">
      <SiteHeader compact />
      <header className="review-work-hero">
        <div className="paper-breadcrumb">
          <Link href="/">Paper index</Link>
          <span>/</span>
          <span>Reviews</span>
          <span>/</span>
          <span>Change requests</span>
        </div>
        <div>
          <p className="eyebrow">Review operations</p>
          <h1>Change requests & comments</h1>
          <p>
            All actionable PRCR outcomes and review comments, grouped around the
            question UUID they belong to.
          </p>
        </div>
        <nav className="review-work-switcher" aria-label="Review work views">
          <Link href="/reviews/global">Global findings</Link>
          <Link aria-current="page" href="/reviews/change-requests">
            Change requests
          </Link>
        </nav>
      </header>
      <ChangeRequestInbox groups={groups} />
    </main>
  );
}
