import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { readReviewMacros } from './macros.ts';

function createContentWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), 'rtq-review-macros-'));
  const papersPackageRoot = join(root, 'packages', 'papers');
  const assetsPackageRoot = join(root, 'packages', 'assets');

  mkdirSync(join(papersPackageRoot, 'papers', 'toml'), { recursive: true });
  mkdirSync(join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model'), {
    recursive: true,
  });
  mkdirSync(join(assetsPackageRoot, 'assets'), { recursive: true });
  writeFileSync(
    join(root, 'package.json'),
    '{"name":"@rtq/content-workspace"}',
  );
  writeFileSync(join(root, 'pnpm-workspace.yaml'), 'packages: []\n');
  writeFileSync(
    join(papersPackageRoot, 'package.json'),
    '{"name":"@rtq/papers"}',
  );
  writeFileSync(
    join(assetsPackageRoot, 'package.json'),
    '{"name":"@rtq/maths-assets"}',
  );
  writeFileSync(
    join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model', 'macros.toml'),
    String.raw`# Macro review fixture
rtq_abbr_note_example = '''Use $x$.'''
rtq_abbr_formula_example = '''rtq_abbr_note_example Then $y$.'''
"\\euro" = '''\\text{€}'''
`,
  );

  return root;
}

test('reads macros in file order and prepares their nested expansions', async () => {
  const root = createContentWorkspace();

  try {
    const document = await readReviewMacros({
      environment: { RTQ_CONTENT_ROOT: root },
    });

    assert.equal(document.fileName, 'macros.toml');
    assert.match(document.rawSource, /# Macro review fixture/);
    assert.deepEqual(
      document.entries.map((entry) => [entry.name, entry.kind]),
      [
        ['rtq_abbr_note_example', 'tip'],
        ['rtq_abbr_formula_example', 'formula'],
        ['\\euro', 'shared'],
      ],
    );
    assert.equal(document.entries[1]?.expanded, 'Use $x$. Then $y$.');
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});
