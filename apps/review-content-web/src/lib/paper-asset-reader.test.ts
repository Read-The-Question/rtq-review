import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { resolveRtqContentPaths } from '@rtq/review-repository-paths';

import { createPaperAssetResponse } from './paper-asset-reader.ts';

test('serves the canonical missing-image asset from the narrow route', async () => {
  const response = await createPaperAssetResponse(
    'papers/missing/missing_image.svg',
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  assert.match(await response.text(), /<svg/);
});

test('rejects traversal and non-paper namespaces before filesystem access', async () => {
  assert.equal((await createPaperAssetResponse('../secret.svg')).status, 400);
  assert.equal(
    (await createPaperAssetResponse('avatars/person.svg')).status,
    404,
  );
});

test('does not expose arbitrary files within a paper asset directory', async () => {
  const response = await createPaperAssetResponse(
    'papers/example/paper-images.generated.json',
  );
  assert.equal(response.status, 415);
});

test('serves a relocated canonical manual question binary without exposing its sidecar', async () => {
  const papersRoot = path.join(resolveRtqContentPaths().assetsRoot, 'papers');
  const files = await fs.readdir(papersRoot, { recursive: true });
  const relativePath = files.find((file) =>
    /\/questions\/manual\/[^/]+\.png$/.test(file.split(path.sep).join('/')),
  );
  assert.ok(
    relativePath,
    'Canonical corpus must contain a manual question PNG',
  );
  const urlPath = `papers/${relativePath.split(path.sep).join('/')}`;
  const response = await createPaperAssetResponse(urlPath);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(
    Buffer.from(await response.arrayBuffer()),
    await fs.readFile(path.join(papersRoot, relativePath)),
  );
  assert.equal(
    (await createPaperAssetResponse(urlPath.replace(/\.png$/, '.json'))).status,
    415,
  );
  assert.equal(
    (await createPaperAssetResponse(urlPath.replace('/manual/', '/'))).status,
    404,
  );
  assert.equal(
    (
      await createPaperAssetResponse(
        'papers/example/questions/generated/example-family/image.svg',
      )
    ).status,
    404,
  );
});

test('serves generated question LongDivision SVGs without exposing their sidecars', async () => {
  const papersRoot = path.join(resolveRtqContentPaths().assetsRoot, 'papers');
  const files = await fs.readdir(papersRoot, { recursive: true });
  const relativePath = files.find((file) =>
    /\/questions\/generated\/long-division\/[^/]+-question\.svg$/.test(
      file.split(path.sep).join('/'),
    ),
  );
  assert.ok(
    relativePath,
    'Canonical corpus must contain a generated question LongDivision SVG',
  );
  const urlPath = `papers/${relativePath.split(path.sep).join('/')}`;
  const response = await createPaperAssetResponse(urlPath);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  assert.match(await response.text(), /data-rtq-long-division-contract="1"/);
  assert.equal(
    (await createPaperAssetResponse(urlPath.replace(/\.svg$/, '.json'))).status,
    415,
  );
});
