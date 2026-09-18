import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveRtqContentRoot } from "@rtq/review-repository-paths";
import katex from "katex";

import {
  getRtqReviewKatexOptions,
  RTQ_BOXED_VALUE_MACROS,
  RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION,
  RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO,
  RTQ_EQUATION_NUMBER_CLASS,
  RTQ_EQUATION_NUMBER_EXPANSION,
  RTQ_EQUATION_NUMBER_MACRO,
  RTQ_EMPTY_VALUE_MACROS,
  RTQ_PENDING_SIZE_SWITCHES,
  RTQ_WORKING_STEP_CLASS,
} from "./index.ts";

type MacroContract = Readonly<{
  macros: readonly Readonly<{
    expansion: string;
    name: string;
    semanticClass?: string;
  }>[];
}>;

const options = getRtqReviewKatexOptions({
  "\\existingReviewerMacro": "x_{#1}",
});

test("matches the canonical rtq-content shared macro contracts", () => {
  const contractPath = path.join(
    resolveRtqContentRoot(),
    "packages",
    "papers",
    "new-scripts",
    "papers",
    "rtq-katex-macro-contract.json",
  );
  const contract = JSON.parse(
    readFileSync(contractPath, "utf8"),
  ) as MacroContract;
  const equationNumber = contract.macros.find(
    ({ name }) => name === RTQ_EQUATION_NUMBER_MACRO,
  );
  const columnarArithmeticStyle = contract.macros.find(
    ({ name }) => name === RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO,
  );
  const pendingSizeSwitches = Object.fromEntries(
    contract.macros
      .filter(({ name }) => name in RTQ_PENDING_SIZE_SWITCHES)
      .map(({ expansion, name }) => [name, expansion]),
  );

  assert.deepEqual(equationNumber, {
    expansion: RTQ_EQUATION_NUMBER_EXPANSION,
    name: RTQ_EQUATION_NUMBER_MACRO,
    semanticClass: RTQ_EQUATION_NUMBER_CLASS,
  });
  assert.deepEqual(columnarArithmeticStyle, {
    expansion: RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION,
    name: RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO,
  });
  assert.deepEqual(pendingSizeSwitches, RTQ_PENDING_SIZE_SWITCHES);
  for (const name of Object.keys(RTQ_BOXED_VALUE_MACROS)) {
    assert.equal(
      contract.macros.some((macro) => macro.name === name),
      true,
      name,
    );
  }
  for (const name of Object.keys(RTQ_EMPTY_VALUE_MACROS)) {
    assert.equal(
      contract.macros.some((macro) => macro.name === name),
      true,
      name,
    );
  }
  assert.equal(options.macros["\\existingReviewerMacro"], "x_{#1}");
});

test("preserves every enlarged size through its pending-review switch", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");

  for (const [wrapper, source] of Object.entries(RTQ_PENDING_SIZE_SWITCHES)) {
    for (const expression of [
      `{${source} \\boxed{7}}`,
      `\\boxed{${source} 7}`,
      `\\boxed{\\phantom{${source} 7}}`,
    ]) {
      assert.equal(
        normalize(
          katex.renderToString(expression.replace(source, wrapper), options),
        ),
        normalize(katex.renderToString(expression, options)),
      );
    }
  }
});

test("renders every boxed-value geometry in the shared review contract", () => {
  for (const name of Object.keys(RTQ_BOXED_VALUE_MACROS)) {
    const source = name.includes("EmptyValue") ? name : `${name}{7}`;
    const html = katex.renderToString(source, options);

    assert.doesNotMatch(html, /katex-error/, name);
    if (name.includes("CorrectValue")) assert.match(html, /color:green/, name);
  }
});

test("renders every unboxed empty-value geometry in the shared review contract", () => {
  for (const name of Object.keys(RTQ_EMPTY_VALUE_MACROS)) {
    const html = katex.renderToString(name, options);
    assert.doesNotMatch(html, /katex-error/, name);
  }

  const solvedOrder = katex.renderToString(
    String.raw`\rtqMathsEmptyValueSolvedOrder`,
    options,
  );
  assert.match(solvedOrder, /rtq-maths-working-step/);
  assert.match(solvedOrder, /color:transparent/);
});

test("applies columnar arithmetic spacing only when requested", () => {
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

test("renders equation numbers consistently in display and inline maths", () => {
  const cases = [
    {
      displayMode: true,
      numbers: ["(1)", "(2)"],
      source: String.raw`\begin{aligned}5b + 2a &= 3.40 & \rtqMathsEquationNumber{1} \\ 3b + a &= 2.00 & \rtqMathsEquationNumber{2}\end{aligned}`,
    },
    {
      displayMode: false,
      numbers: ["(2)"],
      source: String.raw`\rtqMathsEquationNumber{2}`,
    },
  ];

  for (const { displayMode, numbers, source } of cases) {
    const html = katex.renderToString(source, { ...options, displayMode });
    const text = html.replace(/<[^>]+>/g, "");

    assert.match(html, new RegExp(`class="[^"]*${RTQ_EQUATION_NUMBER_CLASS}`));
    assert.match(html, /class="[^"]*size4/);
    for (const number of numbers) assert.ok(text.includes(number));
    assert.doesNotMatch(html, /(?:color:|#[\da-f]{3,8})/i);
  }
});

test("trusts only canonical semantic classes", () => {
  for (const className of [RTQ_EQUATION_NUMBER_CLASS, RTQ_WORKING_STEP_CLASS]) {
    assert.equal(
      options.trust({ class: className, command: "\\htmlClass" }),
      true,
    );
  }
  assert.equal(
    options.trust({ class: "not-approved", command: "\\htmlClass" }),
    false,
  );
  assert.equal(
    options.trust({
      class: RTQ_EQUATION_NUMBER_CLASS,
      command: "\\htmlStyle",
    }),
    false,
  );
});
