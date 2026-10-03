import { PaperBrowser } from '@rtq/review-paper-browser/browser';
import {
  PaperBrowserFrame,
  PaperBrowserSecondaryLink,
  PaperBrowserSecondaryNavigation,
  PaperBrowserUnavailable,
} from '@rtq/review-paper-browser/frame';
import type { PaperBrowserRouteContract } from '@rtq/review-paper-browser/model';
import { loadPaperBrowserWorkspace } from '@rtq/review-paper-browser/server';

const routes: PaperBrowserRouteContract = {
  collectionBasePath: '/papers',
  contentSearchPath: '/api/papers/content-search',
};

function ContentReviewNavigation() {
  return (
    <>
      <PaperBrowserSecondaryNavigation label="Search">
        <PaperBrowserSecondaryLink action="Open" href="/search">
          All questions
        </PaperBrowserSecondaryLink>
      </PaperBrowserSecondaryNavigation>
      <PaperBrowserSecondaryNavigation label="Reviews">
        <PaperBrowserSecondaryLink action="Open" href="/reviews/global">
          Global findings
        </PaperBrowserSecondaryLink>
        <PaperBrowserSecondaryLink
          action="View"
          href="/reviews/change-requests"
        >
          Change requests
        </PaperBrowserSecondaryLink>
      </PaperBrowserSecondaryNavigation>
      <PaperBrowserSecondaryNavigation label="Reference">
        <PaperBrowserSecondaryLink action="1 file" href="/macros">
          Macros
        </PaperBrowserSecondaryLink>
      </PaperBrowserSecondaryNavigation>
    </>
  );
}

export async function PaperIndex({
  initialCollectionId,
  initialContentPattern,
  initialContentScope,
  initialQuery,
}: {
  initialCollectionId?: string;
  initialContentPattern?: string;
  initialContentScope?: string;
  initialQuery?: string;
}) {
  const workspace = await loadPaperBrowserWorkspace(initialCollectionId);
  const detail = workspace.issue ?? workspace.status.detail;

  return (
    <PaperBrowserFrame
      appLabel="Review content"
      connectionDetail={detail}
      connectionLabel={workspace.status.label}
      connectionTone={workspace.status.tone}
      eyebrow="Review content"
      heading="Choose a paper"
      status={
        <>
          <span>Direct source · read only</span>
          <span aria-hidden="true">·</span>
          <span>Outcomes &amp; comments → local SQLite</span>
        </>
      }
      summary="Browse the live RTQ content checkout and open a paper for review."
    >
      {workspace.model.activeCollectionId ? (
        <PaperBrowser
          initialContentPattern={initialContentPattern}
          initialContentScope={initialContentScope}
          initialQuery={initialQuery}
          key={`${workspace.model.activeCollectionId}:${initialQuery ?? ''}:${initialContentPattern ?? ''}:${initialContentScope ?? ''}`}
          model={workspace.model}
          routes={routes}
          secondaryNavigation={<ContentReviewNavigation />}
        />
      ) : (
        <PaperBrowserUnavailable detail={detail} />
      )}
    </PaperBrowserFrame>
  );
}
