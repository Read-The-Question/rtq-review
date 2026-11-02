import { readFile } from 'node:fs/promises';

import {
  isEditablePaperCollectionId,
  PaperTagSourceError,
  readPaperNodeTagSource,
  readQuestionTagCatalog,
  readReviewPaper,
  replacePaperNodeTags,
  resolvePaperSourcePath,
  validateExplicitQuestionTags,
  type PaperCollectionId,
  type ReviewNodeTagState,
  type ReviewPaperNode,
} from '@rtq/review-paper-model';
import type { ResolveRtqContentOptions } from '@rtq/review-repository-paths';

import {
  atomicWritePaperSource,
  paperSourceVersion,
  withPaperSourceWriteQueue,
} from './paper-source-writer.ts';

export type PaperTagEditTarget = Readonly<{
  collectionId: PaperCollectionId;
  nodeUuid: string;
  relativePath: string;
}>;

export type PaperTagMutationResult = Readonly<{
  nodes: readonly ReviewNodeTagState[];
  version: string;
}>;

export class PaperTagEditorError extends Error {
  readonly status: 400 | 403 | 404 | 409 | 422;

  constructor(
    message: string,
    status: 400 | 403 | 404 | 409 | 422,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'PaperTagEditorError';
    this.status = status;
  }
}

function flattenNodeTagStates(
  nodes: readonly ReviewPaperNode[],
): ReviewNodeTagState[] {
  return nodes.flatMap((node) => [
    ...(node.uuid
      ? [
          {
            effectiveTags: node.effectiveTags,
            explicitInherit: node.explicitInherit,
            explicitTags: node.explicitTags,
            inheritedTags: node.inheritedTags,
            nodeUuid: node.uuid,
          },
        ]
      : []),
    ...flattenNodeTagStates(node.children),
  ]);
}

function mapTagSourceError(error: unknown): never {
  if (error instanceof PaperTagSourceError) {
    throw new PaperTagEditorError(
      error.message,
      error.code === 'node-not-found' ? 404 : 422,
      { cause: error },
    );
  }
  throw error;
}

export async function savePaperNodeTags(
  input: Readonly<{
    expectedVersion: string;
    explicitInherit: boolean | null;
    explicitTags: readonly string[];
    target: PaperTagEditTarget;
  }>,
  options: ResolveRtqContentOptions = {},
): Promise<PaperTagMutationResult> {
  if (!isEditablePaperCollectionId(input.target.collectionId)) {
    throw new PaperTagEditorError(
      'This paper collection is read-only for tag editing.',
      403,
    );
  }

  let sourcePath: string;
  try {
    sourcePath = resolvePaperSourcePath(
      input.target.collectionId,
      input.target.relativePath,
      options,
    );
  } catch (error) {
    throw new PaperTagEditorError(
      'The displayed paper source is unavailable.',
      404,
      {
        cause: error,
      },
    );
  }

  return withPaperSourceWriteQueue(sourcePath, async () => {
    const raw = await readFile(sourcePath, 'utf8');
    if (paperSourceVersion(raw) !== input.expectedVersion) {
      throw new PaperTagEditorError(
        'The displayed TOML changed before this tag edit was saved. Refresh the paper and try again.',
        409,
      );
    }

    let current;
    try {
      current = readPaperNodeTagSource(raw, input.target.nodeUuid);
    } catch (error) {
      mapTagSourceError(error);
    }
    const catalog = await readQuestionTagCatalog(options);
    let explicitTags: readonly string[];
    try {
      explicitTags = validateExplicitQuestionTags(
        input.explicitTags,
        current.explicitTags,
        catalog,
      );
    } catch (error) {
      throw new PaperTagEditorError(
        error instanceof Error
          ? error.message
          : 'The selected tags are invalid.',
        422,
        { cause: error },
      );
    }

    let updated: string;
    try {
      updated = replacePaperNodeTags(raw, {
        explicitInherit: input.explicitInherit,
        explicitTags,
        nodeUuid: input.target.nodeUuid,
      });
    } catch (error) {
      mapTagSourceError(error);
    }
    await atomicWritePaperSource(sourcePath, updated);
    const paper = await readReviewPaper(
      input.target.collectionId,
      input.target.relativePath,
      options,
    );
    return {
      nodes: paper.sections.flatMap((section) =>
        flattenNodeTagStates(section.questions),
      ),
      version: paper.source.version,
    };
  });
}
