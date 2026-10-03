import type { PaperImageScope } from './paper-types.ts';

type AttributeRange = {
  end: number;
  start: number;
  valueEnd: number;
  valueStart: number;
};

export type ParsedPaperImageComponent = {
  attributeRanges: Record<string, AttributeRange>;
  attributes: Record<string, string>;
  end: number;
  source: string;
  start: number;
};

const COMPONENT_PATTERN = /<PaperImage\b[^\n>]*\/>/g;
const ATTRIBUTE_PATTERN = /^([A-Za-z][A-Za-z0-9_-]*)="([^"]*)"/;
const COMPONENT_OPEN = '<PaperImage';

export class PaperImageComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaperImageComponentError';
  }
}

function fail(message: string): never {
  throw new PaperImageComponentError(message);
}

export function parsePaperImageComponent(
  source: string,
): ParsedPaperImageComponent {
  if (!source.startsWith(COMPONENT_OPEN) || !source.endsWith('/>')) {
    fail('PaperImage must be a self-closing component.');
  }

  const bodyStart = COMPONENT_OPEN.length;
  const bodyEnd = source.length - 2;
  const body = source.slice(bodyStart, bodyEnd);
  const attributes: Record<string, string> = {};
  const attributeRanges: Record<string, AttributeRange> = {};
  let cursor = 0;

  while (cursor < body.length) {
    const whitespaceStart = cursor;
    while (/\s/.test(body[cursor] ?? '')) {
      cursor += 1;
    }
    if (cursor === body.length) {
      break;
    }

    const match = ATTRIBUTE_PATTERN.exec(body.slice(cursor));
    if (!match) {
      fail('PaperImage attributes must be unique static double-quoted props.');
    }

    const [attributeSource, name, value] = match;
    if (Object.hasOwn(attributes, name)) {
      fail(`PaperImage contains duplicate ${name} attributes.`);
    }
    const attributeStart = bodyStart + cursor;
    const valueStart = attributeStart + name.length + 2;
    attributes[name] = value;
    attributeRanges[name] = {
      end: attributeStart + attributeSource.length,
      start: bodyStart + whitespaceStart,
      valueEnd: valueStart + value.length,
      valueStart,
    };
    cursor += attributeSource.length;
  }

  return {
    attributeRanges,
    attributes,
    end: source.length,
    source,
    start: 0,
  };
}

export function findPaperImageComponents(
  markdown: string,
  expectedScope?: PaperImageScope,
): ParsedPaperImageComponent[] {
  return [...markdown.matchAll(COMPONENT_PATTERN)].map(match => {
    const source = match[0];
    const parsed = parsePaperImageComponent(source);
    if (expectedScope && parsed.attributes.assetScope !== expectedScope) {
      fail(
        `PaperImage requires assetScope="${expectedScope}" in ${expectedScope} content; received ${JSON.stringify(parsed.attributes.assetScope)}.`,
      );
    }
    const start = match.index;
    return {
      ...parsed,
      end: start + source.length,
      start,
    };
  });
}

export function updatePaperImageAttribute(
  component: ParsedPaperImageComponent,
  attribute: string,
  value: string | null,
) {
  const range = component.attributeRanges[attribute];
  if (range && value === null) {
    return `${component.source.slice(0, range.start)}${component.source.slice(range.end)}`;
  }
  if (range && value !== null) {
    return `${component.source.slice(0, range.valueStart)}${value}${component.source.slice(range.valueEnd)}`;
  }
  if (value === null) {
    return component.source;
  }

  const closingStart = component.source.length - 2;
  const beforeClosing = component.source.slice(0, closingStart);
  const trailingWhitespace = beforeClosing.match(/\s*$/)?.[0] ?? '';
  const prefix = beforeClosing.slice(
    0,
    beforeClosing.length - trailingWhitespace.length,
  );
  const closeSpacing = trailingWhitespace || ' ';
  return `${prefix} ${attribute}="${value}"${closeSpacing}/>`;
}
