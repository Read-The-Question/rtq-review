import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('question viewer mirrors the five production light-theme maths roles', async () => {
  const css = await readFile(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  for (const [role, value] of [
    ['maths-working-carry', '#5f646a'],
    ['maths-working-borrow', '#006aa5'],
    ['maths-working-step', '#b62877'],
    ['maths-answer-correct', '#107823'],
    ['maths-answer-incorrect', '#c5002b'],
  ] as const) {
    assert.match(css, new RegExp(`--rtq-${role}: ${value}`));
    assert.match(css, new RegExp(`--color-${role}: var\\(--rtq-${role}\\)`));
    assert.match(css, new RegExp(`\\.rtq-${role}\\s*\\{`));
  }
  assert.doesNotMatch(
    css,
    /maths-working-remainder|long-division-working-rule/,
  );
});
