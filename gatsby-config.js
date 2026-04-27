/**
 * @type {import('gatsby').GatsbyConfig}
 */
const rtqKatexMacros = {
  // RTQ content macros are real KaTeX macros, so they only apply inside math
  // blocks. Keep non-math scaffolding placeholders in the Rukian pipeline.
  // "\\addCarryOver": "\\scriptstyle \\grayF",
  // "\\multiplyCarryOver": "\\scriptstyle \\grayF",
  // "\\subtractBorrow": "\\textstyle \\green",
  // "\\addCarryOver": "\\textstyle \\grayF",
  // "\\multiplyCarryOver": "{}^{\\scriptstyle \\grayF}{#1}",
  // "\\multiplyCarryOver": "\\mkern-9mu{\\scriptstyle \\grayF{#1}}",
  "\\addCarryOver": "\\scriptstyle \\grayF",
  "\\multiplyCarryOver": "\\scriptstyle \\grayF{#1}",
  "\\subtractBorrow": "\\textstyle \\green",
  "\\maroonC": "\\textcolor{##ed5fa6}{#1}",
  "\\filledValue": "\\textcolor{green}{#1}",
  "\\boxedFilledValue": "\\boxed{\\filledValue{#1}}",
  "\\solvedOrder": "\\maroonC{\\footnotesize{(#1)}}",
  "\\solvedOrderPhantom": "\\phantom{\\maroonC{\\footnotesize{(#1)}}}",
};

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
              strict: `warn`,
              throwOnError: false,
              macros: rtqKatexMacros,
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
