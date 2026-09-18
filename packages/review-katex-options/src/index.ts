export const RTQ_EQUATION_NUMBER_CLASS = "rtq-maths-equation-number" as const;
export const RTQ_WORKING_STEP_CLASS = "rtq-maths-working-step" as const;

export const RTQ_EQUATION_NUMBER_MACRO = "\\rtqMathsEquationNumber" as const;

export const RTQ_EQUATION_NUMBER_EXPANSION =
  "\\htmlClass{rtq-maths-equation-number}{\\footnotesize{(#1)}}" as const;

export const RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO =
  "\\rtqMathsColumnarArithmeticStyle" as const;

export const RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION =
  "\\def\\arraystretch{1.5}" as const;

export const RTQ_COLUMNAR_DECIMAL_POINT_MACRO =
  "\\rtqMathsColumnarDecimalPoint" as const;

export const RTQ_COLUMNAR_DECIMAL_POINT_EXPANSION =
  "\\mathrlap{\\mkern5mu .}" as const;

export const RTQ_QUESTION_MARK_PLACEHOLDER_MACROS = {
  "\\rtqMathsQuestionMarkPlaceholder": "\\mathord{?}",
  "\\rtqMathsQuestionMarkOperatorPlaceholder": "\\mathbin{?}",
} as const;

export const RTQ_PENDING_SIZE_SWITCHES = {
  "\\rtqMathsSizeSevenPendingReview": "\\large",
  "\\rtqMathsSizeEightPendingReview": "\\Large",
  "\\rtqMathsSizeNinePendingReview": "\\LARGE",
  "\\rtqMathsSizeTenPendingReview": "\\huge",
  "\\rtqMathsSizeElevenPendingReview": "\\Huge",
} as const;

export const RTQ_BOXED_VALUE_MACROS = {
  "\\rtqMathsCorrectValue": "\\textcolor{green}{#1}",
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
} as const;

export const RTQ_EMPTY_VALUE_MACROS = {
  "\\rtqMathsEmptyValueOneDigitWide": "\\phantom{0}",
  "\\rtqMathsEmptyValueTwoDigitsWide": "\\phantom{00}",
  "\\rtqMathsEmptyValueThreeDigitsWide": "\\phantom{000}",
  "\\rtqMathsEmptyValueFourDigitsWide": "\\phantom{0000}",
  "\\rtqMathsEmptyValueFraction": "\\phantom{\\dfrac{0}{0}}",
  "\\rtqMathsEmptyValueSolvedOrder":
    "\\phantom{\\htmlClass{rtq-maths-working-step}{\\footnotesize{(0)}}}",
} as const;

type KatexTrustContext = Readonly<{
  class?: string;
  command: string;
}>;

const RTQ_TRUSTED_SEMANTIC_CLASSES = new Set<string>([
  RTQ_EQUATION_NUMBER_CLASS,
  RTQ_WORKING_STEP_CLASS,
]);

export function trustRtqSemanticClass(context: KatexTrustContext): boolean {
  return (
    context.command === "\\htmlClass" &&
    typeof context.class === "string" &&
    RTQ_TRUSTED_SEMANTIC_CLASSES.has(context.class)
  );
}

export function reviewKatexStrictness(errorCode: string): "ignore" | "warn" {
  return errorCode === "htmlExtension" ? "ignore" : "warn";
}

export function getRtqReviewKatexOptions<
  const ReviewerMacros extends Readonly<Record<string, string>>,
>(reviewerMacros: ReviewerMacros) {
  return {
    macros: {
      ...reviewerMacros,
      [RTQ_EQUATION_NUMBER_MACRO]: RTQ_EQUATION_NUMBER_EXPANSION,
      [RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO]:
        RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION,
      [RTQ_COLUMNAR_DECIMAL_POINT_MACRO]: RTQ_COLUMNAR_DECIMAL_POINT_EXPANSION,
      ...RTQ_QUESTION_MARK_PLACEHOLDER_MACROS,
      ...RTQ_PENDING_SIZE_SWITCHES,
      ...RTQ_BOXED_VALUE_MACROS,
      ...RTQ_EMPTY_VALUE_MACROS,
    },
    strict: reviewKatexStrictness,
    throwOnError: false,
    trust: trustRtqSemanticClass,
  } as const;
}
