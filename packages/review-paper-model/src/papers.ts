import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { basename, extname } from 'node:path';

import type { ResolveRtqContentOptions } from '@rtq/review-repository-paths';

import { listPaperCollections, paperCollectionForId } from './collections.ts';
import {
  createReviewContentField,
  readPaperMacros,
  type PaperMacros,
} from './content.ts';
import type {
  OriginalQuestionSource,
  PaperCollection,
  PaperCollectionId,
  PaperSource,
  PaperSourceProvenance,
  PaperSourceSummary,
  ReviewAnswer,
  ReviewAssetContext,
  ReviewPaper,
  ReviewPaperMetadata,
  ReviewPaperNode,
  ReviewTargetState,
  ReviewWorking,
} from './model.ts';
import { resolvePaperCollectionRoot, resolvePaperSourcePath } from './paths.ts';
import {
  PaperTomlParseError,
  parsePaperToml,
  type ParsedPaper,
} from './toml.ts';
import { resolveReviewPaperTags } from './tags.ts';

type NodePosition = Readonly<{
  paperStem: string;
  questionIndex: number;
  sectionIndex: number;
  subquestionIndex?: number;
  subSubquestionIndex?: number;
}>;

function hashContent(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function meaningfulString(value: unknown): string | undefined {
  const normalized =
    typeof value === 'string'
      ? value.trim()
      : typeof value === 'number'
        ? String(value)
        : '';

  if (!normalized || /^%[^%]+%$/.test(normalized)) return undefined;
  return normalized;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const text = meaningfulString(item);
    return text ? [text] : [];
  });
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) =>
    left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );
}

function humanize(value: string): string {
  return value
    .split(/[_.-]+/g)
    .filter(Boolean)
    .map((part) =>
      /^[a-z]{1,3}\d+$/i.test(part)
        ? part.toUpperCase()
        : `${part.charAt(0).toUpperCase()}${part.slice(1)}`,
    )
    .join(' ');
}

function paperStem(fileName: string): string {
  return fileName.replace(/\.toml$/i, '');
}

function topicLabel(value: string): string {
  return value.split('.').map(humanize).join(' / ');
}

function groupingFromStem(
  collectionId: PaperCollectionId,
  stem: string,
): Readonly<{ ragGrouping?: string; topic?: string }> {
  if (collectionId === 'focusRagTopicToml' || collectionId === 'ragTopicToml') {
    const match = /^topicpapers_(.+)_rag_([^_]+)_\d+$/i.exec(stem);
    return match
      ? { ragGrouping: match[2].toUpperCase(), topic: match[1] }
      : {};
  }

  if (collectionId === 'focusTopicToml' || collectionId === 'topicToml') {
    const match = /^topicpapers_(.+)_\d+$/i.exec(stem);
    return match ? { topic: match[1] } : {};
  }

  if (collectionId === 'focusRagToml' || collectionId === 'ragToml') {
    const match = /_rag_([^_]+)_\d+$/i.exec(stem);
    return match ? { ragGrouping: match[1].toUpperCase() } : {};
  }

  return {};
}

function nestedRecord(
  record: Record<string, unknown>,
  ...keys: string[]
): Record<string, unknown> | undefined {
  let current: Record<string, unknown> | undefined = record;

  for (const key of keys) {
    const next: unknown = current?.[key];
    if (!isRecord(next)) return undefined;
    current = next;
  }

  return current;
}

function titleFromPaper(
  parsed: ParsedPaper,
  collectionId: PaperCollectionId,
  stem: string,
): string {
  const displayTitle = meaningfulString(
    nestedRecord(parsed.meta, 'paper-name', 'display')?.value,
  );
  const paperName = meaningfulString(
    nestedRecord(parsed.meta, 'paper-name')?.value,
  );
  const legacyName = meaningfulString(parsed.meta.name);
  const grouping = groupingFromStem(collectionId, stem);

  return (
    displayTitle ??
    paperName ??
    legacyName ??
    (grouping.topic ? topicLabel(grouping.topic) : humanize(stem))
  );
}

function topLevelQuestionCount(parsed: ParsedPaper): number {
  return parsed.sections.reduce(
    (sum, section) => sum + asRecords(section.questions).length,
    0,
  );
}

function parseQuestionId(value: string):
  | Readonly<{
      paperStem: string;
      questionNumber: number;
      sectionNumber: number;
    }>
  | undefined {
  const match = /^(.*):(\d+):(\d+)$/.exec(value);
  if (!match) return undefined;

  const sectionNumber = Number.parseInt(match[2], 10);
  const questionNumber = Number.parseInt(match[3], 10);
  if (sectionNumber < 1 || questionNumber < 1) return undefined;

  return { paperStem: match[1], questionNumber, sectionNumber };
}

function visitQuestionRecords(
  records: readonly Record<string, unknown>[],
  visit: (record: Record<string, unknown>) => void,
): void {
  for (const record of records) {
    visit(record);
    visitQuestionRecords(asRecords(record.subquestions), visit);
  }
}

function sourceProvenance(
  parsed: ParsedPaper,
  collection: PaperCollection,
  stem: string,
): PaperSourceProvenance {
  const sourcePaperStems: string[] = [];

  for (const section of parsed.sections) {
    visitQuestionRecords(asRecords(section.questions), (record) => {
      const questionId = meaningfulString(record['rtq-question-id']);
      const parsedId = questionId ? parseQuestionId(questionId) : undefined;
      if (parsedId) sourcePaperStems.push(parsedId.paperStem);
    });
  }

  return {
    kind:
      collection.id === 'toml'
        ? 'canonical'
        : collection.exemplarLevel === undefined
          ? 'derived'
          : 'exemplar',
    sourcePaperStems: sortedUnique(
      sourcePaperStems.length || collection.id !== 'toml'
        ? sourcePaperStems
        : [stem],
    ),
  };
}

function focusGroups(parsed: ParsedPaper): string[] {
  return sortedUnique(stringArray(parsed.meta['rtq-focus-group']));
}

function buildPaperSource(
  collection: PaperCollection,
  relativePath: string,
  raw: string,
  parsed: ParsedPaper,
): PaperSource {
  const fileName = basename(relativePath);
  const stem = paperStem(fileName);
  const grouping = groupingFromStem(collection.id, stem);

  return {
    collection,
    fileName,
    focusGroups: focusGroups(parsed),
    provenance: sourceProvenance(parsed, collection, stem),
    questionCount: topLevelQuestionCount(parsed),
    ...grouping,
    relativePath,
    title: titleFromPaper(parsed, collection.id, stem),
    version: hashContent(raw),
  };
}

function invalidSourceSummary(
  collection: PaperCollection,
  fileName: string,
  raw: string,
  error: unknown,
): PaperSourceSummary {
  return {
    collection,
    fileName,
    message:
      error instanceof PaperTomlParseError
        ? error.message
        : 'The paper source could not be read.',
    relativePath: fileName,
    state: 'invalid',
    title: humanize(paperStem(fileName)),
    version: hashContent(raw),
  };
}

async function listCollectionSources(
  collection: PaperCollection,
  options: ResolveRtqContentOptions,
): Promise<PaperSourceSummary[]> {
  const root = resolvePaperCollectionRoot(collection.directory, options);
  const entries = await readdir(root, { withFileTypes: true });
  const fileNames = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith('.') &&
        !/^manifest(?:[._-]|$)/i.test(entry.name) &&
        extname(entry.name).toLowerCase() === '.toml',
    )
    .map((entry) => entry.name)
    .sort((left, right) =>
      left.localeCompare(right, undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );

  return Promise.all(
    fileNames.map(async (fileName): Promise<PaperSourceSummary> => {
      let raw = '';

      try {
        const sourcePath = resolvePaperSourcePath(
          collection.directory,
          fileName,
          options,
        );
        raw = await readFile(sourcePath, 'utf8');
        const parsed = parsePaperToml(raw, collection.id);
        return {
          source: buildPaperSource(collection, fileName, raw, parsed),
          state: 'ready',
        };
      } catch (error) {
        return invalidSourceSummary(collection, fileName, raw, error);
      }
    }),
  );
}

export async function listPaperSources(
  options: ResolveRtqContentOptions = {},
): Promise<readonly PaperSourceSummary[]> {
  const collections = await listPaperCollections(options);
  const groups = await Promise.all(
    collections.map((collection) => listCollectionSources(collection, options)),
  );
  return groups.flat();
}

function originalSource(
  value: string | undefined,
): OriginalQuestionSource | undefined {
  if (!value) return undefined;
  const parsed = parseQuestionId(value);

  return parsed ? { ...parsed, rawValue: value } : { rawValue: value };
}

function assetPosition(
  position: NodePosition,
  sourceQuestionId: string | undefined,
): NodePosition {
  const source = sourceQuestionId
    ? parseQuestionId(sourceQuestionId)
    : undefined;
  return source
    ? {
        ...position,
        paperStem: source.paperStem,
        questionIndex: source.questionNumber - 1,
        sectionIndex: source.sectionNumber - 1,
      }
    : position;
}

function assetContext(
  position: NodePosition,
  scope: ReviewAssetContext['scope'],
  index?: number,
): ReviewAssetContext {
  return {
    ...(scope === 'answer' && index !== undefined
      ? { answerIndex: index }
      : {}),
    paperStem: position.paperStem,
    questionIndex: position.questionIndex,
    scope,
    sectionIndex: position.sectionIndex,
    ...(position.subquestionIndex !== undefined
      ? { subquestionIndex: position.subquestionIndex }
      : {}),
    ...(position.subSubquestionIndex !== undefined
      ? { subSubquestionIndex: position.subSubquestionIndex }
      : {}),
    ...(scope === 'working' && index !== undefined
      ? { workingIndex: index }
      : {}),
  };
}

function reviewTarget(
  record: Record<string, unknown>,
  target: 'answer' | 'question',
  uuid: string | undefined,
): ReviewTargetState {
  const isAnswer = target === 'answer';
  const contentRag = meaningfulString(
    record[isAnswer ? 'rtq-answer-rag' : 'rtq-question-rag'],
  );
  const reviewOutcome = meaningfulString(
    record[isAnswer ? 'rtq-review-rag' : 'rtq-question-review-rag'],
  );

  return {
    ...(contentRag ? { contentRag } : {}),
    legacyComments: asString(
      record[isAnswer ? 'rtq-review-comments' : 'rtq-question-review-comments'],
    ).trim(),
    ...(reviewOutcome ? { reviewOutcome } : {}),
    ...(uuid ? { uuid } : {}),
  };
}

function lowerRoman(value: number): string {
  const numerals: Array<readonly [number, string]> = [
    [1000, 'm'],
    [900, 'cm'],
    [500, 'd'],
    [400, 'cd'],
    [100, 'c'],
    [90, 'xc'],
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
  ];
  let remaining = value;
  let result = '';

  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }

  return result;
}

function nodeLabel(position: NodePosition, depth: 0 | 1 | 2): string {
  const base = `S${position.sectionIndex + 1} Q${position.questionIndex + 1}`;
  if (depth === 0) return base;
  const subquestion = String.fromCharCode(
    97 + (position.subquestionIndex ?? 0),
  );
  if (depth === 1) return `${base}${subquestion}`;
  return `${base}${subquestion}.${lowerRoman(
    (position.subSubquestionIndex ?? 0) + 1,
  )}`;
}

function nodeId(position: NodePosition): string {
  return [
    `s${position.sectionIndex}`,
    `q${position.questionIndex}`,
    ...(position.subquestionIndex === undefined
      ? []
      : [`sq${position.subquestionIndex}`]),
    ...(position.subSubquestionIndex === undefined
      ? []
      : [`ssq${position.subSubquestionIndex}`]),
  ].join('.');
}

function reviewWorkings(
  rawWorkings: unknown,
  macros: PaperMacros,
  position: NodePosition,
): ReviewWorking[] {
  return asRecords(rawWorkings).map((working, workingIndex) => {
    const context = assetContext(position, 'working', workingIndex);
    return {
      formulas: asRecords(working.formulas).map((formula) =>
        createReviewContentField(formula.formula, macros, context),
      ),
      tips: asRecords(working.tips).map((tip) =>
        createReviewContentField(tip.tip, macros, context),
      ),
      working: createReviewContentField(working.working, macros, context),
    };
  });
}

function reviewAnswers(
  rawAnswers: unknown,
  macros: PaperMacros,
  position: NodePosition,
): ReviewAnswer[] {
  return asRecords(rawAnswers).map((answer, answerIndex) => {
    const context = assetContext(position, 'answer', answerIndex);
    return {
      answer: createReviewContentField(answer.answer, macros, context),
      key: createReviewContentField(answer.key, macros, context),
      option: createReviewContentField(answer.option, macros, context),
    };
  });
}

function buildNode(
  record: Record<string, unknown>,
  position: NodePosition,
  depth: 0 | 1 | 2,
  inheritedSourceQuestionId: string | undefined,
  macros: PaperMacros,
): ReviewPaperNode {
  const questionId = meaningfulString(record['rtq-question-id']);
  const sourceQuestionId =
    questionId ??
    inheritedSourceQuestionId ??
    `${position.paperStem}:${position.sectionIndex + 1}:${position.questionIndex + 1}`;
  const contentPosition = assetPosition(position, sourceQuestionId);
  const uuid = meaningfulString(record['rtq-uuid']);
  const explicitTags = sortedUnique([
    ...stringArray(record['rtq-tags']),
    ...stringArray(record.tags),
  ]);
  const explicitInherit =
    depth === 0
      ? null
      : typeof record['rtq-inherit-tags'] === 'boolean'
        ? record['rtq-inherit-tags']
        : true;
  const childRecords = depth === 2 ? [] : asRecords(record.subquestions);
  const children = childRecords.map((child, index) =>
    buildNode(
      child,
      depth === 0
        ? { ...position, subquestionIndex: index }
        : { ...position, subSubquestionIndex: index },
      depth === 0 ? 1 : 2,
      sourceQuestionId,
      macros,
    ),
  );

  return {
    children,
    content: {
      answers: reviewAnswers(record.answers, macros, contentPosition),
      question: createReviewContentField(
        record.question,
        macros,
        assetContext(contentPosition, 'question'),
      ),
      workings: reviewWorkings(record.workings, macros, contentPosition),
    },
    depth,
    effectiveTags: [],
    explicitInherit,
    explicitTags,
    id: nodeId(position),
    inheritedTags: [],
    kind:
      depth === 0
        ? 'question'
        : depth === 1
          ? 'subquestion'
          : 'sub-subquestion',
    label: nodeLabel(position, depth),
    ...(sourceQuestionId
      ? { originalSource: originalSource(sourceQuestionId) }
      : {}),
    ...(questionId ? { questionId } : {}),
    review: {
      answer: reviewTarget(record, 'answer', uuid),
      question: reviewTarget(record, 'question', uuid),
    },
    ...(sourceQuestionId ? { sourceQuestionId } : {}),
    ...(uuid ? { uuid } : {}),
  };
}

function paperMetadata(parsed: ParsedPaper): ReviewPaperMetadata {
  const accessTier = meaningfulString(parsed.meta['access-tier']);
  const paperId = meaningfulString(parsed.meta['rtq-paper-id']);
  const paperRag = meaningfulString(parsed.meta['rtq-paper-rag']);
  const yearRecord = nestedRecord(parsed.meta, 'year');
  const year = meaningfulString(yearRecord?.value ?? parsed.meta.year);
  const schoolIds = stringArray(
    nestedRecord(parsed.meta, 'schools')?.['school-ids'],
  );

  return {
    ...(accessTier ? { accessTier } : {}),
    focusGroups: focusGroups(parsed),
    ...(paperId ? { paperId } : {}),
    ...(paperRag ? { paperRag } : {}),
    schoolIds,
    ...(year ? { year } : {}),
  };
}

export async function readReviewPaper(
  collectionId: PaperCollectionId,
  relativePath: string,
  options: ResolveRtqContentOptions = {},
): Promise<ReviewPaper> {
  const collection = paperCollectionForId(collectionId);
  const sourcePath = resolvePaperSourcePath(
    collection.directory,
    relativePath,
    options,
  );
  const [raw, macros] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readPaperMacros(options),
  ]);
  const parsed = parsePaperToml(raw, collection.id);
  const source = buildPaperSource(collection, relativePath, raw, parsed);
  const stem = paperStem(source.fileName);
  const sections = parsed.sections.map((section, sectionIndex) => ({
    id: `section-${sectionIndex}`,
    label:
      meaningfulString(section.name) ??
      meaningfulString(section.title) ??
      `Section ${sectionIndex + 1}`,
    questions: asRecords(section.questions).map((question, questionIndex) =>
      buildNode(
        question,
        { paperStem: stem, questionIndex, sectionIndex },
        0,
        undefined,
        macros,
      ),
    ),
  }));

  return resolveReviewPaperTags({
    metadata: paperMetadata(parsed),
    sections,
    source,
    title: source.title,
  });
}
