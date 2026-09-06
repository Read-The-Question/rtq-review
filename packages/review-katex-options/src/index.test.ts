import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveRtqContentRoot } from "@rtq/review-repository-paths";
import katex from "katex";

import {
  getRtqReviewKatexOptions,
  RTQ_EQUATION_NUMBER_CLASS,
  RTQ_EQUATION_NUMBER_EXPANSION,
  RTQ_EQUATION_NUMBER_MACRO,
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

test("matches the canonical rtq-content equation-number contract", () => {
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
  const canonical = contract.macros.find(
    ({ name }) => name === RTQ_EQUATION_NUMBER_MACRO,
  );

  assert.deepEqual(canonical, {
    expansion: RTQ_EQUATION_NUMBER_EXPANSION,
    name: RTQ_EQUATION_NUMBER_MACRO,
    semanticClass: RTQ_EQUATION_NUMBER_CLASS,
  });
  assert.equal(options.macros["\\existingReviewerMacro"], "x_{#1}");
});

test("renders equation numbers consistently in display and inline maths", () => {
  const cases = [
    {
      displayMode: true,
      numbers: ["(1)", "(2)"],
      source: String.raw`\begin{aligned}5b + 2a &= 3.40 & \equationNumber{1} \\ 3b + a &= 2.00 & \equationNumber{2}\end{aligned}`,
    },
    {
      displayMode: false,
      numbers: ["(2)"],
      source: String.raw`\equationNumber{2}`,
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

test("trusts only the canonical equation-number class", () => {
  assert.equal(
    options.trust({
      class: RTQ_EQUATION_NUMBER_CLASS,
      command: "\\htmlClass",
    }),
    true,
  );
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
