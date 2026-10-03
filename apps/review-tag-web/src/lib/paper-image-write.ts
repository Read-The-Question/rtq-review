import fs from 'node:fs/promises';

import { getImageTagCatalog } from '@/lib/image-tag-catalog';
import { readPaperDocument } from '@/lib/paper-data';
import {
  applyImageTagMutationToRaw,
  verifyImageTagSourceVersion,
} from '@/lib/paper-image-write-lines';
import { isReadOnlyFolder, resolvePaperFilePath } from '@/lib/paper-paths';
import type { ImageTagMutationPayload } from '@/lib/paper-types';
import { enqueueFileWrite } from '@/lib/paper-write';

export async function persistImageTagMutation(input: ImageTagMutationPayload) {
  if (isReadOnlyFolder(input.folderKey)) {
    throw new Error('This TOML folder is read-only.');
  }
  const absolutePath = resolvePaperFilePath(
    input.folderKey,
    input.relativePath,
  );
  return enqueueFileWrite(absolutePath, async () => {
    const raw = await fs.readFile(absolutePath, 'utf8');
    verifyImageTagSourceVersion(raw, input.versionHash);
    const currentDocument = await readPaperDocument(
      input.folderKey,
      input.relativePath,
    );
    const matchingNodes = currentDocument.nodesFlat.filter(
      node => node.uuid === input.nodeUuid,
    );
    if (matchingNodes.length !== 1) {
      throw new Error(
        matchingNodes.length === 0
          ? `Could not find node UUID ${input.nodeUuid}.`
          : `Node UUID ${input.nodeUuid} is duplicated.`,
      );
    }
    const catalog = await getImageTagCatalog();
    const updatedRaw = applyImageTagMutationToRaw(raw, input, catalog);
    await fs.writeFile(absolutePath, updatedRaw, 'utf8');
    return readPaperDocument(input.folderKey, input.relativePath);
  });
}
