export type PaperImageMode = 'all' | 'v1';

export function parsePaperImageMode(value: string | null): PaperImageMode {
  return value === 'svg' ||
    value === 'generated' ||
    value === 'prepared' ||
    value === 'v1'
    ? 'v1'
    : 'all';
}
