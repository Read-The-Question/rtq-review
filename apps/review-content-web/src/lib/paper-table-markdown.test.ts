import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizePaperTableMarkdown } from './paper-table-markdown.ts';

test('turns PaperTable content into ordinary GFM', () => {
  assert.equal(
    normalizePaperTableMarkdown(
      '<PaperTable width="full">\n| A | B |\n| - | - |\n| 1 | 2 |\n</PaperTable>\n',
    ),
    '| A | B |\n| - | - |\n| 1 | 2 |\n',
  );
});

test('leaves wrapper examples inside fences untouched', () => {
  const source = '```md\n<PaperTable>\n</PaperTable>\n```\n';
  assert.equal(normalizePaperTableMarkdown(source), source);
});

test('rejects malformed active wrappers', () => {
  assert.throws(
    () => normalizePaperTableMarkdown('</PaperTable>\n'),
    /no opening tag/,
  );
});
