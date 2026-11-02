import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { PaperTagEditorError, savePaperNodeTags } from './paper-tag-editor.ts';

const paperSource = `[[sections]]
name = 'One'

[[sections.questions]]
rtq-uuid = 'parent'
rtq-tags = ['family.money']
question = 'Parent'

[[sections.questions.subquestions]]
rtq-uuid = 'child'
rtq-tags = ['math.number']
rtq-inherit-tags = true
question = 'Child'
`;

function version(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function createWorkspace(): Readonly<{
  paperPath: string;
  root: string;
}> {
  const root = mkdtempSync(join(tmpdir(), 'rtq-review-tag-editor-'));
  const papersPackage = join(root, 'packages', 'papers');
  const assetsPackage = join(root, 'packages', 'assets');
  const paperPath = join(papersPackage, 'papers', 'toml', 'paper.toml');
  const mappingRoot = join(
    papersPackage,
    'docs',
    'ai',
    'tags',
    'dimensional-tags',
  );
  const guidesRoot = join(
    papersPackage,
    'docs',
    'ai',
    'answers',
    'dimensional-style-guides',
  );
  mkdirSync(join(papersPackage, 'papers', 'toml'), { recursive: true });
  mkdirSync(join(papersPackage, 'papers', 'corpusAllTopicsToml'), {
    recursive: true,
  });
  mkdirSync(join(papersPackage, 'macros', 'content'), { recursive: true });
  mkdirSync(mappingRoot, { recursive: true });
  mkdirSync(guidesRoot, { recursive: true });
  mkdirSync(join(assetsPackage, 'assets'), { recursive: true });
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: '@rtq/content-workspace' }),
  );
  writeFileSync(join(root, 'pnpm-workspace.yaml'), 'packages: []\n');
  writeFileSync(
    join(papersPackage, 'package.json'),
    JSON.stringify({ name: '@rtq/papers' }),
  );
  writeFileSync(
    join(assetsPackage, 'package.json'),
    JSON.stringify({ name: '@rtq/maths-assets' }),
  );
  writeFileSync(
    join(papersPackage, 'macros', 'content', 'expansions.toml'),
    '',
  );
  writeFileSync(
    join(mappingRoot, 'dimensional-tag-mapping.json'),
    JSON.stringify({
      records: [
        { family: 'family.age', status: 'mapped' },
        { family: 'family.money', status: 'mapped' },
        { math: 'math.number', status: 'mapped' },
      ],
    }),
  );
  writeFileSync(join(guidesRoot, 'family.age.md'), '# Family age\n');
  writeFileSync(paperPath, paperSource);
  writeFileSync(
    join(papersPackage, 'papers', 'corpusAllTopicsToml', 'paper.toml'),
    paperSource,
  );
  return { paperPath, root };
}

test('saves one UUID and returns inheritance-resolved tag state', async () => {
  const fixture = createWorkspace();
  const options = { environment: { RTQ_CONTENT_ROOT: fixture.root } };
  try {
    const result = await savePaperNodeTags(
      {
        expectedVersion: version(paperSource),
        explicitInherit: null,
        explicitTags: ['family.age'],
        target: {
          collectionId: 'toml',
          nodeUuid: 'parent',
          relativePath: 'paper.toml',
        },
      },
      options,
    );
    const written = readFileSync(fixture.paperPath, 'utf8');
    assert.match(written, /rtq-tags = \["family\.age"\]/);
    const child = result.nodes.find((node) => node.nodeUuid === 'child');
    assert.ok(child);
    assert.deepEqual(
      child.effectiveTags.map((tag) => [tag.value, tag.origin]),
      [
        ['family.age', 'inherited'],
        ['math.number', 'explicit'],
        ['frame.raw', 'implicit'],
        ['reasoning.direct', 'implicit'],
      ],
    );
    assert.equal(result.version, version(written));
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

test('rejects stale versions and read-only collections', async () => {
  const fixture = createWorkspace();
  const options = { environment: { RTQ_CONTENT_ROOT: fixture.root } };
  try {
    await assert.rejects(
      savePaperNodeTags(
        {
          expectedVersion: 'stale',
          explicitInherit: null,
          explicitTags: ['family.age'],
          target: {
            collectionId: 'toml',
            nodeUuid: 'parent',
            relativePath: 'paper.toml',
          },
        },
        options,
      ),
      (error: unknown) =>
        error instanceof PaperTagEditorError && error.status === 409,
    );
    await assert.rejects(
      savePaperNodeTags(
        {
          expectedVersion: version(paperSource),
          explicitInherit: null,
          explicitTags: ['family.age'],
          target: {
            collectionId: 'corpusAllTopicsToml',
            nodeUuid: 'parent',
            relativePath: 'paper.toml',
          },
        },
        options,
      ),
      (error: unknown) =>
        error instanceof PaperTagEditorError && error.status === 403,
    );
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});
