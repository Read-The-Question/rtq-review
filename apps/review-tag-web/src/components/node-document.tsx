'use client';

import {
  PaperOutline,
  type PaperOutlineBadge,
  type PaperOutlineNode,
  type PaperOutlineSection,
} from '@rtq/review-paper-browser/paper-outline';
import { FileText } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { updateNodeAction } from '@/app/actions';
import { ImageTagMarkdown } from '@/components/image-tag-occurrence-editor';
import { RtqMarkdown } from '@/components/rtq-markdown';
import { TagGroup, TagPicker } from '@/components/tag-review-controls';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { PaperImageMode } from '@/lib/paper-image-mode';
import type {
  FolderKey,
  ImageTagCatalog,
  PaperDocument,
  PaperImageFieldLocator,
  PaperNode,
  TagCatalog,
} from '@/lib/paper-types';
import { cn, formatOriginalQuestionSource } from '@/lib/utils';

type NodeDocumentProps = {
  document: PaperDocument;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  paperImageMode: PaperImageMode;
  readOnly: boolean;
  tagCatalog: TagCatalog;
};

type ImageNodeDocumentProps = Omit<NodeDocumentProps, 'tagCatalog'> & {
  catalog: ImageTagCatalog;
};

type DocumentReview =
  | { kind: 'image'; catalog: ImageTagCatalog }
  | { kind: 'question'; tagCatalog: TagCatalog };

const DETAIL_VISIBILITY_STORAGE_PREFIX = 'rtq-tag-web:detail-visibility';
const STALE_FILE_MESSAGE =
  'The file changed outside the editor. Reload to continue.';

function detailVisibilityStorageKey(document: PaperDocument) {
  return `${DETAIL_VISIBILITY_STORAGE_PREFIX}:${document.folderKey}:${document.relativePath}`;
}

function parseStoredDetailVisibility(value: string | null) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, boolean] =>
          typeof entry[0] === 'string' && typeof entry[1] === 'boolean',
      ),
    );
  } catch {
    return {};
  }
}

function nodeAnchorId(path: string) {
  return `node-${path.replaceAll('.', '-')}`;
}

function scrollToNode(path: string | null, container?: HTMLElement | null) {
  if (!path) {
    return;
  }

  const element = window.document.getElementById(nodeAnchorId(path));

  if (!element) {
    return;
  }

  if (!container) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const nextTop =
    container.scrollTop + (elementRect.top - containerRect.top) - 20;

  container.scrollTo({ behavior: 'smooth', top: nextTop });
}

function sectionAnchorId(path: string) {
  return `section-${path.replaceAll('.', '-')}`;
}

function nodeIdentifier(node: PaperNode) {
  if (node.uuid) {
    return { label: 'UUID', value: node.uuid };
  }

  if (node.questionId && !node.originalSource) {
    return { label: 'ID', value: node.questionId };
  }

  return null;
}

function mutationDocumentForNode(
  document: PaperDocument,
  node: PaperNode,
): PaperDocument {
  if (!node.source) {
    return document;
  }

  return {
    ...document,
    fileName: node.source.fileName,
    folderKey: node.source.folderKey,
    relativePath: node.source.relativePath,
    title: node.source.paperTitle,
    versionHash: node.source.versionHash,
  };
}

function dimensionalGroups(tags: string[]) {
  return {
    family: tags.find(tag => tag.startsWith('family.')) ?? null,
    frame: tags.find(tag => tag.startsWith('frame.')) ?? null,
    legacy: tags.filter(tag => !tag.includes('.')),
    markers: tags.filter(tag => tag.startsWith('marker.')),
    maths: tags.filter(tag => tag.startsWith('math.')),
    reasoning: tags.find(tag => tag.startsWith('reasoning.')) ?? null,
  };
}

function NodeContentBlock({
  className,
  document,
  imageFields,
  label,
  node,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
  review,
  values,
}: {
  className?: string;
  document: PaperDocument;
  imageFields?: PaperImageFieldLocator[];
  label: string;
  node: PaperNode;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: NodeDocumentProps['onSaveStateChange'];
  readOnly: boolean;
  review: DocumentReview;
  values: string[];
}) {
  if (!values.length) {
    return null;
  }

  return (
    <section className={cn('node-content-block', className)}>
      <header className="node-content-block__header">{label}</header>
      <div className="node-content-block__body">
        {values.map((value, index) => {
          const imageField = imageFields?.[index];
          const occurrences = imageField
            ? node.imageOccurrences.filter(occurrence =>
                imageField.kind === 'question'
                  ? occurrence.field.kind === 'question'
                  : occurrence.field.kind === imageField.kind &&
                    occurrence.field.index === imageField.index,
              )
            : [];

          return (
            <div
              className="node-content-block__entry"
              key={`${label}-${index}`}>
              {review.kind === 'image' ? (
                <ImageTagMarkdown
                  catalog={review.catalog}
                  document={document}
                  markdown={value}
                  occurrences={occurrences}
                  onDocumentChange={onDocumentChange}
                  onDocumentRefresh={onDocumentRefresh}
                  onSaveStateChange={onSaveStateChange}
                  readOnly={readOnly}
                />
              ) : (
                <RtqMarkdown markdown={value} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkingAnswersSection({
  answerIndexes = [],
  answers,
  document,
  isExpanded,
  node,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  onToggle,
  readOnly,
  review,
  workingIndexes = [],
  workings,
}: {
  answerIndexes: number[];
  answers: string[];
  document: PaperDocument;
  isExpanded: boolean;
  node: PaperNode;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: NodeDocumentProps['onSaveStateChange'];
  onToggle: () => void;
  readOnly: boolean;
  review: DocumentReview;
  workingIndexes: number[];
  workings: string[];
}) {
  if (!workings.length && !answers.length) {
    return null;
  }

  return (
    <section className="working-answers-block">
      <div className="working-answers-block__header">
        <div>
          <h4 className="working-answers-block__title">Working and answers</h4>
        </div>
        <Button onClick={onToggle} size="sm" type="button" variant="outline">
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {isExpanded ? (
        <div className="working-answers-block__body">
          {workings.map((working, index) => (
            <NodeContentBlock
              document={document}
              imageFields={[
                { index: workingIndexes[index] ?? index, kind: 'working' },
              ]}
              key={`working-${index}`}
              label={workings.length > 1 ? `Working ${index + 1}` : 'Working'}
              node={node}
              onDocumentChange={onDocumentChange}
              onDocumentRefresh={onDocumentRefresh}
              onSaveStateChange={onSaveStateChange}
              readOnly={readOnly}
              review={review}
              values={[working]}
            />
          ))}
          <NodeContentBlock
            document={document}
            imageFields={answers.map((_, index) => ({
              index: answerIndexes[index] ?? index,
              kind: 'answer',
            }))}
            label="Answers"
            node={node}
            onDocumentChange={onDocumentChange}
            onDocumentRefresh={onDocumentRefresh}
            onSaveStateChange={onSaveStateChange}
            readOnly={readOnly}
            review={review}
            values={answers}
          />
        </div>
      ) : null}
    </section>
  );
}

function InlineNodeEditor({
  document,
  node,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
  tagCatalog,
}: {
  document: PaperDocument;
  node: PaperNode;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  readOnly: boolean;
  tagCatalog: TagCatalog;
}) {
  const [isPending, startTransition] = useTransition();
  const explicit = useMemo(
    () => dimensionalGroups(node.explicitTags),
    [node.explicitTags],
  );

  const mutate = (nextTags: string[], nextInherit: boolean | null) => {
    if (readOnly) {
      return;
    }

    onSaveStateChange({ message: 'Saving…', tone: 'saving' });

    startTransition(async () => {
      try {
        const nextDocument = await updateNodeAction({
          explicitInherit: nextInherit,
          explicitTags: nextTags,
          folderKey: document.folderKey as FolderKey,
          nodePath: node.source?.nodePath ?? node.path,
          relativePath: document.relativePath,
          versionHash: document.versionHash,
        });
        onDocumentChange(nextDocument);
        onSaveStateChange({ message: 'Saved', tone: 'success' });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to save this change.';

        if (message === STALE_FILE_MESSAGE) {
          try {
            await onDocumentRefresh(document);
            onSaveStateChange({
              message:
                'File changed outside editor. Updated from disk; try again.',
              tone: 'error',
            });
            return;
          } catch {
            // Fall through to the original stale-file error if refresh fails.
          }
        }

        onSaveStateChange({
          message,
          tone: 'error',
        });
      }
    });
  };

  const replaceSingle = (
    kind: 'family' | 'frame' | 'reasoning',
    value: string,
  ) => {
    const next = node.explicitTags.filter(tag => !tag.startsWith(`${kind}.`));
    mutate([...next, value], node.explicitInherit);
  };

  const removeExplicitTag = (value: string) => {
    mutate(
      node.explicitTags.filter(tag => tag !== value),
      node.explicitInherit,
    );
  };

  const toggleMarker = (value: string) => {
    const next = node.explicitTags.includes(value)
      ? node.explicitTags.filter(tag => tag !== value)
      : [...node.explicitTags, value];
    mutate(next, node.explicitInherit);
  };

  const toggleMath = (value: string) => {
    const next = node.explicitTags.includes(value)
      ? node.explicitTags.filter(tag => tag !== value)
      : [...node.explicitTags, value];
    mutate(next, node.explicitInherit);
  };

  return (
    <section className="inline-editor">
      {!node.isRootNode ? (
        <div className="inline-editor__top">
          <div className="inline-editor__toggle">
            <span>Use parent tags</span>
            {readOnly ? (
              <span className="inline-editor__readonly-value">
                {node.explicitInherit ? 'On' : 'Off'}
              </span>
            ) : (
              <Switch
                checked={node.explicitInherit ?? false}
                disabled={isPending}
                onCheckedChange={checked => mutate(node.explicitTags, checked)}
              />
            )}
          </div>
        </div>
      ) : null}

      <div className="inline-editor__groups">
        {!node.isRootNode ? (
          <div className="inline-editor__section">
            <div className="inline-editor__section-title">
              Inherited from parent
            </div>
            <TagGroup tags={node.inheritedDisplayTags} />
          </div>
        ) : null}

        <div className="inline-editor__section">
          <div className="inline-editor__section-title">
            {readOnly ? 'Explicit tags' : 'Your tags'}
          </div>
          <div className="tag-editor-matrix">
            <div className="tag-editor-matrix__row tag-editor-matrix__row--labels">
              <div className="tag-editor-matrix__label">Family</div>
              <div className="tag-editor-matrix__label">Math</div>
              <div className="tag-editor-matrix__label">Frame</div>
              <div className="tag-editor-matrix__label">Markers</div>
              <div className="tag-editor-matrix__label">Reasoning</div>
            </div>

            <div className="tag-editor-matrix__row tag-editor-matrix__row--values">
              <div className="tag-editor-matrix__cell tag-editor-matrix__cell--values">
                <TagGroup
                  onRemove={readOnly ? undefined : removeExplicitTag}
                  tags={node.explicitDisplayTags.filter(
                    tag => tag.kind === 'family',
                  )}
                />
              </div>
              <div className="tag-editor-matrix__cell tag-editor-matrix__cell--values">
                <TagGroup
                  onRemove={readOnly ? undefined : removeExplicitTag}
                  tags={node.explicitDisplayTags.filter(
                    tag => tag.kind === 'math',
                  )}
                />
              </div>
              <div className="tag-editor-matrix__cell tag-editor-matrix__cell--values">
                <TagGroup
                  onRemove={readOnly ? undefined : removeExplicitTag}
                  tags={node.explicitDisplayTags.filter(
                    tag => tag.kind === 'frame',
                  )}
                />
              </div>
              <div className="tag-editor-matrix__cell tag-editor-matrix__cell--values">
                <TagGroup
                  onRemove={readOnly ? undefined : removeExplicitTag}
                  tags={node.explicitDisplayTags.filter(
                    tag => tag.kind === 'marker',
                  )}
                />
              </div>
              <div className="tag-editor-matrix__cell tag-editor-matrix__cell--values">
                <TagGroup
                  onRemove={readOnly ? undefined : removeExplicitTag}
                  tags={node.explicitDisplayTags.filter(
                    tag => tag.kind === 'reasoning',
                  )}
                />
              </div>
            </div>

            {!readOnly ? (
              <div className="tag-editor-matrix__row tag-editor-matrix__row--pickers">
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <TagPicker
                    label="Choose family"
                    mode="single"
                    onSelect={value => replaceSingle('family', value)}
                    options={tagCatalog.family}
                    selected={explicit.family ? [explicit.family] : []}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <TagPicker
                    label="Choose math"
                    mode="multiple"
                    onSelect={toggleMath}
                    options={tagCatalog.math}
                    selected={explicit.maths}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <TagPicker
                    label="Choose frame"
                    mode="single"
                    onSelect={value => replaceSingle('frame', value)}
                    options={tagCatalog.frame}
                    selected={explicit.frame ? [explicit.frame] : []}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <TagPicker
                    label="Choose marker"
                    mode="multiple"
                    onSelect={toggleMarker}
                    options={tagCatalog.marker}
                    selected={explicit.markers}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <TagPicker
                    label="Choose reasoning"
                    mode="single"
                    onSelect={value => replaceSingle('reasoning', value)}
                    options={tagCatalog.reasoning}
                    selected={explicit.reasoning ? [explicit.reasoning] : []}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="inline-editor__legacy-row">
            <div className="inspector-field__title">
              <label>Legacy tags</label>
            </div>
            <div className="inspector-field__chip-slot inspector-field__chip-slot--legacy">
              <TagGroup
                onRemove={readOnly ? undefined : removeExplicitTag}
                tags={node.explicitDisplayTags.filter(
                  tag => tag.kind === 'legacy',
                )}
              />
            </div>
          </div>
        </div>

        <div className="inline-editor__section">
          <div className="inline-editor__section-title">Final tags</div>
          <TagGroup tags={node.effectiveDisplayTags} />
        </div>
      </div>

      {isPending ? (
        <div className="inline-editor__status">Updating…</div>
      ) : null}
    </section>
  );
}

function NodeJumpLinks({
  getScrollContainer,
  firstChildPath,
  nextQuestionPath,
  nextSiblingPath,
  parentPath,
  previousQuestionPath,
  previousSiblingPath,
}: {
  getScrollContainer: () => HTMLElement | null;
  firstChildPath: string | null;
  nextQuestionPath: string | null;
  nextSiblingPath: string | null;
  parentPath: string | null;
  previousQuestionPath: string | null;
  previousSiblingPath: string | null;
}) {
  const actions = [
    { label: 'Prev sibling', path: previousSiblingPath },
    { label: 'Next sibling', path: nextSiblingPath },
    { label: 'Parent', path: parentPath },
    { label: 'First child', path: firstChildPath },
    { label: 'Prev question', path: previousQuestionPath },
    { label: 'Next question', path: nextQuestionPath },
  ].filter(item => item.path);

  if (!actions.length) {
    return null;
  }

  return (
    <div className="node-jump-links">
      {actions.map(action => (
        <Button
          className="text-sm"
          key={`${action.label}-${action.path}`}
          onClick={() =>
            scrollToNode(action.path ?? null, getScrollContainer())
          }
          size="sm"
          type="button"
          variant="outline">
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function tagOutlineNode(
  node: PaperNode,
  reviewKind: DocumentReview['kind'],
): PaperOutlineNode {
  const children = node.children.map(child =>
    tagOutlineNode(child, reviewKind),
  );
  const badges: PaperOutlineBadge[] = [];

  if (reviewKind === 'image' && node.imageOccurrences.length) {
    const missingCount = node.imageOccurrences.filter(
      occurrence => occurrence.assetState === 'missing',
    ).length;
    const imageCount = node.imageOccurrences.length;
    badges.push({
      label: `${imageCount} ${imageCount === 1 ? 'image' : 'images'}${
        missingCount ? `, ${missingCount} missing` : ''
      }`,
      text: String(imageCount),
      tone: missingCount ? 'warning' : 'accent',
    });
  }

  if (
    reviewKind === 'question' &&
    !node.isRootNode &&
    node.explicitInherit === false
  ) {
    badges.push({
      label: 'Parent tag inheritance off',
      text: 'Off',
      tone: 'warning',
    });
  }

  const hasDirectMatch = badges.length > 0;
  const hasDescendantMatch = children.some(
    child => child.state === 'match' || child.state === 'context',
  );

  return {
    badges: badges.length ? badges : undefined,
    children,
    href: `#${nodeAnchorId(node.path)}`,
    id: node.path,
    label: node.hierarchyLabel,
    state: hasDirectMatch
      ? 'match'
      : hasDescendantMatch
        ? 'context'
        : 'neutral',
  };
}

function tagOutlineSections(
  document: PaperDocument,
  reviewKind: DocumentReview['kind'],
): PaperOutlineSection[] {
  return document.sections.map(section => ({
    href: `#${sectionAnchorId(section.path)}`,
    id: section.path,
    label: section.name,
    nodes: section.questions.map(node => tagOutlineNode(node, reviewKind)),
  }));
}

function NodeCard({
  detailVisibility,
  document,
  firstChildPath,
  getScrollContainer,
  nextQuestionPath,
  nextSiblingPath,
  node,
  onDetailVisibilityChange,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  parentPath,
  previousQuestionPath,
  previousSiblingPath,
  readOnly,
  review,
}: {
  detailVisibility: Record<string, boolean>;
  document: PaperDocument;
  firstChildPath: string | null;
  getScrollContainer: () => HTMLElement | null;
  nextQuestionPath: string | null;
  nextSiblingPath: string | null;
  node: PaperNode;
  onDetailVisibilityChange: (nodePath: string, isExpanded: boolean) => void;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  parentPath: string | null;
  previousQuestionPath: string | null;
  previousSiblingPath: string | null;
  readOnly: boolean;
  review: DocumentReview;
}) {
  const isDetailExpanded = detailVisibility[node.path] ?? true;
  const identifier = nodeIdentifier(node);
  const mutationDocument = mutationDocumentForNode(document, node);
  const refreshMutationDocument = () => onDocumentRefresh(mutationDocument);

  return (
    <article
      className={cn('node-card', `node-card--depth-${node.depth}`)}
      data-node-path={node.path}
      id={nodeAnchorId(node.path)}>
      <div className="node-card__header">
        <div className="node-card__headline">
          <span className="node-card__label">{node.hierarchyLabel}</span>
          <span className="node-card__meta">
            <span>{node.kind}</span>
            {identifier ? (
              <span className="node-card__identifier">
                {identifier.label}: {identifier.value}
              </span>
            ) : null}
            {node.originalSource ? (
              <span className="node-card__identifier">
                Original: {formatOriginalQuestionSource(node.originalSource)}
              </span>
            ) : null}
            {node.source ? (
              <span className="node-card__identifier">
                Source: {node.source.relativePath}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      <NodeJumpLinks
        getScrollContainer={getScrollContainer}
        firstChildPath={firstChildPath}
        nextQuestionPath={nextQuestionPath}
        nextSiblingPath={nextSiblingPath}
        parentPath={parentPath}
        previousQuestionPath={previousQuestionPath}
        previousSiblingPath={previousSiblingPath}
      />

      <div className="node-card__body">
        <NodeContentBlock
          document={mutationDocument}
          imageFields={[{ kind: 'question' }]}
          label="Question"
          node={node}
          onDocumentChange={onDocumentChange}
          onDocumentRefresh={refreshMutationDocument}
          onSaveStateChange={onSaveStateChange}
          readOnly={readOnly}
          review={review}
          values={[node.content.question]}
        />
        {review.kind === 'question' ? (
          <InlineNodeEditor
            document={mutationDocument}
            node={node}
            onDocumentChange={onDocumentChange}
            onDocumentRefresh={refreshMutationDocument}
            onSaveStateChange={onSaveStateChange}
            readOnly={readOnly}
            tagCatalog={review.tagCatalog}
          />
        ) : null}
        <NodeContentBlock
          document={mutationDocument}
          label="Formulas"
          node={node}
          onDocumentChange={onDocumentChange}
          onDocumentRefresh={refreshMutationDocument}
          onSaveStateChange={onSaveStateChange}
          readOnly={readOnly}
          review={review}
          values={node.content.formulas}
        />
        <NodeContentBlock
          document={mutationDocument}
          label="Tips"
          node={node}
          onDocumentChange={onDocumentChange}
          onDocumentRefresh={refreshMutationDocument}
          onSaveStateChange={onSaveStateChange}
          readOnly={readOnly}
          review={review}
          values={node.content.tips}
        />
        <WorkingAnswersSection
          answerIndexes={node.content.answerIndexes}
          answers={node.content.answers}
          document={mutationDocument}
          isExpanded={isDetailExpanded}
          node={node}
          onDocumentChange={onDocumentChange}
          onDocumentRefresh={refreshMutationDocument}
          onSaveStateChange={onSaveStateChange}
          onToggle={() =>
            onDetailVisibilityChange(node.path, !isDetailExpanded)
          }
          readOnly={readOnly}
          review={review}
          workingIndexes={node.content.workingIndexes}
          workings={node.content.workings}
        />
      </div>

      {node.children.length > 0 ? (
        <div className="node-card__children">
          {node.children.map((child, index) => (
            <NodeCard
              detailVisibility={detailVisibility}
              document={document}
              firstChildPath={child.children[0]?.path ?? null}
              getScrollContainer={getScrollContainer}
              key={child.path}
              nextQuestionPath={nextQuestionPath}
              nextSiblingPath={node.children[index + 1]?.path ?? null}
              node={child}
              onDetailVisibilityChange={onDetailVisibilityChange}
              onDocumentChange={onDocumentChange}
              onDocumentRefresh={onDocumentRefresh}
              onSaveStateChange={onSaveStateChange}
              parentPath={node.path}
              previousQuestionPath={previousQuestionPath}
              previousSiblingPath={node.children[index - 1]?.path ?? null}
              readOnly={readOnly}
              review={review}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ReviewNodeDocument({
  document,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  paperImageMode,
  readOnly,
  review,
}: Omit<NodeDocumentProps, 'tagCatalog'> & { review: DocumentReview }) {
  const [activeNodePath, setActiveNodePath] = useState<string | null>(
    document.nodesFlat[0]?.path ?? null,
  );
  const [detailVisibility, setDetailVisibility] = useState<
    Record<string, boolean>
  >({});
  const [loadedDetailVisibilityKey, setLoadedDetailVisibilityKey] = useState<
    string | null
  >(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const usesPageScroll = document.corpus?.kind === 'search';
  const detailStorageKey = useMemo(
    () => detailVisibilityStorageKey(document),
    [document],
  );
  const resolvedActiveNodePath =
    activeNodePath &&
    document.nodesFlat.some(node => node.path === activeNodePath)
      ? activeNodePath
      : (document.nodesFlat[0]?.path ?? null);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const nodeElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-node-path]'),
    );

    if (!nodeElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (isProgrammaticScrollRef.current) {
          return;
        }

        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (!visible.length) {
          return;
        }

        const nextPath = visible[0].target.getAttribute('data-node-path');
        if (nextPath) {
          setActiveNodePath(nextPath);
        }
      },
      {
        root: usesPageScroll ? null : container,
        rootMargin: '-18% 0px -70% 0px',
        threshold: [0, 0.2, 0.4, 0.6],
      },
    );

    for (const nodeElement of nodeElements) {
      observer.observe(nodeElement);
    }

    return () => observer.disconnect();
  }, [document, usesPageScroll]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDetailVisibility(
        parseStoredDetailVisibility(
          window.localStorage.getItem(detailStorageKey),
        ),
      );
      setLoadedDetailVisibilityKey(detailStorageKey);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [detailStorageKey]);

  const topLevelNodes = useMemo(
    () => document.sections.flatMap(section => section.questions),
    [document.sections],
  );
  const outlineSections = useMemo(
    () => tagOutlineSections(document, review.kind),
    [document, review.kind],
  );
  const getScrollContainer = () =>
    usesPageScroll ? null : scrollContainerRef.current;
  const navigateToNode = (path: string | null) => {
    if (path) {
      isProgrammaticScrollRef.current = true;
      setActiveNodePath(path);
    }

    scrollToNode(path, getScrollContainer());

    if (programmaticScrollTimeoutRef.current) {
      window.clearTimeout(programmaticScrollTimeoutRef.current);
    }

    programmaticScrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      programmaticScrollTimeoutRef.current = null;
    }, 900);
  };
  const detailNodePaths = useMemo(
    () =>
      document.nodesFlat
        .filter(
          node =>
            node.content.workings.length > 0 || node.content.answers.length > 0,
        )
        .map(node => node.path),
    [document.nodesFlat],
  );
  const allDetailsExpanded =
    detailNodePaths.length > 0 &&
    detailNodePaths.every(path => detailVisibility[path] ?? true);

  const setAllDetailsExpanded = (isExpanded: boolean) => {
    setDetailVisibility(current => {
      const next = { ...current };

      for (const path of detailNodePaths) {
        next[path] = isExpanded;
      }

      return next;
    });
  };

  useEffect(() => {
    if (loadedDetailVisibilityKey !== detailStorageKey) {
      return;
    }

    window.localStorage.setItem(
      detailStorageKey,
      JSON.stringify(detailVisibility),
    );
  }, [detailStorageKey, detailVisibility, loadedDetailVisibilityKey]);

  return (
    <div className={cn('document-pane', `paper-images--${paperImageMode}`)}>
      <div
        className={cn(
          'document-pane__inner',
          detailNodePaths.length && 'document-pane__inner--with-controls',
        )}>
        {detailNodePaths.length ? (
          <div className="document-view-controls">
            <Button
              onClick={() => setAllDetailsExpanded(!allDetailsExpanded)}
              size="sm"
              type="button"
              variant="outline">
              {allDetailsExpanded ? 'Collapse working' : 'Expand working'}
            </Button>
          </div>
        ) : null}
        <div className="document-layout">
          <PaperOutline
            activeId={resolvedActiveNodePath ?? undefined}
            ariaLabel={
              review.kind === 'image'
                ? 'Image tag question navigation'
                : 'Question tag navigation'
            }
            heading={review.kind === 'image' ? 'Images' : 'Questions'}
            onNavigate={navigateToNode}
            sections={outlineSections}
          />
          <div className="document-content" ref={scrollContainerRef}>
            {document.sections.map(section => (
              <section
                className="document-section"
                id={sectionAnchorId(section.path)}
                key={section.path}>
                <header className="document-section__header">
                  <div>
                    <p className="document-section__eyebrow">
                      Section {section.index + 1}
                    </p>
                    <h2>{section.name}</h2>
                  </div>
                  <div className="document-section__icon">
                    <FileText className="h-4 w-4" />
                  </div>
                </header>

                <div className="document-section__questions">
                  {section.questions.map((node, index) => (
                    <NodeCard
                      detailVisibility={detailVisibility}
                      document={document}
                      firstChildPath={node.children[0]?.path ?? null}
                      getScrollContainer={getScrollContainer}
                      key={node.path}
                      nextQuestionPath={
                        topLevelNodes[
                          topLevelNodes.findIndex(
                            item => item.path === node.path,
                          ) + 1
                        ]?.path ?? null
                      }
                      nextSiblingPath={
                        section.questions[index + 1]?.path ?? null
                      }
                      node={node}
                      onDetailVisibilityChange={(nodePath, isExpanded) =>
                        setDetailVisibility(current => ({
                          ...current,
                          [nodePath]: isExpanded,
                        }))
                      }
                      onDocumentChange={onDocumentChange}
                      onDocumentRefresh={onDocumentRefresh}
                      onSaveStateChange={onSaveStateChange}
                      parentPath={null}
                      previousQuestionPath={
                        topLevelNodes[
                          topLevelNodes.findIndex(
                            item => item.path === node.path,
                          ) - 1
                        ]?.path ?? null
                      }
                      previousSiblingPath={
                        section.questions[index - 1]?.path ?? null
                      }
                      readOnly={readOnly}
                      review={review}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NodeDocument({ tagCatalog, ...props }: NodeDocumentProps) {
  return (
    <ReviewNodeDocument {...props} review={{ kind: 'question', tagCatalog }} />
  );
}

export function ImageNodeDocument({
  catalog,
  ...props
}: ImageNodeDocumentProps) {
  return <ReviewNodeDocument {...props} review={{ catalog, kind: 'image' }} />;
}
