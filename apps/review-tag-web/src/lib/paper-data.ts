import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  type QuestionNumberingConfig,
  formatQuestionIndexLabel,
  formatQuestionPathLabel,
  questionListTypeForDepth,
  resolveQuestionNumberingConfig,
  resolveSectionQuestionStart,
} from '@rtq/review-paper-model/numbering';

import { enrichRtqMarkdown, paperImageAssetState } from './paper-assets.ts';
import { findPaperImageComponents } from './paper-image-components.ts';
import { applyPaperMacros } from './paper-macros.ts';
import {
  buildSlugSegments,
  isExemplarFolderKey,
  relativePaperSlug,
  resolvePaperFilePath,
} from './paper-paths.ts';
import { parsePaperToml, workingCollectionValues } from './paper-toml.ts';
import type {
  DisplayTag,
  FolderKey,
  ImageTagOccurrence,
  OriginalQuestionSource,
  PaperDocument,
  PaperImageFieldLocator,
  PaperImageScope,
  PaperNode,
  PaperSection,
} from './paper-types.ts';
import { sortPersistedTags, tagKindFor } from './tag-taxonomy.ts';
import { humanizeStem } from './utils.ts';

type NodeContext = {
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

type ImageTagOccurrenceDraft = Omit<
  ImageTagOccurrence,
  'hierarchyLabel' | 'id' | 'imageNumber' | 'nodeUuid'
>;

function parseRtqQuestionId(questionId: string | null) {
  if (!questionId) {
    return null;
  }

  const match = /^(.*):(\d+):(\d+)$/i.exec(questionId);

  if (!match) {
    return null;
  }

  const sectionIndex = Number.parseInt(match[2], 10) - 1;
  const questionIndex = Number.parseInt(match[3], 10) - 1;

  if (
    !Number.isInteger(sectionIndex) ||
    !Number.isInteger(questionIndex) ||
    sectionIndex < 0 ||
    questionIndex < 0
  ) {
    return null;
  }

  return {
    paperStem: match[1],
    questionIndex,
    rawValue: questionId,
    sectionIndex,
  };
}

function originalSourceFromQuestionId(
  questionId: string | null,
): OriginalQuestionSource | null {
  if (!questionId) {
    return null;
  }

  const parsed = parseRtqQuestionId(questionId);

  if (!parsed) {
    return {
      paperStem: null,
      questionNumber: null,
      rawValue: questionId,
      sectionNumber: null,
    };
  }

  return {
    paperStem: parsed.paperStem,
    questionNumber: parsed.questionIndex + 1,
    rawValue: parsed.rawValue,
    sectionNumber: parsed.sectionIndex + 1,
  };
}

function assetContextFromQuestionId(
  questionId: string | null,
  fallback: NodeContext,
): NodeContext {
  const parsed = parseRtqQuestionId(questionId);

  if (!parsed) {
    return fallback;
  }

  return {
    ...fallback,
    assetFileStem: parsed.paperStem,
    assetQuestionIndex: parsed.questionIndex,
    assetSectionIndex: parsed.sectionIndex,
  };
}

type DerivedDimensions = {
  family: string | null;
  frame: string | null;
  legacy: string[];
  maths: string[];
  markers: string[];
  reasoning: string | null;
};

function hashContent(raw: string) {
  return crypto.createHash('sha1').update(raw).digest('hex');
}

function normalizeString(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  if (value.trim() === '%empty%') {
    return '';
  }

  return value;
}

function answerMarkdownFromRecord(record: Record<string, unknown>) {
  const answer = normalizeString(record.answer).trim();
  const key = normalizeString(record.key).trim();
  const option = normalizeString(record.option).trim();

  if (key && option && answer) {
    return `Option ${option}: ${key} = ${answer}`;
  }

  if (key && answer) {
    return `${key} = ${answer}`;
  }

  if (option && answer) {
    return `Option ${option} = ${answer}`;
  }

  if (key) {
    return key;
  }

  if (option) {
    return `Option ${option}`;
  }

  return normalizeString(record.answer);
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function nodePath(
  sectionIndex: number,
  questionIndex: number,
  subquestionIndex: number | null = null,
  subsubquestionIndex: number | null = null,
) {
  const parts = [`s${sectionIndex}`, `q${questionIndex}`];

  if (subquestionIndex !== null) {
    parts.push(`sq${subquestionIndex}`);
  }

  if (subsubquestionIndex !== null) {
    parts.push(`ssq${subsubquestionIndex}`);
  }

  return parts.join('.');
}

async function hydrateMarkdown(
  text: string,
  context: NodeContext,
  options?: {
    scopeIndex?: number;
    scopeType?: 'answer' | 'working';
  },
) {
  const withMacros = await applyPaperMacros(normalizeString(text));
  return enrichRtqMarkdown(withMacros, context, options);
}

async function hydrateImageField(
  text: string,
  context: NodeContext,
  field: PaperImageFieldLocator,
) {
  const withMacros = await applyPaperMacros(normalizeString(text));
  const scope: PaperImageScope = field.kind;
  const scopeIndex = field.kind === 'question' ? undefined : field.index;
  const options =
    field.kind === 'question'
      ? undefined
      : { scopeIndex: field.index, scopeType: field.kind };
  const contextMarkdown = enrichRtqMarkdown(withMacros, context, options);
  const components = findPaperImageComponents(withMacros, scope);
  const fieldLabel =
    field.kind === 'question'
      ? 'Question'
      : `${field.kind === 'working' ? 'Working' : 'Answer'} ${field.index + 1}`;
  const imageOccurrences: ImageTagOccurrenceDraft[] = components.map(
    (component, occurrenceIndex) => ({
      assetState: paperImageAssetState(
        context,
        scope,
        scopeIndex,
        occurrenceIndex,
      ),
      attributes: component.attributes,
      contextMarkdown,
      field,
      fieldLabel,
      occurrenceIndex,
      previewMarkdown: enrichRtqMarkdown(component.source, context, {
        imageIndexOffset: occurrenceIndex,
        ...(options ?? {}),
      }),
      scope,
    }),
  );

  return { imageOccurrences, markdown: contextMarkdown };
}

function identifyImageOccurrences(
  occurrences: ImageTagOccurrenceDraft[],
  input: { hierarchyLabel: string; nodePath: string; nodeUuid: string | null },
): ImageTagOccurrence[] {
  return occurrences.map(occurrence => ({
    ...occurrence,
    hierarchyLabel: input.hierarchyLabel,
    id: `${input.nodeUuid ?? `missing-${input.nodePath}`}:${occurrence.scope}:${
      occurrence.field.kind === 'question' ? 'question' : occurrence.field.index
    }:${occurrence.occurrenceIndex}`,
    imageNumber: occurrence.occurrenceIndex + 1,
    nodeUuid: input.nodeUuid,
  }));
}

async function buildNodeContent(
  rawNode: Record<string, unknown>,
  context: NodeContext,
) {
  const question = await hydrateImageField(
    normalizeString(rawNode.question),
    context,
    { kind: 'question' },
  );
  const workings = Array.isArray(rawNode.workings)
    ? await Promise.all(
        rawNode.workings.map(async (entry, index) => {
          if (!entry || typeof entry !== 'object') {
            return {
              formulas: [],
              imageOccurrences: [],
              tips: [],
              working: '',
            };
          }

          const record = entry as Record<string, unknown>;

          const working = await hydrateImageField(
            normalizeString(record.working),
            context,
            { index, kind: 'working' },
          );

          return {
            formulas: await Promise.all(
              workingCollectionValues(record, 'formulas', 'formula').map(
                value => hydrateMarkdown(value, context),
              ),
            ),
            tips: await Promise.all(
              workingCollectionValues(record, 'tips', 'tip').map(value =>
                hydrateMarkdown(value, context),
              ),
            ),
            imageOccurrences: working.imageOccurrences,
            working: working.markdown,
          };
        }),
      )
    : [];
  const answers = Array.isArray(rawNode.answers)
    ? await Promise.all(
        rawNode.answers.map(async (entry, index) => {
          if (!entry || typeof entry !== 'object') {
            return { imageOccurrences: [], markdown: '' };
          }

          const record = entry as Record<string, unknown>;
          return hydrateImageField(answerMarkdownFromRecord(record), context, {
            index,
            kind: 'answer',
          });
        }),
      )
    : [];

  return {
    content: {
      answers: answers.map(answer => answer.markdown).filter(Boolean),
      formulas: workings.flatMap(entry => entry.formulas),
      question: question.markdown,
      tips: workings.flatMap(entry => entry.tips),
      workings: workings.map(entry => entry.working).filter(Boolean),
    },
    imageOccurrences: [
      ...question.imageOccurrences,
      ...workings.flatMap(entry => entry.imageOccurrences),
      ...answers.flatMap(answer => answer.imageOccurrences),
    ],
  };
}

async function buildSubsubquestionNodes(
  rawChildren: unknown,
  baseContext: NodeContext,
  numbering: QuestionNumberingConfig,
  parentLabels: readonly string[],
): Promise<PaperNode[]> {
  if (!Array.isArray(rawChildren)) {
    return [];
  }

  const children: PaperNode[] = [];

  for (const [index, rawChild] of rawChildren.entries()) {
    if (!rawChild || typeof rawChild !== 'object') {
      continue;
    }

    const context: NodeContext = {
      ...baseContext,
      subsubquestionIndex: index,
    };
    const record = rawChild as Record<string, unknown>;
    const questionId =
      typeof record['rtq-question-id'] === 'string'
        ? record['rtq-question-id']
        : null;
    const assetContext = assetContextFromQuestionId(questionId, context);
    const explicitTags = sortPersistedTags(asStringArray(record['rtq-tags']));
    const explicitInherit =
      typeof record['rtq-inherit-tags'] === 'boolean'
        ? (record['rtq-inherit-tags'] as boolean)
        : true;
    const shortLabel = formatQuestionIndexLabel(
      index + 1,
      questionListTypeForDepth(numbering, 2),
    );
    const hierarchyLabel = formatQuestionPathLabel([
      ...parentLabels,
      shortLabel,
    ]);
    const path = nodePath(
      context.sectionIndex,
      context.questionIndex,
      context.subquestionIndex,
      index,
    );
    const uuid =
      typeof record['rtq-uuid'] === 'string' ? record['rtq-uuid'] : null;
    const presentation = await buildNodeContent(record, assetContext);

    children.push({
      children: [],
      content: presentation.content,
      depth: 2,
      effectiveDisplayTags: [],
      effectiveTags: [],
      explicitDisplayTags: [],
      explicitInherit,
      explicitTags,
      hierarchyLabel,
      inheritedDisplayTags: [],
      inheritedTags: [],
      imageOccurrences: identifyImageOccurrences(
        presentation.imageOccurrences,
        { hierarchyLabel, nodePath: path, nodeUuid: uuid },
      ),
      isRootNode: false,
      kind: 'subsubquestion',
      path,
      originalSource: originalSourceFromQuestionId(questionId),
      questionId,
      sectionIndex: context.sectionIndex,
      shortLabel,
      subquestionIndex: context.subquestionIndex,
      subsubquestionIndex: index,
      uuid,
    });
  }

  return children;
}

async function buildSubquestionNodes(
  rawChildren: unknown,
  baseContext: NodeContext,
  numbering: QuestionNumberingConfig,
  parentLabels: readonly string[],
) {
  if (!Array.isArray(rawChildren)) {
    return [];
  }

  const children: PaperNode[] = [];

  for (const [index, rawChild] of rawChildren.entries()) {
    if (!rawChild || typeof rawChild !== 'object') {
      continue;
    }

    const context: NodeContext = {
      ...baseContext,
      subquestionIndex: index,
    };
    const record = rawChild as Record<string, unknown>;
    const questionId =
      typeof record['rtq-question-id'] === 'string'
        ? record['rtq-question-id']
        : null;
    const assetContext = assetContextFromQuestionId(questionId, context);
    const explicitTags = sortPersistedTags(asStringArray(record['rtq-tags']));
    const explicitInherit =
      typeof record['rtq-inherit-tags'] === 'boolean'
        ? (record['rtq-inherit-tags'] as boolean)
        : true;
    const shortLabel = formatQuestionIndexLabel(
      index + 1,
      questionListTypeForDepth(numbering, 1),
    );
    const pathLabels = [...parentLabels, shortLabel];
    const descendantNumbering = resolveQuestionNumberingConfig(
      record,
      numbering,
    );
    const hierarchyLabel = formatQuestionPathLabel(pathLabels);
    const path = nodePath(context.sectionIndex, context.questionIndex, index);
    const uuid =
      typeof record['rtq-uuid'] === 'string' ? record['rtq-uuid'] : null;
    const presentation = await buildNodeContent(record, assetContext);

    children.push({
      children: await buildSubsubquestionNodes(
        record.subquestions,
        assetContext,
        descendantNumbering,
        pathLabels,
      ),
      content: presentation.content,
      depth: 1,
      effectiveDisplayTags: [],
      effectiveTags: [],
      explicitDisplayTags: [],
      explicitInherit,
      explicitTags,
      hierarchyLabel,
      inheritedDisplayTags: [],
      inheritedTags: [],
      imageOccurrences: identifyImageOccurrences(
        presentation.imageOccurrences,
        { hierarchyLabel, nodePath: path, nodeUuid: uuid },
      ),
      isRootNode: false,
      kind: 'subquestion',
      path,
      originalSource: originalSourceFromQuestionId(questionId),
      questionId,
      sectionIndex: context.sectionIndex,
      shortLabel,
      subquestionIndex: index,
      subsubquestionIndex: null,
      uuid,
    });
  }

  return children;
}

async function buildQuestionNodes(
  sectionIndex: number,
  rawQuestions: unknown,
  fileStem: string,
  numbering: QuestionNumberingConfig,
  questionStart: number,
) {
  if (!Array.isArray(rawQuestions)) {
    return [];
  }

  const questions: PaperNode[] = [];

  for (const [index, rawQuestion] of rawQuestions.entries()) {
    if (!rawQuestion || typeof rawQuestion !== 'object') {
      continue;
    }

    const record = rawQuestion as Record<string, unknown>;
    const context: NodeContext = {
      fileStem,
      questionIndex: index,
      sectionIndex,
      subquestionIndex: null,
      subsubquestionIndex: null,
    };
    const questionId =
      typeof record['rtq-question-id'] === 'string'
        ? record['rtq-question-id']
        : null;
    const assetContext = assetContextFromQuestionId(questionId, context);
    const shortLabel = formatQuestionIndexLabel(
      questionStart + index,
      questionListTypeForDepth(numbering, 0),
    );
    const pathLabels = [shortLabel];
    const descendantNumbering = resolveQuestionNumberingConfig(
      record,
      numbering,
    );
    const hierarchyLabel = shortLabel;
    const path = nodePath(sectionIndex, index);
    const uuid =
      typeof record['rtq-uuid'] === 'string' ? record['rtq-uuid'] : null;
    const presentation = await buildNodeContent(record, assetContext);

    questions.push({
      children: await buildSubquestionNodes(
        record.subquestions,
        assetContext,
        descendantNumbering,
        pathLabels,
      ),
      content: presentation.content,
      depth: 0,
      effectiveDisplayTags: [],
      effectiveTags: [],
      explicitDisplayTags: [],
      explicitInherit: null,
      explicitTags: sortPersistedTags(asStringArray(record['rtq-tags'])),
      hierarchyLabel,
      inheritedDisplayTags: [],
      inheritedTags: [],
      imageOccurrences: identifyImageOccurrences(
        presentation.imageOccurrences,
        { hierarchyLabel, nodePath: path, nodeUuid: uuid },
      ),
      isRootNode: true,
      kind: 'question',
      path,
      originalSource: originalSourceFromQuestionId(questionId),
      questionId,
      sectionIndex,
      shortLabel,
      subquestionIndex: null,
      subsubquestionIndex: null,
      uuid,
    });
  }

  return questions;
}

function dimensionsFromTags(tags: string[]) {
  const dimensions: DerivedDimensions = {
    family: null,
    frame: null,
    legacy: [],
    maths: [],
    markers: [],
    reasoning: null,
  };

  for (const tag of sortPersistedTags(tags)) {
    switch (tagKindFor(tag)) {
      case 'family':
        dimensions.family = tag;
        break;
      case 'frame':
        dimensions.frame = tag;
        break;
      case 'legacy':
        dimensions.legacy.push(tag);
        break;
      case 'marker':
        dimensions.markers.push(tag);
        break;
      case 'math':
        dimensions.maths.push(tag);
        break;
      case 'reasoning':
        dimensions.reasoning = tag;
        break;
    }
  }

  return dimensions;
}

function explicitDisplayTags(tags: string[]): DisplayTag[] {
  return sortPersistedTags(tags).map(tag => ({
    active: true,
    dimensionLabel: tagKindFor(tag),
    implicitLabel: null,
    kind: tagKindFor(tag),
    source: 'explicit',
    value: tag,
  }));
}

function mergeLegacy(parentLegacy: string[], explicitLegacy: string[]) {
  return sortPersistedTags([...parentLegacy, ...explicitLegacy]).filter(
    tag => tagKindFor(tag) === 'legacy',
  );
}

function deriveNodeState(
  node: PaperNode,
  parentDimensions: DerivedDimensions | null,
): PaperNode {
  const explicitDimensions = dimensionsFromTags(node.explicitTags);
  const inheritEnabled = node.explicitInherit ?? false;
  const inheritedDimensions = parentDimensions ?? {
    family: null,
    frame: null,
    legacy: [],
    maths: [],
    markers: [],
    reasoning: null,
  };

  const nextDimensions: DerivedDimensions = node.isRootNode
    ? explicitDimensions
    : !inheritEnabled
      ? explicitDimensions
      : {
          family: explicitDimensions.family ?? inheritedDimensions.family,
          frame: explicitDimensions.frame ?? inheritedDimensions.frame,
          legacy: mergeLegacy(
            inheritedDimensions.legacy,
            explicitDimensions.legacy,
          ),
          maths: explicitDimensions.maths.length
            ? explicitDimensions.maths
            : inheritedDimensions.maths,
          markers: explicitDimensions.markers.length
            ? explicitDimensions.markers
            : inheritedDimensions.markers,
          reasoning:
            explicitDimensions.reasoning ?? inheritedDimensions.reasoning,
        };

  const inheritedReferenceTags = parentDimensions
    ? sortPersistedTags([
        ...parentDimensions.legacy,
        ...(parentDimensions.family ? [parentDimensions.family] : []),
        ...parentDimensions.maths,
        ...(parentDimensions.frame ? [parentDimensions.frame] : []),
        ...parentDimensions.markers,
        ...(parentDimensions.reasoning ? [parentDimensions.reasoning] : []),
      ])
    : [];

  const inheritedDisplayTags: DisplayTag[] = inheritedReferenceTags.map(
    tag => ({
      active: inheritEnabled,
      dimensionLabel: tagKindFor(tag),
      implicitLabel: null,
      kind: tagKindFor(tag),
      source: 'inherited' as const,
      value: tag,
    }),
  );

  const effectiveTags = sortPersistedTags([
    ...nextDimensions.legacy,
    ...(nextDimensions.family ? [nextDimensions.family] : []),
    ...nextDimensions.maths,
    ...(nextDimensions.frame ? [nextDimensions.frame] : []),
    ...nextDimensions.markers,
    ...(nextDimensions.reasoning ? [nextDimensions.reasoning] : []),
  ]);

  const sourceMap = new Map<string, 'explicit' | 'inherited'>();

  for (const tag of node.explicitTags) {
    sourceMap.set(tag, 'explicit');
  }

  if (inheritEnabled) {
    for (const tag of inheritedReferenceTags) {
      if (!sourceMap.has(tag)) {
        sourceMap.set(tag, 'inherited');
      }
    }
  }

  const effectiveDisplay: DisplayTag[] = effectiveTags.map(tag => ({
    active: true,
    dimensionLabel: tagKindFor(tag),
    implicitLabel: null,
    kind: tagKindFor(tag),
    source: sourceMap.get(tag) ?? 'explicit',
    value: tag,
  }));

  if (!nextDimensions.family) {
    effectiveDisplay.unshift({
      active: true,
      dimensionLabel: 'family',
      implicitLabel: 'implicit unknown',
      kind: 'family',
      source: 'implicit',
      value: 'family.unknown',
    });
  }

  if (!nextDimensions.maths.length) {
    effectiveDisplay.splice(
      effectiveDisplay.filter(
        tag => tag.kind === 'family' || tag.kind === 'legacy',
      ).length,
      0,
      {
        active: true,
        dimensionLabel: 'math',
        implicitLabel: 'implicit unknown',
        kind: 'math',
        source: 'implicit',
        value: 'math.unknown',
      },
    );
  }

  if (!nextDimensions.frame) {
    const insertIndex = effectiveDisplay.filter(
      tag =>
        tag.kind === 'family' || tag.kind === 'math' || tag.kind === 'legacy',
    ).length;
    effectiveDisplay.splice(insertIndex, 0, {
      active: true,
      dimensionLabel: 'frame',
      implicitLabel: 'implicit raw',
      kind: 'frame',
      source: 'implicit',
      value: 'frame.raw',
    });
  }

  if (!nextDimensions.reasoning) {
    const insertIndex = effectiveDisplay.filter(
      tag =>
        tag.kind === 'family' ||
        tag.kind === 'math' ||
        tag.kind === 'frame' ||
        tag.kind === 'marker' ||
        tag.kind === 'legacy',
    ).length;
    effectiveDisplay.splice(insertIndex, 0, {
      active: true,
      dimensionLabel: 'reasoning',
      implicitLabel: 'implicit direct',
      kind: 'reasoning',
      source: 'implicit',
      value: 'reasoning.direct',
    });
  }

  const nextNode: PaperNode = {
    ...node,
    children: node.children.map(child =>
      deriveNodeState(child, nextDimensions),
    ),
    effectiveDisplayTags: effectiveDisplay,
    effectiveTags,
    explicitDisplayTags: explicitDisplayTags(node.explicitTags),
    inheritedDisplayTags,
    inheritedTags: inheritedReferenceTags,
  };

  return nextNode;
}

function flattenNodes(nodes: PaperNode[]): PaperNode[] {
  return nodes.flatMap(node => [node, ...flattenNodes(node.children)]);
}

export function recomputeDerivedDocument(
  document: PaperDocument,
): PaperDocument {
  const sections = document.sections.map(section => ({
    ...section,
    questions: section.questions.map(question =>
      deriveNodeState(question, null),
    ),
  }));

  const nodesFlat = flattenNodes(
    sections.flatMap(section => section.questions),
  );

  return {
    ...document,
    imageOccurrences: nodesFlat.flatMap(node => node.imageOccurrences),
    nodesFlat,
    sections,
  };
}

export function updateNodeInDocument(
  document: PaperDocument,
  nodePathValue: string,
  nextValues: { explicitInherit: boolean | null; explicitTags: string[] },
) {
  const clone = structuredClone(document) as PaperDocument;

  function visit(nodes: PaperNode[]): boolean {
    for (const node of nodes) {
      if (node.path === nodePathValue) {
        node.explicitInherit = nextValues.explicitInherit;
        node.explicitTags = sortPersistedTags(nextValues.explicitTags);
        return true;
      }

      if (visit(node.children)) {
        return true;
      }
    }

    return false;
  }

  for (const section of clone.sections) {
    visit(section.questions);
  }

  return recomputeDerivedDocument(clone);
}

export async function readPaperDocument(
  folderKey: FolderKey,
  relativePath: string,
): Promise<PaperDocument> {
  const absolutePath = resolvePaperFilePath(folderKey, relativePath);
  const raw = await fs.readFile(absolutePath, 'utf8');
  const parsed = parsePaperToml(raw, isExemplarFolderKey(folderKey));
  const fileName = path.basename(relativePath);
  const fileStem = relativePaperSlug(fileName);
  const sections: PaperSection[] = [];
  const paperNumbering = resolveQuestionNumberingConfig(parsed.meta ?? {});

  for (const [sectionIndex, rawSection] of (parsed.sections ?? []).entries()) {
    const section = rawSection as Record<string, unknown>;
    const numbering = resolveQuestionNumberingConfig(section, paperNumbering);

    sections.push({
      index: sectionIndex,
      name: normalizeString(section.name) || `Section ${sectionIndex + 1}`,
      path: `section-${sectionIndex}`,
      questions: await buildQuestionNodes(
        sectionIndex,
        section.questions,
        fileStem,
        numbering,
        resolveSectionQuestionStart(section),
      ),
    });
  }

  const document: PaperDocument = {
    fileName,
    folderKey,
    imageOccurrences: [],
    meta: {
      accessTier:
        typeof parsed.meta?.['access-tier'] === 'string'
          ? (parsed.meta['access-tier'] as string)
          : null,
      paperId:
        typeof parsed.meta?.['rtq-paper-id'] === 'string'
          ? (parsed.meta['rtq-paper-id'] as string)
          : null,
      schoolId:
        typeof parsed.meta?.['school-id'] === 'string'
          ? (parsed.meta['school-id'] as string)
          : null,
      year:
        typeof parsed.meta?.year === 'string'
          ? (parsed.meta.year as string)
          : null,
    },
    nodesFlat: [],
    questionCount: sections.reduce(
      (sum, section) => sum + section.questions.length,
      0,
    ),
    relativePath,
    sections,
    slugSegments: buildSlugSegments(relativePath),
    title: humanizeStem(fileStem),
    versionHash: hashContent(raw),
  };

  return recomputeDerivedDocument(document);
}

export async function readPaperDocumentVersionHash(
  folderKey: FolderKey,
  relativePath: string,
) {
  const absolutePath = resolvePaperFilePath(folderKey, relativePath);
  const raw = await fs.readFile(absolutePath, 'utf8');

  return hashContent(raw);
}
