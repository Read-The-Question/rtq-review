import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';
import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperNativeMdx,
  remarkPaperStructuredTable,
  remarkPaperTable,
  toPaperMdxCompatibilityMarkdown,
  toPaperSymbolCompatibilityMarkdown,
} from '@rtq/review-paper-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function renderMarkdownToHtml(
  markdown: string,
  macros: Record<string, string>,
) {
  const preparedMarkdown = toPaperMdxCompatibilityMarkdown(
    toPaperSymbolCompatibilityMarkdown(markdown),
  );
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPaperListMdx)
    .use(remarkPaperAuthorNote)
    .use(remarkPaperTable)
    .use(remarkPaperStructuredTable)
    .use(remarkPaperList)
    .use(remarkPaperNativeMdx)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePaperTable)
    .use(rehypeKatex as never, getRtqReviewKatexOptions(macros) as never)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(preparedMarkdown);

  return String(file);
}
