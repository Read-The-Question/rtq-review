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
  '\\rtqMathsBoxedCellArrayLayout':
    '\\def\\arraystretch{#1}\\def\\rtqMathsBoxedCellSeparator{#2}',
  '\\rtqMathsBoxedCellArrayOneDigitHighStyle':
    '\\rtqMathsBoxedCellArrayLayout{1.5}{\\rtqMathsSpaceOneSixthEm}',
  '\\rtqMathsBoxedCellArrayFractionHighStyle':
    '\\rtqMathsBoxedCellArrayLayout{2.2}{\\rtqMathsSpaceOneSixthEm}',
  '\\rtqMathsBoxedCellSeparator': '\\enspace',
  '\\rtqMathsSymbolDollar': '\\text{\\textdollar}',
  '\\rtqMathsSymbolPound': '\\pounds',
  '\\rtqMathsSymbolEuro': '\\text{€}',
  '\\rtqMathsSymbolAsterisk': '\\ast',
  '\\rtqMathsSymbolBoxDot': '\\boxdot',
  '\\rtqMathsSymbolBeamedEighthNotes': '\\text{\\char"266B}',
  '\\rtqMathsSymbolBlackHeartSuit': '\\text{\\char"2665}',
  '\\rtqMathsSymbolBlackTriangle': '\\blacktriangle',
  '\\rtqMathsSymbolBlackSquare': '\\blacksquare',
  '\\rtqMathsSymbolWhiteSquare': '\\square',
  '\\rtqMathsSymbolBlackCircle': '\\mathord{\\Large\\bullet}',
  '\\rtqMathsSymbolBlackLozenge': '\\blacklozenge',
  '\\rtqMathsSymbolBlackSmilingFace': '\\text{\\char"263B}',
  '\\rtqMathsSymbolTaurus': '\\mathord{\\text{\\char"2649\\char"FE0E}}',
  '\\rtqMathsBinaryOperatorAsterisk': '\\mathbin{\\rtqMathsSymbolAsterisk}',
  '\\rtqMathsBinaryOperatorBoxDot': '\\mathbin{\\rtqMathsSymbolBoxDot}',
  '\\rtqMathsBinaryOperatorBlackSquare':
    '\\mathbin{\\rtqMathsSymbolBlackSquare}',
  '\\rtqMathsBinaryOperatorTaurus': '\\mathbin{\\rtqMathsSymbolTaurus}',
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
  '\\rtqMathsSymbolCrossPendingReview': '\\text{\\char"2717}',
  '\\rtqMathsAddCarryOver': '\\scriptstyle \\grayF',
  '\\rtqMathsIncorrectValue': '\\textcolor{red}{#1}',
  '\\green': '\\textcolor{green}{#1}',
  '\\rtqMathsMultiplyCarryOver': '\\scriptstyle \\grayF{#1}',
  '\\red': '\\textcolor{red}{#1}',
  '\\rtqMathsSubtractBorrow': '\\textstyle \\green',
};

export const rtqKatexOptions = getRtqReviewKatexOptions(reviewerKatexMacros);
export const rtqKatexMacros = rtqKatexOptions.macros;
