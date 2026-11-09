'use client';

import { PaperShapeSpan } from '@rtq/review-paper-browser/paper-shape';
import {
  type HastNode,
  type PaperImageListVersion,
  getPaperImageListWidth,
  rehypePaperImageList,
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperImageList,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperSmall,
  remarkPaperShape,
  remarkPaperStructuredTable,
  remarkPaperSymbol,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import React, { useId, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from '@/lib/rtq-katex';
import type {
  DisplayPaperImage,
  DisplayPaperImageVariant,
} from '@/lib/display-model';
import {
  DEFAULT_IMAGE_COMPARISON_VERSION_SET,
  imageComparisonVersionForProvenance,
  type ImageComparisonVersion,
} from '@/lib/image-view';
import type {
  OriginalImageSize,
  PaperImageScale,
} from '@/lib/review-view-model';

const TODO_IMAGE_SRC = '#rtq-todo-image';

function positiveNumber(value: null | string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function scaledSvgReviewWidth(
  value: number,
  paperImageScale: PaperImageScale,
): number {
  return value * paperImageScale;
}

function PaperImageVariant({
  variant,
  provenanceLabel,
  showFormat,
  align,
  paperImageScale,
}: {
  variant: DisplayPaperImageVariant;
  provenanceLabel?: string;
  showFormat: boolean;
  align: DisplayPaperImage['align'];
  paperImageScale: PaperImageScale;
}) {
  const descriptionId = useId();
  const sized =
    variant.naturalWidth !== undefined &&
    variant.minimumReadableWidth !== undefined;
  const naturalWidth =
    sized && variant.format === 'SVG'
      ? scaledSvgReviewWidth(variant.naturalWidth, paperImageScale)
      : variant.naturalWidth;
  const minimumReadableWidth =
    sized && variant.format === 'SVG'
      ? scaledSvgReviewWidth(variant.minimumReadableWidth, paperImageScale)
      : variant.minimumReadableWidth;
  const rawVisual = variant.svgMarkup ? (
    <span
      role={variant.alt ? 'img' : undefined}
      aria-label={variant.alt || undefined}
      aria-describedby={variant.description ? descriptionId : undefined}
      data-alt-review={variant.altReview}
      className="rtq-svg-inline rtq-review-inline-svg"
      dangerouslySetInnerHTML={{ __html: variant.svgMarkup }}
    />
  ) : (
    // Canonical same-origin assets deliberately bypass image optimisation.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={variant.alt}
      aria-describedby={variant.description ? descriptionId : undefined}
      data-alt-review={variant.altReview}
      className={sized ? 'rtq-svg-image' : undefined}
      height={variant.height}
      width={variant.width}
      src={variant.src}
    />
  );
  const visual =
    variant.surface === undefined ? (
      rawVisual
    ) : (
      <span className="paper-raster-surface" data-surface={variant.surface}>
        {rawVisual}
      </span>
    );
  return (
    <span
      className="rtq-paper-image-variant"
      data-format={variant.format}
      data-provenance={variant.provenance}
      data-version={imageComparisonVersionForProvenance(variant.provenance)}
    >
      {variant.svgCss ? <style>{variant.svgCss}</style> : null}
      {showFormat ? (
        <span className="rtq-paper-image-format">
          {provenanceLabel ?? variant.provenance} · {variant.format}
        </span>
      ) : null}
      {sized ? (
        <span
          className="rtq-svg-scroll"
          data-align={align}
          role="group"
          aria-label="Scrollable image"
          tabIndex={0}
          style={{ maxWidth: naturalWidth }}
        >
          <span
            className="rtq-svg-graphic"
            style={{ minWidth: minimumReadableWidth }}
          >
            {visual}
          </span>
        </span>
      ) : (
        visual
      )}
      {variant.description ? (
        <span hidden id={descriptionId}>
          {variant.description}
        </span>
      ) : null}
    </span>
  );
}

/**
 * One version of one image inside a PaperImageList. It keeps its
 * standalone sizing (natural width, readable minimum, own scroll); the list's
 * version label replaces the format badge.
 */
function PaperImageListVariant({
  paperImageScale,
  variant,
}: Readonly<{
  paperImageScale: PaperImageScale;
  variant: DisplayPaperImageVariant;
}>) {
  const descriptionId = useId();
  const sized =
    variant.format === 'SVG' &&
    variant.naturalWidth !== undefined &&
    variant.minimumReadableWidth !== undefined;
  const rawVisual = variant.svgMarkup ? (
    <span
      role={variant.alt ? 'img' : undefined}
      aria-label={variant.alt || undefined}
      aria-describedby={variant.description ? descriptionId : undefined}
      data-alt-review={variant.altReview}
      className="rtq-svg-inline rtq-review-inline-svg"
      dangerouslySetInnerHTML={{ __html: variant.svgMarkup }}
    />
  ) : (
    // Canonical same-origin assets deliberately bypass image optimisation.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={variant.alt}
      aria-describedby={variant.description ? descriptionId : undefined}
      data-alt-review={variant.altReview}
      className={sized ? 'rtq-svg-image' : undefined}
      height={variant.height}
      width={variant.width}
      src={variant.src}
      style={sized ? undefined : { width: '100%' }}
    />
  );
  const visual =
    variant.surface === undefined ? (
      rawVisual
    ) : (
      <span className="paper-raster-surface" data-surface={variant.surface}>
        {rawVisual}
      </span>
    );
  return (
    <span
      className="rtq-paper-image-list-variant"
      data-format={variant.format}
      data-provenance={variant.provenance}
    >
      {variant.svgCss ? <style>{variant.svgCss}</style> : null}
      {sized ? (
        <span
          className="rtq-svg-scroll"
          role="group"
          aria-label="Scrollable image"
          tabIndex={0}
          style={{
            maxWidth: scaledSvgReviewWidth(
              variant.naturalWidth!,
              paperImageScale,
            ),
          }}
        >
          <span
            className="rtq-svg-graphic"
            style={{
              minWidth: scaledSvgReviewWidth(
                variant.minimumReadableWidth!,
                paperImageScale,
              ),
            }}
          >
            {visual}
          </span>
        </span>
      ) : (
        visual
      )}
      {variant.description ? (
        <span hidden id={descriptionId}>
          {variant.description}
        </span>
      ) : null}
    </span>
  );
}

/** The Original image size preference raises an original raster's width (globals.css). */
const ORIGINAL_RASTER_FLOOR_PX: Readonly<Record<OriginalImageSize, number>> = {
  lg: 576,
  md: 320,
  sm: 0,
};

function visibleListVariants(
  image: DisplayPaperImage,
  visibleVersions: ReadonlySet<ImageComparisonVersion>,
): DisplayPaperImageVariant[] {
  const byVersion = new Map<ImageComparisonVersion, DisplayPaperImageVariant>();
  for (const variant of [...image.variants, ...(image.retiredVariants ?? [])]
    .filter((candidate) => candidate.provenance !== 'missing')
    .toSorted(
      (left, right) =>
        comparisonVariantOrder[left.provenance] -
        comparisonVariantOrder[right.provenance],
    )) {
    const version = imageComparisonVersionForProvenance(variant.provenance);
    if (visibleVersions.has(version) && !byVersion.has(version)) {
      byVersion.set(version, variant);
    }
  }
  return [...byVersion.values()];
}

function imageListVersions(
  image: DisplayPaperImage,
  visibleVersions: ReadonlySet<ImageComparisonVersion>,
  paperImageScale: PaperImageScale,
  originalImageSize: OriginalImageSize,
): PaperImageListVersion[] {
  return visibleListVariants(image, visibleVersions).map((variant) => {
    const version = imageComparisonVersionForProvenance(variant.provenance);
    const width = getPaperImageListWidth({
      displaySize: image.displaySize,
      intrinsicWidth: variant.width,
      naturalWidth: variant.format === 'SVG' ? variant.naturalWidth : undefined,
      rasterFloor:
        version === 'original'
          ? ORIGINAL_RASTER_FLOOR_PX[originalImageSize]
          : 0,
      scale: paperImageScale,
    });
    return {
      label: comparisonVariantLabels[variant.provenance],
      version,
      width,
    };
  });
}

function PaperImageTags({ image }: { image: DisplayPaperImage }) {
  return (
    <span className="rtq-paper-image-tags">
      <span className="rtq-paper-image-tags-label">Image tags</span>
      {image.tags.length ? (
        image.tags.map((tag) => (
          <span
            className="rtq-paper-image-tag"
            data-dimension={tag.dimensionKey}
            data-supported={tag.supported}
            key={`${tag.dimensionLabel}:${tag.value}`}
          >
            <span>{tag.dimensionLabel}</span>
            <strong>{tag.valueLabel}</strong>
            {tag.supported ? null : <em>Unsupported</em>}
          </span>
        ))
      ) : (
        <span className="rtq-paper-image-tags-empty">Unclassified</span>
      )}
    </span>
  );
}

const comparisonVariantOrder: Readonly<
  Record<DisplayPaperImageVariant['provenance'], number>
> = {
  manual: 0,
  retired: 1,
  v1: 2,
  'debug-v1': 3,
  v2: 4,
  'debug-v2': 5,
  missing: 6,
};

const comparisonVariantLabels: Readonly<
  Record<DisplayPaperImageVariant['provenance'], string>
> = {
  manual: 'Original',
  retired: 'Original',
  v1: 'V1',
  v2: 'V2',
  'debug-v1': 'Debug V1',
  'debug-v2': 'Debug V2',
  missing: 'Missing generated image',
};

export function PaperImageComparison({
  image,
  paperImageScale,
  showImageTags,
  visibleVersions,
}: Readonly<{
  image: DisplayPaperImage;
  paperImageScale: PaperImageScale;
  showImageTags: boolean;
  visibleVersions: ReadonlySet<ImageComparisonVersion>;
}>) {
  const variants = [...image.variants, ...(image.retiredVariants ?? [])]
    .filter((variant) =>
      visibleVersions.has(
        imageComparisonVersionForProvenance(variant.provenance),
      ),
    )
    .toSorted(
      (left, right) =>
        comparisonVariantOrder[left.provenance] -
        comparisonVariantOrder[right.provenance],
    );
  const versionCount = new Set(
    variants.map((variant) =>
      imageComparisonVersionForProvenance(variant.provenance),
    ),
  ).size;
  const originalSpansRow =
    versionCount >= 3 &&
    variants.some(
      (variant) =>
        imageComparisonVersionForProvenance(variant.provenance) === 'original',
    );

  return (
    <span
      className="visual-paper-image"
      data-align={image.align}
      data-indent={image.indent}
      data-size={image.displaySize}
    >
      {showImageTags ? <PaperImageTags image={image} /> : null}
      <span
        className="visual-paper-image-variants"
        data-layout={versionCount}
        data-original-row={originalSpansRow ? 'true' : undefined}
      >
        {variants.length ? (
          variants.map((variant) => (
            <PaperImageVariant
              align={image.align}
              key={variant.src}
              paperImageScale={paperImageScale}
              provenanceLabel={comparisonVariantLabels[variant.provenance]}
              showFormat
              variant={variant}
            />
          ))
        ) : (
          <span className="visual-paper-image-empty">
            This image has none of the selected versions.
          </span>
        )}
      </span>
    </span>
  );
}

function PaperImage({
  alt,
  image,
  paperImageScale,
  showImageTags,
  src,
  title,
  visibleImageVersions,
}: Readonly<{
  alt?: string;
  image?: DisplayPaperImage;
  paperImageScale: PaperImageScale;
  showImageTags: boolean;
  src?: string;
  title?: string;
  visibleImageVersions: ReadonlySet<ImageComparisonVersion>;
}>) {
  const descriptionId = useId();
  if (src === TODO_IMAGE_SRC) {
    return (
      <span className="rtq-placeholder" data-rtq-placeholder="todo-image">
        {alt}
      </span>
    );
  }

  const queryIndex = src ? src.indexOf('?') : -1;
  const params = new URLSearchParams(
    src && queryIndex !== -1 ? src.slice(queryIndex + 1) : '',
  );
  const size = params.get('size');
  const isPaperImage = params.get('kind') === 'paper-image';
  const description = isPaperImage ? title : undefined;

  if (image) {
    return (
      <PaperImageComparison
        image={image}
        paperImageScale={paperImageScale}
        showImageTags={showImageTags}
        visibleVersions={visibleImageVersions}
      />
    );
  }

  const naturalWidth = positiveNumber(params.get('natural_width'));
  const minimumWidth = positiveNumber(params.get('minimum_width'));
  const reviewNaturalWidth = naturalWidth
    ? scaledSvgReviewWidth(naturalWidth, paperImageScale)
    : undefined;
  const reviewMinimumWidth = minimumWidth
    ? scaledSvgReviewWidth(minimumWidth, paperImageScale)
    : undefined;
  const visual = (
    // Canonical assets are served by the same-origin reader.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ''}
      aria-describedby={description ? descriptionId : undefined}
      data-alt-review={isPaperImage ? params.get('altReview') : undefined}
      className={naturalWidth ? 'rtq-svg-image' : undefined}
      height={positiveNumber(params.get('h'))}
      src={src}
      title={isPaperImage ? undefined : title}
      width={positiveNumber(params.get('w'))}
    />
  );
  return (
    <span
      className="rtq-paper-image"
      data-align={params.get('align') ?? 'start'}
      data-indent={params.get('indent') ?? 'none'}
      data-kind={params.get('kind') ?? 'paper-image'}
      {...(size ? { 'data-size': size } : {})}
    >
      {naturalWidth && minimumWidth ? (
        <span
          className="rtq-svg-scroll"
          data-align={params.get('align') ?? 'start'}
          role="group"
          aria-label="Scrollable image"
          tabIndex={0}
          style={{ maxWidth: reviewNaturalWidth }}
        >
          <span
            className="rtq-svg-graphic"
            style={{ minWidth: reviewMinimumWidth }}
          >
            {visual}
          </span>
        </span>
      ) : (
        visual
      )}
      {description ? (
        <span hidden id={descriptionId}>
          {description}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The voice of the content field, as in production's paper rich text. Tables
 * read it for their voice defaults: framed in a question, horizontal elsewhere.
 */
export type RtqMarkdownVariant =
  'answer' | 'default' | 'formulas' | 'question' | 'tips' | 'working';

export function RtqMarkdown({
  markdown,
  originalImageSize = 'sm',
  paperImageScale = 1,
  paperImages,
  showImageTags = true,
  variant,
  visibleImageVersions = DEFAULT_IMAGE_COMPARISON_VERSION_SET,
}: {
  markdown: string;
  originalImageSize?: OriginalImageSize;
  paperImageScale?: PaperImageScale;
  paperImages?: readonly DisplayPaperImage[];
  showImageTags?: boolean;
  variant?: RtqMarkdownVariant;
  visibleImageVersions?: ReadonlySet<ImageComparisonVersion>;
}) {
  const paperImagesByReference = useMemo(
    () =>
      new Map(
        (paperImages ?? []).map(
          (image) => [image.referenceSrc, image] as const,
        ),
      ),
    [paperImages],
  );
  const imageListOptions = useMemo(() => {
    const lookup = (node: HastNode) => {
      const src = node.tagName === 'img' ? node.properties?.src : undefined;
      return typeof src === 'string'
        ? paperImagesByReference.get(src)
        : undefined;
    };
    return {
      // D7: one list per visible version; image tags stay outside the lists.
      ...(showImageTags
        ? {
            chrome: (node: HastNode): HastNode => ({
              ...node,
              properties: { ...node.properties, dataImageChrome: 'tags' },
            }),
          }
        : {}),
      resolve: (node: HastNode) => {
        const image = lookup(node);
        return image
          ? imageListVersions(
              image,
              visibleImageVersions,
              paperImageScale,
              originalImageSize,
            )
          : undefined;
      },
      select: (node: HastNode, version: string): HastNode => ({
        ...node,
        properties: { ...node.properties, dataImageVersion: version },
      }),
    };
  }, [
    originalImageSize,
    paperImageScale,
    paperImagesByReference,
    showImageTags,
    visibleImageVersions,
  ]);
  if (!markdown.trim()) return null;
  return (
    <div className="rtq-markdown" data-variant={variant}>
      <ReactMarkdown
        components={{
          span: PaperShapeSpan,
          a: ({ children, href }) => (
            <a href={href} rel="noreferrer" target="_blank">
              {children}
            </a>
          ),
          img: ({ alt, src, title, ...props }) => {
            const image =
              typeof src === 'string'
                ? paperImagesByReference.get(src)
                : undefined;
            const listVersion = (props as Record<string, unknown>)[
              'data-image-version'
            ];
            const listChrome = (props as Record<string, unknown>)[
              'data-image-chrome'
            ];
            if (image && typeof listChrome === 'string') {
              return <PaperImageTags image={image} />;
            }
            if (image && typeof listVersion === 'string') {
              const variant = visibleListVariants(
                image,
                visibleImageVersions,
              ).find(
                (candidate) =>
                  imageComparisonVersionForProvenance(candidate.provenance) ===
                  listVersion,
              );
              return variant ? (
                <PaperImageListVariant
                  paperImageScale={paperImageScale}
                  variant={variant}
                />
              ) : null;
            }
            return (
              <PaperImage
                alt={alt}
                image={
                  typeof src === 'string'
                    ? paperImagesByReference.get(src)
                    : undefined
                }
                paperImageScale={paperImageScale}
                showImageTags={showImageTags}
                src={typeof src === 'string' ? src : undefined}
                title={title}
                visibleImageVersions={visibleImageVersions}
              />
            );
          },
        }}
        rehypePlugins={[
          rehypePaperTable,
          [rehypePaperImageList, imageListOptions],
          [rehypeKatex, rtqKatexOptions],
        ]}
        remarkPlugins={[
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperAuthorNote,
          remarkPaperTable,
          remarkPaperStructuredTable,
          remarkPaperList,
          remarkPaperImageList,
          remarkPaperSmall,
          remarkPaperShape,
          remarkPaperSymbol,
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
