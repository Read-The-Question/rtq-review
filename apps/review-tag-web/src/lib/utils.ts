import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { OriginalQuestionSource } from '@/lib/paper-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanizeStem(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatCount(
  value: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatOriginalQuestionSource(source: OriginalQuestionSource) {
  if (
    source.paperStem &&
    source.sectionNumber !== null &&
    source.questionNumber !== null
  ) {
    return `${source.paperStem} / S${source.sectionNumber} Q${source.questionNumber} (${source.rawValue})`;
  }

  return source.rawValue;
}

export function lowerAlpha(index: number) {
  return String.fromCharCode('a'.charCodeAt(0) + index);
}

export function lowerRoman(value: number) {
  const numerals: Array<[number, string]> = [
    [1000, 'm'],
    [900, 'cm'],
    [500, 'd'],
    [400, 'cd'],
    [100, 'c'],
    [90, 'xc'],
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
  ];

  let remainder = value;
  let output = '';

  for (const [amount, numeral] of numerals) {
    while (remainder >= amount) {
      output += numeral;
      remainder -= amount;
    }
  }

  return output;
}
