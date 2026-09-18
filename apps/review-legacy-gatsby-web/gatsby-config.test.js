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
    "\\rtqMathsBoxedCorrectValue",
    "\\rtqMathsBoxedCorrectValueFractionPaddingEachSide",
    "\\rtqMathsBoxedCorrectValueOneDigitPaddingEachSide",
    "\\rtqMathsBoxedEmptyValueFourDigitsWide",
    "\\rtqMathsBoxedEmptyValueFraction",
    "\\rtqMathsBoxedEmptyValueOneDigitWide",
    "\\rtqMathsBoxedEmptyValueThreeDigitsWide",
    "\\rtqMathsBoxedEmptyValueTwoDigitsWide",
    "\\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview",
    "\\rtqMathsBoxedValue",
    "\\rtqMathsBoxedValueFractionPaddingEachSide",
    "\\rtqMathsBoxedValueOneDigitPaddingEachSide",
    "\\rtqMathsColumnarArithmeticStyle",
    "\\rtqMathsColumnarDecimalPoint",
    "\\rtqMathsCorrectValue",
    "\\rtqMathsEmptyValueFourDigitsWide",
    "\\rtqMathsEmptyValueFraction",
    "\\rtqMathsEmptyValueOneDigitWide",
    "\\rtqMathsEmptyValueSolvedOrder",
    "\\rtqMathsEmptyValueThreeDigitsWide",
    "\\rtqMathsEmptyValueTwoDigitsWide",
    "\\rtqMathsEquationNumber",
    "\\rtqMathsIncorrectValue",
    "\\rtqMathsMultiplyCarryOver",
    "\\rtqMathsQuestionMarkOperatorPlaceholder",
    "\\rtqMathsQuestionMarkPlaceholder",
    "\\rtqMathsSequenceStep",
    "\\rtqMathsSequenceStepBare",
    "\\rtqMathsSizeEightPendingReview",
    "\\rtqMathsSizeElevenPendingReview",
    "\\rtqMathsSizeNinePendingReview",
    "\\rtqMathsSizeSevenPendingReview",
    "\\rtqMathsSizeTenPendingReview",
    "\\rtqMathsSolvedOrder",
    "\\rtqMathsSubtractBorrow",
    "\\rtqMathsSymbolAsterisk",
    "\\rtqMathsSymbolBigStarPendingReview",
    "\\rtqMathsSymbolBigTriangleUpPendingReview",
    "\\rtqMathsSymbolBlackHeartSuit",
    "\\rtqMathsSymbolBlackLozengePendingReview",
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
  const html = katex.renderToString(
    String.raw`\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview\rtqMathsBoxedEmptyValueFraction\rtqMathsEmptyValueFraction\rtqMathsBoxedCorrectValue{7}\rtqMathsEquationNumber{2}`,
    options,
  );
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /rtq-maths-equation-number/);
});
