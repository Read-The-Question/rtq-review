import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { SHAPE_PATHS } from '@rtq/review-paper-markdown/paper-shape-paths';

test('shape graphics use isolated SVG patterns and preserve accessible children', async () => {
  const [component, css] = await Promise.all([
    readFile(new URL('./paper-shape.tsx', import.meta.url), 'utf8'),
    readFile(new URL('./paper-shape.css', import.meta.url), 'utf8'),
  ]);

  assert.match(component, /useId\(\)/);
  assert.match(component, /patternUnits="userSpaceOnUse"/);
  assert.match(component, /`url\(#\$\{patternId\}\)`/);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /role="group"/);
  assert.match(component, /\{children\}<\/span>/);
  assert.match(component, /return <span \{\.\.\.props\}>\{children\}<\/span>/);
  assert.match(css, /width: 48px;\s*height: 48px/);
  assert.match(css, /width: 64px;\s*height: 64px/);
  assert.equal(
    component.match(/className="rtq-paper-shape__pattern-stroke"/g)?.length,
    2,
  );
  assert.match(
    css,
    /\.rtq-paper-shape__pattern-stroke\s*\{\s*stroke-opacity:\s*0\.3;/,
  );
  assert.match(
    component,
    /d=\{SHAPE_PATHS\[name\]\}[\s\S]*stroke="currentColor"/,
  );
  assert.deepEqual(Object.keys(SHAPE_PATHS), [
    'square',
    'circle',
    'triangle',
    'hexagon',
  ]);
  assert.match(css, /\.rtq-paper-shape\s*\{[^}]*color:\s*inherit;/s);
  assert.match(css, /\.rtq-paper-shape__content\s*\{[^}]*z-index:\s*1;/s);
  assert.doesNotMatch(
    css,
    /\.rtq-paper-shape(?:__graphic|__content)?\s*\{[^}]*\bopacity:/s,
  );
});
