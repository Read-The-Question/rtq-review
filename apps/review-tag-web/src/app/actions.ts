'use server';

import {
  readPaperDocument,
  readPaperDocumentVersionHash,
} from '@/lib/paper-data';
import { persistImageTagMutation } from '@/lib/paper-image-write';
import type {
  FolderKey,
  ImageTagMutationPayload,
  NodeMutationPayload,
} from '@/lib/paper-types';
import { persistNodeMutation } from '@/lib/paper-write';

export async function updateNodeAction(payload: NodeMutationPayload) {
  return persistNodeMutation(payload);
}

export async function updateImageTagAction(payload: ImageTagMutationPayload) {
  return persistImageTagMutation(payload);
}

export async function refreshPaperDocumentAction(payload: {
  folderKey: FolderKey;
  relativePath: string;
  versionHash: string;
}) {
  const versionHash = await readPaperDocumentVersionHash(
    payload.folderKey,
    payload.relativePath,
  );

  if (versionHash === payload.versionHash) {
    return { changed: false, versionHash } as const;
  }

  return {
    changed: true,
    document: await readPaperDocument(payload.folderKey, payload.relativePath),
  } as const;
}
