import { getRtqReviewKatexOptions } from '@rtq/review-katex-options';

const reviewerKatexMacros: Record<string, string> = {
  '\\rtqMathsNumberTowerCellMatching':
    '\\boxed{\\vphantom{\\dfrac{0}{0}}\\phantom{#2}\\mathclap{#1}\\phantom{#2}}',
  '\\rtqMathsNumberTowerCellTwoDigitsWide':
    '\\rtqMathsNumberTowerCellMatching{#1}{0}',
  '\\rtqMathsNumberTowerCellFourDigitsWide':
    '\\rtqMathsNumberTowerCellMatching{#1}{00}',
  '\\rtqMathsNumberTowerStyle': '\\def\\arraystretch{2.5}',
  '\\rtqMathsNumberTowerCellSeparator': '\\enspace',
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
