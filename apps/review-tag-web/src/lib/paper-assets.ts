import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  type PreparedReviewSvg,
  assertPaperImageDelivery,
  paperImageRenderMode,
  prepareReviewSvg,
} from '@rtq/review-paper-assets';
import {
  toPaperListCompatibilityMarkdown,
  toPaperMdxCompatibilityMarkdown,
  toPaperSymbolCompatibilityMarkdown,
} from '@rtq/review-paper-markdown';
import {
  validatePaperListMarkdown,
  validatePaperShapeMarkdown,
} from '@rtq/review-paper-markdown/validate';

import {
  PAPER_IMAGE_EXTENSIONS,
  resolveCanonicalPaperImageExtensions,
} from './paper-asset-reader.ts';
import { EXTERNAL_ASSETS_ROOT } from './paper-paths.ts';
import { normalizePaperTableMarkdown } from './paper-table-markdown.ts';
import { prepareInlineLongDivisionSvg } from './prepare-inline-long-division.ts';

const API_ASSET_PREFIX = '/api/assets';
const MISSING_IMAGE_RELATIVE_PATH = 'papers/missing/missing_image.svg';
const TODO_IMAGE_MARKUP =
  '<span class="paper-image-placeholder" data-rtq-placeholder="todo-image">Image is not implemented yet.</span>';
const PAPER_IMAGE_REGEX = /(?:%image%|TODOIMAGE|<PaperImage\b[^\n>]*\/>)/g;
const PAPER_IMAGE_PREPARATION_ATTRIBUTES = [
  'alt',
  'asset',
  'className',
  'description',
  'extension',
  'format',
  'height',
  'margin',
  'padding',
  'size',
  'src',
  'srcSet',
  'svgMarkup',
  'title',
  'width',
] as const;
const PAPER_IMAGE_AUTHORED_ATTRIBUTES = [
  'renderMode',
  'align',
  'assetScope',
  'displaySize',
  'family',
  'indent',
  'kind',
  'type',
] as const;
const LONG_DIVISION_REGEX = /<LongDivision\b[^\n>]*\/>/g;
const LONG_DIVISION_AUTHORED_ATTRIBUTES = [
  'align',
  'dividend',
  'divisor',
  'indent',
  'variant',
] as const;
const WORKING_SECTION_OPEN_REGEX = /^\s*<WorkingSection\b([^>]*)>\s*$/;
const WORKING_SECTION_CLOSE_REGEX = /^\s*<\/WorkingSection>\s*$/;
const WORKING_SECTION_ATTRIBUTE_REGEX =
  /([A-Za-z][A-Za-z0-9-]*)\s*=\s*["']([^"']*)["']/g;

export type AssetContext = {
  assetFileStem?: string;
  assetQuestionIndex?: number;
  assetSectionIndex?: number;
  assetSubquestionIndex?: number | null;
  assetSubsubquestionIndex?: number | null;
  fileStem: string;
  questionIndex: number;
  sectionIndex: number;
  subquestionIndex: number | null;
  subsubquestionIndex: number | null;
};

type LongDivisionScope = 'answer' | 'working';
type LongDivisionVariant = 'bus' | 'long';
type PreparedLongDivision = {
  alt: string;
  description: string;
  minimumReadableWidth: number;
  naturalHeight: number;
  naturalWidth: number;
  svgMarkup: string;
};
type LongDivisionMetadata = {
  alt: string;
  description: string;
  kind: 'long-division';
  provenance: {
    craftedBy: string;
    copyright: string;
  };
  title?: string;
  values: {
    dividend: string;
    divisor: string;
    quotient: string;
    remainder: string;
    variant: LongDivisionVariant;
  };
  version: 1;
};
type PaperImageAssetScope = 'answer' | 'question' | 'working';
type PaperImageMetadata = {
  alt: string | null;
  assetScope: PaperImageAssetScope;
  description: string | null;
  renderMode: 'external' | 'inline';
  version: 1;
};
type PaperImageTechnicalEntry = {
  fingerprint: string;
  format: (typeof PAPER_IMAGE_EXTENSIONS)[number];
  intrinsicHeight: number;
  intrinsicWidth: number;
};
type PaperImageVariant = {
  extension: (typeof PAPER_IMAGE_EXTENSIONS)[number] | undefined;
  relativePath: string;
  technical: PaperImageTechnicalEntry;
  metadata: PaperImageMetadata;
  provenance: 'manual' | 'generated';
  svg?: PreparedReviewSvg;
};

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
) {
  const keys = Object.keys(value);
  return (
    required.every(key => keys.includes(key)) &&
    keys.every(key => required.includes(key) || optional.includes(key))
  );
}

function decimalParts(value: string) {
  const [whole = '0', fractional = ''] = value.split('.');
  return {
    fractionalDigits: fractional.length,
    integer: BigInt(`${whole}${fractional}`),
  };
}

function scaledInteger(value: string, fractionalDigits: number) {
  const parsed = decimalParts(value);
  return (
    parsed.integer *
    BigInt(10) ** BigInt(fractionalDigits - parsed.fractionalDigits)
  );
}

function parseLongDivisionMetadata(
  input: unknown,
  expected: {
    dividend: string | undefined;
    divisor: string | undefined;
    variant: LongDivisionVariant;
  },
  metadataPath: string,
): LongDivisionMetadata {
  if (
    !isRecord(input) ||
    !hasExactKeys(
      input,
      ['alt', 'description', 'kind', 'provenance', 'values', 'version'],
      ['title'],
    ) ||
    input.version !== 1 ||
    input.kind !== 'long-division' ||
    typeof input.alt !== 'string' ||
    !input.alt.trim() ||
    typeof input.description !== 'string' ||
    !input.description.trim() ||
    (input.title !== undefined &&
      (typeof input.title !== 'string' || !input.title.trim())) ||
    !isRecord(input.provenance) ||
    !hasExactKeys(input.provenance, ['craftedBy', 'copyright']) ||
    typeof input.provenance.craftedBy !== 'string' ||
    !input.provenance.craftedBy.trim() ||
    typeof input.provenance.copyright !== 'string' ||
    !input.provenance.copyright.trim() ||
    !isRecord(input.values) ||
    !hasExactKeys(input.values, [
      'dividend',
      'divisor',
      'quotient',
      'remainder',
      'variant',
    ]) ||
    typeof input.values.dividend !== 'string' ||
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(input.values.dividend) ||
    typeof input.values.divisor !== 'string' ||
    !/^[1-9]\d*$/.test(input.values.divisor) ||
    typeof input.values.quotient !== 'string' ||
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(input.values.quotient) ||
    typeof input.values.remainder !== 'string' ||
    !/^\d+$/.test(input.values.remainder) ||
    !(input.values.variant === 'long' || input.values.variant === 'bus') ||
    input.values.variant !== expected.variant ||
    input.values.dividend !== expected.dividend ||
    input.values.divisor !== expected.divisor
  ) {
    throw new Error(
      `Invalid or inconsistent LongDivision metadata at ${metadataPath}.`,
    );
  }

  const fractionalDigits = Math.max(
    decimalParts(input.values.dividend).fractionalDigits,
    decimalParts(input.values.quotient).fractionalDigits,
  );
  const divisor = BigInt(input.values.divisor);
  const remainder = BigInt(input.values.remainder);
  if (
    scaledInteger(input.values.dividend, fractionalDigits) !==
      divisor * scaledInteger(input.values.quotient, fractionalDigits) +
        remainder * BigInt(10) ** BigInt(fractionalDigits) ||
    remainder >= divisor
  ) {
    throw new Error(
      `Invalid or inconsistent LongDivision metadata at ${metadataPath}.`,
    );
  }

  return input as LongDivisionMetadata;
}

function compactAssetPrefix(context: AssetContext) {
  const sectionIndex = context.assetSectionIndex ?? context.sectionIndex;
  const questionIndex = context.assetQuestionIndex ?? context.questionIndex;
  const subquestionIndex =
    context.assetSubquestionIndex ?? context.subquestionIndex;
  const subsubquestionIndex =
    context.assetSubsubquestionIndex ?? context.subsubquestionIndex;
  const parts = [
    `s${String(sectionIndex + 1).padStart(2, '0')}`,
    `q${String(questionIndex + 1).padStart(2, '0')}`,
  ];

  if (subquestionIndex !== null) {
    parts.push(`s${String(subquestionIndex + 1).padStart(2, '0')}`);
  }

  if (subsubquestionIndex !== null) {
    parts.push(`ss${String(subsubquestionIndex + 1).padStart(2, '0')}`);
  }

  return parts.join('-');
}

function paperAssetPathSegments(fileStem: string) {
  const parts = fileStem.split('--');

  if (parts.length < 4) {
    throw new Error(`Invalid canonical paper file stem: ${fileStem}`);
  }

  const schoolSlug = parts[0];
  const year = parts.at(-2);
  const paperSlug = parts.at(-1);

  if (!year || !paperSlug || !(year === 'undated' || /^\d{4}$/.test(year))) {
    throw new Error(`Invalid canonical paper file stem: ${fileStem}`);
  }

  return [schoolSlug, year === '9999' ? 'sample' : year, paperSlug];
}

function parseComponentAttributes(componentKey: string) {
  const attrs: Record<string, string> = {};

  for (const match of componentKey.matchAll(
    /([A-Za-z][A-Za-z0-9_-]*)="([^"]*)"/g,
  )) {
    attrs[match[1]] = match[2];
  }

  return attrs;
}

function parseWorkingSectionAttributes(rawAttributes: string) {
  const attrs: Record<string, string> = {};

  for (const match of rawAttributes.matchAll(WORKING_SECTION_ATTRIBUTE_REGEX)) {
    attrs[match[1].toLowerCase()] = match[2];
  }

  return attrs;
}

function normalizeWorkingSectionPhase(phase: string | undefined) {
  const normalized = phase?.trim().toLowerCase();
  return normalized || 'custom';
}

function workingSectionOpenMarkup(rawAttributes: string) {
  const attrs = parseWorkingSectionAttributes(rawAttributes);
  const phase = normalizeWorkingSectionPhase(attrs.phase ?? attrs.face);
  const title = attrs.title?.trim();

  const parts = [
    `<div class="paper-working-section" data-phase="${escapeHtmlAttribute(phase)}">`,
  ];

  if (title) {
    parts.push(
      `<div class="paper-working-section-header">`,
      `<div class="paper-working-section-rule"></div>`,
      `<div class="paper-working-section-title">${escapeHtmlAttribute(title)}</div>`,
      `<div class="paper-working-section-rule"></div>`,
      `</div>`,
    );
  }

  parts.push(`<div class="paper-working-section-body">`);
  return parts.join('\n');
}

function workingSectionCloseMarkup() {
  return '</div>\n</div>';
}

function replaceWorkingSections(text: string) {
  return text
    .split('\n')
    .map(line => {
      const openMatch = line.match(WORKING_SECTION_OPEN_REGEX);

      if (openMatch) {
        return workingSectionOpenMarkup(openMatch[1]);
      }

      if (WORKING_SECTION_CLOSE_REGEX.test(line)) {
        return workingSectionCloseMarkup();
      }

      return line;
    })
    .join('\n');
}

function paperImageStyle(displaySize: string, align: string) {
  const sizeMap: Record<string, string> = {
    full: 'width:100%;max-width:100%;',
    lg: 'width:100%;max-width:36rem;',
    md: 'width:100%;max-width:20rem;',
    sm: 'width:100%;max-width:16rem;',
  };
  const alignMap: Record<string, string> = {
    center: 'margin:1rem auto;',
    end: 'margin:1rem 0 1rem auto;',
    start: 'margin:1rem auto 1rem 0;',
  };

  return `${sizeMap[displaySize]}${alignMap[align]}height:auto;display:block;`;
}

function normalizePaperImageDisplaySize(value: string | undefined) {
  if (value === undefined) return 'sm';
  if (['sm', 'md', 'lg', 'full'].includes(value)) return value;
  throw new Error(
    `Unsupported PaperImage displaySize: ${JSON.stringify(value)}; expected sm, md, lg, or full.`,
  );
}

function normalizePaperImageAlign(value: string | undefined) {
  if (value === undefined) return 'start';
  if (['start', 'center', 'end'].includes(value)) return value;
  throw new Error(
    `Unsupported PaperImage align: ${JSON.stringify(value)}; expected start, center, or end.`,
  );
}

function normalizePaperContentIndent(
  value: string | undefined,
  componentName: 'LongDivision' | 'PaperImage',
) {
  if (value === undefined) return 'none';
  if (['none', 'sm', 'md'].includes(value)) return value;
  throw new Error(
    `Unsupported ${componentName} indent: ${JSON.stringify(value)}; expected none, sm, or md.`,
  );
}

function paperImageAssetRelativePaths(
  context: AssetContext,
  assetScope: PaperImageAssetScope,
  scopeIndex: number | undefined,
  imageIndex: number,
) {
  const owner =
    assetScope === 'question'
      ? 'questions'
      : assetScope === 'working'
        ? 'workings'
        : 'answers';
  const scopeToken =
    assetScope === 'question'
      ? ''
      : `-${assetScope === 'working' ? 'w' : 'a'}${String((scopeIndex ?? 0) + 1).padStart(2, '0')}`;

  const basename = `${compactAssetPrefix(context)}${scopeToken}-i${String(imageIndex).padStart(2, '0')}`;
  const locations = (['manual', 'generated'] as const).map(provenance => {
    const sourceRelativeStem = `${owner}/${provenance === 'generated' ? 'generated/diagrams' : 'manual'}/${basename}`;
    const logicalPath = [
      'papers',
      ...paperAssetPathSegments(context.assetFileStem ?? context.fileStem),
      sourceRelativeStem,
    ].join('/');
    return { provenance, sourceRelativeStem, logicalPath };
  });
  const matches = locations.flatMap(location =>
    resolveCanonicalPaperImageExtensions(
      context.assetFileStem ?? context.fileStem,
      location.sourceRelativeStem,
      EXTERNAL_ASSETS_ROOT,
    ).map(extension => ({
      provenance: location.provenance,
      extension,
      relativePath: `${location.logicalPath}.${extension}`,
      sourceRelativePath: `${location.sourceRelativeStem}.${extension}`,
    })),
  );
  return matches.length
    ? matches
    : [
        {
          provenance: 'manual' as const,
          extension: undefined,
          relativePath: `${locations[0].logicalPath}.png`,
          sourceRelativePath: `${locations[0].sourceRelativeStem}.png`,
        },
      ];
}

export function paperImageAssetState(
  context: AssetContext,
  assetScope: PaperImageAssetScope,
  scopeIndex: number | undefined,
  imageIndex: number,
) {
  return paperImageAssetRelativePaths(
    context,
    assetScope,
    scopeIndex,
    imageIndex,
  )[0].extension === undefined
    ? ('missing' as const)
    : ('available' as const);
}

function paperImageTechnicalEntry(
  context: AssetContext,
  sourceRelativePath: string,
  extension: (typeof PAPER_IMAGE_EXTENSIONS)[number] | undefined,
): PaperImageTechnicalEntry {
  if (extension === undefined) {
    return {
      fingerprint: 'missing-image',
      format: 'svg',
      intrinsicHeight: 120,
      intrinsicWidth: 160,
    };
  }
  const paperRoot = path.join(
    EXTERNAL_ASSETS_ROOT,
    'papers',
    context.assetFileStem ?? context.fileStem,
  );
  const manifestPath = path.join(paperRoot, 'paper-images.generated.json');
  if (!existsSync(manifestPath)) {
    throw new Error(
      `Paper image technical manifest not found: ${manifestPath}`,
    );
  }
  const parsed = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    assets?: Record<string, PaperImageTechnicalEntry>;
    version?: unknown;
  };
  const entry = parsed.assets?.[sourceRelativePath];
  if (
    parsed.version !== 1 ||
    !entry ||
    entry.format !== extension ||
    !Number.isInteger(entry.intrinsicWidth) ||
    entry.intrinsicWidth <= 0 ||
    !Number.isInteger(entry.intrinsicHeight) ||
    entry.intrinsicHeight <= 0 ||
    !/^sha256:[a-f0-9]{64}$/.test(entry.fingerprint)
  ) {
    throw new Error(
      `Invalid paper image technical manifest entry at ${manifestPath}: ${sourceRelativePath}`,
    );
  }
  const sourcePath = path.join(paperRoot, ...sourceRelativePath.split('/'));
  const fingerprint = `sha256:${createHash('sha256')
    .update(readFileSync(sourcePath))
    .digest('hex')}`;
  if (fingerprint !== entry.fingerprint) {
    throw new Error(
      `Stale paper image technical manifest entry at ${manifestPath}: ${sourceRelativePath}`,
    );
  }
  return entry;
}

function paperImageMetadata(
  context: AssetContext,
  assetScope: PaperImageAssetScope,
  scopeIndex: number | undefined,
  imageIndex: number,
  extension: (typeof PAPER_IMAGE_EXTENSIONS)[number] | undefined,
  provenance: 'manual' | 'generated' = 'manual',
): PaperImageMetadata {
  const ownerSegments = [
    assetScope === 'question'
      ? 'questions'
      : assetScope === 'working'
        ? 'workings'
        : 'answers',
    ...(provenance === 'generated' ? ['generated', 'diagrams'] : ['manual']),
  ];
  const scopeToken =
    assetScope === 'question'
      ? ''
      : `-${assetScope === 'working' ? 'w' : 'a'}${String((scopeIndex ?? 0) + 1).padStart(2, '0')}`;
  const metadataPath = path.join(
    EXTERNAL_ASSETS_ROOT,
    'papers',
    context.assetFileStem ?? context.fileStem,
    ...ownerSegments,
    `${compactAssetPrefix(context)}${scopeToken}-i${String(imageIndex).padStart(2, '0')}.json`,
  );
  if (!existsSync(metadataPath)) {
    throw new Error(`PaperImage metadata sidecar not found: ${metadataPath}`);
  }
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(metadataPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Malformed PaperImage metadata JSON at ${metadataPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `Invalid PaperImage metadata at ${metadataPath}: expected object.`,
    );
  }
  const metadata = value as Record<string, unknown>;
  const keys = ['alt', 'assetScope', 'description', 'renderMode', 'version'];
  if (Object.keys(metadata).sort().join() !== keys.sort().join()) {
    throw new Error(
      `Invalid PaperImage metadata at ${metadataPath}: fields must match version 1.`,
    );
  }
  if (
    metadata.version !== 1 ||
    metadata.assetScope !== assetScope ||
    !(
      metadata.alt === null ||
      (typeof metadata.alt === 'string' &&
        (metadata.alt === '' || metadata.alt.trim()))
    ) ||
    !(
      metadata.description === null ||
      (typeof metadata.description === 'string' && metadata.description.trim())
    ) ||
    !(metadata.renderMode === 'external' || metadata.renderMode === 'inline')
  ) {
    throw new Error(
      `Invalid or inconsistent PaperImage metadata at ${metadataPath}.`,
    );
  }
  if (extension !== 'svg' && metadata.renderMode !== 'external') {
    throw new Error(
      `Incompatible PaperImage metadata at ${metadataPath}: raster or missing assets require external rendering.`,
    );
  }
  if (
    provenance === 'generated' &&
    (typeof metadata.alt !== 'string' ||
      !metadata.alt.trim() ||
      typeof metadata.description !== 'string' ||
      !metadata.description.trim())
  ) {
    throw new Error(
      `Generated PaperImage requires informative alt and description: ${metadataPath}`,
    );
  }
  return metadata as PaperImageMetadata;
}

function longDivisionAssetRelativePath(
  context: AssetContext,
  scopeType: LongDivisionScope,
  scopeIndex: number,
  assetIndex: number,
  variant: LongDivisionVariant,
) {
  const scopePrefix = scopeType === 'answer' ? 'a' : 'w';
  const basename = `${compactAssetPrefix(context)}-${scopePrefix}${String(scopeIndex + 1).padStart(2, '0')}-ld${String(
    assetIndex,
  ).padStart(2, '0')}-${variant}.svg`;

  return {
    sourceRelativePath: [
      'papers',
      context.assetFileStem ?? context.fileStem,
      scopeType === 'answer' ? 'answers' : 'workings',
      'generated',
      'long-division',
      basename,
    ].join('/'),
  };
}

function prepareLongDivision(
  componentKey: string,
  sourceRelativePath: string,
  variant: LongDivisionVariant,
): PreparedLongDivision {
  const attrs = parseComponentAttributes(componentKey);
  const unknownAttribute = Object.keys(attrs).find(
    attribute =>
      !LONG_DIVISION_AUTHORED_ATTRIBUTES.includes(
        attribute as (typeof LONG_DIVISION_AUTHORED_ATTRIBUTES)[number],
      ),
  );
  if (unknownAttribute) {
    throw new Error(
      `LongDivision must not author ${unknownAttribute}; geometry, size, and overflow are supplied during content preparation.`,
    );
  }
  if (
    attrs.align !== undefined &&
    !['start', 'center', 'end'].includes(attrs.align)
  ) {
    throw new Error(
      `Unsupported LongDivision align: ${JSON.stringify(attrs.align)}; expected start, center, or end.`,
    );
  }
  normalizePaperContentIndent(attrs.indent, 'LongDivision');

  const svgPath = path.join(EXTERNAL_ASSETS_ROOT, sourceRelativePath);
  const metadataPath = svgPath.replace(/\.svg$/, '.json');
  const sourceRepositoryRoot = path.dirname(EXTERNAL_ASSETS_ROOT);
  if (!existsSync(svgPath))
    throw new Error(`LongDivision source SVG not found: ${svgPath}`);
  if (!existsSync(metadataPath)) {
    throw new Error(`LongDivision metadata sidecar not found: ${metadataPath}`);
  }
  const metadata = parseLongDivisionMetadata(
    JSON.parse(readFileSync(metadataPath, 'utf8')),
    { dividend: attrs.dividend, divisor: attrs.divisor, variant },
    metadataPath,
  );

  const namespace = sourceRelativePath.replace(/[^a-zA-Z0-9]+/g, '-');
  const prepared = prepareInlineLongDivisionSvg(
    sourceRepositoryRoot,
    svgPath,
    namespace,
  );
  if (
    typeof prepared.svgMarkup !== 'string' ||
    !prepared.svgMarkup ||
    typeof prepared.naturalWidth !== 'number' ||
    prepared.naturalWidth <= 0 ||
    typeof prepared.naturalHeight !== 'number' ||
    prepared.naturalHeight <= 0 ||
    typeof prepared.minimumReadableWidth !== 'number' ||
    prepared.minimumReadableWidth <= 0
  ) {
    throw new Error(`Invalid prepared LongDivision contract for ${svgPath}.`);
  }
  return {
    alt: metadata.alt,
    description: metadata.description,
    minimumReadableWidth: prepared.minimumReadableWidth,
    naturalHeight: prepared.naturalHeight,
    naturalWidth: prepared.naturalWidth,
    svgMarkup: prepared.svgMarkup,
  };
}

function paperImageFormat(
  extension: (typeof PAPER_IMAGE_EXTENSIONS)[number] | undefined,
) {
  if (extension === undefined) return 'Missing';
  if (extension === 'png') return 'PNG';
  if (extension === 'svg') return 'SVG';
  return 'JPEG';
}

function paperImageVariantMarkup(
  componentKey: string,
  variant: PaperImageVariant,
  assetScope: PaperImageAssetScope,
  primary: boolean,
  showFormat: boolean,
) {
  const { relativePath, extension, metadata, technical, provenance, svg } =
    variant;
  const attrs = parseComponentAttributes(componentKey);
  const kind = attrs.kind ?? 'essential';
  const displaySize = normalizePaperImageDisplaySize(attrs.displaySize);
  const align = normalizePaperImageAlign(attrs.align);
  const indent = normalizePaperContentIndent(attrs.indent, 'PaperImage');
  const alt = metadata.alt ?? '';
  const reviewState =
    metadata.alt === null
      ? 'pending'
      : metadata.alt === ''
        ? 'reviewed-decorative'
        : 'reviewed-informative';
  const descriptionId = `paper-image-${relativePath.replace(/[^a-zA-Z0-9]+/g, '-')}-description`;
  const describedBy = metadata.description
    ? ` aria-describedby="${escapeHtmlAttribute(descriptionId)}"`
    : '';
  const description = metadata.description
    ? `<span id="${escapeHtmlAttribute(descriptionId)}" class="sr-only">${escapeHtmlAttribute(metadata.description)}</span>`
    : '';

  const format = paperImageFormat(extension);
  const formatLabel = showFormat
    ? `<span class="paper-image-format">${provenance} · ${format}</span>`
    : '';

  const attributes = `data-slot="paper-image" data-alt-review="${reviewState}" data-kind="${escapeHtmlAttribute(kind)}" data-asset-scope="${assetScope}" data-display-size="${displaySize}" data-align="${align}" data-indent="${indent}"`;
  const visual = svg?.svgMarkup
    ? `<span ${alt ? `role="img" aria-label="${escapeHtmlAttribute(alt)}"` : ''}${describedBy} ${attributes} class="paper-svg-inline rtq-review-inline-svg">${svg.svgMarkup}</span>`
    : `<img src="${escapeHtmlAttribute(`${API_ASSET_PREFIX}/${relativePath}`)}" alt="${escapeHtmlAttribute(
        alt,
      )}" width="${technical.intrinsicWidth}" height="${technical.intrinsicHeight}"${describedBy} ${attributes} class="${svg ? 'paper-svg-image' : 'paper-image'}"${svg ? '' : ` style="${escapeHtmlAttribute(paperImageStyle(displaySize, align))}"`} />`;
  const graphic = svg
    ? `<div class="paper-svg-scroll" role="group" aria-label="Scrollable image" tabindex="0" data-align="${align}" style="max-width:${svg.naturalWidth}px"><div class="paper-svg-graphic" style="min-width:${svg.minimumReadableWidth}px">${visual}</div></div>`
    : visual;
  const css = svg?.svgCss
    ? `<style>${svg.svgCss.replaceAll('<', '\\3c ')}</style>`
    : '';
  return `<div class="paper-image-variant" data-format="${extension ?? 'missing'}" data-provenance="${provenance}" data-primary="${primary}">${css}${formatLabel}<div class="paper-image-layout" data-indent="${indent}">${graphic}</div>${description}</div>`;
}

function paperImageMarkup(
  componentKey: string,
  variants: readonly PaperImageVariant[],
  assetScope: PaperImageAssetScope,
) {
  const hasGenerated = variants.some(
    variant => variant.provenance === 'generated',
  );
  const showFormat = variants.length > 1;
  const markup = variants
    .map((variant, index) =>
      paperImageVariantMarkup(
        componentKey,
        variant,
        assetScope,
        index === 0,
        showFormat,
      ),
    )
    .join('');
  return `<div class="paper-image-group" data-has-generated="${hasGenerated}" data-variant-count="${variants.length}">${markup}</div>`;
}

function longDivisionMarkup(
  componentKey: string,
  sourceRelativePath: string,
  variant: LongDivisionVariant,
) {
  const attrs = parseComponentAttributes(componentKey);
  const align = attrs.align ?? 'start';
  const indent = normalizePaperContentIndent(attrs.indent, 'LongDivision');
  const prepared = prepareLongDivision(
    componentKey,
    sourceRelativePath,
    variant,
  );
  const descriptionId = `long-division-${sourceRelativePath.replace(/[^a-zA-Z0-9]+/g, '-')}-description`;

  return `<div class="paper-long-division-alignment" data-align="${align}" data-indent="${indent}"><div role="img" tabindex="0" aria-label="${escapeHtmlAttribute(prepared.alt)}" aria-describedby="${escapeHtmlAttribute(descriptionId)}" data-slot="long-division" data-variant="${variant}" class="paper-long-division-viewport" style="--long-division-natural-width:${prepared.naturalWidth}px;--long-division-minimum-readable-width:${prepared.minimumReadableWidth}px"><div aria-hidden="true" class="paper-long-division-graphic">${prepared.svgMarkup}</div></div><span id="${escapeHtmlAttribute(descriptionId)}" class="sr-only">${escapeHtmlAttribute(prepared.description)}</span></div>`;
}

function replacePaperImages(
  text: string,
  context: AssetContext,
  expectedScope: PaperImageAssetScope,
  scopeIndex: number | undefined,
  imageIndexOffset = 0,
) {
  let imageIndex = imageIndexOffset;

  return text.replace(PAPER_IMAGE_REGEX, match => {
    if (!match.startsWith('<PaperImage')) {
      return TODO_IMAGE_MARKUP;
    }
    const attrs = parseComponentAttributes(match);
    const requestedRenderMode = paperImageRenderMode(match);
    const preparationAttribute = PAPER_IMAGE_PREPARATION_ATTRIBUTES.find(
      attribute => attrs[attribute] !== undefined,
    );
    if (preparationAttribute) {
      throw new Error(
        `PaperImage must not author ${preparationAttribute}; asset paths, extensions, and formats are supplied during paper preparation.`,
      );
    }
    const unknownAttribute = Object.keys(attrs).find(
      attribute =>
        !PAPER_IMAGE_AUTHORED_ATTRIBUTES.includes(
          attribute as (typeof PAPER_IMAGE_AUTHORED_ATTRIBUTES)[number],
        ),
    );
    if (unknownAttribute) {
      throw new Error(
        `PaperImage must not author ${unknownAttribute}; allowed authored attributes are assetScope, kind, family, displaySize, align, and indent.`,
      );
    }
    if (attrs.assetScope !== expectedScope) {
      throw new Error(
        `PaperImage requires assetScope="${expectedScope}" in ${expectedScope} content; received ${JSON.stringify(attrs.assetScope)}.`,
      );
    }
    const resolutions = paperImageAssetRelativePaths(
      context,
      expectedScope,
      scopeIndex,
      imageIndex,
    );
    const preferred = resolutions.some(
      resolution => resolution.provenance === 'generated',
    )
      ? 'generated'
      : 'manual';
    const variants = resolutions.map(resolution => {
      const metadata = paperImageMetadata(
        context,
        expectedScope,
        scopeIndex,
        imageIndex,
        resolution.extension,
        resolution.provenance,
      );
      if (resolution.provenance === preferred)
        assertPaperImageDelivery(
          requestedRenderMode,
          metadata.renderMode,
          resolution.extension,
          resolution.sourceRelativePath,
        );
      const svg =
        resolution.extension === 'svg'
          ? prepareReviewSvg(
              path.join(
                EXTERNAL_ASSETS_ROOT,
                'papers',
                context.assetFileStem ?? context.fileStem,
                resolution.sourceRelativePath,
              ),
              resolution.relativePath.replace(/[^A-Za-z0-9_-]/g, '-'),
              metadata.renderMode,
            )
          : undefined;
      return {
        ...resolution,
        metadata,
        svg,
        technical: paperImageTechnicalEntry(
          context,
          resolution.sourceRelativePath,
          resolution.extension,
        ),
      };
    });
    const markup = paperImageMarkup(match, variants, expectedScope);
    imageIndex += 1;
    return markup;
  });
}

function replaceLongDivisions(
  text: string,
  context: AssetContext,
  scopeType: LongDivisionScope,
  scopeIndex: number,
) {
  let assetIndex = 0;

  return text.replace(LONG_DIVISION_REGEX, match => {
    const attrs = parseComponentAttributes(match);
    const variant =
      attrs.variant === 'bus' || attrs.variant === 'long'
        ? attrs.variant
        : 'both';
    const variants: LongDivisionVariant[] =
      variant === 'both' ? ['long', 'bus'] : [variant];

    const output = variants
      .map(currentVariant => {
        const paths = longDivisionAssetRelativePath(
          context,
          scopeType,
          scopeIndex,
          assetIndex,
          currentVariant,
        );
        return longDivisionMarkup(
          match,
          paths.sourceRelativePath,
          currentVariant,
        );
      })
      .join('\n');

    assetIndex += 1;
    return output;
  });
}

export function enrichRtqMarkdown(
  text: string,
  context: AssetContext,
  options?: {
    imageIndexOffset?: number;
    scopeIndex?: number;
    scopeType?: LongDivisionScope;
  },
) {
  if (!text.trim()) {
    return '';
  }

  validatePaperListMarkdown(text);
  validatePaperShapeMarkdown(text);
  const withPaperLists = toPaperListCompatibilityMarkdown(text);
  const withPaperSymbols = toPaperSymbolCompatibilityMarkdown(withPaperLists);
  const withPaperTables = normalizePaperTableMarkdown(withPaperSymbols);
  const withMdxCompatibility = toPaperMdxCompatibilityMarkdown(withPaperTables);
  const withWorkingSections = replaceWorkingSections(withMdxCompatibility);
  const assetScope = options?.scopeType ?? 'question';
  if (assetScope !== 'question' && options?.scopeIndex === undefined) {
    throw new Error(`${assetScope} image resolution requires scopeIndex.`);
  }
  const withImages = replacePaperImages(
    withWorkingSections,
    context,
    assetScope,
    options?.scopeIndex,
    options?.imageIndexOffset,
  );

  if (!options?.scopeType || options.scopeIndex === undefined) {
    return withImages;
  }

  return replaceLongDivisions(
    withImages,
    context,
    options.scopeType,
    options.scopeIndex,
  );
}

export { MISSING_IMAGE_RELATIVE_PATH };
