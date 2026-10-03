'use client';

import * as Popover from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useState } from 'react';

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
import type { DisplayTag } from '@/lib/paper-types';
import { cn } from '@/lib/utils';

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

export function TagGroup({
  emptyLabel,
  onRemove,
  tags,
}: {
  emptyLabel?: string;
  onRemove?: (value: string) => void;
  tags: DisplayTag[];
}) {
  if (!tags.length) {
    return emptyLabel ? (
      <span className="tag-chip-empty">{emptyLabel}</span>
    ) : null;
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

export function TagPicker({
  disabled = false,
  label,
  mode,
  onSelect,
  options,
  selected,
}: {
  disabled?: boolean;
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
          disabled={disabled}
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
