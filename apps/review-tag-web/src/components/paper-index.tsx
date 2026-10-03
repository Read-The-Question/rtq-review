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

function TagReviewNavigation() {
  return (
    <PaperBrowserSecondaryNavigation label="Search">
      <PaperBrowserSecondaryLink action="Open" href="/search">
        All questions
      </PaperBrowserSecondaryLink>
    </PaperBrowserSecondaryNavigation>
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
      appLabel="Review tags"
      connectionDetail={detail}
      connectionLabel={workspace.status.label}
      connectionTone={workspace.status.tone}
      eyebrow="Review tags"
      heading="Choose a paper"
      status={<span>Direct source · UUID-backed TOML editing</span>}
      summary="Browse the live RTQ content checkout, then review question or image tags on a selected paper.">
      {workspace.model.activeCollectionId ? (
        <PaperBrowser
          initialContentPattern={initialContentPattern}
          initialContentScope={initialContentScope}
          initialQuery={initialQuery}
          key={`${workspace.model.activeCollectionId}:${initialQuery ?? ''}:${initialContentPattern ?? ''}:${initialContentScope ?? ''}`}
          model={workspace.model}
          routes={routes}
          secondaryNavigation={<TagReviewNavigation />}
        />
      ) : (
        <PaperBrowserUnavailable detail={detail} />
      )}
    </PaperBrowserFrame>
  );
}
