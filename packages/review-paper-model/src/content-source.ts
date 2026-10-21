import { parse } from '@iarna/toml';

import type {
  ReviewContentFieldKind,
  ReviewContentFieldLocator,
} from './model.ts';
import { parsePaperToml } from './toml.ts';

type SourceSpan = Readonly<{
  end: number;
  source: ReviewContentFieldLocator;
  start: number;
  value: string;
}>;

type MutableNode = {
  fields: SourceSpan[];
  nextAnswerIndex: number;
  nextWorkingIndex: number;
  uuid?: string;
};

type WorkingTarget = {
  kind: 'working';
  nextFormulaIndex: number;
  nextTipIndex: number;
  node: MutableNode;
  workingIndex: number;
};

type Target =
  | { kind: 'answer'; answerIndex: number; node: MutableNode }
  | { kind: 'formula'; itemIndex: number; working: WorkingTarget }
  | { kind: 'node'; node: MutableNode }
  | { kind: 'tip'; itemIndex: number; working: WorkingTarget }
  | WorkingTarget
  | undefined;

export class PaperContentFieldSourceError extends Error {
  readonly code: 'field-not-found' | 'invalid-source' | 'unsupported-value';

  constructor(
    message: string,
    code: 'field-not-found' | 'invalid-source' | 'unsupported-value',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'PaperContentFieldSourceError';
    this.code = code;
  }
}

function parsedString(valueSource: string): string | undefined {
  try {
    const value = (parse(`value = ${valueSource}`) as { value?: unknown })
      .value;
    return typeof value === 'string' ? value : undefined;
  } catch (error) {
    throw new PaperContentFieldSourceError(
      'The selected TOML value could not be read.',
      'invalid-source',
      { cause: error },
    );
  }
}

function lineEnd(raw: string, from: number): number {
  const newline = raw.indexOf('\n', from);
  return newline === -1 ? raw.length : newline;
}

function singleQuotedValueEnd(
  raw: string,
  start: number,
  quote: "'" | '"',
): number {
  for (let index = start + 1; index < raw.length; index += 1) {
    if (quote === '"' && raw[index] === '\\') {
      index += 1;
      continue;
    }
    if (raw[index] === quote) return index + 1;
    if (raw[index] === '\n' || raw[index] === '\r') break;
  }
  throw new PaperContentFieldSourceError(
    'The selected TOML string is not terminated.',
    'invalid-source',
  );
}

function tripleQuotedValueEnd(
  raw: string,
  start: number,
  delimiter: "'''" | '"""',
): number {
  let searchFrom = start + 3;
  while (searchFrom < raw.length) {
    const found = raw.indexOf(delimiter, searchFrom);
    if (found === -1) break;
    if (delimiter === "'''" || raw[found - 1] !== '\\') return found + 3;

    let slashCount = 0;
    for (let index = found - 1; index >= 0 && raw[index] === '\\'; index -= 1) {
      slashCount += 1;
    }
    if (slashCount % 2 === 0) return found + 3;
    searchFrom = found + 3;
  }
  throw new PaperContentFieldSourceError(
    'The selected multiline TOML string is not terminated.',
    'invalid-source',
  );
}

function valueEnd(raw: string, start: number): number {
  const prefix = raw.slice(start, start + 3);
  if (prefix === "'''" || prefix === '"""') {
    return tripleQuotedValueEnd(raw, start, prefix);
  }
  if (raw[start] === "'" || raw[start] === '"') {
    return singleQuotedValueEnd(raw, start, raw[start] as "'" | '"');
  }

  const end = lineEnd(raw, start);
  const comment = raw.indexOf('#', start);
  let valueEnd = comment !== -1 && comment < end ? comment : end;
  while (valueEnd > start && /\s/.test(raw[valueEnd - 1])) valueEnd -= 1;
  return valueEnd;
}

function nodeForPath(
  path: string,
  nodes: Readonly<{
    question?: MutableNode;
    subquestion?: MutableNode;
    subSubquestion?: MutableNode;
  }>,
): MutableNode | undefined {
  if (path === 'sections.questions') return nodes.question;
  if (path === 'sections.questions.subquestions') return nodes.subquestion;
  if (path === 'sections.questions.subquestions.subquestions') {
    return nodes.subSubquestion;
  }
  return undefined;
}

function fieldKindForTarget(
  target: Target,
  key: string,
): ReviewContentFieldKind | undefined {
  if (target?.kind === 'node' && key === 'question') return 'question';
  if (target?.kind === 'working' && key === 'working') return 'working';
  if (target?.kind === 'formula' && key === 'formula') return 'formula';
  if (target?.kind === 'tip' && key === 'tip') return 'tip';
  if (
    target?.kind === 'answer' &&
    (key === 'answer' || key === 'key' || key === 'option')
  ) {
    return key;
  }
  return undefined;
}

function sourceForTarget(
  target: Exclude<Target, undefined>,
  kind: ReviewContentFieldKind,
): ReviewContentFieldLocator {
  if (target.kind === 'working') {
    return { kind, workingIndex: target.workingIndex };
  }
  if (target.kind === 'formula' || target.kind === 'tip') {
    return {
      itemIndex: target.itemIndex,
      kind,
      workingIndex: target.working.workingIndex,
    };
  }
  if (target.kind === 'answer') {
    return { answerIndex: target.answerIndex, kind };
  }
  return { kind };
}

function contentSourceSpans(raw: string): SourceSpan[] {
  const allNodes: MutableNode[] = [];
  const nodes: {
    question?: MutableNode;
    subquestion?: MutableNode;
    subSubquestion?: MutableNode;
  } = {};
  let currentWorking: WorkingTarget | undefined;
  let target: Target;
  let cursor = 0;

  while (cursor < raw.length) {
    const end = lineEnd(raw, cursor);
    const line = raw.slice(cursor, end);
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      cursor = end < raw.length ? end + 1 : end;
      continue;
    }

    const header = /^\s*\[\[([^\]]+)\]\]\s*(?:#.*)?$/.exec(line);
    if (header) {
      const path = header[1].trim();
      if (path === 'sections.questions') {
        nodes.question = {
          fields: [],
          nextAnswerIndex: 0,
          nextWorkingIndex: 0,
        };
        nodes.subquestion = undefined;
        nodes.subSubquestion = undefined;
        allNodes.push(nodes.question);
        currentWorking = undefined;
        target = { kind: 'node', node: nodes.question };
      } else if (path === 'sections.questions.subquestions') {
        nodes.subquestion = {
          fields: [],
          nextAnswerIndex: 0,
          nextWorkingIndex: 0,
        };
        nodes.subSubquestion = undefined;
        allNodes.push(nodes.subquestion);
        currentWorking = undefined;
        target = { kind: 'node', node: nodes.subquestion };
      } else if (path === 'sections.questions.subquestions.subquestions') {
        nodes.subSubquestion = {
          fields: [],
          nextAnswerIndex: 0,
          nextWorkingIndex: 0,
        };
        allNodes.push(nodes.subSubquestion);
        currentWorking = undefined;
        target = { kind: 'node', node: nodes.subSubquestion };
      } else if (path.endsWith('.workings')) {
        const node = nodeForPath(path.slice(0, -'.workings'.length), nodes);
        currentWorking = node
          ? {
              kind: 'working',
              nextFormulaIndex: 0,
              nextTipIndex: 0,
              node,
              workingIndex: node.nextWorkingIndex++,
            }
          : undefined;
        target = currentWorking;
      } else if (path.endsWith('.workings.formulas')) {
        const node = nodeForPath(
          path.slice(0, -'.workings.formulas'.length),
          nodes,
        );
        target =
          node && currentWorking?.node === node
            ? {
                itemIndex: currentWorking.nextFormulaIndex++,
                kind: 'formula',
                working: currentWorking,
              }
            : undefined;
      } else if (path.endsWith('.workings.tips')) {
        const node = nodeForPath(
          path.slice(0, -'.workings.tips'.length),
          nodes,
        );
        target =
          node && currentWorking?.node === node
            ? {
                itemIndex: currentWorking.nextTipIndex++,
                kind: 'tip',
                working: currentWorking,
              }
            : undefined;
      } else if (path.endsWith('.answers')) {
        const node = nodeForPath(path.slice(0, -'.answers'.length), nodes);
        currentWorking = undefined;
        target = node
          ? {
              answerIndex: node.nextAnswerIndex++,
              kind: 'answer',
              node,
            }
          : undefined;
      } else {
        currentWorking = undefined;
        target = undefined;
      }
      cursor = end < raw.length ? end + 1 : end;
      continue;
    }

    if (/^\s*\[[^\]]+\]\s*(?:#.*)?$/.test(line)) {
      currentWorking = undefined;
      target = undefined;
      cursor = end < raw.length ? end + 1 : end;
      continue;
    }

    const assignment = /^\s*([A-Za-z0-9_-]+)\s*=\s*/.exec(line);
    if (!assignment || !target) {
      cursor = end < raw.length ? end + 1 : end;
      continue;
    }

    const key = assignment[1];
    const start = cursor + assignment[0].length;
    const finish = valueEnd(raw, start);
    const valueSource = raw.slice(start, finish);
    const node =
      target.kind === 'formula' || target.kind === 'tip'
        ? target.working.node
        : target.node;

    if (target.kind === 'node' && key === 'rtq-uuid') {
      node.uuid = parsedString(valueSource);
    }

    const kind = fieldKindForTarget(target, key);
    if (kind) {
      const value = parsedString(valueSource);
      if (value !== undefined) {
        node.fields.push({
          end: finish,
          source: sourceForTarget(target, kind),
          start,
          value,
        });
      }
    }

    cursor = finish > end ? finish : end < raw.length ? end + 1 : end;
  }

  return allNodes.flatMap((node) =>
    node.fields.map((field) => ({
      ...field,
      source: {
        ...field.source,
        ...(node.uuid ? { nodeUuid: node.uuid } : {}),
      },
    })),
  );
}

function sameFieldSource(
  left: ReviewContentFieldLocator,
  right: ReviewContentFieldLocator,
): boolean {
  return (
    left.nodeUuid === right.nodeUuid &&
    left.kind === right.kind &&
    left.workingIndex === right.workingIndex &&
    left.answerIndex === right.answerIndex &&
    left.itemIndex === right.itemIndex
  );
}

function fieldSpan(raw: string, source: ReviewContentFieldLocator): SourceSpan {
  if (!source.nodeUuid) {
    throw new PaperContentFieldSourceError(
      'This question does not have an rtq-uuid, so it cannot be edited safely.',
      'field-not-found',
    );
  }
  const matches = contentSourceSpans(raw).filter((candidate) =>
    sameFieldSource(candidate.source, source),
  );
  if (matches.length !== 1) {
    throw new PaperContentFieldSourceError(
      matches.length === 0
        ? 'The selected field could not be found in the displayed TOML.'
        : 'The selected field is ambiguous in the displayed TOML.',
      'field-not-found',
    );
  }
  return matches[0];
}

function encodeTomlString(value: string, lineBreak: string): string {
  const invalidControl = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
  if (!value.includes("'''") && !invalidControl.test(value)) {
    return `'''${value.includes('\n') ? lineBreak : ''}${value}'''`;
  }

  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(
      /[\u0000-\u0007\u000B\u000E-\u001F\u007F]/g,
      (character) =>
        `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
  return `"""${value.includes('\n') ? lineBreak : ''}${escaped}"""`;
}

export function readPaperContentField(
  raw: string,
  source: ReviewContentFieldLocator,
): string {
  return fieldSpan(raw, source).value;
}

export function replacePaperContentField(
  raw: string,
  source: ReviewContentFieldLocator,
  value: string,
): string {
  const span = fieldSpan(raw, source);
  const replacement = encodeTomlString(
    value,
    raw.includes('\r\n') ? '\r\n' : '\n',
  );
  if (parsedString(replacement) !== value) {
    throw new PaperContentFieldSourceError(
      'The edited value cannot be represented safely in TOML.',
      'unsupported-value',
    );
  }
  const updated = `${raw.slice(0, span.start)}${replacement}${raw.slice(span.end)}`;
  try {
    parsePaperToml(updated, 'toml');
  } catch (error) {
    throw new PaperContentFieldSourceError(
      'The edit would make the paper TOML invalid.',
      'unsupported-value',
      { cause: error },
    );
  }
  return updated;
}
