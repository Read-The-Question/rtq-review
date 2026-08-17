import assert from 'node:assert/strict';

import test from 'node:test';

import { normalizePaperTableMarkdown } from './paper-table-markdown.ts';

test('removes a PaperTable wrapper without changing its GFM body', () => {
  const table = '| Item | Value |\n| --- | ---: |\n| One | 1 |\n';

  assert.equal(
    normalizePaperTableMarkdown(`<PaperTable>\n${table}</PaperTable>\n`),
    table,
  );
});

test('ignores configured and unknown PaperTable attributes', () => {
  const table = '| Item | Value |\n| :--- | ---: |\n| $x$ | a wide value |\n';

  assert.equal(
    normalizePaperTableMarkdown(
      `<PaperTable density="compact" grid="rows" cellAlign="center" width="wide" indent="1" future="value">\n${table}</PaperTable>`,
    ),
    table,
  );
});

test('leaves unwrapped content and line endings unchanged', () => {
  const markdown = 'Before\r\n\r\n| A | B |\r\n| --- | --- |\r\n| 1 | 2 |\r\n';

  assert.equal(normalizePaperTableMarkdown(markdown), markdown);
});

test('normalizes the active MDX table separator to a hidden HTML comment', () => {
  assert.equal(
    normalizePaperTableMarkdown(
      '{/* RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable */}\n',
    ),
    '<!-- RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable -->\n',
  );
});

test('preserves PaperTable-like markup and separators inside fenced examples', () => {
  const markdown = [
    '```md',
    '<PaperTable density="compact">',
    '| A | B |',
    '| --- | --- |',
    '| 1 | 2 |',
    '</PaperTable>',
    '{/* RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable */}',
    '```',
    '',
    '~~~md',
    '<PaperTable>',
    '</PaperTable>',
    '~~~',
  ].join('\n');

  assert.equal(normalizePaperTableMarkdown(markdown), markdown);
});

test('does not end a fence at a marker indented as code', () => {
  const markdown = [
    '```md',
    '    ```',
    '<PaperTable>',
    '</PaperTable>',
    '```',
  ].join('\n');

  assert.equal(normalizePaperTableMarkdown(markdown), markdown);
});

test('rejects malformed, nested, and unbalanced active wrappers', () => {
  assert.throws(
    () => normalizePaperTableMarkdown('<PaperTable>\n<PaperTable>\n'),
    /Nested PaperTable/,
  );
  assert.throws(
    () => normalizePaperTableMarkdown('</PaperTable>\n'),
    /no matching opening tag/,
  );
  assert.throws(
    () => normalizePaperTableMarkdown('<PaperTable>\n| A |\n'),
    /no matching closing tag/,
  );
  assert.throws(
    () => normalizePaperTableMarkdown('<PaperTable density="compact"\n'),
    /Malformed PaperTable wrapper/,
  );
});
