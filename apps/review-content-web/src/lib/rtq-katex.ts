import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsBespokeSymbolFourPanePictogramFull':
    '\\mathord{\\begin{smallmatrix}\\square\\square\\\\\\square\\square\\end{smallmatrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramQuarter':
    '\\mathord{\\begin{smallmatrix}\\square\\phantom{\\square}\\\\\\phantom{\\square}\\phantom{\\square}\\end{smallmatrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramHalf':
    '\\mathord{\\begin{smallmatrix}\\square\\phantom{\\square}\\\\\\square\\phantom{\\square}\\end{smallmatrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters':
    '\\mathord{\\begin{smallmatrix}\\square\\square\\\\\\square\\phantom{\\square}\\end{smallmatrix}}',
  '\\rtqMathsSymbolDollar': '\\text{\\textdollar}',
  '\\rtqMathsSymbolPound': '\\pounds',
  '\\rtqMathsSymbolEuro': '\\text{€}',
  '\\rtqMathsSymbolAsterisk': '\\ast',
  '\\rtqMathsSymbolBoxDot': '\\boxdot',
  '\\rtqMathsSymbolBlackHeartSuit': '\\text{\\char"2665}',
  '\\rtqMathsSymbolBlackTriangle': '\\blacktriangle',
  '\\rtqMathsSymbolBlackSquare': '\\blacksquare',
  '\\rtqMathsSymbolWhiteSquare': '\\square',
  '\\rtqMathsSymbolBlackCircle': '\\mathord{\\Large\\bullet}',
  '\\rtqMathsSymbolBlackLozenge': '\\blacklozenge',
  '\\rtqMathsSymbolBlackSmilingFace': '\\text{\\char"263B}',
  '\\rtqMathsSymbolBlackClubSuit': '\\clubsuit',
  '\\rtqMathsSymbolHeartsPendingReview': '\\hearts',
  '\\rtqMathsSymbolHeartSuitPendingReview': '\\heartsuit',
  '\\rtqMathsSymbolSpadeSuitPendingReview': '\\spadesuit',
  '\\rtqMathsSymbolClubSuitPendingReview': '\\clubsuit',
  '\\rtqMathsSymbolDiamondSuitPendingReview': '\\diamondsuit',
  '\\rtqMathsSymbolTrianglePendingReview': '\\triangle',
  '\\rtqMathsSymbolBigTriangleUpPendingReview': '\\bigtriangleup',
  '\\rtqMathsSymbolBlackTrianglePendingReview': '\\blacktriangle',
  '\\rtqMathsSymbolBigStarPendingReview': '\\bigstar',
  '\\rtqMathsSymbolCheckmarkPendingReview': '\\checkmark',
  '\\rtqMathsAddCarryOver': '\\scriptstyle \\grayF',
  '\\green': '\\textcolor{green}{#1}',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\red': '\\textcolor{red}{#1}',
  '\\rtqMathsSequenceStep':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
  '\\rtqMathsSequenceStepBare':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{#1}}',
  '\\rtqMathsSolvedOrder':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
