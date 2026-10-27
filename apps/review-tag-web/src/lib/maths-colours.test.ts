import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('review tags mirror the five production maths roles and SVG utilities', async () => {
  const css = await readFile(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  for (const [role, light, dark] of [
    ['maths-working-carry', '#5f646a', '#8e9399'],
    ['maths-working-borrow', '#006aa5', '#55aee8'],
    ['maths-working-step', '#b62877', '#ee76af'],
    ['maths-answer-correct', '#107823', '#53c75d'],
    ['maths-answer-incorrect', '#c5002b', '#ff6367'],
  ] as const) {
    assert.match(css, new RegExp(`--rtq-${role}: ${light}`));
    assert.match(css, new RegExp(`--rtq-${role}: ${dark}`));
    assert.match(css, new RegExp(`--color-${role}: var\\(--rtq-${role}\\)`));
    assert.match(css, new RegExp(`\\.rtq-${role}\\s*\\{`));
  }
  assert.match(
    css,
    /\.rtq-maths-marker-highlight\s*\{\s*--rtq-katex-marker-fill: var\(--line-strong\);/,
  );
  assert.match(
    css,
    /\.rtq-maths-marker-highlight \.colorbox\s*\{[^}]*background-color: var\(--rtq-katex-marker-fill\) !important;/,
  );
  assert.doesNotMatch(
    css,
    /\.rtq-maths-marker-highlight\s*\{[^}]*(?:^|\s)color:/m,
  );
  assert.doesNotMatch(
    css,
    /maths-working-remainder|long-division-working-rule/,
  );
});
