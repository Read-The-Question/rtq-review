import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const sourceRoot = new URL('.', import.meta.url);

test('the shared paper outline owns hierarchy, current-node visibility, and status badges', async () => {
  const [component, css, manifest] = await Promise.all([
    fs.readFile(new URL('paper-outline.tsx', sourceRoot), 'utf8'),
    fs.readFile(new URL('paper-outline.css', sourceRoot), 'utf8'),
    fs.readFile(new URL('../package.json', sourceRoot), 'utf8'),
  ]);

  assert.match(component, /function OutlineNode/);
  assert.match(component, /node\.children\.map/);
  assert.match(component, /aria-current=\{current \? 'location' : undefined\}/);
  assert.match(component, /querySelector<HTMLElement>/);
  assert.match(component, /outline\.scrollTo/);
  assert.doesNotMatch(component, /scrollIntoView/);
  assert.match(component, /node\.badges\.map/);
  assert.match(css, /\.paper-outline\s*{[^}]*position:\s*sticky/s);
  assert.match(css, /overscroll-behavior:\s*contain/);
  // Containment is only safe if the outline never extends below the viewport,
  // so its height must follow its live position, not just the sticky offset.
  assert.match(css, /max-height:\s*var\(\s*--paper-outline-available-height/);
  assert.match(component, /--paper-outline-available-height/);
  assert.match(component, /window\.innerHeight - top/);
  assert.match(css, /\.paper-outline__badge\[data-tone='table'\]/);
  assert.match(css, /\.paper-outline__badges\s*{[^}]*flex-wrap:\s*wrap/s);
  assert.match(manifest, /"\.\/paper-outline"/);
  assert.match(manifest, /"\.\/paper-outline\.css"/);
});
