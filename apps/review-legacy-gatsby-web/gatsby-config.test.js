const assert = require("node:assert/strict");
const test = require("node:test");

const katex = require("katex");

const gatsbyConfig = require("./gatsby-config");

function getRtqKatexMacros() {
  const remark = gatsbyConfig.plugins.find(
    (plugin) => plugin.resolve === "gatsby-transformer-remark",
  );
  const katexPlugin = remark.options.plugins.find(
    (plugin) => plugin.resolve === "gatsby-remark-katex",
  );

  return katexPlugin.options.macros;
}

test("applies columnar arithmetic spacing only when requested", () => {
  const options = { macros: getRtqKatexMacros(), throwOnError: true };
  const plain = katex.renderToString(
    String.raw`\begin{array}{c}1\\2\end{array}`,
    options,
  );
  const columnar = katex.renderToString(
    String.raw`\columnarArithmeticStyle\begin{array}{c}1\\2\end{array}`,
    options,
  );

  assert.match(plain, /height:2\.4em/);
  assert.doesNotMatch(plain, /height:3\.6em/);
  assert.match(columnar, /height:3\.6em/);
});
