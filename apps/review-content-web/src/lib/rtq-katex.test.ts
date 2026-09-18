import assert from 'node:assert/strict';
import test from 'node:test';

import katex from 'katex';

import { rtqKatexMacros, rtqKatexOptions } from './rtq-katex.ts';

test('registers all prefixed RTQ macros including one-to-one symbol wrappers', () => {
  assert.equal(
    Object.keys(rtqKatexMacros).filter((name) => name.startsWith('\\rtqMaths'))
      .length,
    51,
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
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBoxDot'], '\\boxdot');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackHeartSuit'], '\\heartsuit');
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackTriangle'],
    '\\blacktriangle',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackSquare'], '\\blacksquare');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolPound'], undefined);
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolDegree'], undefined);
});

test('renders the shared equationNumber macro', () => {
  const html = katex.renderToString(
    String.raw`\rtqMathsEquationNumber{7}`,
    rtqKatexOptions,
  );

  assert.match(html, /class="[^"]*rtq-maths-equation-number/);
  assert.ok(html.replace(/<[^>]+>/g, '').includes('(7)'));
});

test('renders opt-in columnar arithmetic spacing', () => {
  const html = katex.renderToString(
    String.raw`\rtqMathsColumnarArithmeticStyle\begin{array}{c}1\\2\end{array}`,
    { ...rtqKatexOptions, throwOnError: true },
  );

  assert.match(html, /height:3\.6em/);
});

test('renders the boxed-value grammar', () => {
  const html = katex.renderToString(
    String.raw`\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview\rtqMathsBoxedEmptyValueFraction\rtqMathsEmptyValueFraction\rtqMathsBoxedValue{7}\rtqMathsBoxedCorrectValue{8}`,
    rtqKatexOptions,
  );

  assert.doesNotMatch(html, /katex-error/);
});

test('renders sequenceStep with a fractional step', () => {
  const html = katex.renderToString(
    String.raw`\rtqMathsSequenceStep{\dfrac{1}{1}}`,
    {
      ...rtqKatexOptions,
      throwOnError: true,
    },
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /class="[^"]*rtq-maths-working-step/);
});
