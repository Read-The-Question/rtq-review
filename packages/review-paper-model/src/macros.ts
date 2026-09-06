import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { parse } from '@iarna/toml';
import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import { applyPaperMacros, type PaperMacros } from './content.ts';
import type { ReviewMacroDocument, ReviewMacroKind } from './model.ts';

export const REVIEW_MACROS_REPOSITORY_PATH =
  'packages/papers/scripts/papers/lib/model/macros.toml';

function macroKind(name: string): ReviewMacroKind {
  if (name.startsWith('rtq_abbr_formula_')) return 'formula';
  if (name.startsWith('rtq_abbr_note_')) return 'tip';
  if (name.startsWith('rtq_abbr_working_')) return 'working';
  return 'shared';
}

export async function readReviewMacros(
  options: ResolveRtqContentOptions = {},
): Promise<ReviewMacroDocument> {
  const { papersPackageRoot } = resolveRtqContentPaths(options);
  const rawSource = await readFile(
    join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model', 'macros.toml'),
    'utf8',
  );
  const parsed = parse(rawSource) as Record<string, unknown>;
  const sourceEntries = Object.entries(parsed).map(
    ([name, value]) => [name, String(value)] as const,
  );
  const expansionMacros: PaperMacros = new Map(
    [...sourceEntries].sort(([left], [right]) => right.length - left.length),
  );

  return {
    entries: sourceEntries.map(([name, source]) => ({
      expanded: applyPaperMacros(source, expansionMacros),
      kind: macroKind(name),
      name,
      source,
    })),
    fileName: 'macros.toml',
    rawSource,
    repositoryPath: REVIEW_MACROS_REPOSITORY_PATH,
  };
}
