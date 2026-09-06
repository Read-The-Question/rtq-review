import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const componentUrl = new URL(
  '../components/review-surface.tsx',
  import.meta.url,
);
const cssUrl = new URL('../app/globals.css', import.meta.url);
const homeUrl = new URL('../app/page.tsx', import.meta.url);

test('display preferences use accessible switches and independent review sides', async () => {
  const component = await fs.readFile(componentUrl, 'utf8');

  assert.match(component, /role="switch"/);
  assert.match(component, /label="Question review"/);
  assert.match(component, /label="Answer review"/);
  assert.match(component, /label="Show previous feedback"/);
  assert.doesNotMatch(component, /label="Review panel"/);
  assert.doesNotMatch(component, /label="Show everything"/);
});

test('feedback follows the stable composer in a full-width review flow', async () => {
  const [component, css] = await Promise.all([
    fs.readFile(componentUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);
  const composerPosition = component.indexOf('className="comment-form"');
  const feedbackPosition = component.indexOf('className={`feedback-region');

  assert.ok(composerPosition >= 0, 'comment composer should render');
  assert.ok(
    feedbackPosition > composerPosition,
    'growing feedback should render after the stable composer',
  );
  assert.match(
    css,
    /\.review-scopes\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s,
  );
  assert.match(
    css,
    /\.feedback-region--populated\s*{[^}]*border:\s*2px solid var\(--signal\)/s,
  );
});

test('review surfaces stay light and reviewer-facing rem sizes stay readable', async () => {
  const css = await fs.readFile(cssUrl, 'utf8');
  const remSizes = [...css.matchAll(/font-size:\s*(0\.\d+)rem/g)].map((match) =>
    Number(match[1]),
  );

  assert.doesNotMatch(css, /#1d2822/i);
  assert.doesNotMatch(css, /repeating-linear-gradient/);
  assert.match(
    css,
    /\.raw-source pre\s*{[^}]*background:\s*var\(--paper-deep\)/s,
  );
  assert.ok(
    remSizes.every((size) => size >= 0.875),
    `found a reviewer-facing rem size below 0.875rem: ${Math.min(...remSizes)}`,
  );
});

test('the landing page uses a compact paper-first introduction', async () => {
  const [home, css] = await Promise.all([
    fs.readFile(homeUrl, 'utf8'),
    fs.readFile(cssUrl, 'utf8'),
  ]);

  assert.match(home, /<h1>Choose a paper<\/h1>/);
  assert.doesNotMatch(home, /Change the lens/);
  assert.match(css, /\.index-intro\s*{[^}]*padding:\s*1\.5rem 0/s);
  assert.match(
    css,
    /\.collection-rail\s*{[^}]*background:\s*var\(--paper-deep\)/s,
  );
});
