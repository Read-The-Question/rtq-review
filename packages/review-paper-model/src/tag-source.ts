import { parse } from '@iarna/toml';

import type { DimensionalTagAxis } from './model.ts';
import { parsePaperToml } from './toml.ts';

type NodeTagSource = Readonly<{
  depth: 0 | 1 | 2;
  explicitInherit: boolean | null;
  explicitTags: readonly string[];
  inheritLineIndex: number | null;
  nodeUuid: string;
  tagsLineIndex: number | null;
  uuidLineIndex: number;
}>;

const nodeHeaders = new Map<string, 0 | 1 | 2>([
  ['sections.questions', 0],
  ['sections.questions.subquestions', 1],
  ['sections.questions.subquestions.subquestions', 2],
]);

export class PaperTagSourceError extends Error {
  readonly code:
    | 'invalid-source'
    | 'node-not-found'
    | 'unsupported-inheritance'
    | 'unsupported-tags';

  constructor(
    message: string,
    code:
      | 'invalid-source'
      | 'node-not-found'
      | 'unsupported-inheritance'
      | 'unsupported-tags',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'PaperTagSourceError';
    this.code = code;
  }
}

function parseAssignmentValue(line: string, key: string): unknown {
  const assignment = new RegExp(`^\\s*${key}\\s*=\\s*(.*?)\\s*(?:#.*)?$`).exec(
    line,
  );
  if (!assignment) return undefined;
  try {
    return (parse(`value = ${assignment[1]}`) as { value?: unknown }).value;
  } catch (error) {
    throw new PaperTagSourceError(
      `The selected ${key} value is not valid TOML.`,
      'invalid-source',
      { cause: error },
    );
  }
}

function editableLines(raw: string): Readonly<{
  hasTrailingNewline: boolean;
  lineEnding: '\n' | '\r\n';
  lines: string[];
}> {
  const lineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
  const hasTrailingNewline = raw.endsWith(lineEnding);
  const content = hasTrailingNewline
    ? raw.slice(0, raw.length - lineEnding.length)
    : raw;
  return {
    hasTrailingNewline,
    lineEnding,
    lines: content ? content.split(/\r?\n/) : [''],
  };
}

function scanNodeTagSources(raw: string): NodeTagSource[] {
  const { lines } = editableLines(raw);
  const nodes: Array<{
    depth: 0 | 1 | 2;
    inheritLineIndex: number | null;
    tagsLineIndex: number | null;
    uuid?: string;
    uuidLineIndex?: number;
  }> = [];
  let current: (typeof nodes)[number] | undefined;
  let directNodeTable = false;

  for (const [lineIndex, line] of lines.entries()) {
    const arrayHeader = /^\s*\[\[([^\]]+)\]\]\s*(?:#.*)?$/.exec(line);
    if (arrayHeader) {
      const depth = nodeHeaders.get(arrayHeader[1].trim());
      if (depth === undefined) {
        directNodeTable = false;
        continue;
      }
      current = {
        depth,
        inheritLineIndex: null,
        tagsLineIndex: null,
      };
      nodes.push(current);
      directNodeTable = true;
      continue;
    }

    if (/^\s*\[[^\]]+\]\s*(?:#.*)?$/.test(line)) {
      directNodeTable = false;
      continue;
    }
    if (!current || !directNodeTable) continue;

    if (/^\s*rtq-uuid\s*=/.test(line)) {
      const uuid = parseAssignmentValue(line, 'rtq-uuid');
      if (typeof uuid === 'string' && uuid.trim()) {
        current.uuid = uuid.trim();
        current.uuidLineIndex = lineIndex;
      }
    } else if (/^\s*rtq-tags\s*=/.test(line)) {
      current.tagsLineIndex = lineIndex;
    } else if (/^\s*rtq-inherit-tags\s*=/.test(line)) {
      current.inheritLineIndex = lineIndex;
    }
  }

  return nodes.flatMap((node) => {
    if (!node.uuid || node.uuidLineIndex === undefined) return [];
    const rawTags =
      node.tagsLineIndex === null
        ? []
        : parseAssignmentValue(lines[node.tagsLineIndex], 'rtq-tags');
    if (
      !Array.isArray(rawTags) ||
      rawTags.some((tag) => typeof tag !== 'string')
    ) {
      throw new PaperTagSourceError(
        `The rtq-tags value for ${node.uuid} must be an array of strings.`,
        'invalid-source',
      );
    }
    const rawInherit =
      node.inheritLineIndex === null
        ? undefined
        : parseAssignmentValue(
            lines[node.inheritLineIndex],
            'rtq-inherit-tags',
          );
    if (rawInherit !== undefined && typeof rawInherit !== 'boolean') {
      throw new PaperTagSourceError(
        `The rtq-inherit-tags value for ${node.uuid} must be a boolean.`,
        'invalid-source',
      );
    }
    return [
      {
        depth: node.depth,
        explicitInherit:
          node.depth === 0
            ? null
            : typeof rawInherit === 'boolean'
              ? rawInherit
              : true,
        explicitTags: rawTags as string[],
        inheritLineIndex: node.inheritLineIndex,
        nodeUuid: node.uuid,
        tagsLineIndex: node.tagsLineIndex,
        uuidLineIndex: node.uuidLineIndex,
      },
    ];
  });
}

function nodeTagSource(raw: string, nodeUuid: string): NodeTagSource {
  const matches = scanNodeTagSources(raw).filter(
    (candidate) => candidate.nodeUuid === nodeUuid,
  );
  if (matches.length !== 1) {
    throw new PaperTagSourceError(
      matches.length === 0
        ? `The question UUID ${nodeUuid} was not found in the displayed TOML.`
        : `The question UUID ${nodeUuid} is duplicated in the displayed TOML.`,
      'node-not-found',
    );
  }
  return matches[0];
}

function replaceAssignment(line: string, key: string, value: string): string {
  const assignment = new RegExp(
    `^(\\s*${key}\\s*=\\s*)(.*?)(\\s*(?:#.*)?)$`,
  ).exec(line);
  if (!assignment) {
    throw new PaperTagSourceError(
      `The selected ${key} assignment could not be updated safely.`,
      'invalid-source',
    );
  }
  return `${assignment[1]}${value}${assignment[3]}`;
}

export function readPaperNodeTagSource(
  raw: string,
  nodeUuid: string,
): Pick<
  NodeTagSource,
  'depth' | 'explicitInherit' | 'explicitTags' | 'nodeUuid'
> {
  const source = nodeTagSource(raw, nodeUuid);
  return {
    depth: source.depth,
    explicitInherit: source.explicitInherit,
    explicitTags: source.explicitTags,
    nodeUuid: source.nodeUuid,
  };
}

export function replacePaperNodeTags(
  raw: string,
  input: Readonly<{
    explicitInherit: boolean | null;
    explicitTags: readonly string[];
    nodeUuid: string;
  }>,
): string {
  if (
    input.explicitTags.some(
      (tag) => typeof tag !== 'string' || !tag.trim() || tag.length > 200,
    )
  ) {
    throw new PaperTagSourceError(
      'Every explicit tag must be a non-empty string of at most 200 characters.',
      'unsupported-tags',
    );
  }
  const source = nodeTagSource(raw, input.nodeUuid);
  if (
    (source.depth === 0 && input.explicitInherit !== null) ||
    (source.depth > 0 && typeof input.explicitInherit !== 'boolean')
  ) {
    throw new PaperTagSourceError(
      source.depth === 0
        ? 'A top-level question cannot inherit tags.'
        : 'A nested question must specify whether it inherits tags.',
      'unsupported-inheritance',
    );
  }

  const { hasTrailingNewline, lineEnding, lines } = editableLines(raw);
  const formattedTags = `[${[...new Set(input.explicitTags)]
    .map((tag) => JSON.stringify(tag))
    .join(', ')}]`;
  let tagsLineIndex = source.tagsLineIndex;
  if (tagsLineIndex === null) {
    tagsLineIndex = source.uuidLineIndex + 1;
    lines.splice(tagsLineIndex, 0, `rtq-tags = ${formattedTags}`);
  } else {
    lines[tagsLineIndex] = replaceAssignment(
      lines[tagsLineIndex],
      'rtq-tags',
      formattedTags,
    );
  }

  if (source.depth > 0 && input.explicitInherit !== null) {
    const formattedInherit = input.explicitInherit ? 'true' : 'false';
    const adjustedInheritIndex =
      source.inheritLineIndex !== null &&
      source.tagsLineIndex === null &&
      source.inheritLineIndex >= tagsLineIndex
        ? source.inheritLineIndex + 1
        : source.inheritLineIndex;
    if (adjustedInheritIndex === null) {
      lines.splice(
        tagsLineIndex + 1,
        0,
        `rtq-inherit-tags = ${formattedInherit}`,
      );
    } else {
      lines[adjustedInheritIndex] = replaceAssignment(
        lines[adjustedInheritIndex],
        'rtq-inherit-tags',
        formattedInherit,
      );
    }
  }

  const normalized = lines.join(lineEnding);
  const updated = hasTrailingNewline
    ? `${normalized}${lineEnding}`
    : normalized;
  try {
    parsePaperToml(updated, 'toml');
  } catch (error) {
    throw new PaperTagSourceError(
      'The tag edit would make the paper TOML invalid.',
      'unsupported-tags',
      { cause: error },
    );
  }
  return updated;
}

export function dimensionalTagKind(
  value: string,
): DimensionalTagAxis | 'legacy' {
  for (const axis of [
    'family',
    'math',
    'frame',
    'marker',
    'reasoning',
  ] as const) {
    if (value.startsWith(`${axis}.`)) return axis;
  }
  return 'legacy';
}

export function sortPersistedQuestionTags(
  tags: readonly string[],
): readonly string[] {
  const order: Record<DimensionalTagAxis | 'legacy', number> = {
    legacy: 0,
    family: 1,
    math: 2,
    frame: 3,
    marker: 4,
    reasoning: 5,
  };
  return [...new Set(tags)].sort((left, right) => {
    const kind =
      order[dimensionalTagKind(left)] - order[dimensionalTagKind(right)];
    return (
      kind ||
      left.localeCompare(right, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });
}
