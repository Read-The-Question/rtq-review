'use client';

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
        rehypePlugins={[rehypeRaw, [rehypeKatex, rtqKatexOptions]]}
        remarkPlugins={[remarkGfm, remarkMath]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
