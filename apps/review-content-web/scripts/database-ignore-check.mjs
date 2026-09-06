import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const reviewRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const configured = process.env.RTQ_CONTENT_ROOT?.trim();
const contentRoot = configured
  ? path.resolve(reviewRoot, configured)
  : path.resolve(reviewRoot, '../rtq-content');
const runtimeFiles = [
  'database/review-content.sqlite',
  'database/review-content.sqlite-journal',
  'database/review-content.sqlite-wal',
  'database/review-content.sqlite-shm',
];

const ignored = execFileSync(
  'git',
  ['-C', contentRoot, 'check-ignore', ...runtimeFiles],
  { encoding: 'utf8' },
)
  .trim()
  .split('\n');
assert.deepEqual(ignored, runtimeFiles);

const tracked = execFileSync(
  'git',
  ['-C', contentRoot, 'ls-files', '--', 'database/review-content.sqlite*'],
  { encoding: 'utf8' },
).trim();
assert.equal(tracked, '');

console.log('Review Content SQLite runtime files are ignored and untracked.');
