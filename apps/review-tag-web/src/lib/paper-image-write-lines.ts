import crypto from 'node:crypto';

import { validateImageTagAssignments } from './image-tag-catalog.ts';
import {
  findPaperImageComponents,
  updatePaperImageAttribute,
} from './paper-image-components.ts';
import type {
  ImageTagCatalog,
  ImageTagMutationPayload,
  PaperImageFieldLocator,
  PaperImageScope,
} from './paper-types.ts';

type Span = { end: number; start: number };
type NodeSpan = Span & { uuid: string | null };

const NODE_HEADER_PATTERN =
  /^\[\[(?:sections\.questions|sections\.questions\.subquestions|sections\.questions\.subquestions\.subquestions)\]\][ \t]*$/gm;
const TABLE_HEADER_PATTERN = /^\[\[([^\]]+)\]\][ \t]*$/gm;
const UUID_PATTERN = /^rtq-uuid\s*=\s*"([^"]+)"[ \t]*$/m;

export class ImageTagMutationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageTagMutationError';
  }
}

export function imageTagSourceVersion(raw: string) {
  return crypto.createHash('sha1').update(raw).digest('hex');
}

export function verifyImageTagSourceVersion(raw: string, versionHash: string) {
  if (imageTagSourceVersion(raw) !== versionHash) {
    fail('The file changed outside the editor. Reload to continue.');
  }
}

function fail(message: string): never {
  throw new ImageTagMutationError(message);
}

function nodeSpans(raw: string): NodeSpan[] {
  const headers = [...raw.matchAll(NODE_HEADER_PATTERN)];
  return headers.map((header, index) => {
    const start = header.index;
    const end = headers[index + 1]?.index ?? raw.length;
    const uuid = UUID_PATTERN.exec(raw.slice(start, end))?.[1] ?? null;
    return { end, start, uuid };
  });
}

function tableSpans(raw: string, node: NodeSpan) {
  const segment = raw.slice(node.start, node.end);
  const headers = [...segment.matchAll(TABLE_HEADER_PATTERN)];
  return headers.map((header, index) => ({
    end: node.start + (headers[index + 1]?.index ?? segment.length),
    name: header[1],
    start: node.start + header.index,
  }));
}

function stringContentSpan(raw: string, table: Span, key: string): Span {
  const segment = raw.slice(table.start, table.end);
  const assignmentPattern = new RegExp(`^${key}\\s*=\\s*`, 'm');
  const assignment = assignmentPattern.exec(segment);
  if (!assignment) {
    fail(`Could not locate ${key} in the selected PaperImage field.`);
  }
  const valueStart = table.start + assignment.index + assignment[0].length;
  const delimiter = raw.startsWith("'''", valueStart)
    ? "'''"
    : raw.startsWith('"""', valueStart)
      ? '"""'
      : raw.startsWith("'", valueStart)
        ? "'"
        : raw.startsWith('"', valueStart)
          ? '"'
          : null;
  if (!delimiter) {
    fail(`${key} must be a TOML string.`);
  }
  const contentStart = valueStart + delimiter.length;
  let contentEnd = contentStart;
  while (contentEnd < table.end) {
    if (raw.startsWith(delimiter, contentEnd)) {
      let backslashes = 0;
      for (let index = contentEnd - 1; raw[index] === '\\'; index -= 1) {
        backslashes += 1;
      }
      if (delimiter.startsWith("'") || backslashes % 2 === 0) {
        return { end: contentEnd, start: contentStart };
      }
    }
    contentEnd += 1;
  }
  fail(`Could not locate the closing TOML string delimiter for ${key}.`);
}

function scopeFor(field: PaperImageFieldLocator): PaperImageScope {
  return field.kind;
}

function fieldSpan(
  raw: string,
  node: NodeSpan,
  field: PaperImageFieldLocator,
): Span {
  const tables = tableSpans(raw, node);
  if (field.kind === 'question') {
    const directEnd = tables[1]?.start ?? node.end;
    return stringContentSpan(
      raw,
      { end: directEnd, start: node.start },
      'question',
    );
  }

  if (!Number.isSafeInteger(field.index) || field.index < 0) {
    fail(`The selected ${field.kind} index is invalid.`);
  }
  const suffix = `.${field.kind === 'working' ? 'workings' : 'answers'}`;
  const candidates = tables.filter(table => table.name.endsWith(suffix));
  const selected = candidates[field.index];
  if (!selected) {
    fail(`Could not locate ${field.kind} ${field.index + 1}.`);
  }
  return stringContentSpan(
    raw,
    selected,
    field.kind === 'working' ? 'working' : 'answer',
  );
}

export function applyImageTagMutationToRaw(
  raw: string,
  input: Pick<
    ImageTagMutationPayload,
    'dimensionKey' | 'field' | 'nodeUuid' | 'occurrenceIndex' | 'value'
  >,
  catalog: ImageTagCatalog,
) {
  const matchingNodes = nodeSpans(raw).filter(
    node => node.uuid === input.nodeUuid,
  );
  if (matchingNodes.length !== 1) {
    fail(
      matchingNodes.length === 0
        ? `Could not find node UUID ${input.nodeUuid}.`
        : `Node UUID ${input.nodeUuid} is duplicated.`,
    );
  }
  const dimension = catalog.dimensions.find(
    candidate => candidate.key === input.dimensionKey,
  );
  if (!dimension) {
    fail(`Unsupported image tag dimension ${input.dimensionKey}.`);
  }
  if (
    input.value !== null &&
    !dimension.values.some(value => value.value === input.value)
  ) {
    fail(
      `Unsupported ${dimension.label.toLowerCase()} value ${String(input.value)}.`,
    );
  }
  if (
    !Number.isSafeInteger(input.occurrenceIndex) ||
    input.occurrenceIndex < 0
  ) {
    fail('The selected PaperImage occurrence index is invalid.');
  }

  const selectedNode = matchingNodes[0];
  const selectedField = fieldSpan(raw, selectedNode, input.field);
  const fieldSource = raw.slice(selectedField.start, selectedField.end);
  const components = findPaperImageComponents(
    fieldSource,
    scopeFor(input.field),
  );
  const component = components[input.occurrenceIndex];
  if (!component) {
    fail('The selected PaperImage occurrence no longer exists.');
  }
  const nextAttributes = { ...component.attributes };
  if (input.value === null) {
    delete nextAttributes[dimension.attribute];
  } else {
    nextAttributes[dimension.attribute] = input.value;
  }
  try {
    validateImageTagAssignments(catalog, nextAttributes);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  const updatedComponent = updatePaperImageAttribute(
    component,
    dimension.attribute,
    input.value,
  );
  const componentStart = selectedField.start + component.start;
  const componentEnd = selectedField.start + component.end;
  return `${raw.slice(0, componentStart)}${updatedComponent}${raw.slice(componentEnd)}`;
}
