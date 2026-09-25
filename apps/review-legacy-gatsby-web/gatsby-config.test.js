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
    ["\\rtqMathsQuestionMarkOperatorPlaceholder", "\\mathbin{?}"],
    [
      "\\rtqMathsDigitGroupSeparator",
      "\\rtqMathsSpaceOneSixthEm",
    ],
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
    "\\rtqMathsAddCarryOver",
    "\\rtqMathsBespokeSymbolFourPanePictogramFull",
    "\\rtqMathsBespokeSymbolFourPanePictogramHalf",
    "\\rtqMathsBespokeSymbolFourPanePictogramQuarter",
    "\\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters",
    "\\rtqMathsBespokeSymbolOutlinedCircle",
    "\\rtqMathsBespokeSymbolOutlinedDiamond",
    "\\rtqMathsBespokeSymbolOutlinedHexagon",
    "\\rtqMathsBespokeSymbolOutlinedTriangle",
    "\\rtqMathsBespokeSymbolSunWithRays",
    "\\rtqMathsBoxedBinaryOperator",
    "\\rtqMathsBoxedBinaryOperatorOneDigitPaddingEachSide",
    "\\rtqMathsBoxedCorrectBinaryOperator",
    "\\rtqMathsBoxedCorrectBinaryOperatorOneDigitPaddingEachSide",
    "\\rtqMathsBoxedCorrectRelation",
    "\\rtqMathsBoxedCorrectRelationOneDigitPaddingEachSide",
    "\\rtqMathsBoxedCorrectValue",
    "\\rtqMathsBoxedCorrectValueFractionPaddingEachSide",
    "\\rtqMathsBoxedCorrectValueOneDigitPaddingEachSide",
    "\\rtqMathsBoxedEmptyBinaryOperatorMatching",
    "\\rtqMathsBoxedEmptyBinaryOperatorUnknown",
    "\\rtqMathsBoxedEmptyRelationMatching",
    "\\rtqMathsBoxedEmptyRelationPendingReview",
    "\\rtqMathsBoxedEmptyValueFourDigitsWide",
    "\\rtqMathsBoxedEmptyValueFraction",
    "\\rtqMathsBoxedEmptyValueOneDigitWide",
    "\\rtqMathsBoxedEmptyValueThreeDigitsWide",
    "\\rtqMathsBoxedEmptyValueTwoDigitsWide",
    "\\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview",
    "\\rtqMathsBoxedRelation",
    "\\rtqMathsBoxedRelationOneDigitPaddingEachSide",
    "\\rtqMathsBoxedValue",
    "\\rtqMathsBoxedValueFractionPaddingEachSide",
    "\\rtqMathsBoxedValueOneDigitPaddingEachSide",
    "\\rtqMathsColumnarArithmeticStyle",
    "\\rtqMathsColumnarDecimalPoint",
    "\\rtqMathsCorrectValue",
    "\\rtqMathsDigitGroupSeparator",
    "\\rtqMathsEllipsisEmptyBinaryOperatorMatching",
    "\\rtqMathsEllipsisEmptyBinaryOperatorUnknown",
    "\\rtqMathsEllipsisEmptyRelationMatching",
    "\\rtqMathsEllipsisEmptyRelationPendingReview",
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
    "\\rtqMathsNumberTowerCellFourDigitsWide",
    "\\rtqMathsNumberTowerCellMatching",
    "\\rtqMathsNumberTowerCellSeparator",
    "\\rtqMathsNumberTowerCellTwoDigitsWide",
    "\\rtqMathsNumberTowerStyle",
    "\\rtqMathsQuestionMarkOperatorPlaceholder",
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
    "\\rtqMathsSpaceOneSixthEm",
    "\\rtqMathsSubtractBorrow",
    "\\rtqMathsSymbolAsterisk",
    "\\rtqMathsSymbolBigStarPendingReview",
    "\\rtqMathsSymbolBigTriangleUpPendingReview",
    "\\rtqMathsSymbolBlackCircle",
    "\\rtqMathsSymbolBlackClubSuit",
    "\\rtqMathsSymbolBlackHeartSuit",
    "\\rtqMathsSymbolBlackLozenge",
    "\\rtqMathsSymbolBlackSmilingFace",
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
  ];

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
    "\\text{\\char\"2665}",
  );
  assert.equal(
    options.macros["\\rtqMathsSymbolBlackSmilingFace"],
    "\\text{\\char\"263B}",
  );
  assert.equal(
    options.macros["\\rtqMathsSymbolBlackClubSuit"],
    "\\clubsuit",
  );
  assert.equal(
    options.macros["\\rtqMathsBespokeSymbolOutlinedDiamond"],
    "\\lozenge",
  );
  assert.equal(
    options.macros["\\rtqMathsBespokeSymbolSunWithRays"],
    "\\text{\\char\"263C}",
  );
  assert.equal(
    options.macros["\\rtqMathsBespokeSymbolOutlinedCircle"],
    "\\bigcirc",
  );
  assert.equal(
    options.macros["\\rtqMathsBespokeSymbolOutlinedTriangle"],
    "\\bigtriangleup",
  );
  assert.equal(
    options.macros["\\rtqMathsBespokeSymbolOutlinedHexagon"],
    "\\text{\\char\"2B21}",
  );
  assert.equal(options.macros["\\rtqMathsSymbolWhiteSquare"], "\\square");
  assert.equal(
    options.macros["\\rtqMathsNumberTowerCellFourDigitsWide"],
    "\\rtqMathsNumberTowerCellMatching{#1}{00}",
  );
  assert.equal(
    options.macros["\\rtqMathsNumberTowerCellSeparator"],
    "\\enspace",
  );
  assert.equal(
    options.macros["\\rtqMathsNumberTowerStyle"],
    "\\def\\arraystretch{2.5}",
  );
  const html = katex.renderToString(
    String.raw`\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview\rtqMathsBoxedEmptyValueFraction\rtqMathsBoxedEmptyBinaryOperatorUnknown\rtqMathsBoxedEmptyBinaryOperatorMatching{+}\rtqMathsBoxedEmptyRelationPendingReview\rtqMathsBoxedEmptyRelationMatching{=}\rtqMathsBoxedBinaryOperator{+}\rtqMathsBoxedBinaryOperatorOneDigitPaddingEachSide{\times}\rtqMathsBoxedRelation{=}\rtqMathsBoxedRelationOneDigitPaddingEachSide{<}\rtqMathsUnderlineEmptyValueShort\rtqMathsUnderlineEmptyValueMedium\rtqMathsUnderlineEmptyValueLong\rtqMathsUnderlineValue{7}\rtqMathsUnderlineValueShortPaddingEachSide{7}\rtqMathsUnderlineValueMediumPaddingEachSide{7}\rtqMathsUnderlineValueLongPaddingEachSide{7}\rtqMathsUnderlineCorrectValue{7}\rtqMathsUnderlineCorrectValueShortPaddingEachSide{7}\rtqMathsUnderlineCorrectValueMediumPaddingEachSide{7}\rtqMathsUnderlineCorrectValueLongPaddingEachSide{7}\rtqMathsEllipsisEmptyValueOneDigitWide\rtqMathsEllipsisEmptyValueTwoDigitsWide\rtqMathsEllipsisEmptyValueThreeDigitsWide\rtqMathsEllipsisEmptyValueFourDigitsWide\rtqMathsEllipsisEmptyValueFraction\rtqMathsEllipsisEmptyBinaryOperatorMatching{\times}\rtqMathsEllipsisEmptyRelationMatching{=}\rtqMathsEllipsisEmptyBinaryOperatorUnknown\rtqMathsEllipsisEmptyRelationPendingReview\rtqMathsEmptyValueFraction\rtqMathsBoxedCorrectValue{7}\rtqMathsBoxedCorrectBinaryOperator{+}\rtqMathsBoxedCorrectRelation{=}\rtqMathsEquationNumber{2}\rtqMathsSymbolBlackHeartSuit\rtqMathsSymbolWhiteSquare\rtqMathsSymbolBlackSmilingFace\rtqMathsSymbolBlackClubSuit\rtqMathsBespokeSymbolFourPanePictogramFull\rtqMathsBespokeSymbolFourPanePictogramQuarter\rtqMathsBespokeSymbolFourPanePictogramHalf\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters\rtqMathsBespokeSymbolOutlinedDiamond\rtqMathsBespokeSymbolSunWithRays\rtqMathsBespokeSymbolOutlinedCircle\rtqMathsBespokeSymbolOutlinedTriangle\rtqMathsBespokeSymbolOutlinedHexagon\rtqMathsNumberTowerStyle\begin{array}{c}\rtqMathsNumberTowerCellTwoDigitsWide{7}\\\rtqMathsNumberTowerCellFourDigitsWide{34}\rtqMathsNumberTowerCellSeparator\rtqMathsNumberTowerCellFourDigitsWide{}\end{array}`,
    options,
  );
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /♥/);
  assert.match(html, /□/);
  assert.match(html, /☻/);
  assert.match(html, /◊/);
  assert.match(html, /☼/);
  assert.match(html, /⬡/);
  assert.match(html, /rtq-maths-equation-number/);
});
