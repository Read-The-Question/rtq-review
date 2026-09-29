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
const IMAGE_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg'] as const;
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
type Dimensions = Readonly<{ height: number; width: number }>;
type ImageLayout = Readonly<{
  align: (typeof ALIGNS)[number];
  displaySize: (typeof DISPLAY_SIZES)[number];
  indent: (typeof INDENTS)[number];
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
      ? 'questions'
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
): Readonly<{ alt: string; description: string }> {
  try {
    const parsed = JSON.parse(
      readFileSync(path.join(paperRoot, ...metadataPath.split('/')), 'utf8'),
    ) as Record<string, unknown>;
    return {
      alt: typeof parsed.alt === 'string' ? parsed.alt : '',
      description:
        typeof parsed.description === 'string' ? parsed.description : '',
    };
  } catch {
    return { alt: 'Paper image', description: '' };
  }
}

function paperImageMarkdown(
  component: string,
  context: ReviewAssetContext,
  imageIndex: number,
): string {
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
  if (matches.length > 1) {
    throw new Error(`Ambiguous PaperImage at ${location.sourceStem}.`);
  }
  if (matches.length === 0) {
    const missing = assetUrl(
      MISSING_IMAGE,
      imageParams(layout, MISSING_IMAGE_SIZE),
    );
    return `![Missing paper image](${missing})`;
  }

  const sourcePath = `${location.sourceStem}.${matches[0]}`;
  const metadata = imageMetadata(paperRoot, location.metadata);
  const relativePath = `papers/${context.paperStem}/${sourcePath}`;
  const title = metadata.description
    ? ` "${markdownTitle(metadata.description)}"`
    : '';
  const url = assetUrl(
    relativePath,
    imageParams(layout, dimensions(paperRoot, sourcePath)),
  );
  return `![${markdownText(metadata.alt)}](${url}${title})`;
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
    const tables = preparePaperTableMarkdown(
      field.expanded.replace(MDX_COMMENT, ''),
    );
    const paperLists = preparePaperListMarkdown(tables.markdown);
    validatePaperSymbolMarkdown(paperLists.markdown);
    const images = paperLists.markdown.replace(IMAGE, (component) =>
      component.startsWith('<')
        ? paperImageMarkdown(component, field.context, imageIndex++)
        : TODO_IMAGE_MARKDOWN,
    );
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
