'use server';

import {
  readPaperDocument,
  readPaperDocumentVersionHash,
} from '@/lib/paper-data';
import type { FolderKey, NodeMutationPayload } from '@/lib/paper-types';
import { persistNodeMutation } from '@/lib/paper-write';

export async function updateNodeAction(payload: NodeMutationPayload) {
  return persistNodeMutation(payload);
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
