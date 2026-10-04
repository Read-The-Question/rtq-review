export type PaperImageMode = 'all' | 'generated';

export function parsePaperImageMode(value: string | null): PaperImageMode {
  return value === 'svg' || value === 'generated' ? 'generated' : 'all';
}
