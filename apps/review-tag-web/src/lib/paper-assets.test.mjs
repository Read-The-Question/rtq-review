import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('PaperImage family is rendering-neutral across scopes, nesting and formats', async t => {
  const root = mkdtempSync(path.join(tmpdir(), 'rtq-image-family-'));
  const previousRoot = process.env.RTQ_CONTENT_ROOT;
  process.env.RTQ_CONTENT_ROOT = root;
  const sourceRoot = new URL('../', import.meta.url);
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (
        context.parentURL?.startsWith(sourceRoot.href) &&
        specifier.startsWith('@/')
      ) {
        return nextResolve(
          new URL(`${specifier.slice(2)}.ts`, sourceRoot).href,
          context,
        );
      }
      return nextResolve(specifier, context);
    },
  });
  t.after(() => {
    hooks.deregister();
    if (previousRoot === undefined) delete process.env.RTQ_CONTENT_ROOT;
    else process.env.RTQ_CONTENT_ROOT = previousRoot;
    rmSync(root, { recursive: true, force: true });
  });
  function write(relativePath, value) {
    const destination = path.join(root, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, value);
  }
  write('package.json', '{"name":"@rtq/content-workspace"}');
  write('pnpm-workspace.yaml', 'packages: []\n');
  write('packages/papers/package.json', '{"name":"@rtq/papers"}');
  write('packages/assets/package.json', '{"name":"@rtq/maths-assets"}');
  mkdirSync(path.join(root, 'packages/papers/papers/toml'), {
    recursive: true,
  });

  const fileStem = 'alpha-school--11-plus--maths--2020--paper-1';
  const paperRoot = `packages/assets/assets/papers/${fileStem}`;
  mkdirSync(path.join(root, paperRoot), { recursive: true });
  const { enrichRtqMarkdown } = await import('./paper-assets.ts');
  const assets = {};
  for (const depth of [0, 1, 2]) {
    const prefix = `s01-q01${depth > 0 ? '-s01' : ''}${depth > 1 ? '-ss01' : ''}`;
    const context = {
      fileStem,
      sectionIndex: 0,
      questionIndex: 0,
      subquestionIndex: depth > 0 ? 0 : null,
      subsubquestionIndex: depth > 1 ? 0 : null,
    };
    for (const scope of ['question', 'working', 'answer']) {
      const owner =
        scope === 'question'
          ? 'questions'
          : scope === 'working'
            ? 'workings'
            : 'answers';
      const slot =
        scope === 'question' ? '' : scope === 'working' ? '-w01' : '-a01';
      for (const [index, format] of ['png', 'svg'].entries()) {
        const stem = `${owner}/manual/${prefix}${slot}-i0${index}`;
        const source =
          format === 'svg'
            ? '<svg viewBox="0 0 160 120"></svg>'
            : 'image bytes';
        write(`${paperRoot}/${stem}.${format}`, source);
        write(
          `${paperRoot}/${stem}.json`,
          JSON.stringify({
            alt: 'Sets',
            assetScope: scope,
            description: 'The sets overlap.',
            renderMode: 'external',
            version: 1,
          }),
        );
        assets[`${stem}.${format}`] = {
          fingerprint: `sha256:${createHash('sha256').update(source).digest('hex')}`,
          format,
          intrinsicHeight: 120,
          intrinsicWidth: 160,
        };
      }
      write(
        `${paperRoot}/paper-images.generated.json`,
        JSON.stringify({ assets, version: 1 }),
      );
      const options =
        scope === 'question' ? undefined : { scopeType: scope, scopeIndex: 0 };
      const source = `<PaperImage assetScope="${scope}" displaySize="lg" />\n\n<PaperImage assetScope="${scope}" />`;
      const baseline = enrichRtqMarkdown(source, context, options);
      for (const family of ['venn', '', 'future-family']) {
        const tagged = source.replace(
          'displaySize="lg"',
          `family="${family}" displaySize="lg"`,
        );
        assert.equal(enrichRtqMarkdown(tagged, context, options), baseline);
      }
      assert.equal((baseline.match(/<img /g) ?? []).length, 2);
      assert.ok(baseline.includes(`${prefix}${slot}-i00.png`));
      assert.ok(baseline.includes(`${prefix}${slot}-i01.svg`));
      assert.doesNotMatch(baseline, /family|venn/);
      assert.throws(
        () =>
          enrichRtqMarkdown(
            source.replace('displaySize="lg"', 'unknown="value"'),
            context,
            options,
          ),
        /must not author unknown/,
      );
      rmSync(
        path.join(root, paperRoot, `${owner}/manual/${prefix}${slot}-i00.png`),
      );
      const missingBaseline = enrichRtqMarkdown(source, context, options);
      assert.equal(
        enrichRtqMarkdown(
          source.replace('displaySize="lg"', 'family="venn" displaySize="lg"'),
          context,
          options,
        ),
        missingBaseline,
      );
    }
  }
});
