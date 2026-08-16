'use client';

import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronsUpDown, CircleSlash, Plus, X } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';

import { updateNodeAction } from '@/app/actions';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type {
  DisplayTag,
  FolderKey,
  PaperDocument,
  PaperNode,
  TagCatalog,
} from '@/lib/paper-types';
import { cn, formatOriginalQuestionSource } from '@/lib/utils';

type NodeInspectorProps = {
  document: PaperDocument | null;
  onDocumentChange: (document: PaperDocument) => void;
  onSaveStateChange: (state: {
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }) => void;
  selectedNode: PaperNode | null;
};

function tagTone(tag: DisplayTag) {
  return tag.source === 'implicit' ? 'implicit' : tag.kind;
}

function tagStyle(tag: DisplayTag) {
  if (!tag.active) {
    return 'inactive';
  }

  return tag.source === 'inherited' ? 'outlined' : 'solid';
}

function tagSearchKeywords(tag: string) {
  const withoutPrefix = tag.replace(/^[^.]+\./, '');
  const readable = tag.replace(/[.-]+/g, ' ');
  const readableWithoutPrefix = withoutPrefix.replace(/[.-]+/g, ' ');
  return [readable, withoutPrefix, readableWithoutPrefix];
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
        <Button className="justify-between rounded-2xl" variant="outline">
          <span>{label}</span>
          <ChevronsUpDown className="h-4 w-4 text-[color:var(--muted)]" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-50 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] border border-[color:var(--line-strong)] bg-[color:var(--panel)] shadow-[0_22px_60px_rgba(42,25,10,0.22)]"
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
                      <Check
                        className={cn(
                          'h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
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

function TagGroup({
  emptyLabel,
  onRemove,
  tags,
}: {
  emptyLabel: string;
  onRemove?: (value: string) => void;
  tags: DisplayTag[];
}) {
  if (!tags.length) {
    return <p className="inspector-empty">{emptyLabel}</p>;
  }

  return (
    <div className="tag-chip-list">
      {tags.map(tag => (
        <Badge
          key={`${tag.value}-${tag.source}-${tag.active}`}
          style={tagStyle(tag)}
          tone={tagTone(tag)}>
          <span>{tag.implicitLabel ?? tag.value}</span>
          {onRemove ? (
            <button
              aria-label={`Remove ${tag.value}`}
              className="tag-chip-remove"
              onClick={() => onRemove(tag.value)}
              type="button">
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </Badge>
      ))}
    </div>
  );
}

function implicitOnly(tags: DisplayTag[]) {
  return tags.filter(tag => tag.source === 'implicit');
}

export function NodeInspector({
  document,
  onDocumentChange,
  onSaveStateChange,
  selectedNode,
}: NodeInspectorProps) {
  const [isPending, startTransition] = useTransition();
  const explicit = useMemo(
    () => dimensionalGroups(selectedNode?.explicitTags ?? []),
    [selectedNode],
  );

  if (!selectedNode || !document) {
    return (
      <aside className="inspector-pane">
        <div className="inspector-empty-state">
          <CircleSlash className="h-7 w-7" />
          <h3>Select a question node</h3>
          <p>
            Choose a question, subquestion, or sub-subquestion to review tags
            and edit inheritance.
          </p>
        </div>
      </aside>
    );
  }

  const mutate = (nextTags: string[], nextInherit: boolean | null) => {
    onSaveStateChange({ message: 'Saving…', tone: 'saving' });

    startTransition(async () => {
      try {
        const nextDocument = await updateNodeAction({
          explicitInherit: nextInherit,
          explicitTags: nextTags,
          folderKey: document.folderKey as FolderKey,
          nodePath: selectedNode.path,
          relativePath: document.relativePath,
          versionHash: document.versionHash,
        });
        onDocumentChange(nextDocument);
        onSaveStateChange({ message: 'Saved', tone: 'success' });
      } catch (error) {
        onSaveStateChange({
          message:
            error instanceof Error
              ? error.message
              : 'Unable to save this change.',
          tone: 'error',
        });
      }
    });
  };

  const replaceSingle = (
    kind: 'family' | 'frame' | 'reasoning',
    value: string,
  ) => {
    const next = selectedNode.explicitTags.filter(
      tag => !tag.startsWith(`${kind}.`),
    );
    mutate([...next, value], selectedNode.explicitInherit);
  };

  const removeExplicitTag = (value: string) => {
    mutate(
      selectedNode.explicitTags.filter(tag => tag !== value),
      selectedNode.explicitInherit,
    );
  };

  const toggleMarker = (value: string) => {
    const next = selectedNode.explicitTags.includes(value)
      ? selectedNode.explicitTags.filter(tag => tag !== value)
      : [...selectedNode.explicitTags, value];
    mutate(next, selectedNode.explicitInherit);
  };

  const toggleMath = (value: string) => {
    const next = selectedNode.explicitTags.includes(value)
      ? selectedNode.explicitTags.filter(tag => tag !== value)
      : [...selectedNode.explicitTags, value];
    mutate(next, selectedNode.explicitInherit);
  };

  const catalog: TagCatalog = (
    document as PaperDocument & { tagCatalog?: TagCatalog }
  ).tagCatalog ?? {
    family: [],
    frame: [],
    marker: [],
    math: [],
    reasoning: [],
  };

  return (
    <aside className="inspector-pane">
      <header className="inspector-pane__header">
        <div>
          <p className="inspector-pane__eyebrow">{selectedNode.kind}</p>
          <h2>{selectedNode.hierarchyLabel}</h2>
          <p className="inspector-pane__meta">
            {selectedNode.uuid ??
              (!selectedNode.originalSource ? selectedNode.questionId : null) ??
              'No UUID available'}
          </p>
          {selectedNode.originalSource ? (
            <p className="inspector-pane__meta">
              Original:{' '}
              {formatOriginalQuestionSource(selectedNode.originalSource)}
            </p>
          ) : null}
        </div>
        {isPending ? (
          <span className="status-chip status-chip--saving">Updating</span>
        ) : null}
      </header>

      <section className="inspector-block">
        <div className="inspector-block__header">
          <div>
            <h3>Inheritance</h3>
            <p>
              Derived tags stay visible for reference even when inheritance is
              disabled.
            </p>
          </div>
          <div className="inheritance-toggle">
            <span>{selectedNode.explicitInherit ? 'On' : 'Off'}</span>
            <Switch
              checked={selectedNode.explicitInherit ?? false}
              disabled={selectedNode.isRootNode || isPending}
              onCheckedChange={checked =>
                mutate(selectedNode.explicitTags, checked)
              }
            />
          </div>
        </div>
        {selectedNode.isRootNode ? (
          <p className="inspector-note">
            Top-level questions do not inherit from a parent node.
          </p>
        ) : null}
      </section>

      <Separator />

      <section className="inspector-block">
        <header className="inspector-block__header">
          <div>
            <h3>Inherited from parent</h3>
            <p>
              {selectedNode.explicitInherit
                ? 'Applied to this node.'
                : 'Shown as inactive reference only.'}
            </p>
          </div>
        </header>
        <TagGroup
          emptyLabel="No parent-derived tags."
          tags={selectedNode.inheritedDisplayTags}
        />
      </section>

      <Separator />

      <section className="inspector-block">
        <header className="inspector-block__header">
          <div>
            <h3>Explicit on this node</h3>
            <p>Only these tags can be changed here.</p>
          </div>
        </header>

        <div className="inspector-editor-grid">
          <div className="inspector-field">
            <label>Family</label>
            <TagGroup
              emptyLabel="No explicit family tag."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'family',
              )}
            />
            <Picker
              label={explicit.family ? 'Replace family' : 'Add family'}
              mode="single"
              onSelect={value => replaceSingle('family', value)}
              options={catalog.family}
              selected={explicit.family ? [explicit.family] : []}
            />
          </div>

          <div className="inspector-field">
            <label>Math</label>
            <TagGroup
              emptyLabel="No explicit math tag."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'math',
              )}
            />
            <Picker
              label="Add math"
              mode="multiple"
              onSelect={toggleMath}
              options={catalog.math}
              selected={explicit.maths}
            />
          </div>

          <div className="inspector-field">
            <label>Frame</label>
            <TagGroup
              emptyLabel="No explicit frame tag."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'frame',
              )}
            />
            <Picker
              label={explicit.frame ? 'Replace frame' : 'Add frame'}
              mode="single"
              onSelect={value => replaceSingle('frame', value)}
              options={catalog.frame}
              selected={explicit.frame ? [explicit.frame] : []}
            />
          </div>

          <div className="inspector-field">
            <label>Markers</label>
            <TagGroup
              emptyLabel="No explicit marker tags."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'marker',
              )}
            />
            <Picker
              label="Add marker"
              mode="multiple"
              onSelect={toggleMarker}
              options={catalog.marker}
              selected={explicit.markers}
            />
          </div>

          <div className="inspector-field">
            <label>Reasoning</label>
            <TagGroup
              emptyLabel="No explicit reasoning tag."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'reasoning',
              )}
            />
            <Picker
              label={explicit.reasoning ? 'Replace reasoning' : 'Add reasoning'}
              mode="single"
              onSelect={value => replaceSingle('reasoning', value)}
              options={catalog.reasoning}
              selected={explicit.reasoning ? [explicit.reasoning] : []}
            />
          </div>

          <div className="inspector-field inspector-field--full">
            <div className="inspector-field__title">
              <label>Legacy tags</label>
              <span>Visible and removable only.</span>
            </div>
            <TagGroup
              emptyLabel="No explicit legacy tags."
              onRemove={removeExplicitTag}
              tags={selectedNode.explicitDisplayTags.filter(
                tag => tag.kind === 'legacy',
              )}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="inspector-block">
        <header className="inspector-block__header">
          <div>
            <h3>Effective final tags</h3>
            <p>Inherited tags stay visually distinct from explicit ones.</p>
          </div>
        </header>
        <TagGroup
          emptyLabel="No effective tags."
          tags={selectedNode.effectiveDisplayTags}
        />
        <div className="inspector-implicit-row">
          {implicitOnly(selectedNode.effectiveDisplayTags).map(tag => (
            <span
              className="inspector-implicit-note"
              key={`${tag.kind}-${tag.value}`}>
              <Plus className="h-3.5 w-3.5" />
              {tag.dimensionLabel}: {tag.implicitLabel}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}
