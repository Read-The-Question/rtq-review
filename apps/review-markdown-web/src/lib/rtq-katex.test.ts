import assert from 'node:assert/strict';
import test from 'node:test';

import { renderMarkdownToHtml } from './markdown-renderer.ts';
import { rtqKatexMacros } from './rtq-katex.ts';

test('registers all prefixed RTQ macros including one-to-one symbol wrappers', () => {
  assert.equal(
    Object.keys(rtqKatexMacros).filter(name => name.startsWith('\\rtqMaths'))
      .length,
    30,
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolTrianglePendingReview'],
    '\\triangle',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolHeartsPendingReview'],
    '\\hearts',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolHeartSuitPendingReview'],
    '\\heartsuit',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolEuro'], '\\text{€}');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolAsterisk'], '\\ast');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackHeartSuit'], '\\heartsuit');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackTriangle'], '\\blacktriangle');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackSquare'], '\\blacksquare');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolPound'], undefined);
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolDegree'], undefined);
});

test('renders the shared equationNumber macro through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`Inline $\rtqMathsEquationNumber{7}$.`,
    rtqKatexMacros,
  );

  assert.match(html, /class="[^"]*rtq-maths-equation-number/);
  assert.ok(html.replace(/<[^>]+>/g, '').includes('(7)'));
});

test('renders opt-in columnar arithmetic spacing through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsColumnarArithmeticStyle\begin{array}{c}1\\2\end{array}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /height:3\.6em/);
});

test('renders sequenceStep with a fractional step through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsSequenceStep{\dfrac{1}{1}}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /color:#ed5fa6/);
});
