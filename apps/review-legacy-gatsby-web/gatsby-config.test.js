const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const katex = require("katex");

const gatsbyConfig = require("./gatsby-config");

test("keeps PaperAuthorNote visible and explicitly internal in legacy review", () => {
  const template = fs.readFileSync(
    "src/pages/{MarkdownRemark.frontmatter__slug}.js",
    "utf8",
  );
  const styles = fs.readFileSync("src/styles/styles.css", "utf8");

  assert.match(template, /renderInternalAuthorNotes/);
  assert.match(template, /Paper author note · internal only/);
  assert.match(template, /<aside aria-label=/);
  assert.match(styles, /\.paper-author-note\s*{/);
});

function getRtqKatexOptions() {
  const remark = gatsbyConfig.plugins.find(
    (plugin) => plugin.resolve === "gatsby-transformer-remark",
  );
  const katexPlugin = remark.options.plugins.find(
    (plugin) => plugin.resolve === "gatsby-remark-katex",
  );

  return katexPlugin.options;
}

test("applies columnar arithmetic spacing only when requested", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const plain = katex.renderToString(
    String.raw`\begin{array}{c}1\\2\end{array}`,
    options,
  );
  const columnar = katex.renderToString(
    String.raw`\rtqMathsColumnarArithmeticStyle\begin{array}{c}1\\2\end{array}`,
    options,
  );

  assert.match(plain, /height:2\.4em/);
  assert.doesNotMatch(plain, /height:3\.6em/);
  assert.match(columnar, /height:3\.6em/);
});

test("isolates pending size wrappers from adjacent spacing", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const normalize = (html) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");
  const cases = [
    ["\\rtqMathsSizeSevenPendingReview", "\\large"],
    ["\\rtqMathsSizeEightPendingReview", "\\Large"],
    ["\\rtqMathsSizeNinePendingReview", "\\LARGE"],
    ["\\rtqMathsSizeTenPendingReview", "\\huge"],
    ["\\rtqMathsSizeElevenPendingReview", "\\Huge"],
  ];

  for (const [wrapper, source] of cases) {
    const wrapped = `${wrapper}{1}\\rtqMathsListSeparator${wrapper}{2}`;
    const expected = `{${source} 1}\\quad{${source} 2}`;
    const rendered = normalize(katex.renderToString(wrapped, options));

    assert.equal(
      rendered,
      normalize(katex.renderToString(expected, options)),
      wrapper,
    );
    assert.doesNotMatch(
      rendered.match(/<span class="mspace[^"]*"/)?.[0] || "",
      /sizing|size[0-9]/,
      wrapper,
    );
  }
});

test("renders the columnar decimal point as the contracted zero-width overlap", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const normalize = (html) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");
  const macro = katex.renderToString(
    String.raw`\begin{array}{cc}2\rtqMathsColumnarDecimalPoint & 4\end{array}`,
    options,
  );
  const direct = katex.renderToString(
    String.raw`\begin{array}{cc}2\mathrlap{\mkern5mu .} & 4\end{array}`,
    options,
  );

  assert.equal(normalize(macro), normalize(direct));
  assert.match(macro, /rlap/);
});

test("renders question-mark placeholders with their contracted math roles", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const normalize = (html) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");
  const cases = [
    ["\\rtqMathsQuestionMarkPlaceholder", "\\mathord{?}"],
    ["\\rtqMathsBinaryOperatorQuestionMarkPlaceholder", "\\mathbin{?}"],
    ["\\rtqMathsDigitGroupSeparator", "\\rtqMathsSpaceOneSixthEm"],
    ["\\rtqMathsTimeSeparator", "\\mathord{:}"],
    ["\\rtqMathsRatioSeparator", "\\ratio"],
    ["\\rtqMathsTimeMeridiem{a.m.}", "\\ \\text{a.m.}"],
    ["\\rtqMathsTimeAm", "\\ \\text{am}"],
    ["\\rtqMathsTimePm", "\\ \\text{pm}"],
  ];

  for (const [macro, expansion] of cases) {
    assert.equal(
      normalize(katex.renderToString(macro, options)),
      normalize(katex.renderToString(expansion, options)),
    );
  }
});

test("renders sequence steps through the semantic working-step class", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const html = katex.renderToString(
    String.raw`\rtqMathsSequenceStep{+2}`,
    options,
  );

  assert.match(html, /class="[^"]*rtq-maths-working-step/);
});

test("registers and renders the complete prefixed RTQ vocabulary", () => {
  const options = { ...getRtqKatexOptions(), throwOnError: true };
  const expected = [
    "\\rtqMathsBinaryOperatorAsterisk",
    "\\rtqMathsBinaryOperatorOf",
    "\\rtqMathsUnit",
    "\\rtqMathsUnitCurrencyPence",
    "\\rtqMathsBinaryOperatorBlackSquare",
    "\\rtqMathsBinaryOperatorBoxDot",
    "\\rtqMathsAddCarryOver",
    "\\rtqMathsBespokeSymbolFourPanePictogramFull",
    "\\rtqMathsBespokeSymbolFourPanePictogramHalf",
    "\\rtqMathsBespokeSymbolFourPanePictogramQuarter",
    "\\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters",
    "\\rtqMathsBinaryOperatorBoxed",
    "\\rtqMathsBinaryOperatorBoxedOneDigitPaddingEachSide",
    "\\rtqMathsBoxedCellArrayFractionHighStyle",
    "\\rtqMathsBoxedCellArrayLayout",
    "\\rtqMathsBoxedCellArrayOneDigitHighStyle",
    "\\rtqMathsBoxedCellFourDigitsWideFractionHigh",
    "\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer",
    "\\rtqMathsBoxedCellMatching",
    "\\rtqMathsBoxedCellSeparator",
    "\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh",
    "\\rtqMathsBinaryOperatorBoxedCorrect",
    "\\rtqMathsBinaryOperatorBoxedCorrectOneDigitPaddingEachSide",
    "\\rtqMathsRelationBoxedCorrect",
    "\\rtqMathsRelationBoxedCorrectOneDigitPaddingEachSide",
    "\\rtqMathsBoxedCorrectValue",
    "\\rtqMathsBoxedCorrectValueFractionPaddingEachSide",
    "\\rtqMathsBoxedCorrectValueOneDigitPaddingEachSide",
    "\\rtqMathsBinaryOperatorBoxedEmptyMatching",
    "\\rtqMathsBinaryOperatorBoxedEmptyUnknown",
    "\\rtqMathsRelationBoxedEmptyMatching",
    "\\rtqMathsRelationBoxedEmptyUnknown",
    "\\rtqMathsBoxedEmptyValueFourDigitsWide",
    "\\rtqMathsBoxedEmptyValueFraction",
    "\\rtqMathsBoxedEmptyValueOneDigitWide",
    "\\rtqMathsBoxedEmptyValueThreeDigitsWide",
    "\\rtqMathsBoxedEmptyValueTwoDigitsWide",
    "\\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview",
    "\\rtqMathsRelationBoxed",
    "\\rtqMathsRelationBoxedOneDigitPaddingEachSide",
    "\\rtqMathsBoxedValue",
    "\\rtqMathsBoxedValueFractionPaddingEachSide",
    "\\rtqMathsBoxedValueOneDigitPaddingEachSide",
    "\\rtqMathsColumnarArithmeticStyle",
    "\\rtqMathsColumnarDecimalPoint",
    "\\rtqMathsCorrectValue",
    "\\rtqMathsDigitGroupSeparator",
    "\\rtqMathsBinaryOperatorEllipsisEmptyMatching",
    "\\rtqMathsBinaryOperatorEllipsisEmptyUnknown",
    "\\rtqMathsRelationEllipsisEmptyMatching",
    "\\rtqMathsRelationEllipsisEmptyUnknown",
    "\\rtqMathsEllipsisEmptyValueFourDigitsWide",
    "\\rtqMathsEllipsisEmptyValueFraction",
    "\\rtqMathsEllipsisEmptyValueOneDigitWide",
    "\\rtqMathsEllipsisEmptyValueThreeDigitsWide",
    "\\rtqMathsEllipsisEmptyValueTwoDigitsWide",
    "\\rtqMathsEmptyValueFourDigitsWide",
    "\\rtqMathsEmptyValueFraction",
    "\\rtqMathsEmptyValueOneDigitWide",
    "\\rtqMathsEmptyValueSolvedOrder",
    "\\rtqMathsEmptyValueThreeDigitsWide",
    "\\rtqMathsEmptyValueTwoDigitsWide",
    "\\rtqMathsEquationNumber",
    "\\rtqMathsIncorrectValue",
    "\\rtqMathsListSeparator",
    "\\rtqMathsMultiplyCarryOver",
    "\\rtqMathsBinaryOperatorQuestionMarkPlaceholder",
    "\\rtqMathsQuestionMarkPlaceholder",
    "\\rtqMathsRatioSeparator",
    "\\rtqMathsSequenceEllipsis",
    "\\rtqMathsSequenceStep",
    "\\rtqMathsSequenceStepBare",
    "\\rtqMathsSizeEightPendingReview",
    "\\rtqMathsSizeElevenPendingReview",
    "\\rtqMathsSizeNinePendingReview",
    "\\rtqMathsSizeSevenPendingReview",
    "\\rtqMathsSizeTenPendingReview",
    "\\rtqMathsSolvedOrder",
    "\\rtqMathsSpaceHalfEm",
    "\\rtqMathsSpaceOneSixthEm",
    "\\rtqMathsSubtractBorrow",
    "\\rtqMathsSymbolAsterisk",
    "\\rtqMathsSymbolBigStarPendingReview",
    "\\rtqMathsSymbolBigTriangleUpPendingReview",
    "\\rtqMathsSymbolBlackCircle",
    "\\rtqMathsSymbolBlackHeartSuit",
    "\\rtqMathsSymbolBlackLozenge",
    "\\rtqMathsSymbolBlackSquare",
    "\\rtqMathsSymbolBlackTriangle",
    "\\rtqMathsSymbolBlackTrianglePendingReview",
    "\\rtqMathsSymbolBoxDot",
    "\\rtqMathsSymbolCheckmarkPendingReview",
    "\\rtqMathsSymbolClubSuitPendingReview",
    "\\rtqMathsSymbolDiamondSuitPendingReview",
    "\\rtqMathsSymbolDollar",
    "\\rtqMathsSymbolEuro",
    "\\rtqMathsSymbolHeartSuitPendingReview",
    "\\rtqMathsSymbolHeartsPendingReview",
    "\\rtqMathsSymbolSpadeSuitPendingReview",
    "\\rtqMathsSymbolTrianglePendingReview",
    "\\rtqMathsSymbolWhiteSquare",
    "\\rtqMathsTimeAm",
    "\\rtqMathsTimeMeridiem",
    "\\rtqMathsTimePm",
    "\\rtqMathsTimeSeparator",
    "\\rtqMathsUnderlineCorrectValue",
    "\\rtqMathsUnderlineCorrectValueLongPaddingEachSide",
    "\\rtqMathsUnderlineCorrectValueMediumPaddingEachSide",
    "\\rtqMathsUnderlineCorrectValueShortPaddingEachSide",
    "\\rtqMathsUnderlineEmptyValueLong",
    "\\rtqMathsUnderlineEmptyValueMedium",
    "\\rtqMathsUnderlineEmptyValueShort",
    "\\rtqMathsUnderlineValue",
    "\\rtqMathsUnderlineValueLongPaddingEachSide",
    "\\rtqMathsUnderlineValueMediumPaddingEachSide",
    "\\rtqMathsUnderlineValueShortPaddingEachSide",
  ].sort();

  assert.deepEqual(
    Object.keys(options.macros)
      .filter((name) => name.startsWith("\\rtqMaths"))
      .sort(),
    expected,
  );
  assert.equal(
    options.macros["\\rtqMathsSymbolTrianglePendingReview"],
    "\\triangle",
  );
  assert.equal(options.macros["\\rtqMathsSymbolBoxDot"], "\\boxdot");
  assert.equal(
    options.macros["\\rtqMathsSymbolBlackHeartSuit"],
    '\\text{\\char"2665}',
  );
  assert.equal(options.macros["\\rtqMathsSymbolWhiteSquare"], "\\square");
  assert.equal(
    options.macros["\\rtqMathsBoxedCellMatching"],
    "\\boxed{\\vphantom{#3}\\phantom{#2}\\mathclap{#1}\\phantom{#2}}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh"],
    "\\rtqMathsBoxedCellMatching{#1}{0}{0}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellFourDigitsWideFractionHigh"],
    "\\rtqMathsBoxedCellMatching{#1}{00}{\\dfrac{0}{0}}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer"],
    "\\phantom{\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellArrayLayout"],
    "\\def\\arraystretch{#1}\\def\\rtqMathsBoxedCellSeparator{#2}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellArrayOneDigitHighStyle"],
    "\\rtqMathsBoxedCellArrayLayout{1.5}{\\rtqMathsSpaceOneSixthEm}",
  );
  assert.equal(
    options.macros["\\rtqMathsBoxedCellArrayFractionHighStyle"],
    "\\rtqMathsBoxedCellArrayLayout{2.2}{\\rtqMathsSpaceOneSixthEm}",
  );
  assert.equal(options.macros["\\rtqMathsBoxedCellSeparator"], "\\enspace");
  const html = katex.renderToString(
    String.raw`\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview\rtqMathsBoxedEmptyValueFraction\rtqMathsBinaryOperatorBoxedEmptyUnknown\rtqMathsBinaryOperatorBoxedEmptyMatching{+}\rtqMathsRelationBoxedEmptyUnknown\rtqMathsRelationBoxedEmptyMatching{=}\rtqMathsBinaryOperatorBoxed{+}\rtqMathsBinaryOperatorBoxedOneDigitPaddingEachSide{\times}\rtqMathsRelationBoxed{=}\rtqMathsRelationBoxedOneDigitPaddingEachSide{<}\rtqMathsUnderlineEmptyValueShort\rtqMathsUnderlineEmptyValueMedium\rtqMathsUnderlineEmptyValueLong\rtqMathsUnderlineValue{7}\rtqMathsUnderlineValueShortPaddingEachSide{7}\rtqMathsUnderlineValueMediumPaddingEachSide{7}\rtqMathsUnderlineValueLongPaddingEachSide{7}\rtqMathsUnderlineCorrectValue{7}\rtqMathsUnderlineCorrectValueShortPaddingEachSide{7}\rtqMathsUnderlineCorrectValueMediumPaddingEachSide{7}\rtqMathsUnderlineCorrectValueLongPaddingEachSide{7}\rtqMathsEllipsisEmptyValueOneDigitWide\rtqMathsEllipsisEmptyValueTwoDigitsWide\rtqMathsEllipsisEmptyValueThreeDigitsWide\rtqMathsEllipsisEmptyValueFourDigitsWide\rtqMathsEllipsisEmptyValueFraction\rtqMathsBinaryOperatorEllipsisEmptyMatching{\times}\rtqMathsRelationEllipsisEmptyMatching{=}\rtqMathsBinaryOperatorEllipsisEmptyUnknown\rtqMathsRelationEllipsisEmptyUnknown\rtqMathsEmptyValueFraction\rtqMathsBoxedCorrectValue{7}\rtqMathsBinaryOperatorBoxedCorrect{+}\rtqMathsRelationBoxedCorrect{=}\rtqMathsEquationNumber{2}\rtqMathsSymbolBlackHeartSuit\rtqMathsSymbolWhiteSquare\rtqMathsBespokeSymbolFourPanePictogramFull\rtqMathsBespokeSymbolFourPanePictogramQuarter\rtqMathsBespokeSymbolFourPanePictogramHalf\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters\rtqMathsBoxedCellArrayOneDigitHighStyle\begin{array}{c}\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{7}\\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{34}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh{}\end{array}\quad\rtqMathsBoxedCellArrayFractionHighStyle\begin{array}{l}\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHigh{1}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{\rtqMathsSymbolAsterisk}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{4}\\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{2}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\rtqMathsBoxedCellSeparator\rtqMathsBoxedCellFourDigitsWideFractionHigh{}\end{array}`,
    options,
  );
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /♥/);
  assert.match(html, /□/);
  assert.match(html, /rtq-maths-equation-number/);
});
