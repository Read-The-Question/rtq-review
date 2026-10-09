export type PaperImageMode = 'all' | 'prepared';

export function parsePaperImageMode(value: string | null): PaperImageMode {
  return value === 'svg' || value === 'generated' || value === 'prepared'
    ? 'prepared'
    : 'all';
}
