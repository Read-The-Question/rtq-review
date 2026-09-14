import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsAddCarryOver': '\\scriptstyle \\grayF',
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
  '\\maroonC': '\\textcolor{##ed5fa6}{#1}',
  '\\rtqMathsSequenceStep': '\\maroonC{\\footnotesize{(#1)}}',
  '\\rtqMathsSequenceStepBare': '\\maroonC{\\footnotesize{#1}}',
  '\\rtqMathsFilledValue': '\\textcolor{green}{#1}',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\rtqMathsBoxedFilledValue': '\\boxed{\\rtqMathsFilledValue{#1}}',
  '\\rtqMathsBoxedEmptyValue': '\\boxed{\\phantom{9}}',
  '\\rtqMathsSolvedOrder': '\\maroonC{\\footnotesize{(#1)}}',
  '\\rtqMathsSolvedOrderPhantom': '\\phantom{\\maroonC{\\footnotesize{(#1)}}}',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
