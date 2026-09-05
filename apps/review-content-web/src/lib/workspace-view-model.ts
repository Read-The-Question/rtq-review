import type { ContentWorkspaceStatus } from '@rtq/review-paper-model';

export type WorkspaceStatusCopy = Readonly<{
  detail: string;
  label: string;
  tone: 'ready' | 'warning';
}>;

export function getWorkspaceStatusCopy(
  status: ContentWorkspaceStatus,
): WorkspaceStatusCopy {
  if (status.state === 'ready') {
    return {
      detail: `${status.papersPackage} and ${status.assetsPackage} are available.`,
      label: 'Content checkout connected',
      tone: 'ready',
    };
  }

  return {
    detail: status.message,
    label: 'Content checkout unavailable',
    tone: 'warning',
  };
}
