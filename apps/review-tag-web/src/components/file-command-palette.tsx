'use client';

import { FileText, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command-dialog';
import { compareFolderKeys, folderLabel } from '@/lib/paper-folder-metadata';
import type { FileIndexItem, FolderKey } from '@/lib/paper-types';

type FileCommandPaletteProps = {
  files: FileIndexItem[];
};

export function FileCommandPalette({ files }: FileCommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => {
    const folderKeys = [...new Set(files.map(file => file.folderKey))].sort(
      compareFolderKeys,
    );

    return folderKeys.map((folderKey: FolderKey) => ({
      files: files.filter(file => file.folderKey === folderKey),
      folderKey,
      label: folderLabel(folderKey),
    }));
  }, [files]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(current => !current);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filter = (value: string, search: string) => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return 1;
    }

    const terms = normalizedSearch.split(/\s+/g).filter(Boolean);
    const haystack = value.toLowerCase();

    return terms.every(term => haystack.includes(term)) ? 1 : 0;
  };

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <Command filter={filter}>
        <CommandInput placeholder="Jump to a TOML file…" />
        <CommandList>
          <CommandEmpty>No matching file.</CommandEmpty>
          {groups.map(group => (
            <CommandGroup
              heading={
                <div className="flex items-center gap-2 px-2 pt-2 pb-1 text-xs font-semibold tracking-[0.14em] text-[color:var(--muted)] uppercase">
                  <FolderOpen className="h-3.5 w-3.5" />
                  {group.label}
                </div>
              }
              key={group.folderKey}>
              {group.files.map(file => (
                <CommandItem
                  key={`${file.folderKey}:${file.relativePath}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(file.href);
                  }}
                  value={file.searchText}>
                  <FileText className="h-4 w-4 text-[color:var(--accent)]" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold">
                      {file.navTitle}
                    </span>
                    <div className="flex min-w-0 items-center gap-2">
                      {file.navStatus ? (
                        <Badge
                          className="shrink-0 text-[10px] tracking-[0.14em]"
                          tone={file.navStatusTone ?? 'status'}>
                          {file.navStatus}
                        </Badge>
                      ) : null}
                      <span className="truncate text-xs text-[color:var(--muted)]">
                        {file.navMeta}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
