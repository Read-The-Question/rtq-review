import assert from 'node:assert/strict';
import test from 'node:test';

import katex from 'katex';

import { rtqKatexMacros, rtqKatexOptions } from './rtq-katex.ts';

test('registers all prefixed RTQ macros including one-to-one symbol wrappers', () => {
  assert.equal(
    Object.keys(rtqKatexMacros).filter(name => name.startsWith('\\rtqMaths'))
      .length,
    59,
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

test('renders question-mark placeholders with ordinary and operator spacing', () => {
  const ordinary = katex.renderToString(
    String.raw`1\rtqMathsQuestionMarkPlaceholder2`,
    { ...rtqKatexOptions, throwOnError: true },
  );
  const operator = katex.renderToString(
    String.raw`1\rtqMathsQuestionMarkOperatorPlaceholder2`,
    { ...rtqKatexOptions, throwOnError: true },
  );

  assert.doesNotMatch(ordinary, /katex-error/);
  assert.doesNotMatch(operator, /katex-error/);
  assert.notEqual(ordinary, operator);
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

test('renders the columnar decimal point', () => {
  const html = katex.renderToString(
    String.raw`\begin{array}{cc}2\rtqMathsColumnarDecimalPoint & 4\end{array}`,
    { ...rtqKatexOptions, throwOnError: true },
  );

  assert.match(html, /rlap/);
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
