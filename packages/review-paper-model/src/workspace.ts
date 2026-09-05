import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import type { ContentWorkspaceStatus } from './model.ts';

export function getContentWorkspaceStatus(
  options: ResolveRtqContentOptions = {},
): ContentWorkspaceStatus {
  try {
    resolveRtqContentPaths(options);

    return {
      assetsPackage: '@rtq/maths-assets',
      papersPackage: '@rtq/papers',
      source: 'rtq-content',
      state: 'ready',
    };
  } catch {
    return {
      message:
        'The RTQ content checkout is unavailable. Set RTQ_CONTENT_ROOT to a complete checkout and refresh.',
      source: 'rtq-content',
      state: 'unavailable',
    };
  }
}
