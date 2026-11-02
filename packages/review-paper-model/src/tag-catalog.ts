import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import {
  DIMENSIONAL_TAG_AXES,
  type DimensionalTagAxis,
  type QuestionTagCatalog,
} from './model.ts';
import { dimensionalTagKind, sortPersistedQuestionTags } from './tag-source.ts';

const implicitDefaults = new Set([
  'family.unknown',
  'frame.raw',
  'math.unknown',
  'reasoning.direct',
]);
const mappingStatuses = new Set(['admin', 'mapped', 'mapped-with-followup']);
const singleValueAxes = new Set<DimensionalTagAxis>([
  'family',
  'frame',
  'reasoning',
]);

type MappingRecord = Readonly<{
  family?: string | null;
  frame?: string | null;
  markers?: readonly string[] | null;
  math?: string | null;
  reasoning?: string | null;
  status?: string;
}>;

let catalogCache:
  Readonly<{ catalog: QuestionTagCatalog; signature: string }> | undefined;

function catalogPaths(options: ResolveRtqContentOptions) {
  const { papersPackageRoot } = resolveRtqContentPaths(options);
  return {
    mapping: path.join(
      papersPackageRoot,
      'docs/ai/tags/dimensional-tags/dimensional-tag-mapping.json',
    ),
    styleGuides: path.join(
      papersPackageRoot,
      'docs/ai/answers/dimensional-style-guides',
    ),
  };
}

export async function readQuestionTagCatalog(
  options: ResolveRtqContentOptions = {},
): Promise<QuestionTagCatalog> {
  const paths = catalogPaths(options);
  const [mappingStat, guidesStat] = await Promise.all([
    stat(paths.mapping),
    stat(paths.styleGuides),
  ]);
  const signature = `${paths.mapping}:${mappingStat.mtimeMs}:${mappingStat.size}:${guidesStat.mtimeMs}`;
  if (catalogCache?.signature === signature) return catalogCache.catalog;

  const [mappingRaw, guideEntries] = await Promise.all([
    readFile(paths.mapping, 'utf8'),
    readdir(paths.styleGuides, { withFileTypes: true }),
  ]);
  const found = new Set<string>();
  const parsed = JSON.parse(mappingRaw) as { records?: MappingRecord[] };
  for (const record of parsed.records ?? []) {
    if (!record.status || !mappingStatuses.has(record.status)) continue;
    for (const value of [
      record.family,
      record.frame,
      record.math,
      record.reasoning,
    ]) {
      if (value) found.add(value);
    }
    for (const marker of record.markers ?? []) found.add(marker);
  }
  for (const entry of guideEntries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    found.add(entry.name.slice(0, -3));
  }

  const catalog: Record<DimensionalTagAxis, string[]> = {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };
  for (const tag of found) {
    const kind = dimensionalTagKind(tag);
    if (kind !== 'legacy' && !implicitDefaults.has(tag))
      catalog[kind].push(tag);
  }
  for (const axis of DIMENSIONAL_TAG_AXES) {
    catalog[axis] = [...sortPersistedQuestionTags(catalog[axis])];
  }
  catalogCache = { catalog, signature };
  return catalog;
}

export function validateExplicitQuestionTags(
  nextTags: readonly string[],
  currentTags: readonly string[],
  catalog: QuestionTagCatalog,
): readonly string[] {
  const sorted = sortPersistedQuestionTags(nextTags);
  const duplicateAxes = DIMENSIONAL_TAG_AXES.filter(
    (axis) =>
      singleValueAxes.has(axis) &&
      sorted.filter((tag) => dimensionalTagKind(tag) === axis).length > 1,
  );
  if (duplicateAxes.length) {
    throw new Error(
      `Only one ${duplicateAxes.join(', ')} tag can be explicit on a question.`,
    );
  }

  const known = new Set(DIMENSIONAL_TAG_AXES.flatMap((axis) => catalog[axis]));
  const retained = new Set(currentTags);
  for (const tag of sorted) {
    if (!known.has(tag) && !retained.has(tag)) {
      throw new Error(`Unsupported dimensional tag: ${tag}`);
    }
  }
  return sorted;
}
