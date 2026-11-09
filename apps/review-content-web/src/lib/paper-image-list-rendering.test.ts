import assert from 'node:assert/strict';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { DisplayPaperImage } from './display-model';

import '../../scripts/paper-image-test-loader.mjs';

const { RtqMarkdown } = await import('../components/rtq-markdown.tsx');

function image(name: string, svgWidth: number): DisplayPaperImage {
  return {
    align: 'start',
    alt: name,
    description: '',
    displaySize: 'sm',
    indent: 'none',
    referenceSrc: `/ref/${name}`,
    tags: [],
    variants: [
      {
        alt: `${name} original`,
        description: '',
        format: 'PNG',
        height: 273,
        provenance: 'manual',
        src: `/original/${name}.png`,
        surface: 'paper',
        width: 196,
      },
      {
        alt: `${name} v2`,
        description: '',
        format: 'SVG',
        height: 120,
        minimumReadableWidth: svgWidth * 0.75,
        naturalHeight: 120,
        naturalWidth: svgWidth,
        provenance: 'v2',
        src: `/v2/${name}.svg`,
        width: svgWidth,
      },
    ],
  };
}

const MARKDOWN = [
  '<PaperImageList listStyleType="upper-alpha">',
  '',
  '- ![A](/ref/a)',
  '- ![B](/ref/b)',
  '  angle B',
  '',
  '</PaperImageList>',
].join('\n');

function render(
  versions: ReadonlyArray<'original' | 'v1' | 'v2'>,
  showImageTags = false,
) {
  return renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown: MARKDOWN,
      paperImages: [image('a', 128), image('b', 230)],
      showImageTags,
      visibleImageVersions: new Set(versions),
    }),
  );
}

test('draws one image list per visible version (D7)', () => {
  const html = render(['original', 'v2']);
  assert.equal(html.match(/data-slot="paper-image-list"/g)?.length, 2);
  assert.match(html, /class="rtq-image-list-label">Original</);
  assert.match(html, /class="rtq-image-list-label">V2</);
  // React hoists image preload links ahead of the markup; compare the lists only.
  const sets = html.slice(html.indexOf('<div class="rtq-markdown"'));
  const [originalList, v2List] = sets.split('data-version="v2"');
  assert.match(originalList!, /\/original\/a\.png/);
  assert.doesNotMatch(originalList!, /\/v2\/a\.svg/);
  assert.match(v2List!, /\/v2\/a\.svg/);
  assert.doesNotMatch(v2List!, /\/original\/a\.png/);
  // Inside a list an SVG keeps its own scroll region; the list label replaces
  // the format badge.
  assert.match(html, /aria-label="Scrollable image"/);
  assert.doesNotMatch(html, /rtq-paper-image-format/);
});

test('sizes each list from its own version and keeps captions', () => {
  const html = render(['original', 'v2']);
  // Originals keep their pixel width up to the displaySize cap, as in the
  // comparison cards (196px crop, sm cap 256); V2 the SVG natural widths.
  assert.match(html, /--rtq-image-list-item-width:196px/);
  assert.match(html, /--rtq-image-list-item-width:230px/);
  assert.match(html, /<figcaption class="rtq-image-list-caption">angle B/);
  assert.doesNotMatch(html, /<style>[^<]*@container/);
});

test('raises an Original raster to the Original image size preference', () => {
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      markdown: MARKDOWN,
      originalImageSize: 'lg',
      paperImages: [image('a', 128), image('b', 230)],
      showImageTags: false,
      visibleImageVersions: new Set(['original'] as const),
    }),
  );
  assert.match(html, /--rtq-image-list-item-width:576px/);
});

test('omits the label with one visible version and draws tags after the lists', () => {
  const html = render(['v2'], true);
  assert.doesNotMatch(html, /rtq-image-list-label/);
  assert.match(html, /class="rtq-image-list-chrome"/);
  assert.ok(
    html.indexOf('rtq-image-list-chrome') >
      html.lastIndexOf('data-slot="paper-image-list"'),
  );
  assert.equal(html.match(/rtq-paper-image-tags"/g)?.length, 2);
});
