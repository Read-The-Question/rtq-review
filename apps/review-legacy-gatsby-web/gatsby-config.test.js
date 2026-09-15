const assert = require("node:assert/strict");
const test = require("node:test");

const katex = require("katex");

const gatsbyConfig = require("./gatsby-config");

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
    "\\rtqMathsBoxedEmptyValue",
    "\\rtqMathsBoxedFilledValue",
    "\\rtqMathsColumnarArithmeticStyle",
    "\\rtqMathsEquationNumber",
    "\\rtqMathsFilledValue",
    "\\rtqMathsIncorrectValue",
    "\\rtqMathsMultiplyCarryOver",
    "\\rtqMathsSequenceStep",
    "\\rtqMathsSequenceStepBare",
    "\\rtqMathsSolvedOrder",
    "\\rtqMathsSolvedOrderPhantom",
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
    String.raw`\rtqMathsBoxedEmptyValue\rtqMathsEquationNumber{2}`,
    options,
  );
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /rtq-maths-equation-number/);
});
