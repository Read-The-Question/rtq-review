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
import { useId } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from '@/lib/rtq-katex';

const TODO_IMAGE_SRC = '#rtq-todo-image';

function positiveInteger(value: null | string): number | undefined {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function PaperImage({
  alt,
  src,
  title,
}: Readonly<{ alt?: string; src?: string; title?: string }>) {
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

export function RtqMarkdown({ markdown }: { markdown: string }) {
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
