import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\addCarryOver': '\\scriptstyle \\grayF',
  '\\multiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\subtractBorrow': '\\textstyle \\green',
  '\\maroonC': '\\textcolor{##ed5fa6}{#1}',
  '\\sequenceStep': '\\maroonC{\\footnotesize{(#1)}}',
  '\\sequenceStepBare': '\\maroonC{\\footnotesize{#1}}',
  '\\filledValue': '\\textcolor{green}{#1}',
  '\\incorrectValue': '\\textcolor{red}{#1}',
  '\\boxedFilledValue': '\\boxed{\\filledValue{#1}}',
  '\\boxedEmptyValue': '\\boxed{\\phantom{9}}',
  '\\solvedOrder': '\\maroonC{\\footnotesize{(#1)}}',
  '\\solvedOrderPhantom': '\\phantom{\\maroonC{\\footnotesize{(#1)}}}',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
