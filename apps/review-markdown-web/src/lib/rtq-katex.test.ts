import assert from 'node:assert/strict';
import test from 'node:test';

import { renderMarkdownToHtml } from './markdown-renderer.ts';
import { rtqKatexMacros } from './rtq-katex.ts';

test('registers all prefixed RTQ macros including one-to-one symbol wrappers', () => {
  assert.equal(
    Object.keys(rtqKatexMacros).filter(name => name.startsWith('\\rtqMaths'))
      .length,
    103,
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsUnderlineEmptyValueLong'],
    '\\underline{\\phantom{000000000000}}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsEllipsisEmptyValueFraction'],
    '\\rtqMathsBoxedEmptyValueFraction',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSequenceEllipsis'], '\\ldots');
  assert.equal(rtqKatexMacros['\\rtqMathsListSeparator'], '\\quad');
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
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackHeartSuit'],
    '\\text{\\char"2665}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackTriangle'],
    '\\blacktriangle',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackSquare'], '\\blacksquare');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolWhiteSquare'], '\\square');
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackCircle'],
    '\\mathord{\\Large\\bullet}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackLozenge'],
    '\\blacklozenge',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsSymbolBlackSmilingFace'],
    '\\text{\\char"263B}',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolBlackClubSuit'], '\\clubsuit');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolPound'], '\\pounds');
  assert.equal(rtqKatexMacros['\\rtqMathsSymbolDegree'], undefined);
});

test('renders the pound wrapper through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsSymbolPound 12.50$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /£/);
});

test('renders the approved symbol wrappers through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsSymbolBlackCircle + \rtqMathsSymbolBlackLozenge + \rtqMathsSymbolBlackHeartSuit + \rtqMathsSymbolWhiteSquare + \rtqMathsSymbolBlackSmilingFace + \rtqMathsSymbolBlackClubSuit$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /♥/);
  assert.match(html, /□/);
  assert.match(html, /☻/);
});

test('renders question-mark placeholders with ordinary and operator spacing', async () => {
  const ordinary = await renderMarkdownToHtml(
    String.raw`$1\rtqMathsQuestionMarkPlaceholder2$`,
    rtqKatexMacros,
  );
  const operator = await renderMarkdownToHtml(
    String.raw`$1\rtqMathsQuestionMarkOperatorPlaceholder2$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(ordinary, /katex-error/);
  assert.doesNotMatch(operator, /katex-error/);
  assert.notEqual(ordinary, operator);
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

test('renders the columnar decimal point through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\begin{array}{cc}2\rtqMathsColumnarDecimalPoint & 4\end{array}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /rlap/);
});

test('renders the boxed-value grammar through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview\rtqMathsBoxedEmptyValueFraction\rtqMathsBoxedBinaryOperator{+}\rtqMathsBoxedBinaryOperatorOneDigitPaddingEachSide{\times}\rtqMathsBoxedRelation{=}\rtqMathsBoxedRelationOneDigitPaddingEachSide{<}\rtqMathsUnderlineEmptyValueShort\rtqMathsUnderlineEmptyValueMedium\rtqMathsUnderlineEmptyValueLong\rtqMathsUnderlineValue{7}\rtqMathsUnderlineValueShortPaddingEachSide{7}\rtqMathsUnderlineValueMediumPaddingEachSide{7}\rtqMathsUnderlineValueLongPaddingEachSide{7}\rtqMathsUnderlineCorrectValue{8}\rtqMathsUnderlineCorrectValueShortPaddingEachSide{8}\rtqMathsUnderlineCorrectValueMediumPaddingEachSide{8}\rtqMathsUnderlineCorrectValueLongPaddingEachSide{8}\rtqMathsEllipsisEmptyValueOneDigitWide\rtqMathsEllipsisEmptyValueTwoDigitsWide\rtqMathsEllipsisEmptyValueThreeDigitsWide\rtqMathsEllipsisEmptyValueFourDigitsWide\rtqMathsEllipsisEmptyValueFraction\rtqMathsEllipsisEmptyBinaryOperatorMatching{\times}\rtqMathsEllipsisEmptyRelationMatching{=}\rtqMathsEllipsisEmptyBinaryOperatorUnknown\rtqMathsEllipsisEmptyRelationPendingReview\rtqMathsEmptyValueFraction\rtqMathsBoxedValue{7}\rtqMathsBoxedCorrectValue{8}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
});

test('renders sequenceStep with a fractional step through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsSequenceStep{\dfrac{1}{1}}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /class="[^"]*rtq-maths-working-step/);
});
