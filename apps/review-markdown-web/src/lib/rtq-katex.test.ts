import assert from 'node:assert/strict';
import test from 'node:test';

import { renderMarkdownToHtml } from './markdown-renderer.ts';
import { rtqKatexMacros } from './rtq-katex.ts';

test('registers all prefixed RTQ macros including one-to-one symbol wrappers', () => {
  assert.equal(
    Object.keys(rtqKatexMacros).filter(name => name.startsWith('\\rtqMaths'))
      .length,
    124,
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
    rtqKatexMacros['\\rtqMathsDigitGroupSeparator'],
    '\\rtqMathsSpaceOneSixthEm',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsSpaceOneSixthEm'], '\\,');
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellMatching'],
    '\\boxed{\\vphantom{#3}\\phantom{#2}\\mathclap{#1}\\phantom{#2}}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh'],
    '\\rtqMathsBoxedCellMatching{#1}{0}{0}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellFourDigitsWideFractionHigh'],
    '\\rtqMathsBoxedCellMatching{#1}{00}{\\dfrac{0}{0}}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer'],
    '\\phantom{\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellArrayOneDigitHighStyle'],
    '\\def\\arraystretch{1.5}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBoxedCellArrayFractionHighStyle'],
    '\\def\\arraystretch{2.5}',
  );
  assert.equal(rtqKatexMacros['\\rtqMathsBoxedCellSeparator'], '\\enspace');
  assert.equal(
    rtqKatexMacros['\\rtqMathsNumberTowerCellSeparator'],
    '\\rtqMathsBoxedCellSeparator',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsNumberTowerOneDigitHighStyle'],
    '\\rtqMathsBoxedCellArrayOneDigitHighStyle',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsNumberTowerFractionHighStyle'],
    '\\rtqMathsBoxedCellArrayFractionHighStyle',
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
  assert.equal(
    rtqKatexMacros['\\rtqMathsBespokeSymbolOutlinedDiamond'],
    '\\lozenge',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBespokeSymbolSunWithRays'],
    '\\text{\\char"263C}',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBespokeSymbolOutlinedCircle'],
    '\\bigcirc',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBespokeSymbolOutlinedTriangle'],
    '\\bigtriangleup',
  );
  assert.equal(
    rtqKatexMacros['\\rtqMathsBespokeSymbolOutlinedHexagon'],
    '\\text{\\char"2B21}',
  );
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

test('renders fixed-geometry number towers through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsNumberTowerOneDigitHighStyle\begin{array}{c}\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{7}\\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{34}\rtqMathsNumberTowerCellSeparator\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{}\end{array}\quad\rtqMathsBoxedCellArrayFractionHighStyle\begin{array}{l}\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHigh{1}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{\rtqMathsSymbolAsterisk}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{4}\\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{2}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\end{array}$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, />7</);
  assert.match(html, />34</);
  assert.match(html, />1</);
  assert.match(html, />2</);
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

test('renders the approved bespoke symbols through Markdown', async () => {
  const html = await renderMarkdownToHtml(
    String.raw`$\rtqMathsBespokeSymbolFourPanePictogramFull + \rtqMathsBespokeSymbolFourPanePictogramQuarter + \rtqMathsBespokeSymbolFourPanePictogramHalf + \rtqMathsBespokeSymbolFourPanePictogramThreeQuarters + \rtqMathsBespokeSymbolOutlinedDiamond + \rtqMathsBespokeSymbolSunWithRays + \rtqMathsBespokeSymbolOutlinedCircle + \rtqMathsBespokeSymbolOutlinedTriangle + \rtqMathsBespokeSymbolOutlinedHexagon$`,
    rtqKatexMacros,
  );

  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /□/);
  assert.match(html, /◊/);
  assert.match(html, /☼/);
  assert.match(html, /⬡/);
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
