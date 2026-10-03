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
import type { DisplayPaperImage } from '@/lib/display-model';
import type { PaperImageMode } from '@/lib/review-view-model';

const TODO_IMAGE_SRC = '#rtq-todo-image';

function positiveInteger(value: null | string): number | undefined {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
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
    const svg = image.variants.find((variant) => variant.format === 'SVG');
    const variants =
      imageMode === 'all'
        ? image.variants
        : [svg ?? image.variants[0]].filter((variant) => variant !== undefined);
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
            <span className="rtq-paper-image-variant" key={variant.src}>
              {showFormat ? (
                <span className="rtq-paper-image-format">{variant.format}</span>
              ) : null}
              {
                // Canonical local assets are served by the narrow same-origin
                // route, so each discovered format retains its own dimensions.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={image.alt}
                  aria-describedby={
                    image.description ? descriptionId : undefined
                  }
                  data-alt-review={image.altReview}
                  height={variant.height}
                  src={variant.src}
                  width={variant.width}
                />
              }
            </span>
          ))}
        </span>
        {image.description ? (
          <span hidden id={descriptionId}>
            {image.description}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className="rtq-paper-image"
      data-align={params.get('align') ?? 'center'}
      data-indent={params.get('indent') ?? 'none'}
      data-kind={params.get('kind') ?? 'paper-image'}
      {...(size ? { 'data-size': size } : {})}
    >
      {
        // Canonical local assets have dynamic dimensions and are deliberately
        // served by the narrow same-origin route rather than Next Image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt ?? ''}
          aria-describedby={description ? descriptionId : undefined}
          data-alt-review={isPaperImage ? params.get('altReview') : undefined}
          height={positiveInteger(params.get('h'))}
          src={src}
          title={isPaperImage ? undefined : title}
          width={positiveInteger(params.get('w'))}
        />
      }
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
