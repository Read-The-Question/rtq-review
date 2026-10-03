import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  PaperPdfRequestError,
  createPaperPdfResponse,
  resolveCanonicalPaperPdf,
  resolvePaperPdf,
} from './paper-pdf-reader.ts';

async function withPdfRoot(
  run: (fixture: { outside: string; root: string }) => Promise<void>,
) {
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'rtq-tag-pdf-'));
  const root = path.join(fixtureRoot, 'pdf-rtq');
  const outside = path.join(fixtureRoot, 'outside.pdf');
  await fs.mkdir(root);
  await fs.writeFile(path.join(root, 'paper.pdf'), '%PDF-fixture');
  await fs.writeFile(outside, '%PDF-outside');
  try {
    await run({ outside, root });
  } finally {
    await fs.rm(fixtureRoot, { force: true, recursive: true });
  }
}

test('offers PDFs only for full canonical and focus-paper collections', async () => {
  await withPdfRoot(async ({ root }) => {
    assert.deepEqual(
      await resolvePaperPdf('toml', 'paper.toml', { pdfRoot: root }),
      {
        fileName: 'paper.pdf',
        state: 'available',
        url: '/api/papers/pdf/paper',
      },
    );
    assert.deepEqual(
      await resolvePaperPdf('focusPaperToml', 'missing.toml', {
        pdfRoot: root,
      }),
      { fileName: 'missing.pdf', state: 'unavailable' },
    );
    assert.equal(
      await resolvePaperPdf('corpusPrimaryTopicToml', 'paper.toml', {
        pdfRoot: root,
      }),
      undefined,
    );
  });
});

test('serves PDFs inline with GET, HEAD, and byte-range support', async () => {
  await withPdfRoot(async ({ root }) => {
    const partial = await createPaperPdfResponse(
      new Request('http://localhost/pdf', {
        headers: { Range: 'bytes=0-3' },
      }),
      'paper',
      { pdfRoot: root },
    );
    assert.equal(partial.status, 206);
    assert.equal(partial.headers.get('content-type'), 'application/pdf');
    assert.equal(partial.headers.get('accept-ranges'), 'bytes');
    assert.equal(partial.headers.get('content-length'), '4');
    assert.match(
      partial.headers.get('content-range') ?? '',
      /^bytes 0-3\/\d+$/,
    );
    assert.equal(await partial.text(), '%PDF');

    const head = await createPaperPdfResponse(
      new Request('http://localhost/pdf', { method: 'HEAD' }),
      'paper',
      { pdfRoot: root },
    );
    assert.equal(head.status, 200);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
  });
});

test('rejects unsafe names, escaping symlinks, and invalid ranges', async () => {
  await withPdfRoot(async ({ outside, root }) => {
    assert.equal(
      (
        await createPaperPdfResponse(
          new Request('http://localhost/pdf'),
          '../paper',
          { pdfRoot: root },
        )
      ).status,
      400,
    );

    const invalidRange = await createPaperPdfResponse(
      new Request('http://localhost/pdf', {
        headers: { Range: 'bytes=999999-' },
      }),
      'paper',
      { pdfRoot: root },
    );
    assert.equal(invalidRange.status, 416);
    assert.match(
      invalidRange.headers.get('content-range') ?? '',
      /^bytes \*\/\d+$/,
    );

    await fs.symlink(outside, path.join(root, 'escape.pdf'));
    await assert.rejects(
      resolveCanonicalPaperPdf('escape', { pdfRoot: root }),
      (error: unknown) =>
        error instanceof PaperPdfRequestError && error.status === 403,
    );
  });
});
