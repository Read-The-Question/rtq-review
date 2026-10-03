import {
  getContentWorkspaceStatus,
  isPaperCollectionId,
  listPaperCollections,
  listPaperSources,
  normalizeContentSearchScope,
  PaperContentSearchError,
  searchPaperCollectionContent,
} from '@rtq/review-paper-model';

import { buildPaperBrowserModel, type PaperBrowserModel } from './model.ts';

export type PaperBrowserWorkspace = Readonly<{
  issue?: string;
  model: PaperBrowserModel;
  status: Readonly<{
    detail: string;
    label: string;
    tone: 'ready' | 'warning';
  }>;
}>;

export async function loadPaperBrowserWorkspace(
  requestedCollectionId?: string,
): Promise<PaperBrowserWorkspace> {
  const workspaceStatus = getContentWorkspaceStatus();
  if (workspaceStatus.state !== 'ready') {
    return {
      model: buildPaperBrowserModel([], [], requestedCollectionId),
      status: {
        detail: workspaceStatus.message,
        label: 'Content checkout unavailable',
        tone: 'warning',
      },
    };
  }

  try {
    const [collections, sources] = await Promise.all([
      listPaperCollections(),
      listPaperSources(),
    ]);
    return {
      model: buildPaperBrowserModel(
        collections,
        sources,
        requestedCollectionId,
      ),
      status: {
        detail: `${workspaceStatus.papersPackage} and ${workspaceStatus.assetsPackage} are available.`,
        label: 'Content checkout connected',
        tone: 'ready',
      },
    };
  } catch (error) {
    const issue =
      error instanceof Error
        ? error.message
        : 'The paper index could not load.';
    return {
      issue,
      model: buildPaperBrowserModel([], [], requestedCollectionId),
      status: {
        detail: issue,
        label: 'Content checkout unavailable',
        tone: 'warning',
      },
    };
  }
}

const responseHeaders = { 'Cache-Control': 'no-store' } as const;

export async function createPaperContentSearchResponse(
  request: Request,
): Promise<Response> {
  const parameters = new URL(request.url).searchParams;
  const collection = parameters.get('collection') ?? '';
  const pattern = parameters.get('content')?.trim() ?? '';
  const scope = normalizeContentSearchScope(parameters.get('content-scope'));

  if (!isPaperCollectionId(collection)) {
    return Response.json(
      { message: 'The selected paper collection is not reviewable.' },
      { headers: responseHeaders, status: 400 },
    );
  }
  if (!pattern) {
    return Response.json(
      { message: 'Enter a regular expression to search.' },
      { headers: responseHeaders, status: 400 },
    );
  }

  try {
    return Response.json(
      await searchPaperCollectionContent(collection, { pattern, scope }),
      { headers: responseHeaders },
    );
  } catch (error) {
    const invalid = error instanceof PaperContentSearchError;
    return Response.json(
      {
        message: invalid
          ? error.message
          : 'The raw paper content could not be searched.',
      },
      { headers: responseHeaders, status: invalid ? 400 : 500 },
    );
  }
}
