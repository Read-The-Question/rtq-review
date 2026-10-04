import 'server-only';

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { resolveRtqContentPaths } from '@rtq/review-repository-paths';
import type {
  ReviewAssetContext,
  ReviewContentField,
  ReviewPaper,
} from '@rtq/review-paper-model';
import { validatePaperSymbolMarkdown } from '@rtq/review-paper-markdown/validate';

import type {
  DisplayContentField,
  DisplayPaperImage,
  DisplayPaperImageTag,
  DisplayPaperImageVariant,
  DisplayPaperNode,
  DisplayReviewPaper,
  DisplayWorkingSegment,
} from './display-model';
import { preparePaperListMarkdown } from './paper-list-markdown';
import { preparePaperTableMarkdown } from './paper-table-markdown';
import {
  parseWorkingSections,
  type WorkingSectionParseResult,
} from './working-sections';

const IMAGE = /(?:%image%|TODOIMAGE|<PaperImage\b[^\n>]*\/>)/g;
const LONG_DIVISION = /<LongDivision\b[^\n>]*\/>/g;
const ATTRIBUTE = /([A-Za-z][A-Za-z0-9_-]*)\s*=\s*["']([^"']*)["']/g;
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg'] as const;
const IMAGE_TAG_CATALOG = 'docs/architecture/image-dimensional-tags.json';
const MISSING_IMAGE = 'papers/missing/missing_image.svg';
const MISSING_IMAGE_SIZE = { height: 120, width: 160 } as const;
const MDX_COMMENT = /\{\/\*[\s\S]*?\*\/\}/g;

// Layout vocabulary and defaults mirror rtq-web so review previews match production.
const ALIGNS = ['start', 'center', 'end'] as const;
const DISPLAY_SIZES = ['sm', 'md', 'lg', 'full'] as const;
const INDENTS = ['none', 'sm', 'md'] as const;
const DEFAULT_ALIGN = 'center';
const DEFAULT_DISPLAY_SIZE = 'sm';
const DEFAULT_INDENT = 'none';

// Intrinsic pixel sizes are generated alongside the binaries by the content workspace.
const DIMENSION_MANIFEST = 'paper-images.generated.json';

// Unimplemented images are a placeholder in rtq-web, never a resolved asset.
const TODO_IMAGE_MARKDOWN = '![Image is not implemented yet.](#rtq-todo-image)';

type ImageScope = 'answer' | 'question' | 'working';
type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];
type Dimensions = Readonly<{ height: number; width: number }>;
type ImageLayout = Readonly<{
  align: (typeof ALIGNS)[number];
  displaySize: (typeof DISPLAY_SIZES)[number];
  indent: (typeof INDENTS)[number];
}>;
type ImageTagCatalogDimension = Readonly<{
  attribute: string;
  cardinality: 'zero-or-one' | 'zero-or-more';
  key: string;
  label: string;
  values: readonly Readonly<{
    label: string;
    value: string;
  }>[];
}>;

function attributes(value: string): Record<string, string> {
  return Object.fromEntries(
    [...value.matchAll(ATTRIBUTE)].map((match) => [match[1], match[2]]),
  );
}

function markdownText(value: string): string {
  return value
    .replace(/[\\\[\]]/g, '\\$&')
    .replace(/\s+/g, ' ')
    .trim();
}

function markdownTitle(value: string): string {
  return value.replace(/["\r\n]+/g, ' ').trim();
}

function assetUrl(
  relativePath: string,
  params: Readonly<Record<string, string>> = {},
): string {
  const query = new URLSearchParams(params).toString();
  const encoded = relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/api/assets/${encoded}${query ? `?${query}` : ''}`;
}

function pickAttribute<T extends string>(
  allowed: readonly T[],
  value: string | undefined,
  fallback: T,
  attribute: string,
): T {
  if (value === undefined) return fallback;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(
    `Unsupported ${attribute}: ${value}. Expected ${allowed.join(', ')}.`,
  );
}

function imageLayout(authored: Record<string, string>): ImageLayout {
  return {
    align: pickAttribute(ALIGNS, authored.align, DEFAULT_ALIGN, 'align'),
    displaySize: pickAttribute(
      DISPLAY_SIZES,
      authored.displaySize,
      DEFAULT_DISPLAY_SIZE,
      'displaySize',
    ),
    indent: pickAttribute(INDENTS, authored.indent, DEFAULT_INDENT, 'indent'),
  };
}

const dimensionCache = new Map<
  string,
  Readonly<{ entries: ReadonlyMap<string, Dimensions>; mtimeMs: number }>
>();

let imageTagCatalogCache:
  | Readonly<{
      dimensions: readonly ImageTagCatalogDimension[];
      mtimeMs: number;
      path: string;
    }>
  | undefined;

function imageTagCatalog(): readonly ImageTagCatalogDimension[] {
  const catalogPath = path.join(
    resolveRtqContentPaths().assetsPackageRoot,
    IMAGE_TAG_CATALOG,
  );
  const mtimeMs = statSync(catalogPath).mtimeMs;
  if (
    imageTagCatalogCache?.path === catalogPath &&
    imageTagCatalogCache.mtimeMs === mtimeMs
  ) {
    return imageTagCatalogCache.dimensions;
  }

  const parsed: unknown = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed) ||
    (parsed as Record<string, unknown>).version !== 5 ||
    (parsed as Record<string, unknown>).component !== 'PaperImage' ||
    !Array.isArray((parsed as Record<string, unknown>).dimensions)
  ) {
    throw new Error('Invalid canonical PaperImage tag catalog.');
  }

  const dimensions = (
    (parsed as Record<string, unknown>).dimensions as unknown[]
  ).map<ImageTagCatalogDimension>((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error('Invalid PaperImage tag dimension.');
    }
    const dimension = entry as Record<string, unknown>;
    if (
      typeof dimension.attribute !== 'string' ||
      typeof dimension.key !== 'string' ||
      typeof dimension.label !== 'string' ||
      dimension.cardinality !==
        (dimension.key === 'type' ? 'zero-or-more' : 'zero-or-one') ||
      !Array.isArray(dimension.values)
    ) {
      throw new Error('Invalid PaperImage tag dimension.');
    }
    return {
      attribute: dimension.attribute,
      cardinality:
        dimension.cardinality as ImageTagCatalogDimension['cardinality'],
      key: dimension.key,
      label: dimension.label,
      values: dimension.values.map((candidate) => {
        if (
          !candidate ||
          typeof candidate !== 'object' ||
          Array.isArray(candidate)
        ) {
          throw new Error('Invalid PaperImage tag value.');
        }
        const value = candidate as Record<string, unknown>;
        if (
          typeof value.label !== 'string' ||
          typeof value.value !== 'string' ||
          Object.hasOwn(value, 'requires')
        ) {
          throw new Error('Invalid PaperImage tag value.');
        }
        return {
          label: value.label,
          value: value.value,
        };
      }),
    };
  });

  imageTagCatalogCache = { dimensions, mtimeMs, path: catalogPath };
  return dimensions;
}

function imageTags(
  authored: Readonly<Record<string, string>>,
): readonly DisplayPaperImageTag[] {
  const dimensions = imageTagCatalog();
  return dimensions.flatMap((dimension) => {
    const assigned = authored[dimension.attribute];
    if (assigned === undefined) return [];
    const values =
      dimension.cardinality === 'zero-or-more'
        ? assigned.split(' ')
        : [assigned];
    return [...new Set(values)].map((member) => {
      const value = dimension.values.find(
        (candidate) => candidate.value === member,
      );
      return {
        dimensionKey: dimension.key,
        dimensionLabel: dimension.label,
        supported:
          value !== undefined &&
          values.filter((item) => item === member).length === 1,
        value: member,
        valueLabel: value?.label ?? member,
      };
    });
  });
}

function dimensions(
  paperRoot: string,
  sourcePath: string,
): Dimensions | undefined {
  const manifestPath = path.join(paperRoot, DIMENSION_MANIFEST);
  let mtimeMs: number;
  try {
    mtimeMs = statSync(manifestPath).mtimeMs;
  } catch {
    return undefined;
  }

  const cached = dimensionCache.get(paperRoot);
  if (cached?.mtimeMs === mtimeMs) return cached.entries.get(sourcePath);

  const entries = new Map<string, Dimensions>();
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      assets?: Record<string, Record<string, unknown>>;
    };
    for (const [key, value] of Object.entries(parsed.assets ?? {})) {
      const height = value?.intrinsicHeight;
      const width = value?.intrinsicWidth;
      if (typeof height === 'number' && typeof width === 'number') {
        entries.set(key, { height, width });
      }
    }
  } catch {
    // Dimensions only remove layout shift; sizing still works without them.
  }
  dimensionCache.set(paperRoot, { entries, mtimeMs });
  return entries.get(sourcePath);
}

function imageParams(
  layout: ImageLayout,
  size: Dimensions | undefined,
): Record<string, string> {
  const params: Record<string, string> = {
    align: layout.align,
    indent: layout.indent,
    size: layout.displaySize,
  };
  if (size) {
    params.h = String(size.height);
    params.w = String(size.width);
  }
  return params;
}

function compactPrefix(context: ReviewAssetContext): string {
  const parts = [
    `s${String(context.sectionIndex + 1).padStart(2, '0')}`,
    `q${String(context.questionIndex + 1).padStart(2, '0')}`,
  ];
  if (context.subquestionIndex !== undefined) {
    parts.push(`s${String(context.subquestionIndex + 1).padStart(2, '0')}`);
  }
  if (context.subSubquestionIndex !== undefined) {
    parts.push(`ss${String(context.subSubquestionIndex + 1).padStart(2, '0')}`);
  }
  return parts.join('-');
}

function ownerPath(
  context: ReviewAssetContext,
  scope: ImageScope,
  imageIndex: number,
): Readonly<{ metadata: string; sourceStem: string }> {
  const owner =
    scope === 'question'
      ? 'questions/manual'
      : `${scope === 'working' ? 'workings' : 'answers'}/manual`;
  const scopeIndex =
    scope === 'working' ? context.workingIndex : context.answerIndex;
  const scopeToken =
    scope === 'question'
      ? ''
      : `-${scope === 'working' ? 'w' : 'a'}${String((scopeIndex ?? 0) + 1).padStart(2, '0')}`;
  const basename = `${compactPrefix(context)}${scopeToken}-i${String(
    imageIndex,
  ).padStart(2, '0')}`;
  return {
    metadata: `${owner}/${basename}.json`,
    sourceStem: `${owner}/${basename}`,
  };
}

function imageMetadata(
  paperRoot: string,
  metadataPath: string,
): Readonly<{
  alt: string | null;
  altReview?: 'pending' | 'reviewed-decorative' | 'reviewed-informative';
  description: string;
}> {
  try {
    const parsed = JSON.parse(
      readFileSync(path.join(paperRoot, ...metadataPath.split('/')), 'utf8'),
    ) as Record<string, unknown>;
    return {
      alt:
        parsed.alt === null || typeof parsed.alt === 'string' ? parsed.alt : '',
      altReview:
        parsed.alt === null
          ? 'pending'
          : parsed.alt === ''
            ? 'reviewed-decorative'
            : typeof parsed.alt === 'string' && parsed.alt.trim()
              ? 'reviewed-informative'
              : undefined,
      description:
        typeof parsed.description === 'string' ? parsed.description : '',
    };
  } catch {
    return { alt: 'Paper image', description: '' };
  }
}

function imageFormat(
  extension: ImageExtension,
): DisplayPaperImageVariant['format'] {
  if (extension === 'png') return 'PNG';
  if (extension === 'svg') return 'SVG';
  return 'JPEG';
}

function paperImageMarkdown(
  component: string,
  context: ReviewAssetContext,
  imageIndex: number,
): Readonly<{ image: DisplayPaperImage; markdown: string }> {
  const authored = attributes(component);
  const scope = (authored.assetScope ?? context.scope) as ImageScope;
  if (!['question', 'working', 'answer'].includes(scope)) {
    throw new Error(`Unsupported PaperImage assetScope: ${scope}`);
  }
  if (scope !== context.scope) {
    throw new Error(
      `PaperImage assetScope ${scope} does not match ${context.scope} content.`,
    );
  }

  const layout = imageLayout(authored);
  const assetsRoot = resolveRtqContentPaths().assetsRoot;
  const paperRoot = path.join(assetsRoot, 'papers', context.paperStem);
  const location = ownerPath(context, scope, imageIndex);
  const matches = IMAGE_EXTENSIONS.filter((extension) =>
    existsSync(path.join(paperRoot, `${location.sourceStem}.${extension}`)),
  );
  if (matches.length === 0) {
    const missing = assetUrl(MISSING_IMAGE, {
      ...imageParams(layout, MISSING_IMAGE_SIZE),
      kind: 'paper-image',
    });
    return {
      image: {
        ...layout,
        alt: 'Missing paper image',
        description: '',
        referenceSrc: missing,
        tags: imageTags(authored),
        variants: [
          {
            format: 'Missing',
            ...MISSING_IMAGE_SIZE,
            src: missing,
          },
        ],
      },
      markdown: `![Missing paper image](${missing})`,
    };
  }

  const metadata = imageMetadata(paperRoot, location.metadata);
  const variants = matches.map<DisplayPaperImageVariant>((extension) => {
    const sourcePath = `${location.sourceStem}.${extension}`;
    const size = dimensions(paperRoot, sourcePath);
    const relativePath = `papers/${context.paperStem}/${sourcePath}`;
    return {
      format: imageFormat(extension),
      ...(size ?? {}),
      src: assetUrl(relativePath, {
        ...imageParams(layout, size),
        kind: 'paper-image',
        ...(metadata.altReview ? { altReview: metadata.altReview } : {}),
      }),
    };
  });
  const referenceSrc = variants[0].src;
  // Markdown's title slot transports the description; the renderer associates it
  // with the image rather than emitting an HTML title.
  const title = metadata.description
    ? ` "${metadata.description
        .replace(/[\\"]/g, '\\$&')
        .replace(/[\r\n]+/g, ' ')
        .trim()}"`
    : '';
  return {
    image: {
      ...layout,
      alt: metadata.alt ?? '',
      ...(metadata.altReview ? { altReview: metadata.altReview } : {}),
      description: metadata.description,
      referenceSrc,
      tags: imageTags(authored),
      variants,
    },
    markdown: `![${markdownText(metadata.alt ?? '')}](${referenceSrc}${title})`,
  };
}

function longDivisionPath(
  context: ReviewAssetContext,
  assetIndex: number,
  variant: 'bus' | 'long',
): string {
  const scope = context.scope;
  if (scope !== 'working' && scope !== 'answer') {
    throw new Error('LongDivision is only supported in solution content.');
  }
  const scopeIndex =
    scope === 'working' ? context.workingIndex : context.answerIndex;
  const token = scope === 'working' ? 'w' : 'a';
  const basename = `${compactPrefix(context)}-${token}${String(
    (scopeIndex ?? 0) + 1,
  ).padStart(2, '0')}-ld${String(assetIndex).padStart(2, '0')}-${variant}`;
  return `${scope === 'working' ? 'workings' : 'answers'}/generated/long-division/${basename}`;
}

function longDivisionMarkdown(
  component: string,
  context: ReviewAssetContext,
  assetIndex: number,
): string {
  const authored = attributes(component);
  const requested: readonly ('bus' | 'long')[] =
    authored.variant === 'bus' || authored.variant === 'long'
      ? [authored.variant]
      : ['long', 'bus'];
  // Long division renders at its natural width in rtq-web, so it carries no display size.
  const params: Record<string, string> = {
    align: pickAttribute(ALIGNS, authored.align, DEFAULT_ALIGN, 'align'),
    indent: pickAttribute(INDENTS, authored.indent, DEFAULT_INDENT, 'indent'),
    kind: 'long-division',
  };
  return requested
    .map((variant) => {
      const sourceStem = longDivisionPath(context, assetIndex, variant);
      const assetsRoot = resolveRtqContentPaths().assetsRoot;
      const paperRoot = path.join(assetsRoot, 'papers', context.paperStem);
      const metadataPath = path.join(paperRoot, `${sourceStem}.json`);
      let alt = `${authored.dividend ?? 'Number'} divided by ${authored.divisor ?? 'number'}, ${variant} method`;
      let description = '';
      try {
        const metadata = JSON.parse(
          readFileSync(metadataPath, 'utf8'),
        ) as Record<string, unknown>;
        if (typeof metadata.alt === 'string') alt = metadata.alt;
        if (typeof metadata.description === 'string') {
          description = metadata.description;
        }
      } catch {
        // The same-origin route supplies the standard missing-image fallback.
      }
      const sourcePath = `${sourceStem}.svg`;
      const relativePath = `papers/${context.paperStem}/${sourcePath}`;
      const title = description ? ` "${markdownTitle(description)}"` : '';
      const size = dimensions(paperRoot, sourcePath);
      const url = assetUrl(relativePath, {
        ...params,
        ...(size ? { h: String(size.height), w: String(size.width) } : {}),
      });
      return `![${markdownText(alt)}](${url}${title})`;
    })
    .join('\n\n');
}

function normalizeWorkingSections(
  value: string,
  parsed: WorkingSectionParseResult = parseWorkingSections(value),
): string {
  if (!parsed.segments) return value;
  return parsed.segments
    .flatMap((segment) => {
      if (segment.kind === 'flat') return segment.markdown;
      if (segment.visibility === 'hidden') return [];
      return segment.title
        ? `**${markdownText(segment.title)}**\n\n${segment.markdown}`
        : segment.markdown;
    })
    .join('\n\n');
}

function prepareField(
  field: ReviewContentField,
  options: Readonly<{ preserveWorkingSections?: boolean }> = {},
): DisplayContentField {
  try {
    let imageIndex = 0;
    let divisionIndex = 0;
    const paperImages: DisplayPaperImage[] = [];
    const tables = preparePaperTableMarkdown(
      field.expanded.replace(MDX_COMMENT, ''),
    );
    const paperLists = preparePaperListMarkdown(tables.markdown);
    validatePaperSymbolMarkdown(paperLists.markdown);
    const images = paperLists.markdown.replace(IMAGE, (component) => {
      if (!component.startsWith('<')) return TODO_IMAGE_MARKDOWN;
      const prepared = paperImageMarkdown(
        component,
        field.context,
        imageIndex++,
      );
      paperImages.push(prepared.image);
      return prepared.markdown;
    });
    const prepared = images.replace(LONG_DIVISION, (component) =>
      longDivisionMarkdown(component, field.context, divisionIndex++),
    );
    const parsed = options.preserveWorkingSections
      ? parseWorkingSections(prepared)
      : {};
    const workingSegments = parsed.segments?.map<DisplayWorkingSegment>(
      (segment) =>
        segment.kind === 'flat'
          ? { kind: 'flat', rendered: segment.markdown }
          : {
              kind: 'section',
              phase: segment.phase,
              rendered: segment.markdown,
              ...(segment.title ? { title: segment.title } : {}),
              visibility: segment.visibility,
            },
    );
    return {
      ...field,
      ...(tables.issue || paperLists.issue || parsed.issue
        ? {
            preparationIssue: [tables.issue, paperLists.issue, parsed.issue]
              .filter(Boolean)
              .join(' '),
          }
        : {}),
      ...(paperImages.length ? { paperImages } : {}),
      rendered: normalizeWorkingSections(prepared, parsed),
      ...(workingSegments ? { workingSegments } : {}),
    };
  } catch (error) {
    return {
      ...field,
      preparationIssue:
        error instanceof Error ? error.message : 'Content preparation failed.',
      rendered: field.expanded
        .replace(IMAGE, '**Paper image unavailable.**')
        .replace(LONG_DIVISION, '**Long division unavailable.**'),
    };
  }
}

export function prepareReviewPaperNodeForDisplay(
  node: ReviewPaper['sections'][number]['questions'][number],
): DisplayPaperNode {
  return {
    ...node,
    children: node.children.map(prepareReviewPaperNodeForDisplay),
    content: {
      answers: node.content.answers.map((answer) => ({
        answer: prepareField(answer.answer),
        key: prepareField(answer.key),
        option: prepareField(answer.option),
      })),
      question: prepareField(node.content.question),
      workings: node.content.workings.map((working) => ({
        formulas: working.formulas.map((field) => prepareField(field)),
        tips: working.tips.map((field) => prepareField(field)),
        working: prepareField(working.working, {
          preserveWorkingSections: true,
        }),
      })),
    },
  };
}

export function prepareReviewPaperForDisplay(
  paper: ReviewPaper,
): DisplayReviewPaper {
  return {
    ...paper,
    sections: paper.sections.map((section) => ({
      ...section,
      questions: section.questions.map(prepareReviewPaperNodeForDisplay),
    })),
  };
}
