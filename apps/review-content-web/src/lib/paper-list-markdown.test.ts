import assert from 'node:assert/strict';
import test from 'node:test';

import {
  rehypePaperTable,
  remarkPaperAuthorNote,
  remarkPaperList,
  remarkPaperListMdx,
  remarkPaperSmall,
  remarkPaperSymbol,
  remarkPaperTable,
} from '@rtq/review-paper-markdown';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { rtqKatexOptions } from './rtq-katex.ts';
import { preparePaperListMarkdown } from './paper-list-markdown.ts';

test('preserves a valid PaperList for the shared render transform', () => {
  const markdown = [
    '<PaperList listStyleType="lower-alpha">',
    '',
    '1. One',
    '2. Two',
    '',
    '</PaperList>',
  ].join('\n');
  assert.deepEqual(preparePaperListMarkdown(markdown), { markdown });
});

test('keeps malformed PaperList content readable and reports the issue', () => {
  const prepared = preparePaperListMarkdown(
    '<PaperList listStyleType="square">\n\n- One\n- Two',
  );
  assert.match(prepared.issue ?? '', /PaperList|closing|end of file/i);
  assert.equal(prepared.markdown, '\n- One\n- Two');
});

test('does not parse LaTeX braces as MDX expressions during preparation', () => {
  const ordinaryWorking = String.raw`$
\begin{array}{cc}
{}^{\rtqMathsSubtractBorrow{7}} \cancel{8} & \boxed{?}
\end{array}
$`;
  const listWithMaths = String.raw`<PaperList listStyleType="upper-alpha">

- $\dfrac{1}{3}$
- $\large{\boxed{\text{X}}}$

</PaperList>`;

  assert.deepEqual(preparePaperListMarkdown(ordinaryWorking), {
    markdown: ordinaryWorking,
  });
  assert.deepEqual(preparePaperListMarkdown(listWithMaths), {
    markdown: listWithMaths,
  });
});

test('renders PaperList through the Review Content ReactMarkdown stack', () => {
  const markdown = [
    '<PaperList listStyleType="upper-roman">',
    '',
    '3. Parent',
    '   - Unwrapped child',
    '',
    '</PaperList>',
  ].join('\n');
  const html = renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperList,
        ],
      },
      markdown,
    ),
  );

  assert.match(html, /<ol start="3" style="list-style-type:upper-roman">/);
  assert.match(html, /<ul>\s*<li>Unwrapped child<\/li>\s*<\/ul>/);
  assert.doesNotMatch(html, /PaperList|listStyleType/);
});

test('renders unordered styles and semantic invalid-value defaults', () => {
  const render = (markdown: string) =>
    renderToStaticMarkup(
      createElement(
        ReactMarkdown,
        { remarkPlugins: [remarkPaperListMdx, remarkPaperList] },
        markdown,
      ),
    );

  assert.match(
    render(
      '<PaperList listStyleType="square">\n\n- One\n- Two\n\n</PaperList>',
    ),
    /<ul style="list-style-type:square">/,
  );
  assert.match(
    render(
      '<PaperList listStyleType="unsafe-value">\n\n1. One\n\n</PaperList>',
    ),
    /<ol style="list-style-type:decimal">/,
  );
});

test('renders PaperSmall with inline maths through the Review Content stack', () => {
  const html = renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [[rehypeKatex, rtqKatexOptions]],
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperSmall,
        ],
      },
      'Estimate. <PaperSmall aria-label="Supporting note">Rounded $x^2$</PaperSmall>',
    ),
  );

  assert.match(
    html,
    /<small aria-label="Supporting note" data-paper-small="">/,
  );
  assert.match(html, /class="katex"/);
  assert.doesNotMatch(html, /PaperSmall/);
});

test('renders PaperSymbol through the Review Content ReactMarkdown stack', () => {
  const html = renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [rehypePaperTable],
        remarkPlugins: [
          remarkGfm,
          remarkPaperListMdx,
          remarkPaperTable,
          remarkPaperSymbol,
        ],
      },
      '<PaperTable columnHeaders="none" rowHeaders="first-column">\n\n| Italy | <PaperSymbolGroup gap="md"><PaperSymbol name="computer" size="lg" /><PaperSymbol name="computer" variant="half" size="lg" /></PaperSymbolGroup> |\n| --- | --- |\n\n</PaperTable>',
    ),
  );

  assert.match(html, /<th scope="row">Italy<\/th>/);
  assert.match(html, /data-paper-symbol-group=""/);
  assert.equal(html.match(/data-paper-symbol=""/g)?.length, 2);
  assert.equal(html.match(/<svg/g)?.length, 2);
  assert.doesNotMatch(html, /PaperSymbol/);
});

test('renders PaperAuthorNote as labelled internal content with KaTeX', () => {
  const html = renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        rehypePlugins: [[rehypeKatex, rtqKatexOptions]],
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkPaperListMdx,
          remarkPaperAuthorNote,
        ],
      },
      '<PaperAuthorNote>\n\nCheck **every** $x^2$ variant.\n\n</PaperAuthorNote>',
    ),
  );

  assert.match(html, /<aside[^>]*class="paper-author-note"/);
  assert.match(html, /Paper author note · internal only/);
  assert.match(html, /<strong>every<\/strong>/);
  assert.match(html, /class="katex"/);
  assert.doesNotMatch(html, /PaperAuthorNote/);
});
