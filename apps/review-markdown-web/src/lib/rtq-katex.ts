import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsBoxedCellMatching':
    '\\boxed{\\vphantom{#3}\\phantom{#2}\\mathclap{#1}\\phantom{#2}}',
  '\\rtqMathsBoxedCellTwoDigitsWideOneDigitHigh':
    '\\rtqMathsBoxedCellMatching{#1}{0}{0}',
  '\\rtqMathsBoxedCellFourDigitsWideFractionHigh':
    '\\rtqMathsBoxedCellMatching{#1}{00}{\\dfrac{0}{0}}',
  '\\rtqMathsBoxedCellFourDigitsWideFractionHighSpacer':
    '\\phantom{\\rtqMathsBoxedCellFourDigitsWideFractionHigh{}}',
  '\\rtqMathsBoxedCellArrayOneDigitHighStyle': '\\def\\arraystretch{1.5}',
  '\\rtqMathsBoxedCellArrayFractionHighStyle': '\\def\\arraystretch{2.5}',
  '\\rtqMathsBoxedCellSeparator': '\\enspace',
  '\\rtqMathsNumberTowerOneDigitHighStyle':
    '\\rtqMathsBoxedCellArrayOneDigitHighStyle',
  '\\rtqMathsNumberTowerFractionHighStyle':
    '\\rtqMathsBoxedCellArrayFractionHighStyle',
  '\\rtqMathsNumberTowerCellSeparator': '\\rtqMathsBoxedCellSeparator',
  '\\rtqMathsBespokeSymbolFourPanePictogramFull':
    '\\mathord{\\begin{matrix}\\square\\square\\\\\\square\\square\\end{matrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramQuarter':
    '\\mathord{\\begin{matrix}\\square\\phantom{\\square}\\\\\\phantom{\\square}\\phantom{\\square}\\end{matrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramHalf':
    '\\mathord{\\begin{matrix}\\square\\phantom{\\square}\\\\\\square\\phantom{\\square}\\end{matrix}}',
  '\\rtqMathsBespokeSymbolFourPanePictogramThreeQuarters':
    '\\mathord{\\begin{matrix}\\square\\square\\\\\\square\\phantom{\\square}\\end{matrix}}',
  '\\rtqMathsBespokeSymbolOutlinedDiamond': '\\lozenge',
  '\\rtqMathsBespokeSymbolSunWithRays': '\\text{\\char"263C}',
  '\\rtqMathsBespokeSymbolOutlinedCircle': '\\bigcirc',
  '\\rtqMathsBespokeSymbolOutlinedTriangle': '\\bigtriangleup',
  '\\rtqMathsBespokeSymbolOutlinedHexagon': '\\text{\\char"2B21}',
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
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
  '\\rtqMathsSequenceStep':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
  '\\rtqMathsSequenceStepBare':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{#1}}',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\rtqMathsSolvedOrder':
    '\\htmlClass{rtq-maths-working-step}{\\footnotesize{(#1)}}',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
