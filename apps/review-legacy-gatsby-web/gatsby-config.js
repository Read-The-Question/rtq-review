/**
 * @type {import('gatsby').GatsbyConfig}
 */
const rtqKatexMacros = {
  "\\rtqMathsBoxedCellMatching":
    "\\boxed{\\vphantom{#3}\\phantom{#2}\\mathclap{#1}\\phantom{#2}}",
  "\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh":
    "\\rtqMathsBoxedCellMatching{#1}{0}{0}",
  "\\rtqMathsBoxedCellFourDigitsWideFractionHigh":
    "\\rtqMathsBoxedCellMatching{#1}{00}{\\dfrac{0}{0}}",
  "\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer":
    "\\phantom{\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}}",
  "\\rtqMathsBoxedCellArrayLayout":
    "\\def\\arraystretch{#1}\\def\\rtqMathsBoxedCellSeparator{#2}",
  "\\rtqMathsBoxedCellArrayOneDigitHighStyle":
    "\\rtqMathsBoxedCellArrayLayout{1.5}{\\rtqMathsSpaceOneSixthEm}",
  "\\rtqMathsBoxedCellArrayFractionHighStyle":
    "\\rtqMathsBoxedCellArrayLayout{2.2}{\\rtqMathsSpaceOneSixthEm}",
  "\\rtqMathsBoxedCellSeparator": "\\enspace",
  "\\rtqMathsBespokeSymbolFourPanePictogramFull":
    "\\mathord{\\begin{matrix}\\square\\square\\\\\\square\\square\\end{matrix}}",
  "\\rtqMathsBespokeSymbolFourPanePictogramQuarter":
    "\\mathord{\\begin{matrix}\\square\\phantom{\\square}\\\\\\phantom{\\square}\\phantom{\\square}\\end{matrix}}",
  "\\rtqMathsBespokeSymbolFourPanePictogramHalf":
    "\\mathord{\\begin{matrix}\\square\\phantom{\\square}\\\\\\square\\phantom{\\square}\\end{matrix}}",
  "\\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters":
    "\\mathord{\\begin{matrix}\\square\\square\\\\\\square\\phantom{\\square}\\end{matrix}}",
  "\\rtqMathsSymbolDollar": "\\text{\\textdollar}",
  "\\rtqMathsSymbolEuro": "\\text{€}",
  "\\rtqMathsSymbolAsterisk": "\\ast",
  "\\rtqMathsSymbolBoxDot": "\\boxdot",
  "\\rtqMathsSymbolBlackHeartSuit": "\\text{\\char\"2665}",
  "\\rtqMathsSymbolBlackTriangle": "\\blacktriangle",
  "\\rtqMathsSymbolBlackSquare": "\\blacksquare",
  "\\rtqMathsSymbolWhiteSquare": "\\square",
  "\\rtqMathsSymbolBlackCircle": "\\mathord{\\Large\\bullet}",
  "\\rtqMathsSymbolBlackLozenge": "\\blacklozenge",
  "\\rtqMathsSymbolBlackSmilingFace": "\\text{\\char\"263B}",
  "\\rtqMathsBinaryOperatorAsterisk":
    "\\mathbin{\\rtqMathsSymbolAsterisk}",
  "\\rtqMathsBinaryOperatorBoxDot":
    "\\mathbin{\\rtqMathsSymbolBoxDot}",
  "\\rtqMathsBinaryOperatorBlackSquare":
    "\\mathbin{\\rtqMathsSymbolBlackSquare}",
  "\\rtqMathsSymbolHeartsPendingReview": "\\hearts",
  "\\rtqMathsSymbolHeartSuitPendingReview": "\\heartsuit",
  "\\rtqMathsSymbolSpadeSuitPendingReview": "\\spadesuit",
  "\\rtqMathsSymbolClubSuitPendingReview": "\\clubsuit",
  "\\rtqMathsSymbolDiamondSuitPendingReview": "\\diamondsuit",
  "\\rtqMathsSymbolTrianglePendingReview": "\\triangle",
  "\\rtqMathsSymbolBigTriangleUpPendingReview": "\\bigtriangleup",
  "\\rtqMathsSymbolBlackTrianglePendingReview": "\\blacktriangle",
  "\\rtqMathsSymbolBigStarPendingReview": "\\bigstar",
  "\\rtqMathsSymbolCheckmarkPendingReview": "\\checkmark",
  // RTQ content macros are real KaTeX macros, so they only apply inside math
  // blocks. Keep non-math scaffolding placeholders in the Rukian pipeline.
  // "\\rtqMathsAddCarryOver": "\\scriptstyle \\grayF",
  // "\\rtqMathsMultiplyCarryOver": "\\scriptstyle \\grayF",
  // "\\rtqMathsSubtractBorrow": "\\textstyle \\green",
  // "\\rtqMathsAddCarryOver": "\\textstyle \\grayF",
  // "\\rtqMathsMultiplyCarryOver": "{}^{\\scriptstyle \\grayF}{#1}",
  // "\\rtqMathsMultiplyCarryOver": "\\mkern-9mu{\\scriptstyle \\grayF{#1}}",
  "\\rtqMathsAddCarryOver": "\\scriptstyle \\grayF",
  "\\rtqMathsMultiplyCarryOver": "\\scriptstyle \\grayF{#1}",
  "\\rtqMathsSubtractBorrow": "\\textstyle \\green",
  "\\rtqMathsSequenceStep":
    "\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}",
  "\\rtqMathsSequenceStepBare":
    "\\htmlClass{rtq-maths-working-step}{\\footnotesize{#1}}",
  "\\rtqMathsCorrectValue": "\\textcolor{green}{#1}",
  "\\rtqMathsIncorrectValue": "\\textcolor{red}{#1}",
  "\\rtqMathsBoxedValue": "\\boxed{#1}",
  "\\rtqMathsBoxedValueOneDigitPaddingEachSide":
    "\\boxed{\\phantom{0}#1\\phantom{0}}",
  "\\rtqMathsBoxedValueFractionPaddingEachSide":
    "\\boxed{\\phantom{\\dfrac{0}{0}}#1\\phantom{\\dfrac{0}{0}}}",
  "\\rtqMathsBoxedCorrectValue": "\\boxed{\\rtqMathsCorrectValue{#1}}",
  "\\rtqMathsBoxedCorrectValueOneDigitPaddingEachSide":
    "\\boxed{\\phantom{0}\\rtqMathsCorrectValue{#1}\\phantom{0}}",
  "\\rtqMathsBoxedCorrectValueFractionPaddingEachSide":
    "\\boxed{\\phantom{\\dfrac{0}{0}}\\rtqMathsCorrectValue{#1}\\phantom{\\dfrac{0}{0}}}",
  "\\rtqMathsBoxedEmptyValueZeroDigitsWidePendingReview": "\\boxed{}",
  "\\rtqMathsBoxedEmptyValueOneDigitWide": "\\boxed{\\phantom{0}}",
  "\\rtqMathsBoxedEmptyValueTwoDigitsWide": "\\boxed{\\phantom{00}}",
  "\\rtqMathsBoxedEmptyValueThreeDigitsWide": "\\boxed{\\phantom{000}}",
  "\\rtqMathsBoxedEmptyValueFourDigitsWide": "\\boxed{\\phantom{0000}}",
  "\\rtqMathsBoxedEmptyValueFraction": "\\boxed{\\phantom{\\dfrac{0}{0}}}",
  "\\rtqMathsBinaryOperatorBoxedEmptyMatching":
    "\\mathbin{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsRelationBoxedEmptyMatching":
    "\\mathrel{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsBinaryOperatorBoxedEmptyUnknown":
    "\\rtqMathsBinaryOperatorBoxedEmptyMatching{+}",
  "\\rtqMathsRelationBoxedEmptyUnknown":
    "\\rtqMathsRelationBoxedEmptyMatching{=}",
  "\\rtqMathsBinaryOperatorBoxed": "\\mathbin{\\boxed{#1}}",
  "\\rtqMathsBinaryOperatorBoxedOneDigitPaddingEachSide":
    "\\mathbin{\\boxed{\\phantom{0}#1\\phantom{0}}}",
  "\\rtqMathsRelationBoxed": "\\mathrel{\\boxed{#1}}",
  "\\rtqMathsRelationBoxedOneDigitPaddingEachSide":
    "\\mathrel{\\boxed{\\phantom{0}#1\\phantom{0}}}",
  "\\rtqMathsBinaryOperatorBoxedCorrect":
    "\\mathbin{\\boxed{\\rtqMathsCorrectValue{#1}}}",
  "\\rtqMathsBinaryOperatorBoxedCorrectOneDigitPaddingEachSide":
    "\\mathbin{\\boxed{\\phantom{0}\\rtqMathsCorrectValue{#1}\\phantom{0}}}",
  "\\rtqMathsRelationBoxedCorrect":
    "\\mathrel{\\boxed{\\rtqMathsCorrectValue{#1}}}",
  "\\rtqMathsRelationBoxedCorrectOneDigitPaddingEachSide":
    "\\mathrel{\\boxed{\\phantom{0}\\rtqMathsCorrectValue{#1}\\phantom{0}}}",
  "\\rtqMathsUnderlineEmptyValueShort": "\\underline{\\phantom{0000}}",
  "\\rtqMathsUnderlineEmptyValueMedium":
    "\\underline{\\phantom{00000000}}",
  "\\rtqMathsUnderlineEmptyValueLong":
    "\\underline{\\phantom{000000000000}}",
  "\\rtqMathsUnderlineValue": "\\underline{#1}",
  "\\rtqMathsUnderlineValueShortPaddingEachSide":
    "\\underline{\\phantom{00}#1\\phantom{00}}",
  "\\rtqMathsUnderlineValueMediumPaddingEachSide":
    "\\underline{\\phantom{0000}#1\\phantom{0000}}",
  "\\rtqMathsUnderlineValueLongPaddingEachSide":
    "\\underline{\\phantom{000000}#1\\phantom{000000}}",
  "\\rtqMathsUnderlineCorrectValue":
    "\\underline{\\rtqMathsCorrectValue{#1}}",
  "\\rtqMathsUnderlineCorrectValueShortPaddingEachSide":
    "\\underline{\\phantom{00}\\rtqMathsCorrectValue{#1}\\phantom{00}}",
  "\\rtqMathsUnderlineCorrectValueMediumPaddingEachSide":
    "\\underline{\\phantom{0000}\\rtqMathsCorrectValue{#1}\\phantom{0000}}",
  "\\rtqMathsUnderlineCorrectValueLongPaddingEachSide":
    "\\underline{\\phantom{000000}\\rtqMathsCorrectValue{#1}\\phantom{000000}}",
  "\\rtqMathsEllipsisEmptyValueOneDigitWide":
    "\\rtqMathsBoxedEmptyValueOneDigitWide",
  "\\rtqMathsEllipsisEmptyValueTwoDigitsWide":
    "\\rtqMathsBoxedEmptyValueTwoDigitsWide",
  "\\rtqMathsEllipsisEmptyValueThreeDigitsWide":
    "\\rtqMathsBoxedEmptyValueThreeDigitsWide",
  "\\rtqMathsEllipsisEmptyValueFourDigitsWide":
    "\\rtqMathsBoxedEmptyValueFourDigitsWide",
  "\\rtqMathsEllipsisEmptyValueFraction":
    "\\rtqMathsBoxedEmptyValueFraction",
  "\\rtqMathsBinaryOperatorEllipsisEmptyMatching":
    "\\rtqMathsBinaryOperatorBoxedEmptyMatching{#1}",
  "\\rtqMathsRelationEllipsisEmptyMatching":
    "\\rtqMathsRelationBoxedEmptyMatching{#1}",
  "\\rtqMathsBinaryOperatorEllipsisEmptyUnknown":
    "\\rtqMathsBinaryOperatorBoxedEmptyUnknown",
  "\\rtqMathsRelationEllipsisEmptyUnknown":
    "\\rtqMathsRelationBoxedEmptyUnknown",
  "\\rtqMathsEmptyValueOneDigitWide": "\\phantom{0}",
  "\\rtqMathsEmptyValueTwoDigitsWide": "\\phantom{00}",
  "\\rtqMathsEmptyValueThreeDigitsWide": "\\phantom{000}",
  "\\rtqMathsEmptyValueFourDigitsWide": "\\phantom{0000}",
  "\\rtqMathsEmptyValueFraction": "\\phantom{\\dfrac{0}{0}}",
  "\\rtqMathsSolvedOrder":
    "\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}",
  "\\rtqMathsEmptyValueSolvedOrder":
    "\\phantom{\\htmlClass{rtq-maths-working-step}{\\footnotesize{(0)}}}",
  "\\rtqMathsEquationNumber":
    "\\htmlClass{rtq-maths-equation-number}{\\footnotesize{(#1)}}",
  "\\rtqMathsColumnarArithmeticStyle": "\\def\\arraystretch{1.5}",
  "\\rtqMathsColumnarDecimalPoint": "\\mathrlap{\\mkern5mu .}",
  "\\rtqMathsQuestionMarkPlaceholder": "\\mathord{?}",
  "\\rtqMathsBinaryOperatorQuestionMarkPlaceholder": "\\mathbin{?}",
  "\\rtqMathsSequenceEllipsis": "\\ldots",
  "\\rtqMathsDigitGroupSeparator": "\\rtqMathsSpaceOneSixthEm",
  "\\rtqMathsSpaceOneSixthEm": "\\,",
  "\\rtqMathsSpaceHalfEm": "\\enspace",
  "\\rtqMathsTimeSeparator": "\\mathord{:}",
  "\\rtqMathsRatioSeparator": "\\ratio",
  "\\rtqMathsTimeMeridiem": "\\ \\text{#1}",
  "\\rtqMathsTimeAm": "\\rtqMathsTimeMeridiem{am}",
  "\\rtqMathsTimePm": "\\rtqMathsTimeMeridiem{pm}",
  "\\rtqMathsListSeparator": "\\quad",
  "\\rtqMathsSizeSevenPendingReview": "\\large",
  "\\rtqMathsSizeEightPendingReview": "\\Large",
  "\\rtqMathsSizeNinePendingReview": "\\LARGE",
  "\\rtqMathsSizeTenPendingReview": "\\huge",
  "\\rtqMathsSizeElevenPendingReview": "\\Huge",
};

const rtqKatexApprovedClasses = new Set([
  "rtq-maths-equation-number",
  "rtq-maths-working-step",
]);

const trustRtqKatex = (context) =>
  context.command === "\\htmlClass" &&
  rtqKatexApprovedClasses.has(context.class);

module.exports = {
  siteMetadata: {
    title: `Sample RTQ Test Server`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    "gatsby-plugin-postcss",

    "gatsby-plugin-react-helmet",

    // "gatsby-transformer-remark",

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: (errorCode) =>
                errorCode === "htmlExtension" ? "ignore" : "warn",
              throwOnError: false,
              macros: rtqKatexMacros,
              trust: trustRtqKatex,
            },
          },

          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              // classPrefix: "language-",

              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
            },
          },
        ],
      },
    },

    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
  pathPrefix: "/sample-rtq-test-server",
};
