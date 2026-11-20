import assert from 'node:assert/strict';
import test from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { DisplayPaperImage } from './display-model';

import '../../scripts/paper-image-test-loader.mjs';

const { RtqMarkdown } = await import('../components/rtq-markdown.tsx');

function image(
  name: string,
  variants: DisplayPaperImage['variants'],
  displaySize: DisplayPaperImage['displaySize'] = 'sm',
): DisplayPaperImage {
  return {
    align: 'start',
    alt: name,
    description: '',
    displaySize,
    indent: 'none',
    referenceSrc: `/ref/${name}`,
    tags: [],
    variants,
  };
}

const crop = (name: string): DisplayPaperImage['variants'][number] => ({
  alt: `${name} original`,
  description: '',
  format: 'PNG',
  height: 273,
  provenance: 'manual',
  src: `/original/${name}.png`,
  surface: 'paper',
  width: 196,
});

const svg = (
  name: string,
  provenance: 'debug-v2' | 'v1' | 'v2',
  width: number,
): DisplayPaperImage['variants'][number] => ({
  alt: `${name} ${provenance}`,
  description: '',
  format: 'SVG',
  height: 120,
  minimumReadableWidth: width * 0.75,
  naturalHeight: 120,
  naturalWidth: width,
  provenance,
  src: `/${provenance}/${name}.svg`,
  width,
});

function render(
  markdown: string,
  paperImages: readonly DisplayPaperImage[],
): string {
  const html = renderToStaticMarkup(
    createElement(RtqMarkdown, {
      imagePresentation: 'production',
      markdown,
      paperImages,
      variant: 'question',
    }),
  );
  // React hoists image preload links ahead of the markup.
  return html.slice(html.indexOf('<div class="rtq-markdown"'));
}

test('shows only the published version, without review chrome', () => {
  const html = render('![A](/ref/a)', [
    image('a', [crop('a'), svg('a', 'v1', 300), svg('a', 'v2', 420)]),
  ]);
  assert.match(html, /data-image-presentation="production"/);
  assert.match(html, /src="\/v2\/a\.svg"/);
  assert.doesNotMatch(html, /\/original\/a\.png|\/v1\/a\.svg/);
  assert.doesNotMatch(
    html,
    /visual-paper-image|rtq-paper-image-format|rtq-paper-image-variant/,
  );
  // SVG: natural width, then the readable minimum and its own scroll.
  assert.match(html, /class="rtq-svg-scroll"[^>]*style="max-width:420px"/);
  assert.match(html, /class="rtq-svg-graphic" style="min-width:315px"/);
});

test('falls back to the manual image in the paper surface at its size cap', () => {
  const html = render('![A](/ref/a)', [
    image('a', [crop('a'), svg('a', 'debug-v2', 300)], 'md'),
  ]);
  assert.match(html, /class="rtq-paper-image"[^>]*data-size="md"/);
  assert.match(html, /class="paper-raster-surface" data-surface="paper"/);
  assert.match(html, /src="\/original\/a\.png"/);
  assert.doesNotMatch(html, /debug-v2/);
});

test('draws an image list once, unlabelled, sized as on the website', () => {
  const markdown = [
    '<PaperImageList listStyleType="upper-alpha">',
    '',
    '- ![A](/ref/a)',
    '- ![B](/ref/b)',
    '  angle B',
    '',
    '</PaperImageList>',
  ].join('\n');
  const html = render(markdown, [
    image('a', [crop('a'), svg('a', 'v2', 230)]),
    image('b', [crop('b')]),
  ]);
  assert.equal(html.match(/data-slot="paper-image-list"/g)?.length, 1);
  assert.doesNotMatch(html, /rtq-image-list-label/);
  // SVG at its natural width; the raster at the sm cap, not its 196px crop.
  assert.match(html, /--rtq-image-list-item-width:230px/);
  assert.match(html, /--rtq-image-list-item-width:256px/);
  assert.match(html, /src="\/v2\/a\.svg"/);
  assert.match(html, /src="\/original\/b\.png"/);
  assert.doesNotMatch(html, /\/original\/a\.png/);
  assert.match(html, /<figcaption class="rtq-image-list-caption">angle B/);
});
