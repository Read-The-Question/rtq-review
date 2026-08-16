import fs from 'node:fs/promises';
import path from 'node:path';

import { parse } from '@iarna/toml';

import {
  DIMENSIONAL_MAPPING_PATH,
  DIMENSIONAL_STYLE_GUIDES_ROOT,
  FOLDER_ORDER,
  resolveFolderPath,
} from '@/lib/paper-paths';
import type {
  FolderKey,
  TagCatalog,
  TagDimension,
  TagKind,
} from '@/lib/paper-types';

const TAG_DIMENSIONS = [
  'family',
  'math',
  'frame',
  'marker',
  'reasoning',
] as const satisfies readonly TagDimension[];
const SINGLE_VALUE_DIMENSIONS = new Set<TagDimension>([
  'family',
  'frame',
  'reasoning',
]);
const IMPLICIT_DEFAULTS = new Set([
  'family.unknown',
  'frame.raw',
  'math.unknown',
  'reasoning.direct',
]);
const CATALOG_MAPPING_STATUSES = new Set([
  'admin',
  'mapped',
  'mapped-with-followup',
]);

type MappingRecord = {
  family?: string | null;
  frame?: string | null;
  markers?: string[] | null;
  math?: string | null;
  reasoning?: string | null;
  status: string;
};

type CatalogCache = {
  promise: Promise<TagCatalog>;
  sourceSignature: string;
};

let catalogCache: CatalogCache | null = null;

function compareTags(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function tagKindFor(tag: string): TagKind {
  if (tag.startsWith('family.')) return 'family';
  if (tag.startsWith('math.')) return 'math';
  if (tag.startsWith('frame.')) return 'frame';
  if (tag.startsWith('marker.')) return 'marker';
  if (tag.startsWith('reasoning.')) return 'reasoning';
  return 'legacy';
}

export function isLegacyTag(tag: string) {
  return tagKindFor(tag) === 'legacy';
}

export function sortPersistedTags(tags: string[]) {
  return [...new Set(tags)].sort((left, right) => {
    const order: Record<TagKind, number> = {
      legacy: 0,
      family: 1,
      math: 2,
      frame: 3,
      marker: 4,
      reasoning: 5,
    };
    const kindCompare = order[tagKindFor(left)] - order[tagKindFor(right)];

    if (kindCompare !== 0) {
      return kindCompare;
    }

    return compareTags(left, right);
  });
}

async function collectTagsFromFolder(folderKey: FolderKey) {
  const folderPath = resolveFolderPath(folderKey);
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const found = new Set<string>();

  await Promise.all(
    entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.toml'))
      .map(async entry => {
        const raw = await fs.readFile(
          path.join(folderPath, entry.name),
          'utf8',
        );
        const matches = raw.matchAll(/rtq-tags\s*=\s*(\[[^\n]*\])/g);

        for (const match of matches) {
          try {
            const parsed = parse(`tags = ${match[1]}`) as { tags?: string[] };

            for (const tag of parsed.tags ?? []) {
              if (tagKindFor(tag) !== 'legacy') {
                found.add(tag);
              }
            }
          } catch {
            // Ignore malformed snippets and rely on the mapping doc.
          }
        }
      }),
  );

  return found;
}

async function readStyleGuideTags() {
  const entries = await fs.readdir(DIMENSIONAL_STYLE_GUIDES_ROOT, {
    withFileTypes: true,
  });
  const found = new Set<string>();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const tag = entry.name.replace(/\.md$/i, '');

    if (tagKindFor(tag) !== 'legacy') {
      found.add(tag);
    }
  }

  return found;
}

async function readDimensionalMappingTags() {
  const raw = await fs.readFile(DIMENSIONAL_MAPPING_PATH, 'utf8');
  const parsed = JSON.parse(raw) as { records?: MappingRecord[] };
  const found = new Set<string>();

  for (const record of parsed.records ?? []) {
    if (!CATALOG_MAPPING_STATUSES.has(record.status)) {
      continue;
    }

    for (const value of [
      record.family,
      record.frame,
      record.math,
      record.reasoning,
    ]) {
      if (value) {
        found.add(value);
      }
    }

    for (const marker of record.markers ?? []) {
      found.add(marker);
    }
  }

  return found;
}

async function buildTagCatalog(): Promise<TagCatalog> {
  const found = new Set<string>();
  const [styleGuideTags, mappingTags, ...folderTags] = await Promise.all([
    readStyleGuideTags(),
    readDimensionalMappingTags(),
    ...FOLDER_ORDER.map(folderKey => collectTagsFromFolder(folderKey)),
  ]);

  for (const collection of [styleGuideTags, mappingTags, ...folderTags]) {
    for (const tag of collection) {
      if (!IMPLICIT_DEFAULTS.has(tag)) {
        found.add(tag);
      }
    }
  }

  const catalog: TagCatalog = {
    family: [],
    frame: [],
    math: [],
    marker: [],
    reasoning: [],
  };

  for (const tag of found) {
    const kind = tagKindFor(tag);

    if (kind !== 'legacy') {
      catalog[kind].push(tag);
    }
  }

  for (const dimension of TAG_DIMENSIONS) {
    catalog[dimension].sort(compareTags);
  }

  return catalog;
}

async function statSignature(filePath: string) {
  const stat = await fs.stat(filePath);
  return `${filePath}:${stat.size}:${stat.mtimeMs}`;
}

async function folderSignature(folderPath: string, extension: string) {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const signatures = await Promise.all(
    entries
      .filter(entry => entry.isFile() && entry.name.endsWith(extension))
      .map(entry => statSignature(path.join(folderPath, entry.name))),
  );

  return signatures.sort().join('|');
}

async function tagSourceSignature() {
  const signatures = await Promise.all([
    statSignature(DIMENSIONAL_MAPPING_PATH),
    folderSignature(DIMENSIONAL_STYLE_GUIDES_ROOT, '.md'),
    ...FOLDER_ORDER.map(folderKey =>
      folderSignature(resolveFolderPath(folderKey), '.toml'),
    ),
  ]);

  return signatures.join('\n');
}

export async function getTagCatalog() {
  const sourceSignature = await tagSourceSignature();

  if (catalogCache?.sourceSignature === sourceSignature) {
    return catalogCache.promise;
  }

  const promise = buildTagCatalog();
  catalogCache = { promise, sourceSignature };

  try {
    return await promise;
  } catch (error) {
    if (catalogCache?.promise === promise) {
      catalogCache = null;
    }

    throw error;
  }
}

export function validateExplicitTags(
  nextTags: string[],
  allowedLegacyTags: string[],
  tagCatalog: TagCatalog,
) {
  const sorted = sortPersistedTags(nextTags);
  const dimensionalTags = sorted.filter(tag => tagKindFor(tag) !== 'legacy');
  const legacy = sorted.filter(tag => tagKindFor(tag) === 'legacy');

  const duplicateSingleDimensions = TAG_DIMENSIONS.filter(
    dimension =>
      SINGLE_VALUE_DIMENSIONS.has(dimension) &&
      sorted.filter(tag => tagKindFor(tag) === dimension).length > 1,
  );

  if (duplicateSingleDimensions.length) {
    throw new Error(
      `Only one ${duplicateSingleDimensions.join(', ')} tag can be explicit on a node.`,
    );
  }

  const known = new Set(
    TAG_DIMENSIONS.flatMap(dimension => tagCatalog[dimension]),
  );

  for (const tag of dimensionalTags) {
    if (!known.has(tag)) {
      throw new Error(`Unsupported dimensional tag: ${tag}`);
    }
  }

  const legacySet = new Set(allowedLegacyTags);

  for (const tag of legacy) {
    if (!legacySet.has(tag)) {
      throw new Error(`Legacy tag ${tag} cannot be added in this editor.`);
    }
  }

  return sorted;
}
