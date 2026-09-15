export const RTQ_EQUATION_NUMBER_CLASS = "rtq-maths-equation-number" as const;
export const RTQ_WORKING_STEP_CLASS = "rtq-maths-working-step" as const;

export const RTQ_EQUATION_NUMBER_MACRO = "\\rtqMathsEquationNumber" as const;

export const RTQ_EQUATION_NUMBER_EXPANSION =
  "\\htmlClass{rtq-maths-equation-number}{\\footnotesize{(#1)}}" as const;

export const RTQ_COLUMNAR_ARITHMETIC_STYLE_MACRO =
  "\\rtqMathsColumnarArithmeticStyle" as const;

export const RTQ_COLUMNAR_ARITHMETIC_STYLE_EXPANSION =
  "\\def\\arraystretch{1.5}" as const;

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
    },
    strict: reviewKatexStrictness,
    throwOnError: false,
    trust: trustRtqSemanticClass,
  } as const;
}
