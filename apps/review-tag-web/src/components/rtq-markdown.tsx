'use client';

import { PaperShapeSpan } from '@rtq/review-paper-browser/paper-shape';
import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperNativeMdx,
  remarkPaperShape,
  remarkPaperStructuredTable,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import React, { createElement } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from '@/lib/rtq-katex';
import { cn } from '@/lib/utils';

type RtqMarkdownProps = {
  className?: string;
  components?: Components;
  markdown: string;
};

export function RtqMarkdown({
  className,
  components,
  markdown,
}: RtqMarkdownProps) {
  if (!markdown.trim()) {
    return null;
  }

  return (
    <div className={cn('rtq-markdown', className)}>
      <ReactMarkdown
        components={{
          ...components,
          span: props =>
            'data-paper-shape' in props ? (
              <PaperShapeSpan {...props} />
            ) : components?.span ? (
              createElement(components.span, props)
            ) : (
              <PaperShapeSpan {...props} />
            ),
        }}
        rehypePlugins={[
          rehypePaperTable,
          rehypeRaw,
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
          remarkPaperShape,
          remarkPaperNativeMdx,
        ]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
