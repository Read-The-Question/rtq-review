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
  RTQ_COLUMNAR_DECIMAL_POINT_EXPANSION,
  RTQ_COLUMNAR_DECIMAL_POINT_MACRO,
  RTQ_EQUATION_NUMBER_CLASS,
  RTQ_EQUATION_NUMBER_EXPANSION,
  RTQ_EQUATION_NUMBER_MACRO,
  RTQ_EMPTY_VALUE_MACROS,
  RTQ_PENDING_SIZE_SWITCHES,
  RTQ_QUESTION_MARK_PLACEHOLDER_MACROS,
  RTQ_RATIO_SEPARATOR_EXPANSION,
  RTQ_RATIO_SEPARATOR_MACRO,
  RTQ_LIST_SEPARATOR_EXPANSION,
  RTQ_LIST_SEPARATOR_MACRO,
  RTQ_SPACING_MACROS,
  RTQ_TABLE_NO_VALUE_EXPANSION,
  RTQ_TABLE_NO_VALUE_MACRO,
  RTQ_TIME_SEPARATOR_EXPANSION,
  RTQ_TIME_SEPARATOR_MACRO,
  RTQ_TIME_MERIDIEM_MACROS,
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
    "macros",
    "katex",
    "contract.generated.json",
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
  const columnarDecimalPoint = contract.macros.find(
    ({ name }) => name === RTQ_COLUMNAR_DECIMAL_POINT_MACRO,
  );
  const timeSeparator = contract.macros.find(
    ({ name }) => name === RTQ_TIME_SEPARATOR_MACRO,
  );
  const tableNoValue = contract.macros.find(
    ({ name }) => name === RTQ_TABLE_NO_VALUE_MACRO,
  );
  const ratioSeparator = contract.macros.find(
    ({ name }) => name === RTQ_RATIO_SEPARATOR_MACRO,
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
  assert.deepEqual(columnarDecimalPoint, {
    expansion: RTQ_COLUMNAR_DECIMAL_POINT_EXPANSION,
    name: RTQ_COLUMNAR_DECIMAL_POINT_MACRO,
  });
  assert.deepEqual(timeSeparator, {
    expansion: RTQ_TIME_SEPARATOR_EXPANSION,
    name: RTQ_TIME_SEPARATOR_MACRO,
  });
  assert.deepEqual(tableNoValue, {
    expansion: RTQ_TABLE_NO_VALUE_EXPANSION,
    name: RTQ_TABLE_NO_VALUE_MACRO,
  });
  assert.deepEqual(ratioSeparator, {
    expansion: RTQ_RATIO_SEPARATOR_EXPANSION,
    name: RTQ_RATIO_SEPARATOR_MACRO,
  });
  assert.deepEqual(
    contract.macros.find(({ name }) => name === RTQ_LIST_SEPARATOR_MACRO),
    {
      expansion: RTQ_LIST_SEPARATOR_EXPANSION,
      name: RTQ_LIST_SEPARATOR_MACRO,
    },
  );
  for (const [name, expansion] of Object.entries(RTQ_SPACING_MACROS)) {
    assert.deepEqual(
      contract.macros.find((macro) => macro.name === name),
      { expansion, name },
    );
  }
  for (const [name, expansion] of Object.entries(RTQ_TIME_MERIDIEM_MACROS)) {
    assert.deepEqual(
      contract.macros.find((macro) => macro.name === name),
      { expansion, name },
    );
  }
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
  for (const name of Object.keys(RTQ_QUESTION_MARK_PLACEHOLDER_MACROS)) {
    assert.equal(
      contract.macros.some((macro) => macro.name === name),
      true,
      name,
    );
  }
  assert.equal(options.macros["\\existingReviewerMacro"], "x_{#1}");
});

test("renders question-mark placeholders with their contracted math roles", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");

  for (const [macro, expansion] of Object.entries(
    RTQ_QUESTION_MARK_PLACEHOLDER_MACROS,
  )) {
    assert.equal(
      normalize(katex.renderToString(macro, options)),
      normalize(katex.renderToString(expansion, options)),
    );
  }
});

test("renders the table no-value marker as an explicit text em dash", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");

  assert.equal(
    normalize(katex.renderToString(RTQ_TABLE_NO_VALUE_MACRO, options)),
    normalize(katex.renderToString(RTQ_TABLE_NO_VALUE_EXPANSION, options)),
  );
});

test("renders clock-time separators with ordinary-atom spacing", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");
  const macro = katex.renderToString(`9${RTQ_TIME_SEPARATOR_MACRO}25`, options);
  const direct = katex.renderToString(
    `9${RTQ_TIME_SEPARATOR_EXPANSION}25`,
    options,
  );
  const raw = katex.renderToString("9:25", options);

  assert.equal(normalize(macro), normalize(direct));
  assert.doesNotMatch(macro, /mspace/);
  assert.match(raw, /mspace/);
});

test("renders ratio separators as vertically centred relations", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");
  const macro = katex.renderToString(
    `4 ${RTQ_RATIO_SEPARATOR_MACRO} 5`,
    options,
  );
  const direct = katex.renderToString(
    `4 ${RTQ_RATIO_SEPARATOR_EXPANSION} 5`,
    options,
  );

  assert.equal(normalize(macro), normalize(direct));
  assert.match(macro, /mrel/);
  assert.doesNotThrow(() =>
    katex.renderToString(
      `\\begin{array}{ccc}4 & ${RTQ_RATIO_SEPARATOR_MACRO} & 5\\end{array}`,
      options,
    ),
  );
});

test("renders the semantic list separator as one em", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");

  assert.equal(
    normalize(katex.renderToString(`1${RTQ_LIST_SEPARATOR_MACRO}2`, options)),
    normalize(katex.renderToString("1\\quad2", options)),
  );
});

test("renders source-variant and canonical meridiem macros", () => {
  assert.doesNotThrow(() =>
    katex.renderToString(
      "9 \\rtqMathsTimeSeparator 25 \\rtqMathsTimeMeridiem{a.m.}",
      options,
    ),
  );
  assert.doesNotThrow(() =>
    katex.renderToString(
      "9 \\rtqMathsTimeSeparator 25 \\rtqMathsTimeAm\\quad 4 \\rtqMathsTimePm",
      options,
    ),
  );
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
    const source =
      name.includes("BoxedEmpty") && !name.includes("Matching")
        ? name
        : `${name}{7}`;
    const html = katex.renderToString(source, options);

    assert.doesNotMatch(html, /katex-error/, name);
    if (name.includes("CorrectValue")) assert.match(html, /color:green/, name);
  }
});

test("renders boxed operator placeholders with their semantic atom classes", () => {
  const normalize = (html: string) =>
    html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "<annotation/>");

  for (const [macro, expansion, expectedClass] of [
    [
      "\\rtqMathsBoxedEmptyBinaryOperatorMatching{+}",
      "\\mathbin{\\boxed{\\phantom{+}}}",
      "mbin",
    ],
    [
      "\\rtqMathsBoxedEmptyRelationMatching{=}",
      "\\mathrel{\\boxed{\\phantom{=}}}",
      "mrel",
    ],
    [
      "\\rtqMathsBoxedEmptyBinaryOperatorPendingReview",
      "\\mathbin{\\boxed{\\phantom{+}}}",
      "mbin",
    ],
    [
      "\\rtqMathsBoxedEmptyRelationPendingReview",
      "\\mathrel{\\boxed{\\phantom{=}}}",
      "mrel",
    ],
    [
      "\\rtqMathsBoxedCorrectBinaryOperator{+}",
      "\\mathbin{\\boxed{\\textcolor{green}{+}}}",
      "mbin",
    ],
    [
      "\\rtqMathsBoxedCorrectBinaryOperatorOneDigitPaddingEachSide{+}",
      "\\mathbin{\\boxed{\\phantom{0}\\textcolor{green}{+}\\phantom{0}}}",
      "mbin",
    ],
    [
      "\\rtqMathsBoxedCorrectRelation{=}",
      "\\mathrel{\\boxed{\\textcolor{green}{=}}}",
      "mrel",
    ],
    [
      "\\rtqMathsBoxedCorrectRelationOneDigitPaddingEachSide{=}",
      "\\mathrel{\\boxed{\\phantom{0}\\textcolor{green}{=}\\phantom{0}}}",
      "mrel",
    ],
  ] as const) {
    const rendered = katex.renderToString(`2${macro}3`, options);
    assert.equal(
      normalize(rendered),
      normalize(katex.renderToString(`2${expansion}3`, options)),
    );
    assert.match(rendered, new RegExp(`class="${expectedClass}`));
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

test("renders the columnar decimal point as the contracted zero-width overlap", () => {
  const normalize = (html: string) =>
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
