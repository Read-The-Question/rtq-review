export const RTQ_EQUATION_NUMBER_CLASS = "rtq-maths-equation-number" as const;
export const RTQ_CELL_LABEL_NUMBER_CLASS =
  "rtq-maths-cell-label-number" as const;
export const RTQ_WORKING_STEP_CLASS = "rtq-maths-working-step" as const;

export const RTQ_EQUATION_NUMBER_MACRO = "\\rtqMathsEquationNumber" as const;
export const RTQ_CELL_LABEL_NUMBER_MACRO = "\\rtqMathsCellLabelNumber" as const;

export const RTQ_EQUATION_NUMBER_EXPANSION =
  "\\htmlClass{rtq-maths-equation-number}{\\footnotesize{(#1)}}" as const;
export const RTQ_CELL_LABEL_NUMBER_EXPANSION =
  "\\htmlClass{rtq-maths-cell-label-number}{#1}" as const;

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

export const RTQ_ELLIPSIS_EMPTY_MACROS = {
  "\\rtqMathsEllipsisEmptyValueOneDigitWide":
    "\\rtqMathsBoxedEmptyValueOneDigitWide",
  "\\rtqMathsEllipsisEmptyValueTwoDigitsWide":
    "\\rtqMathsBoxedEmptyValueTwoDigitsWide",
  "\\rtqMathsEllipsisEmptyValueThreeDigitsWide":
    "\\rtqMathsBoxedEmptyValueThreeDigitsWide",
  "\\rtqMathsEllipsisEmptyValueFourDigitsWide":
    "\\rtqMathsBoxedEmptyValueFourDigitsWide",
  "\\rtqMathsEllipsisEmptyValueFraction": "\\rtqMathsBoxedEmptyValueFraction",
  "\\rtqMathsEllipsisEmptyBinaryOperatorMatching":
    "\\rtqMathsBoxedEmptyBinaryOperatorMatching{#1}",
  "\\rtqMathsEllipsisEmptyRelationMatching":
    "\\rtqMathsBoxedEmptyRelationMatching{#1}",
  "\\rtqMathsEllipsisEmptyBinaryOperatorUnknown":
    "\\rtqMathsBoxedEmptyBinaryOperatorUnknown",
  "\\rtqMathsEllipsisEmptyRelationPendingReview":
    "\\rtqMathsBoxedEmptyRelationPendingReview",
} as const;

export const RTQ_SEQUENCE_ELLIPSIS_MACRO =
  "\\rtqMathsSequenceEllipsis" as const;

export const RTQ_SEQUENCE_ELLIPSIS_EXPANSION = "\\ldots" as const;

export const RTQ_TABLE_NO_VALUE_MACRO = "\\rtqMathsTableNoValue" as const;

export const RTQ_TABLE_NO_VALUE_EXPANSION = "\\text{\\textemdash}" as const;

export const RTQ_DIGIT_GROUP_SEPARATOR_MACRO =
  "\\rtqMathsDigitGroupSeparator" as const;

export const RTQ_DIGIT_GROUP_SEPARATOR_EXPANSION =
  "\\rtqMathsSpaceOneSixthEm" as const;

export const RTQ_TIME_SEPARATOR_MACRO = "\\rtqMathsTimeSeparator" as const;

export const RTQ_TIME_SEPARATOR_EXPANSION = "\\mathord{:}" as const;

export const RTQ_RATIO_SEPARATOR_MACRO = "\\rtqMathsRatioSeparator" as const;

export const RTQ_RATIO_SEPARATOR_EXPANSION = "\\ratio" as const;

export const RTQ_TIME_MERIDIEM_MACROS = {
  "\\rtqMathsTimeMeridiem": "\\rtqMathsSpaceQuarterEm \\text{#1}",
  "\\rtqMathsTimeAm": "\\rtqMathsTimeMeridiem{am}",
  "\\rtqMathsTimePm": "\\rtqMathsTimeMeridiem{pm}",
} as const;

export const RTQ_SPACING_MACROS = {
  "\\rtqMathsSpaceOneSixthEm": "\\,",
  "\\rtqMathsSpaceQuarterEm": "\\ ",
  "\\rtqMathsSpaceHalfEm": "\\enspace",
  "\\rtqMathsSpaceOneEm": "\\quad",
  "\\rtqMathsSpaceTwoEm": "\\qquad",
} as const;

export const RTQ_LIST_SEPARATOR_MACRO = "\\rtqMathsListSeparator" as const;

export const RTQ_LIST_SEPARATOR_EXPANSION = "\\quad" as const;

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
  "\\rtqMathsBoxedEmptyBinaryOperatorMatching":
    "\\mathbin{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsBoxedEmptyRelationMatching": "\\mathrel{\\boxed{\\phantom{#1}}}",
  "\\rtqMathsBoxedEmptyBinaryOperatorUnknown":
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
} as const;

export const RTQ_UNDERLINE_VALUE_MACROS = {
  "\\rtqMathsUnderlineEmptyValueShort": "\\underline{\\phantom{0000}}",
  "\\rtqMathsUnderlineEmptyValueMedium": "\\underline{\\phantom{00000000}}",
  "\\rtqMathsUnderlineEmptyValueLong": "\\underline{\\phantom{000000000000}}",
  "\\rtqMathsUnderlineValue": "\\underline{#1}",
  "\\rtqMathsUnderlineValueShortPaddingEachSide":
    "\\underline{\\phantom{00}#1\\phantom{00}}",
  "\\rtqMathsUnderlineValueMediumPaddingEachSide":
    "\\underline{\\phantom{0000}#1\\phantom{0000}}",
  "\\rtqMathsUnderlineValueLongPaddingEachSide":
    "\\underline{\\phantom{000000}#1\\phantom{000000}}",
  "\\rtqMathsUnderlineCorrectValue": "\\underline{\\rtqMathsCorrectValue{#1}}",
  "\\rtqMathsUnderlineCorrectValueShortPaddingEachSide":
    "\\underline{\\phantom{00}\\rtqMathsCorrectValue{#1}\\phantom{00}}",
  "\\rtqMathsUnderlineCorrectValueMediumPaddingEachSide":
    "\\underline{\\phantom{0000}\\rtqMathsCorrectValue{#1}\\phantom{0000}}",
  "\\rtqMathsUnderlineCorrectValueLongPaddingEachSide":
    "\\underline{\\phantom{000000}\\rtqMathsCorrectValue{#1}\\phantom{000000}}",
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
  RTQ_CELL_LABEL_NUMBER_CLASS,
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
      [RTQ_CELL_LABEL_NUMBER_MACRO]: RTQ_CELL_LABEL_NUMBER_EXPANSION,
      [RTQ_EQUATION_NUMBER_MACRO]: RTQ_EQUATION_NUMBER_EXPANSION,
      [RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO]:
        RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION,
      [RTQ_COLUMNAR_DECIMAL_POINT_MACRO]: RTQ_COLUMNAR_DECIMAL_POINT_EXPANSION,
      ...RTQ_QUESTION_MARK_PLACEHOLDER_MACROS,
      ...RTQ_ELLIPSIS_EMPTY_MACROS,
      [RTQ_SEQUENCE_ELLIPSIS_MACRO]: RTQ_SEQUENCE_ELLIPSIS_EXPANSION,
      [RTQ_TABLE_NO_VALUE_MACRO]: RTQ_TABLE_NO_VALUE_EXPANSION,
      [RTQ_DIGIT_GROUP_SEPARATOR_MACRO]: RTQ_DIGIT_GROUP_SEPARATOR_EXPANSION,
      [RTQ_TIME_SEPARATOR_MACRO]: RTQ_TIME_SEPARATOR_EXPANSION,
      [RTQ_RATIO_SEPARATOR_MACRO]: RTQ_RATIO_SEPARATOR_EXPANSION,
      ...RTQ_SPACING_MACROS,
      [RTQ_LIST_SEPARATOR_MACRO]: RTQ_LIST_SEPARATOR_EXPANSION,
      ...RTQ_TIME_MERIDIEM_MACROS,
      ...RTQ_PENDING_SIZE_SWITCHES,
      ...RTQ_BOXED_VALUE_MACROS,
      ...RTQ_UNDERLINE_VALUE_MACROS,
      ...RTQ_EMPTY_VALUE_MACROS,
    },
    strict: reviewKatexStrictness,
    throwOnError: false,
    trust: trustRtqSemanticClass,
  } as const;
}
