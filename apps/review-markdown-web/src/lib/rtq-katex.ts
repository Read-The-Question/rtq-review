import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsSymbolDollar': '\\text{\\textdollar}',
  '\\rtqMathsSymbolEuro': '\\text{€}',
  '\\rtqMathsSymbolAsterisk': '\\ast',
  '\\rtqMathsSymbolBlackHeartSuit': '\\heartsuit',
  '\\rtqMathsSymbolBlackTriangle': '\\blacktriangle',
  '\\rtqMathsSymbolBlackSquare': '\\blacksquare',
  '\\rtqMathsSymbolHeartsPendingReview': '\\hearts',
  '\\rtqMathsSymbolHeartSuitPendingReview': '\\heartsuit',
  '\\rtqMathsSymbolSpadeSuitPendingReview': '\\spadesuit',
  '\\rtqMathsSymbolClubSuitPendingReview': '\\clubsuit',
  '\\rtqMathsSymbolDiamondSuitPendingReview': '\\diamondsuit',
  '\\rtqMathsSymbolTrianglePendingReview': '\\triangle',
  '\\rtqMathsSymbolBigTriangleUpPendingReview': '\\bigtriangleup',
  '\\rtqMathsSymbolBlackTrianglePendingReview': '\\blacktriangle',
  '\\rtqMathsSymbolBigStarPendingReview': '\\bigstar',
  '\\rtqMathsSymbolBlackLozengePendingReview': '\\blacklozenge',
  '\\rtqMathsSymbolCheckmarkPendingReview': '\\checkmark',
  '\\rtqMathsAddCarryOver': '\\scriptstyle \\grayF',
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
  '\\rtqMathsSequenceStep':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
  '\\rtqMathsSequenceStepBare':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{#1}}',
  '\\rtqMathsFilledValue': '\\textcolor{green}{#1}',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\rtqMathsBoxedFilledValue': '\\boxed{\\rtqMathsFilledValue{#1}}',
  '\\rtqMathsBoxedEmptyValue': '\\boxed{\\phantom{9}}',
  '\\rtqMathsSolvedOrder':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
  '\\rtqMathsSolvedOrderPhantom':
    '\\phantom{\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}}',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
