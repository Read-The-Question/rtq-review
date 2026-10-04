'use client';

import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperSmall,
  remarkPaperStructuredTable,
  remarkPaperSymbol,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import { useId, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from '@/lib/rtq-katex';
import type {
  DisplayPaperImage,
  DisplayPaperImageVariant,
} from '@/lib/display-model';
import type { PaperImageMode } from '@/lib/review-view-model';

const TODO_IMAGE_SRC = '#rtq-todo-image';

function positiveNumber(value: null | string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function PaperImageVariant({
  variant,
  showFormat,
  align,
}: {
  variant: DisplayPaperImageVariant;
  showFormat: boolean;
  align: DisplayPaperImage['align'];
}) {
  const descriptionId = useId();
  const sized =
    variant.naturalWidth !== undefined &&
    variant.minimumReadableWidth !== undefined;
  const visual = variant.svgMarkup ? (
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
  return (
    <span
      className="rtq-paper-image-variant"
      data-provenance={variant.provenance}
    >
      {variant.svgCss ? <style>{variant.svgCss}</style> : null}
      {showFormat ? (
        <span className="rtq-paper-image-format">
          {variant.provenance} · {variant.format}
        </span>
      ) : null}
      {sized ? (
        <span
          className="rtq-svg-scroll"
          data-align={align}
          role="group"
          aria-label="Scrollable image"
          tabIndex={0}
          style={{ maxWidth: variant.naturalWidth }}
        >
          <span
            className="rtq-svg-graphic"
            style={{ minWidth: variant.minimumReadableWidth }}
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

function PaperImage({
  alt,
  image,
  imageMode,
  showImageTags,
  src,
  title,
}: Readonly<{
  alt?: string;
  image?: DisplayPaperImage;
  imageMode: PaperImageMode;
  showImageTags: boolean;
  src?: string;
  title?: string;
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
    const generated = image.variants.filter(
      (variant) => variant.provenance === 'generated',
    );
    const variants =
      imageMode === 'all'
        ? image.variants
        : generated.length
          ? generated
          : image.variants.slice(0, 1);
    const showFormat = image.variants.length > 1;
    return (
      <span
        className="rtq-paper-image"
        data-align={image.align}
        data-indent={image.indent}
        data-kind="paper-image"
        data-size={image.displaySize}
      >
        {showImageTags ? (
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
        ) : null}
        <span className="rtq-paper-image-variants">
          {variants.map((variant) => (
            <PaperImageVariant
              variant={variant}
              align={image.align}
              showFormat={showFormat}
              key={variant.src}
            />
          ))}
        </span>
      </span>
    );
  }

  const naturalWidth = positiveNumber(params.get('natural_width'));
  const minimumWidth = positiveNumber(params.get('minimum_width'));
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
          style={{ maxWidth: naturalWidth }}
        >
          <span className="rtq-svg-graphic" style={{ minWidth: minimumWidth }}>
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

export function RtqMarkdown({
  imageMode = 'all',
  markdown,
  paperImages,
  showImageTags = true,
}: {
  imageMode?: PaperImageMode;
  markdown: string;
  paperImages?: readonly DisplayPaperImage[];
  showImageTags?: boolean;
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
  if (!markdown.trim()) return null;
  return (
    <div className="rtq-markdown">
      <ReactMarkdown
        components={{
          a: ({ children, href }) => (
            <a href={href} rel="noreferrer" target="_blank">
              {children}
            </a>
          ),
          img: ({ alt, src, title }) => (
            <PaperImage
              alt={alt}
              image={
                typeof src === 'string'
                  ? paperImagesByReference.get(src)
                  : undefined
              }
              imageMode={imageMode}
              showImageTags={showImageTags}
              src={typeof src === 'string' ? src : undefined}
              title={title}
            />
          ),
        }}
        rehypePlugins={[rehypePaperTable, [rehypeKatex, rtqKatexOptions]]}
        remarkPlugins={[
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperAuthorNote,
          remarkPaperTable,
          remarkPaperStructuredTable,
          remarkPaperList,
          remarkPaperSmall,
          remarkPaperSymbol,
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
