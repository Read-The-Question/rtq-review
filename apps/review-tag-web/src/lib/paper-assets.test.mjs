import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { installSvgToolFixture } from '../../../../packages/review-paper-assets/test/svg-tool-fixture.mjs';

test('PaperImage family/type is rendering-neutral across scopes, nesting and formats', async t => {
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
  installSvgToolFixture(path.join(root, 'packages/assets'));
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
            ? '<svg width="160" height="120" viewBox="0 0 160 120"></svg>'
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
      const firstStem = `${owner}/manual/${prefix}${slot}-i00`;
      const firstSvg =
        '<svg width="320" height="240" viewBox="0 0 320 240"></svg>';
      write(`${paperRoot}/${firstStem}.svg`, firstSvg);
      assets[`${firstStem}.svg`] = {
        fingerprint: `sha256:${createHash('sha256').update(firstSvg).digest('hex')}`,
        format: 'svg',
        intrinsicHeight: 240,
        intrinsicWidth: 320,
      };
      write(
        `${paperRoot}/paper-images.generated.json`,
        JSON.stringify({ assets, version: 1 }),
      );
      const options =
        scope === 'question' ? undefined : { scopeType: scope, scopeIndex: 0 };
      const source = `<PaperImage assetScope="${scope}" displaySize="lg" />\n\nTODOIMAGE\n\n<PaperImage assetScope="${scope}" />\n\n%image%`;
      const baseline = enrichRtqMarkdown(source, context, options);
      for (const attributes of [
        'family="venn"',
        'family="" type=""',
        'family="future-family" type="future-type"',
        'family="geometry" type="square"',
        'family="geometry" type="rectangle"',
        'family="geometry" type="triangle"',
        'family="chart" type="pie"',
        'family="chart" type="bar"',
        'family="chart" type="coordinate-grid"',
        'family="chart" type="triangle"',
        'family="custom"',
        'family="illustration"',
        'type="triangle"',
      ]) {
        const tagged = source.replaceAll(
          '<PaperImage',
          `<PaperImage ${attributes}`,
        );
        assert.equal(enrichRtqMarkdown(tagged, context, options), baseline);
      }
      assert.equal((baseline.match(/<img /g) ?? []).length, 3);
      assert.ok(baseline.includes(`${prefix}${slot}-i00.png`));
      assert.ok(baseline.includes(`${prefix}${slot}-i00.svg`));
      assert.ok(baseline.includes(`${prefix}${slot}-i01.svg`));
      assert.ok(
        baseline.indexOf(`${prefix}${slot}-i00.png`) <
          baseline.indexOf(`${prefix}${slot}-i00.svg`),
      );
      assert.match(
        baseline,
        /class="paper-image-group" data-has-generated="false" data-variant-count="2"/,
      );
      assert.match(
        baseline,
        /data-format="png" data-provenance="manual" data-primary="true"/,
      );
      assert.match(
        baseline,
        /data-format="svg" data-provenance="manual" data-primary="false"/,
      );
      assert.match(baseline, />manual · PNG<\/span>/);
      assert.match(baseline, />manual · SVG<\/span>/);
      assert.equal(
        (baseline.match(/data-rtq-placeholder="todo-image"/g) ?? []).length,
        2,
      );
      assert.doesNotMatch(baseline, /(?:family|type)=|venn/);
      const generatedStem = `${owner}/generated/diagrams/${prefix}${slot}-i00`;
      write(`${paperRoot}/${generatedStem}.svg`, firstSvg);
      write(
        `${paperRoot}/${generatedStem}.json`,
        JSON.stringify({
          version: 1,
          assetScope: scope,
          alt: 'Generated triangle',
          description: 'Generated description.',
          renderMode: depth === 1 ? 'inline' : 'external',
        }),
      );
      assets[`${generatedStem}.svg`] = assets[`${firstStem}.svg`];
      write(
        `${paperRoot}/paper-images.generated.json`,
        JSON.stringify({ assets, version: 1 }),
      );
      if (depth === 1)
        assert.throws(
          () => enrichRtqMarkdown(source, context, options),
          /delivery mismatch/,
        );
      const comparisonSource =
        depth === 1
          ? source.replace(/<PaperImage\b/, '<PaperImage renderMode="inline"')
          : source;
      const comparison = enrichRtqMarkdown(comparisonSource, context, options);
      assert.match(
        comparison,
        /data-has-generated="true" data-variant-count="3"/,
      );
      assert.match(comparison, /data-provenance="generated"/);
      assert.match(comparison, /Generated triangle/);
      assert.match(comparison, /Generated description/);
      assert.match(comparison, /The sets overlap/);
      if (depth === 1) assert.match(comparison, /rtq-review-inline-svg/);
      rmSync(path.join(root, paperRoot, `${generatedStem}.svg`));
      rmSync(path.join(root, paperRoot, `${generatedStem}.json`));
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
      rmSync(
        path.join(root, paperRoot, `${owner}/manual/${prefix}${slot}-i00.svg`),
      );
      const missingBaseline = enrichRtqMarkdown(source, context, options);
      assert.equal(
        enrichRtqMarkdown(
          source.replace(
            'displaySize="lg"',
            'family="geometry" type="triangle" displaySize="lg"',
          ),
          context,
          options,
        ),
        missingBaseline,
      );
    }
  }
});
