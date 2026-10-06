'use client';

import { PaperShapeSpan } from '@rtq/review-paper-browser/paper-shape';
import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperShape,
  remarkPaperStructuredTable,
  remarkPaperSymbol,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from '@/lib/rtq-katex';

type RtqMarkdownProps = {
  markdown: string;
};

export function RtqMarkdown({ markdown }: RtqMarkdownProps) {
  if (!markdown.trim()) {
    return null;
  }

  return (
    <div className="rtq-markdown">
      <ReactMarkdown
        components={{ span: PaperShapeSpan }}
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
          remarkPaperSymbol,
        ]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
