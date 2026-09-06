import assert from 'node:assert/strict';
import test from 'node:test';

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
