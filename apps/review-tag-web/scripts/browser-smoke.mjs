import assert from 'node:assert/strict';

const baseUrl = process.env.REVIEW_TAG_BASE_URL ?? 'http://127.0.0.1:3002';
const stem = 'bancrofts-school--11-plus--maths--2018--paper-1';
const collectionPath = '/papers/focusPaperToml';
const paperPath = `${collectionPath}/${stem}.toml`;

async function read(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return { response, text: await response.text() };
}

const home = await read('/');
assert.match(home.text, /Choose a paper/);
assert.match(home.text, /Live TOML index/);
assert.match(home.text, /Search questions in this collection/);

const restored = await read(
  `${collectionPath}?q=bancrofts&content=PaperImage&content-scope=working`,
);
assert.match(restored.text, /value="bancrofts"/);
assert.match(restored.text, /value="PaperImage"/);
assert.match(restored.text, /value="working" selected/);

const contentSearch = await fetch(
  `${baseUrl}/api/papers/content-search?collection=focusPaperToml&content=PaperImage&content-scope=all`,
);
assert.equal(contentSearch.status, 200);
assert.equal(contentSearch.headers.get('cache-control'), 'no-store');
const contentPayload = await contentSearch.json();
assert.ok(contentPayload.scannedFileCount > 0);
assert.ok(Array.isArray(contentPayload.matches));

const paper = await read(paperPath);
assert.match(paper.text, /Question tags/);
assert.match(paper.text, /Image tags/);
assert.match(paper.text, /Show original PDF/);
assert.match(paper.text, /class="paper-outline/);
assert.match(paper.text, /aria-current="location"/);

const legacy = await fetch(
  `${baseUrl}/files/focusPaperToml/${stem}?q=bancrofts`,
  { redirect: 'manual' },
);
assert.equal(legacy.status, 308);
assert.equal(legacy.headers.get('location'), `${paperPath}?q=bancrofts`);

console.log(`Review Tag Web browser smoke passed at ${baseUrl}.`);
