/**
 * @type {import('gatsby').GatsbyConfig}
 */
const rtqKatexMacros = {
  "\\rtqMathsSymbolDollar": "\\text{\\textdollar}",
  "\\rtqMathsSymbolEuro": "\\text{€}",
  "\\rtqMathsSymbolAsterisk": "\\ast",
  "\\rtqMathsSymbolBoxDot": "\\boxdot",
  "\\rtqMathsSymbolBlackHeartSuit": "\\heartsuit",
  "\\rtqMathsSymbolBlackTriangle": "\\blacktriangle",
  "\\rtqMathsSymbolBlackSquare": "\\blacksquare",
  "\\rtqMathsSymbolBlackCircle": "\\mathord{\\Large\\bullet}",
  "\\rtqMathsSymbolBlackLozenge": "\\blacklozenge",
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
  "\\rtqMathsBoxedEmptyBinaryOperatorMatching":
    "\\mathbin{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsBoxedEmptyRelationMatching":
    "\\mathrel{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsBoxedEmptyBinaryOperatorPendingReview":
    "\\rtqMathsBoxedEmptyBinaryOperatorMatching{+}",
  "\\rtqMathsBoxedEmptyRelationPendingReview":
    "\\rtqMathsBoxedEmptyRelationMatching{=}",
  "\\rtqMathsBoxedBinaryOperator": "\\mathbin{\\boxed{#1}}",
  "\\rtqMathsBoxedBinaryOperatorOneDigitPaddingEachSide":
    "\\mathbin{\\boxed{\\phantom{0}#1\\phantom{0}}}",
  "\\rtqMathsBoxedRelation": "\\mathrel{\\boxed{#1}}",
  "\\rtqMathsBoxedRelationOneDigitPaddingEachSide":
    "\\mathrel{\\boxed{\\phantom{0}#1\\phantom{0}}}",
  "\\rtqMathsBoxedCorrectBinaryOperator":
    "\\mathbin{\\boxed{\\rtqMathsCorrectValue{#1}}}",
  "\\rtqMathsBoxedCorrectBinaryOperatorOneDigitPaddingEachSide":
    "\\mathbin{\\boxed{\\phantom{0}\\rtqMathsCorrectValue{#1}\\phantom{0}}}",
  "\\rtqMathsBoxedCorrectRelation":
    "\\mathrel{\\boxed{\\rtqMathsCorrectValue{#1}}}",
  "\\rtqMathsBoxedCorrectRelationOneDigitPaddingEachSide":
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
  "\\rtqMathsEllipsisEmptyBinaryOperatorMatching":
    "\\rtqMathsBoxedEmptyBinaryOperatorMatching{#1}",
  "\\rtqMathsEllipsisEmptyRelationMatching":
    "\\rtqMathsBoxedEmptyRelationMatching{#1}",
  "\\rtqMathsEllipsisEmptyBinaryOperatorPendingReview":
    "\\rtqMathsBoxedEmptyBinaryOperatorPendingReview",
  "\\rtqMathsEllipsisEmptyRelationPendingReview":
    "\\rtqMathsBoxedEmptyRelationPendingReview",
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
  "\\rtqMathsQuestionMarkOperatorPlaceholder": "\\mathbin{?}",
  "\\rtqMathsSequenceEllipsis": "\\ldots",
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
