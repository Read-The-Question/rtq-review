import { spawnSync } from 'node:child_process';

export function prepareInlineLongDivisionSvg(
  sourceRepositoryRoot: string,
  svgPath: string,
  namespace: string,
) {
  const result = spawnSync(
    'pnpm',
    [
      '--silent',
      '--dir',
      sourceRepositoryRoot,
      'papers:long-division:inline-svg:prepare',
      '--',
      `--input=${svgPath}`,
      `--namespace=${namespace}`,
    ],
    { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
  );

  if (result.status !== 0) {
    throw new Error(
      result.stderr.trim() || `LongDivision preparation failed for ${svgPath}.`,
    );
  }

  return JSON.parse(result.stdout) as Record<string, unknown>;
}
