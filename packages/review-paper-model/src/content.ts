import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { parse } from '@iarna/toml';
import {
  resolveRtqContentPaths,
  type ResolveRtqContentOptions,
} from '@rtq/review-repository-paths';

import type {
  ReviewAssetContext,
  ReviewContentField,
  ReviewContentPreparation,
} from './model.ts';

const paperTablePattern = /<PaperTable\b([^>\r\n]*)>([\s\S]*?)<\/PaperTable>/gi;
const paperImagePattern = /<PaperImage\b([^>\r\n]*)\/>/gi;
const longDivisionPattern = /<LongDivision\b([^>\r\n]*)\/>/gi;
const attributePattern = /([A-Za-z][A-Za-z0-9-]*)\s*=\s*"([^"]*)"/g;

const allowedAttributes = {
  'long-division': new Set([
    'align',
    'dividend',
    'divisor',
    'indent',
    'variant',
  ]),
  'paper-image': new Set([
    'align',
    'assetScope',
    'displaySize',
    'indent',
    'kind',
  ]),
  'paper-table': new Set(['cellAlign', 'density', 'grid', 'indent', 'width']),
} as const;

export type PaperMacros = ReadonlyMap<string, string>;

export async function readPaperMacros(
  options: ResolveRtqContentOptions = {},
): Promise<PaperMacros> {
  const { papersPackageRoot } = resolveRtqContentPaths(options);
  const raw = await readFile(
    join(papersPackageRoot, 'scripts', 'papers', 'lib', 'model', 'macros.toml'),
    'utf8',
  );
  const parsed = parse(raw) as Record<string, unknown>;

  return new Map(
    Object.entries(parsed)
      .map(([key, value]) => [key, String(value)] as const)
      .sort(([left], [right]) => right.length - left.length),
  );
}

function parseAttributes(
  raw: string,
  kind: keyof typeof allowedAttributes,
): Readonly<Record<string, string>> {
  const attributes: Record<string, string> = {};

  for (const match of raw.matchAll(attributePattern)) {
    const [, name, value] = match;
    if (allowedAttributes[kind].has(name as never)) attributes[name] = value;
  }

  return attributes;
}

export function applyPaperMacros(raw: string, macros: PaperMacros): string {
  if (!raw.trim() || raw.trim().toLowerCase() === '%empty%') return '';

  let expanded = raw;
  for (const [key, value] of macros) expanded = expanded.split(key).join(value);
  return expanded;
}

function contentPreparations(
  expanded: string,
  context: ReviewAssetContext,
): readonly ReviewContentPreparation[] {
  const preparations: ReviewContentPreparation[] = [];

  for (const match of expanded.matchAll(paperTablePattern)) {
    preparations.push({
      attributes: parseAttributes(match[1], 'paper-table'),
      kind: 'paper-table',
      markdown: match[2].trim(),
    });
  }

  for (const match of expanded.matchAll(paperImagePattern)) {
    preparations.push({
      attributes: parseAttributes(match[1], 'paper-image'),
      context,
      kind: 'paper-image',
    });
  }

  for (const match of expanded.matchAll(longDivisionPattern)) {
    preparations.push({
      attributes: parseAttributes(match[1], 'long-division'),
      context,
      kind: 'long-division',
    });
  }

  return preparations;
}

export function createReviewContentField(
  value: unknown,
  macros: PaperMacros,
  context: ReviewAssetContext,
): ReviewContentField {
  const raw = typeof value === 'string' ? value : '';
  const expanded = applyPaperMacros(raw, macros);

  return {
    context,
    expanded,
    preparations: contentPreparations(expanded, context),
    raw,
  };
}
