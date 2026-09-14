import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsAddCarryOver': '\\scriptstyle \\grayF',
  '\\rtqMathsBoxedEmptyValue': '\\boxed{\\phantom{9}}',
  '\\rtqMathsBoxedFilledValue': '\\boxed{\\rtqMathsFilledValue{#1}}',
  '\\rtqMathsFilledValue': '\\textcolor{green}{#1}',
  '\\green': '\\textcolor{green}{#1}',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\maroonC': '\\textcolor{##ed5fa6}{#1}',
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\red': '\\textcolor{red}{#1}',
  '\\rtqMathsSequenceStep': '\\maroonC{\\footnotesize{(#1)}}',
  '\\rtqMathsSequenceStepBare': '\\maroonC{\\footnotesize{#1}}',
  '\\rtqMathsSolvedOrder': '\\maroonC{\\footnotesize{(#1)}}',
  '\\rtqMathsSolvedOrderPhantom': '\\phantom{\\maroonC{\\footnotesize{(#1)}}}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
