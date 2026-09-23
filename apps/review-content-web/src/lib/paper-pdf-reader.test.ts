import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { paperCollectionForId } from '@rtq/review-paper-model';
import { resolveRtqContentPaths } from '@rtq/review-repository-paths';

import { createPaperPdfResponse, resolvePaperPdf } from './paper-pdf-reader.ts';

async function activePaperStem(): Promise<string> {
  const { papersPackageRoot } = resolveRtqContentPaths();
  const files = await fs.readdir(
    path.join(papersPackageRoot, 'original-papers', 'pdf-rtq'),
  );
  const fileName = files.find((file) => file.endsWith('.pdf'));
  assert.ok(fileName, 'Expected at least one active canonical PDF.');
  return fileName.slice(0, -'.pdf'.length);
}

test('only complete-paper collections expose an original PDF', async () => {
  const stem = await activePaperStem();
  const source = {
    collection: paperCollectionForId('toml'),
    fileName: `${stem}.toml`,
  };

  assert.deepEqual(
    await resolvePaperPdf({
      ...source,
      focusGroups: [],
      provenance: { kind: 'canonical', sourcePaperStems: [stem] },
      questionCount: 1,
      relativePath: `${stem}.toml`,
      title: stem,
      version: 'test',
    }),
    {
      fileName: `${stem}.pdf`,
      state: 'available',
      url: `/api/papers/pdf/${stem}`,
    },
  );

  assert.equal(
    await resolvePaperPdf({
      ...source,
      collection: paperCollectionForId('topicToml'),
      focusGroups: [],
      provenance: { kind: 'derived', sourcePaperStems: [stem] },
      questionCount: 1,
      relativePath: `${stem}.toml`,
      title: stem,
      version: 'test',
    }),
    undefined,
  );
});

test('serves canonical PDFs inline with byte-range and HEAD support', async () => {
  const stem = await activePaperStem();
  const partial = await createPaperPdfResponse(
    new Request('http://localhost/pdf', {
      headers: { Range: 'bytes=0-3' },
    }),
    stem,
  );
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get('content-type'), 'application/pdf');
  assert.equal(partial.headers.get('accept-ranges'), 'bytes');
  assert.equal(partial.headers.get('content-length'), '4');
  assert.match(partial.headers.get('content-range') ?? '', /^bytes 0-3\/\d+$/);
  assert.equal(await partial.text(), '%PDF');

  const head = await createPaperPdfResponse(
    new Request('http://localhost/pdf', { method: 'HEAD' }),
    stem,
  );
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  assert.ok(Number(head.headers.get('content-length')) > 4);
});

test('rejects unsafe names and unsatisfiable ranges', async () => {
  assert.equal(
    (
      await createPaperPdfResponse(
        new Request('http://localhost/pdf'),
        '../paper',
      )
    ).status,
    400,
  );

  const stem = await activePaperStem();
  const response = await createPaperPdfResponse(
    new Request('http://localhost/pdf', {
      headers: { Range: 'bytes=999999999999-' },
    }),
    stem,
  );
  assert.equal(response.status, 416);
  assert.match(response.headers.get('content-range') ?? '', /^bytes \*\/\d+$/);
});
