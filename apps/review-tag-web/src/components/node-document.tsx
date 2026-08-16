'use client';

import * as Popover from '@radix-ui/react-popover';
import { FileText, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { updateNodeAction } from '@/app/actions';
import { RtqMarkdown } from '@/components/rtq-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command-dialog';
import { Switch } from '@/components/ui/switch';
import type {
  DisplayTag,
  FolderKey,
  PaperDocument,
  PaperNode,
  TagCatalog,
} from '@/lib/paper-types';
import { cn, formatOriginalQuestionSource } from '@/lib/utils';

type NodeDocumentProps = {
  document: PaperDocument;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: () => Promise<PaperDocument>;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  readOnly: boolean;
  tagCatalog: TagCatalog;
};

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

function rootQuestionPath(path: string) {
  return path.split('.').slice(0, 2).join('.');
}

function tagTone(tag: DisplayTag) {
  if (tag.source === 'implicit') {
    return 'implicit';
  }

  return tag.kind;
}

function tagStyle(tag: DisplayTag) {
  if (!tag.active) {
    return 'inactive';
  }

  return tag.source === 'inherited' || tag.source === 'implicit'
    ? 'outlined'
    : 'solid';
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

function TagGroup({
  onRemove,
  tags,
}: {
  onRemove?: (value: string) => void;
  tags: DisplayTag[];
}) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="tag-chip-list">
      {tags.map(tag => (
        <Badge
          className="tag-chip-large"
          key={`${tag.value}-${tag.source}-${tag.active}`}
          style={tagStyle(tag)}
          tone={tagTone(tag)}>
          <span>
            {tag.source === 'implicit'
              ? tag.value
              : (tag.implicitLabel ?? tag.value)}
          </span>
          {onRemove ? (
            <button
              aria-label={`Remove ${tag.value}`}
              className="tag-chip-remove"
              onClick={() => onRemove(tag.value)}
              type="button">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </Badge>
      ))}
    </div>
  );
}

function tagSearchKeywords(tag: string) {
  const withoutPrefix = tag.replace(/^[^.]+\./, '');
  const readable = tag.replace(/[.-]+/g, ' ');
  const readableWithoutPrefix = withoutPrefix.replace(/[.-]+/g, ' ');
  return [readable, withoutPrefix, readableWithoutPrefix];
}

function Picker({
  label,
  mode,
  onSelect,
  options,
  selected,
}: {
  label: string;
  mode: 'multiple' | 'single';
  onSelect: (value: string) => void;
  options: string[];
  selected: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>
        <Button
          aria-label={label}
          className="picker-button rounded-2xl"
          type="button"
          variant="outline">
          <span className="picker-button__icon">+</span>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-50 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] border border-[color:var(--line-strong)] bg-[color:var(--panel)] shadow-[0_22px_60px_rgba(0,0,0,0.12)]"
          sideOffset={8}>
          <Command>
            <CommandInput placeholder={`Find ${label.toLowerCase()}…`} />
            <CommandList>
              <CommandEmpty>No matching tag.</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const isSelected = selected.includes(option);

                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => {
                        onSelect(option);
                        if (mode === 'single') {
                          setOpen(false);
                        }
                      }}
                      value={option}
                      keywords={tagSearchKeywords(option)}>
                      <span
                        className={cn(
                          'w-4 text-center',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}>
                        ✓
                      </span>
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function NodeContentBlock({
  className,
  label,
  values,
}: {
  className?: string;
  label: string;
  values: string[];
}) {
  if (!values.length) {
    return null;
  }

  return (
    <section className={cn('node-content-block', className)}>
      <header className="node-content-block__header">{label}</header>
      <div className="node-content-block__body">
        {values.map((value, index) => (
          <div className="node-content-block__entry" key={`${label}-${index}`}>
            <RtqMarkdown markdown={value} />
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkingAnswersSection({
  answers,
  isExpanded,
  onToggle,
  workings,
}: {
  answers: string[];
  isExpanded: boolean;
  onToggle: () => void;
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
              key={`working-${index}`}
              label={workings.length > 1 ? `Working ${index + 1}` : 'Working'}
              values={[working]}
            />
          ))}
          <NodeContentBlock label="Answers" values={answers} />
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
  onDocumentRefresh: () => Promise<PaperDocument>;
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
          nodePath: node.path,
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
            await onDocumentRefresh();
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
                  <Picker
                    label="Choose family"
                    mode="single"
                    onSelect={value => replaceSingle('family', value)}
                    options={tagCatalog.family}
                    selected={explicit.family ? [explicit.family] : []}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <Picker
                    label="Choose math"
                    mode="multiple"
                    onSelect={toggleMath}
                    options={tagCatalog.math}
                    selected={explicit.maths}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <Picker
                    label="Choose frame"
                    mode="single"
                    onSelect={value => replaceSingle('frame', value)}
                    options={tagCatalog.frame}
                    selected={explicit.frame ? [explicit.frame] : []}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <Picker
                    label="Choose marker"
                    mode="multiple"
                    onSelect={toggleMarker}
                    options={tagCatalog.marker}
                    selected={explicit.markers}
                  />
                </div>
                <div className="tag-editor-matrix__cell tag-editor-matrix__cell--picker">
                  <Picker
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

function QuestionGlanceItem({
  getScrollContainer,
  node,
  relativeDepth = 0,
}: {
  getScrollContainer: () => HTMLElement | null;
  node: PaperNode;
  relativeDepth?: number;
}) {
  const isInheritanceOff = !node.isRootNode && node.explicitInherit === false;

  return (
    <>
      <div
        className={cn(
          'question-glance__item',
          isInheritanceOff ? 'question-glance__item--inheritance-off' : null,
        )}
        style={{ paddingLeft: `${relativeDepth * 0.75}rem` }}>
        <button
          className="question-glance__label"
          onClick={() => scrollToNode(node.path, getScrollContainer())}
          type="button">
          {node.hierarchyLabel}
        </button>
        {node.explicitDisplayTags.length > 0 ? (
          <TagGroup tags={node.explicitDisplayTags} />
        ) : (
          <span className="question-glance__empty">No explicit tags</span>
        )}
        {isInheritanceOff ? (
          <span className="question-glance__inheritance-note">
            Parent tags off
          </span>
        ) : null}
      </div>
      {node.children.map(child => (
        <QuestionGlanceItem
          getScrollContainer={getScrollContainer}
          key={child.path}
          node={child}
          relativeDepth={relativeDepth + 1}
        />
      ))}
    </>
  );
}

function QuestionGlance({
  getScrollContainer,
  node,
}: {
  getScrollContainer: () => HTMLElement | null;
  node: PaperNode;
}) {
  return (
    <aside
      className="question-glance"
      aria-label={`${node.hierarchyLabel} explicit tags`}>
      <div className="question-glance__header">
        <span>Explicit tags</span>
      </div>
      <div className="question-glance__list">
        <QuestionGlanceItem
          getScrollContainer={getScrollContainer}
          node={node}
        />
      </div>
    </aside>
  );
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
  tagCatalog,
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
  onDocumentRefresh: () => Promise<PaperDocument>;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  parentPath: string | null;
  previousQuestionPath: string | null;
  previousSiblingPath: string | null;
  readOnly: boolean;
  tagCatalog: TagCatalog;
}) {
  const isDetailExpanded = detailVisibility[node.path] ?? true;
  const identifier = nodeIdentifier(node);

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
        <NodeContentBlock label="Question" values={[node.content.question]} />
        <InlineNodeEditor
          document={document}
          node={node}
          onDocumentChange={onDocumentChange}
          onDocumentRefresh={onDocumentRefresh}
          onSaveStateChange={onSaveStateChange}
          readOnly={readOnly}
          tagCatalog={tagCatalog}
        />
        <NodeContentBlock label="Formulas" values={node.content.formulas} />
        <NodeContentBlock label="Tips" values={node.content.tips} />
        <WorkingAnswersSection
          answers={node.content.answers}
          isExpanded={isDetailExpanded}
          onToggle={() =>
            onDetailVisibilityChange(node.path, !isDetailExpanded)
          }
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
              tagCatalog={tagCatalog}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
function StickyQuestionNav({
  activeNodePath,
  activeRootPath,
  allDetailsExpanded,
  getScrollContainer,
  nodesFlat,
  onNavigate,
  onSetAllDetailsExpanded,
  topLevelNodes,
}: {
  activeNodePath: string | null;
  activeRootPath: string | null;
  allDetailsExpanded: boolean;
  getScrollContainer: () => HTMLElement | null;
  nodesFlat: PaperNode[];
  onNavigate: (path: string | null) => void;
  onSetAllDetailsExpanded: (isExpanded: boolean) => void;
  topLevelNodes: PaperNode[];
}) {
  const activeAllIndex = activeNodePath
    ? nodesFlat.findIndex(node => node.path === activeNodePath)
    : 0;
  const resolvedActiveRootPath =
    activeRootPath ?? topLevelNodes[0]?.path ?? null;
  const activeQuestionIndex = resolvedActiveRootPath
    ? topLevelNodes.findIndex(node => node.path === resolvedActiveRootPath)
    : 0;

  const previousItemPath =
    activeAllIndex > 0 ? (nodesFlat[activeAllIndex - 1]?.path ?? null) : null;
  const nextItemPath =
    activeAllIndex >= 0 ? (nodesFlat[activeAllIndex + 1]?.path ?? null) : null;
  const previousQuestionPath =
    activeQuestionIndex > 0
      ? (topLevelNodes[activeQuestionIndex - 1]?.path ?? null)
      : null;
  const nextQuestionPath =
    activeQuestionIndex >= 0
      ? (topLevelNodes[activeQuestionIndex + 1]?.path ?? null)
      : null;

  return (
    <div className="document-sticky-nav">
      <div className="document-sticky-nav__group">
        <Button
          className="text-sm"
          disabled={!previousQuestionPath}
          onClick={() => onNavigate(previousQuestionPath)}
          size="sm"
          type="button"
          variant="outline">
          Prev question
        </Button>
        <Button
          className="text-sm"
          disabled={!nextQuestionPath}
          onClick={() => onNavigate(nextQuestionPath)}
          size="sm"
          type="button"
          variant="outline">
          Next question
        </Button>
        <Button
          className="text-sm"
          disabled={!previousItemPath}
          onClick={() => onNavigate(previousItemPath)}
          size="sm"
          type="button"
          variant="outline">
          Prev item
        </Button>
        <Button
          className="text-sm"
          disabled={!nextItemPath}
          onClick={() => onNavigate(nextItemPath)}
          size="sm"
          type="button"
          variant="outline">
          Next item
        </Button>
        <Button
          className="text-sm"
          onClick={() =>
            getScrollContainer()?.scrollTo({ behavior: 'smooth', top: 0 })
          }
          size="sm"
          type="button"
          variant="outline">
          Top
        </Button>
        <Button
          className="text-sm"
          onClick={() => {
            const container = getScrollContainer();
            if (!container) {
              return;
            }

            container.scrollTo({
              behavior: 'smooth',
              top: container.scrollHeight,
            });
          }}
          size="sm"
          type="button"
          variant="outline">
          Bottom
        </Button>
      </div>

      <div className="document-sticky-nav__group document-sticky-nav__group--end">
        <Button
          className="text-xs leading-tight"
          onClick={() => onSetAllDetailsExpanded(!allDetailsExpanded)}
          size="sm"
          type="button"
          variant="outline">
          {allDetailsExpanded ? 'Collapse working' : 'Expand working'}
        </Button>
      </div>
    </div>
  );
}

export function NodeDocument({
  document,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  readOnly,
  tagCatalog,
}: NodeDocumentProps) {
  const [activeNodePath, setActiveNodePath] = useState<string | null>(
    document.nodesFlat[0]?.path ?? null,
  );
  const [activeRootPath, setActiveRootPath] = useState<string | null>(
    document.nodesFlat[0]?.path
      ? rootQuestionPath(document.nodesFlat[0].path)
      : null,
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
  const detailStorageKey = useMemo(
    () => detailVisibilityStorageKey(document),
    [document],
  );
  const resolvedActiveNodePath =
    activeNodePath &&
    document.nodesFlat.some(node => node.path === activeNodePath)
      ? activeNodePath
      : (document.nodesFlat[0]?.path ?? null);
  const resolvedActiveRootPath =
    activeRootPath &&
    document.sections.some(section =>
      section.questions.some(node => node.path === activeRootPath),
    )
      ? activeRootPath
      : resolvedActiveNodePath
        ? rootQuestionPath(resolvedActiveNodePath)
        : null;

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
          setActiveRootPath(rootQuestionPath(nextPath));
        }
      },
      {
        root: container,
        rootMargin: '-18% 0px -70% 0px',
        threshold: [0, 0.2, 0.4, 0.6],
      },
    );

    for (const nodeElement of nodeElements) {
      observer.observe(nodeElement);
    }

    return () => observer.disconnect();
  }, [document]);

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
  const getScrollContainer = () => scrollContainerRef.current;
  const navigateToNode = (path: string | null) => {
    if (path) {
      isProgrammaticScrollRef.current = true;
      setActiveNodePath(path);
      setActiveRootPath(rootQuestionPath(path));
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
    <div className="document-pane" ref={scrollContainerRef}>
      <div className="document-pane__inner">
        <div className="document-layout">
          <div className="document-content">
            {document.sections.map(section => (
              <section className="document-section" key={section.path}>
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
                    <div className="question-overview-row" key={node.path}>
                      <QuestionGlance
                        getScrollContainer={getScrollContainer}
                        node={node}
                      />
                      <NodeCard
                        detailVisibility={detailVisibility}
                        document={document}
                        firstChildPath={node.children[0]?.path ?? null}
                        getScrollContainer={getScrollContainer}
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
                        tagCatalog={tagCatalog}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="document-rail">
            <StickyQuestionNav
              activeNodePath={resolvedActiveNodePath}
              activeRootPath={resolvedActiveRootPath}
              allDetailsExpanded={allDetailsExpanded}
              getScrollContainer={getScrollContainer}
              nodesFlat={document.nodesFlat}
              onNavigate={navigateToNode}
              onSetAllDetailsExpanded={setAllDetailsExpanded}
              topLevelNodes={topLevelNodes}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
