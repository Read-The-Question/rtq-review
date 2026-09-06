export const RTQ_EQUATION_NUMBER_CLASS = "rtq-maths-equation-number" as const;

export const RTQ_EQUATION_NUMBER_MACRO = "\\equationNumber" as const;

export const RTQ_EQUATION_NUMBER_EXPANSION =
  "\\htmlClass{rtq-maths-equation-number}{\\footnotesize{(#1)}}" as const;

type KatexTrustContext = Readonly<{
  class?: string;
  command: string;
}>;

export function trustRtqEquationNumber(context: KatexTrustContext): boolean {
  return (
    context.command === "\\htmlClass" &&
    context.class === RTQ_EQUATION_NUMBER_CLASS
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
    },
    strict: reviewKatexStrictness,
    throwOnError: false,
    trust: trustRtqEquationNumber,
  } as const;
}
