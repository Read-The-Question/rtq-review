'use server';

import {
  isPaperCollectionId,
  readQuestionTagCatalog,
  type PaperCollectionId,
  type QuestionTagCatalog,
  type ReviewNodeTagState,
} from '@rtq/review-paper-model';

import { PaperTagEditorError, savePaperNodeTags } from '@/lib/paper-tag-editor';

export type QuestionTagCatalogActionResult =
  | Readonly<{ catalog: QuestionTagCatalog; ok: true }>
  | Readonly<{ message: string; ok: false }>;

export type QuestionTagMutationActionResult =
  | Readonly<{
      nodes: readonly ReviewNodeTagState[];
      ok: true;
      version: string;
    }>
  | Readonly<{ message: string; ok: false; status?: number }>;

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export async function loadQuestionTagCatalogAction(): Promise<QuestionTagCatalogActionResult> {
  try {
    return { catalog: await readQuestionTagCatalog(), ok: true };
  } catch {
    return {
      message: 'The question-tag vocabulary could not be loaded.',
      ok: false,
    };
  }
}

export async function updateQuestionTagsAction(
  value: unknown,
): Promise<QuestionTagMutationActionResult> {
  const input = record(value);
  const target = record(input?.target);
  const collectionId = target?.collectionId;
  const relativePath =
    typeof target?.relativePath === 'string' ? target.relativePath.trim() : '';
  const nodeUuid =
    typeof target?.nodeUuid === 'string' ? target.nodeUuid.trim() : '';
  const expectedVersion = input?.expectedVersion;
  const explicitInherit = input?.explicitInherit;
  const explicitTags = input?.explicitTags;
  if (
    typeof collectionId !== 'string' ||
    !isPaperCollectionId(collectionId) ||
    !relativePath ||
    !nodeUuid ||
    typeof expectedVersion !== 'string' ||
    !expectedVersion ||
    (explicitInherit !== null && typeof explicitInherit !== 'boolean') ||
    !Array.isArray(explicitTags) ||
    explicitTags.length > 100 ||
    explicitTags.some((tag) => typeof tag !== 'string')
  ) {
    return { message: 'The question-tag edit request is invalid.', ok: false };
  }

  try {
    const result = await savePaperNodeTags({
      expectedVersion,
      explicitInherit,
      explicitTags: explicitTags as string[],
      target: {
        collectionId: collectionId as PaperCollectionId,
        nodeUuid,
        relativePath,
      },
    });
    return { ...result, ok: true };
  } catch (error) {
    if (error instanceof PaperTagEditorError) {
      return { message: error.message, ok: false, status: error.status };
    }
    return {
      message: 'The displayed TOML could not be updated with these tags.',
      ok: false,
    };
  }
}
