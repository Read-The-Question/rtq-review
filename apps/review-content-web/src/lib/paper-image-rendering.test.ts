import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { type TestContext } from 'node:test';

import type {
  ReviewAssetContext,
  ReviewContentField,
  ReviewPaperNode,
} from '@rtq/review-paper-model';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type {
  DisplayContentField,
  DisplayPaperImage,
} from './display-model.ts';

import '../../scripts/paper-image-test-loader.mjs';
import { installSvgToolFixture } from '../../../../packages/review-paper-assets/test/svg-tool-fixture.mjs';

const { prepareReviewPaperNodeForDisplay } = await import('./prepare-paper.ts');
const { PaperImageComparison, RtqMarkdown } =
  await import('../components/rtq-markdown.tsx');

const ALL_IMAGE_VERSIONS = new Set([
  'original',
  'v1',
  'debug-v1',
  'v2',
  'debug-v2',
] as const);
const PREPARED_IMAGE_VERSION = new Set(['v1'] as const);

function fixture(t: TestContext) {
  const root = mkdtempSync(path.join(tmpdir(), 'rtq-paper-image-rendering-'));
  const previousRoot = process.env.RTQ_CONTENT_ROOT;
  process.env.RTQ_CONTENT_ROOT = root;
  t.after(() => {
    if (previousRoot === undefined) delete process.env.RTQ_CONTENT_ROOT;
    else process.env.RTQ_CONTENT_ROOT = previousRoot;
    rmSync(root, { recursive: true, force: true });
  });

  function write(relativePath: string, content: string) {
    const destination = path.join(root, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  }

  write('package.json', '{"name":"@rtq/content-workspace"}');
  write('pnpm-workspace.yaml', 'packages: []\n');
  write('packages/papers/package.json', '{"name":"@rtq/papers"}');
  installSvgToolFixture(path.join(root, 'packages/assets'));
  write(
    'packages/assets/catalogs/image-dimensional-tags.json',
    JSON.stringify({
      component: 'PaperImage',
      dimensions: [
        {
          attribute: 'family',
          cardinality: 'zero-or-one',
          key: 'family',
          label: 'Family',
          values: [
            {
              label: 'Venn diagram',
              value: 'venn',
            },
            {
              label: 'Geometry',
              value: 'geometry',
            },
          ],
        },
        {
          attribute: 'type',
          cardinality: 'zero-or-more',
          key: 'type',
          label: 'Type',
          values: [
            {
              label: 'Triangle',
              value: 'triangle',
            },
            { label: 'Dimension annotation', value: 'dimension' },
          ],
        },
      ],
      version: 5,
    }),
  );
  mkdirSync(path.join(root, 'packages/papers/papers/toml'), {
    recursive: true,
  });
  const paperRoot = 'packages/assets/assets/papers/example';
  mkdirSync(path.join(root, paperRoot), { recursive: true });

  const sourcePath = 'questions/manual/s01-q01-i00.png';
  function asset(relativePath: string, content: string) {
    write(`${paperRoot}/${relativePath}`, content);
  }
  function debugAsset(relativePath: string, content: string) {
    write(
      `packages/assets/debug-assets/papers/example/${relativePath}`,
      content,
    );
  }
  function retiredAsset(relativePath: string, content: string) {
    write(
      `packages/assets/retired-assets/papers/example/${relativePath}`,
      content,
    );
  }
  function image(metadata: unknown, imagePath = sourcePath) {
    asset(imagePath, 'fixture image bytes; preparation does not decode images');
    asset(imagePath.replace(/\.png$/, '.json'), JSON.stringify(metadata));
  }
  function field(
    markdown: string,
    scope: ReviewAssetContext['scope'],
  ): ReviewContentField {
    return {
      context: {
        answerIndex: 0,
        paperStem: 'example',
        questionIndex: 0,
        scope,
        sectionIndex: 0,
        workingIndex: 0,
      },
      expanded: markdown,
      preparations: [],
      raw: markdown,
    };
  }
  function prepareNode(
    markdown = '<PaperImage assetScope="question" />',
    scope: ReviewAssetContext['scope'] = 'question',
    uuid?: string,
  ) {
    const node: ReviewPaperNode = {
      children: [],
      content: {
        answers: [
          {
            answer: field(scope === 'answer' ? markdown : '', 'answer'),
            key: field('', 'answer'),
            option: field('', 'answer'),
          },
        ],
        question: field(scope === 'question' ? markdown : '', 'question'),
        workings: [
          {
            formulas: [],
            tips: [],
            working: field(scope === 'working' ? markdown : '', 'working'),
          },
        ],
      },
      depth: 0,
      effectiveTags: [],
      explicitInherit: null,
      explicitTags: [],
      id: 's01-q01',
      inheritedTags: [],
      kind: 'question',
      label: '1',
      review: {
        answer: { legacyComments: '' },
        'answer-image': { legacyComments: '' },
        question: { legacyComments: '' },
        'question-image': { legacyComments: '' },
      },
      ...(uuid ? { uuid } : {}),
    };
    return prepareReviewPaperNodeForDisplay(node);
  }
  function prepareResult(
    markdown = '<PaperImage assetScope="question" />',
    scope: ReviewAssetContext['scope'] = 'question',
  ): DisplayContentField {
    const prepared = prepareNode(markdown, scope).content;
    const result =
      scope === 'question'
        ? prepared.question
        : scope === 'working'
          ? prepared.workings[0].working
          : prepared.answers[0].answer;
    return result;
  }
  function prepareDisplay(
    markdown = '<PaperImage assetScope="question" />',
    scope: ReviewAssetContext['scope'] = 'question',
  ) {
    const result = prepareResult(markdown, scope);
    assert.equal(result.preparationIssue, undefined);
    return result;
  }
  function prepare(
    markdown = '<PaperImage assetScope="question" />',
    scope: ReviewAssetContext['scope'] = 'question',
  ) {
    return prepareDisplay(markdown, scope).rendered;
  }
  function snapshot() {
    return readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const filePath = path.join(entry.parentPath, entry.name);
        return [
          path.relative(root, filePath),
          readFileSync(filePath).toString('hex'),
        ];
      })
      .sort(([left], [right]) => left.localeCompare(right));
  }
  return {
    asset,
    debugAsset,
    image,
    prepare,
    prepareDisplay,
    prepareNode,
    prepareResult,
    snapshot,
    sourcePath,
    retiredAsset,
  };
}

function metadata(alt: string | null, description: string | null = null) {
  return {
    alt,
    assetScope: 'question',
    description,
    renderMode: 'external',
    version: 1,
  };
}

function render(
  markdown: string,
  options: Readonly<{
    paperImageScale?: 1 | 2;
    paperImages?: readonly DisplayPaperImage[];
    showImageTags?: boolean;
    visibleImageVersions?: ReadonlySet<
      'debug-v1' | 'debug-v2' | 'original' | 'v1' | 'v2'
    >;
  }> = {},
) {
  return renderToStaticMarkup(
    createElement(RtqMarkdown, { markdown, ...options }),
  );
}

test('displays every multi-type member without changing artwork or hiding unsupported values', (t) => {
  const f = fixture(t);
  const prepared = f.prepareDisplay(
    '<PaperImage assetScope="question" family="geometry" type="triangle dimension unknown" />',
  );
  assert.ok(prepared.paperImages);
  const tags = prepared.paperImages.flatMap((image) => image.tags);
  assert.deepEqual(
    tags.map((tag) => [tag.value, tag.supported]),
    [
      ['geometry', true],
      ['triangle', true],
      ['dimension', true],
      ['unknown', false],
    ],
  );
  const html = render(prepared.rendered, { paperImages: prepared.paperImages });
  assert.equal(imageTags(html).length, 1);
  assert.doesNotMatch(imageTags(html)[0], /family=|type=|triangle dimension/);
});

function imageTags(html: string): string[] {
  return html.match(/<img\b[^>]*>/g) ?? [];
}

test('reports invalid, stale, raster-inline and missing-inline delivery requests', (t) => {
  const f = fixture(t);
  for (const props of [
    'renderMode=""',
    'renderMode="other"',
    'renderMode={"inline"}',
    'renderMode="external" renderMode="inline"',
  ]) {
    assert.ok(
      f.prepareResult(`<PaperImage assetScope="question" ${props} />`)
        .preparationIssue,
    );
  }
  const inline = '<PaperImage assetScope="question" renderMode="inline" />';
  assert.match(f.prepareResult(inline).preparationIssue ?? '', /existing SVG/);
  f.image(metadata('Original screenshot'));
  assert.match(f.prepareResult(inline).preparationIssue ?? '', /existing SVG/);
  f.asset(
    'questions/generated/v1/diagrams/s01-q01-i00.svg',
    '<svg width="100" height="75" viewBox="0 0 100 75"><path d="M0 0L100 0L0 75Z"/></svg>',
  );
  f.asset(
    'questions/generated/v1/diagrams/s01-q01-i00.json',
    JSON.stringify(metadata('Generated diagram', 'A generated triangle.')),
  );
  assert.match(
    f.prepareResult(inline).preparationIssue ?? '',
    /delivery mismatch/,
  );
  f.asset(
    'questions/generated/v1/diagrams/s01-q01-i00.json',
    JSON.stringify({
      ...metadata('Generated diagram', 'A generated triangle.'),
      renderMode: 'inline',
    }),
  );
  assert.match(
    f.prepareResult('<PaperImage assetScope="question" />').preparationIssue ??
      '',
    /delivery mismatch/,
  );
  assert.equal(f.prepareResult(inline).preparationIssue, undefined);
});

test('preserves explicitly requested inline manual SVG delivery', (t) => {
  const f = fixture(t);
  f.asset(
    'questions/manual/s01-q01-i00.svg',
    '<svg width="100" height="75" viewBox="0 0 100 75"><path class="fill-diagrams-swatch-red stroke-diagrams-swatch-blue" d="M0 0L100 0L0 75Z"/></svg>',
  );
  f.asset(
    'questions/manual/s01-q01-i00.json',
    JSON.stringify({ ...metadata('Manual triangle'), renderMode: 'inline' }),
  );
  assert.match(
    f.prepareResult('<PaperImage assetScope="question" />').preparationIssue ??
      '',
    /delivery mismatch/,
  );
  const prepared = f.prepareDisplay(
    '<PaperImage assetScope="question" renderMode="inline" />',
  );
  const rendered = render(prepared.rendered, {
    paperImages: prepared.paperImages,
  });
  assert.match(rendered, /rtq-review-inline-svg/);
  assert.match(rendered, /fill-diagrams-swatch-red/);
  assert.match(rendered, /stroke-diagrams-swatch-blue/);
  assert.match(rendered, /fill-diagrams-swatch-red \{ fill: #f53e39; \}/);
  assert.match(rendered, /stroke-diagrams-swatch-blue \{ stroke: #2288f8; \}/);
});

for (const scope of ['question', 'working', 'answer'] as const) {
  test(`renders occurrence-local image tags in ${scope} content`, (t) => {
    const f = fixture(t);
    const owner =
      scope === 'question'
        ? 'questions'
        : scope === 'working'
          ? 'workings'
          : 'answers';
    const slot =
      scope === 'question' ? '' : scope === 'working' ? '-w01' : '-a01';
    for (const index of ['00', '01']) {
      f.image(
        { ...metadata('Sets'), assetScope: scope },
        `${owner}/manual/s01-q01${slot}-i${index}.png`,
      );
    }
    const source = `<PaperImage assetScope="${scope}" type="triangle" displaySize="lg" />\n\n<PaperImage assetScope="${scope}" family="venn" />`;
    const prepared = f.prepareDisplay(source, scope);
    assert.deepEqual(
      prepared.paperImages?.map((image) =>
        image.tags.map((tag) => ({
          dimension: tag.dimensionLabel,
          supported: tag.supported,
          value: tag.valueLabel,
        })),
      ),
      [
        [{ dimension: 'Type', supported: true, value: 'Triangle' }],
        [{ dimension: 'Family', supported: true, value: 'Venn diagram' }],
      ],
    );
    const html = render(prepared.rendered, {
      paperImages: prepared.paperImages,
    });
    assert.equal(imageTags(html).length, 2);
    assert.match(html, /Image tags/);
    assert.match(html, /data-dimension="family"/);
    assert.match(html, /data-dimension="type"/);
    assert.match(html, /Family/);
    assert.match(html, /Triangle/);
    assert.match(html, /Venn diagram/);
    assert.doesNotMatch(
      render(prepared.rendered, {
        paperImages: prepared.paperImages,
        showImageTags: false,
      }),
      /Image tags|Triangle|Venn diagram/,
    );
  });
}

test('shows image tags with the existing missing-binary fallback', (t) => {
  const f = fixture(t);
  const prepared = f.prepareDisplay(
    '<PaperImage assetScope="question" family="geometry" type="triangle" />',
  );
  const html = render(prepared.rendered, {
    paperImages: prepared.paperImages,
  });
  assert.match(html, /Missing paper image/);
  assert.match(html, /Geometry/);
  assert.match(html, /Triangle/);
});

test('renders matching active formats in PNG, JPEG, SVG order', (t) => {
  const f = fixture(t);
  f.image(metadata('A geometric diagram.', 'Compare each active format.'));
  f.asset(f.sourcePath.replace(/\.png$/, '.jpeg'), 'fixture jpeg image bytes');
  f.asset(
    f.sourcePath.replace(/\.png$/, '.svg'),
    '<svg width="480" height="360" />',
  );
  f.asset(
    'paper-images.generated.json',
    JSON.stringify({
      assets: {
        [f.sourcePath]: { intrinsicHeight: 120, intrinsicWidth: 160 },
        [f.sourcePath.replace(/\.png$/, '.jpeg')]: {
          intrinsicHeight: 240,
          intrinsicWidth: 320,
        },
        [f.sourcePath.replace(/\.png$/, '.svg')]: {
          intrinsicHeight: 360,
          intrinsicWidth: 480,
        },
      },
    }),
  );
  const prepared = f.prepareDisplay(
    '<PaperImage assetScope="question" family="geometry" type="triangle" />',
  );
  assert.deepEqual(
    prepared.paperImages?.[0].variants.map((variant) => ({
      format: variant.format,
      height: variant.height,
      surface: variant.surface,
      width: variant.width,
    })),
    [
      { format: 'PNG', height: 120, surface: 'paper', width: 160 },
      { format: 'JPEG', height: 240, surface: 'paper', width: 320 },
      { format: 'SVG', height: 360, surface: undefined, width: 480 },
    ],
  );

  const all = render(prepared.rendered, {
    paperImages: prepared.paperImages,
    visibleImageVersions: ALL_IMAGE_VERSIONS,
  });
  const allImages = imageTags(all);
  assert.equal(allImages.length, 3);
  assert.match(allImages[0], /i00\.png/);
  assert.match(allImages[1], /i00\.jpeg/);
  assert.match(allImages[2], /i00\.svg/);
  assert.match(all, /PNG/);
  assert.match(all, /JPEG/);
  assert.match(all, /SVG/);
  assert.match(all, /Compare each active format\./);
});

test('reports when an image has none of the selected versions', (t) => {
  const f = fixture(t);
  f.image(metadata('A raster diagram.'));
  f.asset(f.sourcePath.replace(/\.png$/, '.jpg'), 'fixture jpeg image bytes');
  const prepared = f.prepareDisplay();
  const html = render(prepared.rendered, {
    paperImages: prepared.paperImages,
    visibleImageVersions: PREPARED_IMAGE_VERSION,
  });
  assert.equal(imageTags(html).length, 0);
  assert.match(html, /This image has none of the selected versions\./);
});

test('shows retired manual artwork through the shared comparison renderer', (t) => {
  const f = fixture(t);
  f.asset(
    'questions/generated/v1/diagrams/s01-q01-i00.svg',
    '<svg width="320" height="200" viewBox="0 0 320 200"><path d="M0 0L100 0L0 100Z"/></svg>',
  );
  f.asset(
    'questions/generated/v1/diagrams/s01-q01-i00.json',
    JSON.stringify(metadata('Prepared diagram', 'Current artwork.')),
  );
  f.retiredAsset(
    'questions/manual/s01-q01-i00.png',
    'retired screenshot bytes',
  );
  f.retiredAsset(
    'questions/manual/s01-q01-i00.json',
    JSON.stringify(metadata('Retired screenshot', 'Archived reference.')),
  );

  const prepared = f.prepareDisplay();
  assert.deepEqual(
    prepared.paperImages?.[0].variants.map((variant) => variant.provenance),
    ['v1'],
  );
  assert.deepEqual(
    prepared.paperImages?.[0].retiredVariants?.map(
      (variant) => variant.provenance,
    ),
    ['retired'],
  );
  assert.match(
    prepared.paperImages?.[0].retiredVariants?.[0].src ?? '',
    /\/api\/assets\/retired\/papers\/example\/questions\/manual\/s01-q01-i00\.png/,
  );
  const normal = render(prepared.rendered, {
    paperImages: prepared.paperImages,
  });
  assert.match(normal, /Prepared diagram/);
  assert.match(normal, /Retired screenshot|retired\/papers/);
  assert.match(normal, /Original · PNG/);

  const comparison = renderToStaticMarkup(
    createElement(PaperImageComparison, {
      image: prepared.paperImages?.[0] as DisplayPaperImage,
      paperImageScale: 1,
      showImageTags: false,
      visibleVersions: new Set(['original', 'v1', 'debug-v1'] as const),
    }),
  );
  assert.match(comparison, /V1 · SVG/);
  assert.match(comparison, /Original · PNG/);
  assert.match(comparison, /Prepared diagram/);
  assert.match(comparison, /Retired screenshot/);
});

test('puts the original first and pairs each generated SVG with its debug SVG', () => {
  const comparisonImage: DisplayPaperImage = {
    align: 'start',
    alt: 'Comparison',
    description: '',
    displaySize: 'sm',
    indent: 'none',
    referenceSrc: '/original.png',
    tags: [],
    variants: [
      {
        alt: 'Original scan',
        description: '',
        format: 'PNG',
        provenance: 'manual',
        src: '/original.png',
      },
      {
        alt: 'Prepared diagram',
        description: '',
        format: 'SVG',
        provenance: 'v1',
        src: '/prepared.svg',
      },
      {
        alt: 'Prepared diagram V2',
        description: '',
        format: 'SVG',
        provenance: 'v2',
        src: '/prepared-v2.svg',
      },
      {
        alt: 'Debug diagram',
        description: '',
        format: 'SVG',
        provenance: 'debug-v1',
        src: '/debug.svg',
      },
      {
        alt: 'Debug diagram V2',
        description: '',
        format: 'SVG',
        provenance: 'debug-v2',
        src: '/debug-v2.svg',
      },
    ],
  };
  const all = renderToStaticMarkup(
    createElement(PaperImageComparison, {
      image: comparisonImage,
      paperImageScale: 1,
      showImageTags: false,
      visibleVersions: ALL_IMAGE_VERSIONS,
    }),
  );
  assert.match(all, /data-layout="5"/);
  assert.match(all, /data-original-row="true"/);
  assert.match(all, /data-version="original"/);
  assert.match(all, /data-format="PNG"/);
  assert.match(all, /data-format="SVG"/);
  assert.match(all, /Original · PNG/);
  assert.match(
    all,
    /Original · PNG[\s\S]*V1 · SVG[\s\S]*Debug V1 · SVG[\s\S]*V2 · SVG[\s\S]*Debug V2 · SVG/,
  );

  const generated = renderToStaticMarkup(
    createElement(PaperImageComparison, {
      image: comparisonImage,
      paperImageScale: 1,
      showImageTags: false,
      visibleVersions: new Set(['v1', 'debug-v1'] as const),
    }),
  );
  assert.match(generated, /data-layout="2"/);
  assert.doesNotMatch(generated, /data-original-row/);
  assert.doesNotMatch(generated, /Original · PNG|original\.png/);
  assert.match(generated, /V1 · SVG/);
  assert.match(generated, /Debug V1 · SVG/);
  assert.doesNotMatch(generated, /V2 · SVG|Debug V2 · SVG/);

  const generatedV2 = renderToStaticMarkup(
    createElement(PaperImageComparison, {
      image: comparisonImage,
      paperImageScale: 1,
      showImageTags: false,
      visibleVersions: new Set(['v2', 'debug-v2'] as const),
    }),
  );
  assert.match(generatedV2, /data-layout="2"/);
  assert.match(generatedV2, /V2 · SVG/);
  assert.match(generatedV2, /Debug V2 · SVG/);
  assert.doesNotMatch(generatedV2, /V1 · SVG|Debug V1 · SVG/);
});

test('maps a retired-only original back to its current question UUID', (t) => {
  const f = fixture(t);
  const uuid = 'AAB63DDE-7AE5-4CBB-B9C4-86695C3EA843';
  f.retiredAsset(
    'questions/manual/s01-q01-i00.png',
    'retired screenshot bytes',
  );
  f.retiredAsset(
    'questions/manual/s01-q01-i00.json',
    JSON.stringify(metadata('Museum sign', 'The archived entrance-fee sign.')),
  );
  f.retiredAsset(
    'retirement.json',
    JSON.stringify({
      paperSlug: 'example',
      retirements: [
        {
          assets: [
            { path: 'questions/manual/s01-q01-i00.json' },
            { path: 'questions/manual/s01-q01-i00.png' },
          ],
          kind: 'assets',
          questionUuid: uuid,
          reason: 'Replaced by authored text.',
        },
      ],
      version: 2,
    }),
  );

  const prepared = f.prepareNode('The fee is £1.20.', 'question', uuid);
  assert.equal(prepared.content.question.paperImages, undefined);
  assert.equal(prepared.retiredPaperImages?.length, 1);
  assert.equal(
    prepared.retiredPaperImages?.[0].reason,
    'Replaced by authored text.',
  );
  assert.equal(
    prepared.retiredPaperImages?.[0].image.retiredVariants?.[0].alt,
    'Museum sign',
  );
  assert.match(
    prepared.retiredPaperImages?.[0].image.referenceSrc ?? '',
    /\/api\/assets\/retired\/papers\/example\/questions\/manual\/s01-q01-i00\.png/,
  );
});

for (const scope of ['question', 'working', 'answer'] as const) {
  for (const renderMode of ['inline', 'external'] as const) {
    test(`compares ${scope} manual, V1, V2 and debug ${renderMode} artwork with independent wording`, (t) => {
      const f = fixture(t);
      const owner = `${scope}s`;
      const slot =
        scope === 'question' ? '' : scope === 'working' ? '-w01' : '-a01';
      const stem = `s01-q01${slot}-i00`;
      f.image(
        {
          ...metadata('Original screenshot', 'Original description.'),
          assetScope: scope,
        },
        `${owner}/manual/${stem}.png`,
      );
      f.asset(
        `${owner}/generated/v1/diagrams/${stem}.svg`,
        '<svg width="320.5" height="200" viewBox="0 0 320.5 200"><path d="M0 0L100 0L0 100Z"/></svg>',
      );
      f.debugAsset(
        `${owner}/generated/v1/diagrams/${stem}.svg`,
        '<svg width="320.5" height="200" viewBox="0 0 320.5 200"><path d="M0 0L100 0L0 100Z"/><g id="diagram-bounds-debug"><rect width="100" height="100"/></g></svg>',
      );
      f.asset(
        `${owner}/generated/v1/diagrams/${stem}.json`,
        JSON.stringify({
          ...metadata('Generated triangle', 'Generated description.'),
          assetScope: scope,
          renderMode,
        }),
      );
      f.asset(
        `${owner}/generated/v2/diagrams/${stem}.svg`,
        '<svg width="300" height="180" viewBox="0 0 300 180"><circle cx="90" cy="90" r="70"/></svg>',
      );
      f.debugAsset(
        `${owner}/generated/v2/diagrams/${stem}.svg`,
        '<svg width="300" height="180" viewBox="0 0 300 180"><circle cx="90" cy="90" r="70"/><g id="diagram-bounds-debug"><rect width="180" height="180"/></g></svg>',
      );
      f.asset(
        `${owner}/generated/v2/diagrams/${stem}.json`,
        JSON.stringify({
          ...metadata('V2 circle', 'V2 description.'),
          assetScope: scope,
          renderMode,
        }),
      );
      const prepared = f.prepareDisplay(
        `<PaperImage assetScope="${scope}" family="geometry" type="triangle" displaySize="sm" renderMode="${renderMode}" />`,
        scope,
      );
      assert.equal(prepared.paperImages?.length, 1);
      assert.deepEqual(
        prepared.paperImages?.[0].variants.map((variant) => variant.provenance),
        ['manual', 'v1', 'v2', 'debug-v1', 'debug-v2'],
      );
      assert.match(
        prepared.paperImages?.[0].variants.find(
          (variant) => variant.provenance === 'debug-v1',
        )?.src ?? '',
        /\/api\/assets\/debug\/papers\/example/,
      );
      const all = render(prepared.rendered, {
        paperImageScale: 2,
        paperImages: prepared.paperImages,
        visibleImageVersions: ALL_IMAGE_VERSIONS,
      });
      assert.match(all, /Original screenshot/);
      assert.match(all, /Generated triangle/);
      assert.match(all, /Original description/);
      assert.match(all, /Generated description/);
      assert.match(all, /V2 circle/);
      assert.match(all, /V2 description/);
      assert.match(all, /Debug V1 · SVG/);
      assert.match(all, /Debug V2 · SVG/);
      if (renderMode === 'external') {
        assert.match(all, /\/api\/assets\/debug\/papers\/example/);
      }
      assert.match(all, /max-width:641px/);
      assert.match(all, /min-width:480\.75px/);
      assert.match(all, /tabindex="0"/);
      if (renderMode === 'inline') assert.match(all, /rtq-review-inline-svg/);
      const originalSize = render(prepared.rendered, {
        paperImageScale: 1,
        paperImages: prepared.paperImages,
        visibleImageVersions: PREPARED_IMAGE_VERSION,
      });
      assert.match(originalSize, /max-width:320\.5px/);
      assert.match(originalSize, /min-width:240\.375px/);
      const preferred = render(prepared.rendered, {
        paperImages: prepared.paperImages,
        visibleImageVersions: PREPARED_IMAGE_VERSION,
      });
      assert.doesNotMatch(
        preferred,
        /Original screenshot|Original description/,
      );
      assert.match(preferred, /Generated triangle/);
      assert.doesNotMatch(preferred, /Debug V1 · SVG|diagram-bounds-debug/);
    });
  }
}

for (const [alt, state] of [
  [null, 'pending'],
  ['', 'reviewed-decorative'],
  ['A triangle', 'reviewed-informative'],
] as const) {
  test(`preserves ${state} through preparation and rendering`, (t) => {
    const f = fixture(t);
    f.image(metadata(alt));
    f.asset(
      'paper-images.generated.json',
      JSON.stringify({
        assets: {
          [f.sourcePath]: { intrinsicHeight: 120, intrinsicWidth: 160 },
        },
      }),
    );
    const before = f.snapshot();
    const markdown = f.prepare();
    assert.ok(markdown.includes(`altReview=${state}`));
    const html = render(markdown);
    const [image] = imageTags(html);
    assert.ok(image.includes(`alt="${alt ?? ''}"`));
    assert.ok(image.includes(`data-alt-review="${state}"`));
    assert.match(image, /width="160"/);
    assert.match(image, /height="120"/);
    assert.doesNotMatch(image, /aria-describedby|title=/);
    assert.match(html, /data-align="start"/);
    assert.match(html, /data-indent="none"/);
    assert.match(html, /data-size="sm"/);
    assert.deepEqual(f.snapshot(), before);
  });
}

test('associates escaped descriptions with distinct images and repeated content', (t) => {
  const f = fixture(t);
  f.image(
    metadata('Triangle', 'Sides "a" & "b"; <script>text</script>; C:\\shape'),
  );
  f.image(
    metadata('Circle', 'A circular boundary.'),
    'questions/manual/s01-q01-i01.png',
  );
  const markdown = f.prepare(
    '<PaperImage assetScope="question" />\n\n<PaperImage assetScope="question" />',
  );
  const html = renderToStaticMarkup(
    createElement(
      Fragment,
      null,
      createElement(RtqMarkdown, { markdown }),
      createElement(RtqMarkdown, { markdown }),
    ),
  );
  const images = imageTags(html);
  assert.equal(images.length, 4);
  const ids = images.map((image) => {
    assert.doesNotMatch(image, /\btitle=/);
    const id = image.match(/aria-describedby="([^"]+)"/)?.[1];
    assert.ok(id);
    return id;
  });
  assert.equal(new Set(ids).size, 4);
  for (const [index, id] of ids.entries()) {
    const text =
      index % 2 === 0
        ? 'Sides &quot;a&quot; &amp; &quot;b&quot;; &lt;script&gt;text&lt;/script&gt;; C:\\shape'
        : 'A circular boundary.';
    assert.ok(html.includes(`<span hidden="" id="${id}">${text}</span>`));
  }
  assert.doesNotMatch(html, /<script>/);
});

for (const alt of [null, ''] as const) {
  test(`retains descriptions with ${alt === null ? 'pending' : 'decorative'} alt`, (t) => {
    const f = fixture(t);
    f.image(metadata(alt, 'Description supplied by the source.'));
    const html = render(f.prepare());
    assert.match(imageTags(html)[0], /alt=""[^>]*aria-describedby=/);
    assert.match(html, /Description supplied by the source\./);
  });
}

for (const [label, raw] of [
  ['missing', undefined],
  ['unparseable', '{'],
  ['null', 'null'],
] as const) {
  test(`keeps the ${label}-sidecar fallback without marking it reviewed`, (t) => {
    const f = fixture(t);
    f.asset(f.sourcePath, 'fixture');
    if (raw !== undefined) f.asset(f.sourcePath.replace('.png', '.json'), raw);
    const html = render(f.prepare());
    assert.match(imageTags(html)[0], /alt="Paper image"/);
    assert.doesNotMatch(html, /data-alt-review|aria-describedby/);
  });
}

test('does not invent a review state for an invalid alt field', (t) => {
  const f = fixture(t);
  f.image({ ...metadata(null), alt: 42 });
  const html = render(f.prepare());
  assert.match(imageTags(html)[0], /alt=""/);
  assert.doesNotMatch(html, /data-alt-review/);
});

test('retains the missing-binary and unimplemented-image fallbacks', (t) => {
  const f = fixture(t);
  const html = render(f.prepare('<PaperImage />\n\nTODOIMAGE'));
  assert.match(imageTags(html)[0], /alt="Missing paper image"/);
  assert.match(html, /\/api\/assets\/papers\/missing\/missing_image\.svg/);
  assert.match(html, /width="320"/);
  assert.match(html, /height="180"/);
  assert.doesNotMatch(html, /data-surface=/);
  assert.match(html, /data-rtq-placeholder="todo-image"/);
  assert.doesNotMatch(html, /data-alt-review|aria-describedby/);
});

for (const [label, manifest] of [
  ['missing', undefined],
  ['unparseable', '{'],
  ['missing-entry', '{"assets":{}}'],
  [
    'invalid-dimensions',
    '{"assets":{"questions/manual/s01-q01-i00.png":{"intrinsicWidth":"bad"}}}',
  ],
] as const) {
  test(`keeps rendering with a ${label} technical manifest`, (t) => {
    const f = fixture(t);
    f.image(metadata(null));
    if (manifest !== undefined)
      f.asset('paper-images.generated.json', manifest);
    const image = imageTags(render(f.prepare()))[0];
    assert.match(image, /data-alt-review="pending"/);
    assert.doesNotMatch(image, /\bwidth=|\bheight=/);
  });
}

test('retains scope inference, ignored attributes and tolerant sidecar fields', (t) => {
  const f = fixture(t);
  f.image({
    ...metadata(null),
    version: 99,
    assetScope: 'answer',
    renderMode: null,
  });
  const html = render(
    f.prepare(
      '<PaperImage unknown="ignored" displaySize="lg" align="end" indent="md" />',
    ),
  );
  assert.match(html, /data-size="lg"/);
  assert.match(html, /data-align="end"/);
  assert.match(html, /data-indent="md"/);
  assert.match(imageTags(html)[0], /data-alt-review="pending"/);
});

for (const scope of ['working', 'answer'] as const) {
  test(`preserves the semantics in ${scope} content`, (t) => {
    const f = fixture(t);
    const owner = scope === 'working' ? 'workings' : 'answers';
    const token = scope === 'working' ? 'w' : 'a';
    f.image(
      { ...metadata(null, 'A supporting diagram.'), assetScope: scope },
      `${owner}/manual/s01-q01-${token}01-i00.png`,
    );
    const html = render(
      f.prepare(`<PaperImage assetScope="${scope}" />`, scope),
    );
    assert.match(imageTags(html)[0], /data-alt-review="pending"/);
    assert.match(imageTags(html)[0], /aria-describedby=/);
    assert.match(html, /A supporting diagram\./);
  });
}

test('leaves ordinary Markdown image titles and generated division rendering unchanged', (t) => {
  const f = fixture(t);
  const ordinary = imageTags(
    render('![Ordinary](/example.png "Hover title")'),
  )[0];
  assert.match(ordinary, /title="Hover title"/);
  assert.doesNotMatch(ordinary, /aria-describedby|data-alt-review/);

  f.asset(
    'workings/generated/long-division/s01-q01-w01-ld00-long.json',
    JSON.stringify({
      alt: 'Division result',
      description: 'Division explanation',
    }),
  );
  const html = render(
    f.prepare(
      '<LongDivision dividend="12" divisor="3" variant="long" />',
      'working',
    ),
  );
  assert.match(html, /data-kind="long-division"/);
  assert.match(imageTags(html)[0], /alt="Division result"/);
  assert.match(imageTags(html)[0], /title="Division explanation"/);
  assert.doesNotMatch(html, /aria-describedby|data-alt-review/);
});

test('renders solution-free long division in question content', (t) => {
  const f = fixture(t);
  f.asset(
    'questions/generated/long-division/s01-q01-ld00-question.svg',
    '<svg width="142" height="53" viewBox="0 0 142 53"><path d="M36 47V8H130"/></svg>',
  );
  f.asset(
    'questions/generated/long-division/s01-q01-ld00-question.json',
    JSON.stringify({
      alt: 'Long-division question of 4716 by 9',
      description:
        'Long-division question showing 4716 divided by 9 in division-bracket notation.',
      values: {
        dividend: '4716',
        divisor: '9',
        variant: 'question',
      },
    }),
  );

  const prepared = f.prepareDisplay(
    '<LongDivision dividend="4716" divisor="9" variant="question" />',
  );
  const html = render(prepared.rendered);
  assert.match(html, /data-kind="long-division"/);
  assert.match(imageTags(html)[0], /alt="Long-division question of 4716 by 9"/);
  assert.match(
    html,
    /questions\/generated\/long-division\/s01-q01-ld00-question\.svg/,
  );
  assert.match(html, /Long-division question showing 4716 divided by 9/);
  assert.doesNotMatch(html, /quotient|remainder/i);
});

test('keeps LongDivision question and solution variants in their owned content scopes', (t) => {
  const f = fixture(t);
  assert.match(
    f.prepareResult('<LongDivision dividend="12" divisor="3" variant="long" />')
      .preparationIssue ?? '',
    /question content must use variant="question"/,
  );
  assert.match(
    f.prepareResult(
      '<LongDivision dividend="12" divisor="3" variant="question" />',
      'working',
    ).preparationIssue ?? '',
    /variant="question" is only supported in question content/,
  );
});
