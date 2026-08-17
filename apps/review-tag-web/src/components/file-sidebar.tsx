'use client';

import { FileText, FolderOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { FileCommandPalette } from '@/components/file-command-palette';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { compareFolderKeys, folderLabel } from '@/lib/paper-folder-metadata';
import type { FileIndexItem, FolderKey } from '@/lib/paper-types';
import { cn } from '@/lib/utils';

type FileSidebarProps = {
  activeFileHref?: string;
  files: FileIndexItem[];
};

type FolderFilter = 'all' | FolderKey;

function matchesQuery(file: FileIndexItem, query: string) {
  if (!query) {
    return true;
  }

  const terms = query.split(/\s+/g).filter(Boolean);
  return terms.every(term => file.searchText.includes(term));
}

export function FileSidebar({ activeFileHref, files }: FileSidebarProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FolderFilter>('all');
  const normalizedQuery = query.trim().toLowerCase();
  const folderOptions = useMemo(() => {
    const folderKeys = [...new Set(files.map(file => file.folderKey))].sort(
      compareFolderKeys,
    );

    return [
      { key: 'all' as const, label: 'All TOML' },
      ...folderKeys.map(folderKey => ({
        key: folderKey,
        label: folderLabel(folderKey),
      })),
    ];
  }, [files]);
  const grouped = useMemo(() => {
    const visibleFolders: FolderKey[] =
      activeFilter === 'all'
        ? folderOptions.flatMap(option =>
            option.key === 'all' ? [] : [option.key],
          )
        : [activeFilter];

    return visibleFolders.map(folderKey => {
      const matches = files.filter(file => {
        if (file.folderKey !== folderKey) {
          return false;
        }

        return matchesQuery(file, normalizedQuery);
      });

      return {
        files: matches,
        folderKey,
        label: folderLabel(folderKey),
      };
    });
  }, [activeFilter, files, folderOptions, normalizedQuery]);
  const visibleFiles = useMemo(
    () => grouped.flatMap(group => group.files),
    [grouped],
  );

  return (
    <aside className="tag-sidebar">
      <div className="tag-sidebar__top">
        <div>
          <p className="tag-sidebar__eyebrow">Workspace</p>
          <h2 className="tag-sidebar__title">RTQ Tag Editor</h2>
        </div>
        <FileCommandPalette files={visibleFiles} />
      </div>

      <div
        className="tag-sidebar__filters"
        role="tablist"
        aria-label="Source bucket">
        {folderOptions.map(option => (
          <button
            aria-selected={activeFilter === option.key}
            className={cn(
              'tag-sidebar__filter',
              activeFilter === option.key && 'tag-sidebar__filter--active',
            )}
            key={option.key}
            onClick={() => setActiveFilter(option.key)}
            role="tab"
            type="button">
            {option.label}
          </button>
        ))}
      </div>

      <label className="tag-sidebar__search">
        <Search className="h-4 w-4 text-[color:var(--muted)]" />
        <Input
          onChange={event => setQuery(event.target.value)}
          placeholder="Filter files or folders…"
          value={query}
        />
      </label>

      <div className="tag-sidebar__hint">
        <span>Jump fast with</span>
        <kbd>Cmd K</kbd>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="tag-folder-list">
          {grouped.map(group => (
            <section className="tag-folder-card" key={group.folderKey}>
              <div className="tag-folder-card__header">
                <div className="tag-folder-card__label">
                  <FolderOpen className="h-4 w-4 text-[color:var(--accent)]" />
                  <span>{group.label}</span>
                </div>
                <span className="tag-folder-card__count">
                  {group.files.length}
                </span>
              </div>

              <ul className="tag-folder-card__files">
                {group.files.map(file => (
                  <li key={`${file.folderKey}:${file.relativePath}`}>
                    <Link
                      className={cn(
                        'tag-file-link',
                        activeFileHref === file.href && 'tag-file-link--active',
                      )}
                      href={file.href}>
                      <FileText className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      <span className="tag-file-link__copy">
                        <span className="tag-file-link__title">
                          {file.navTitle}
                        </span>
                        <span className="tag-file-link__meta-row">
                          {file.navStatus ? (
                            <Badge
                              className="shrink-0 text-[10px] tracking-[0.14em]"
                              tone={file.navStatusTone ?? 'status'}>
                              {file.navStatus}
                            </Badge>
                          ) : null}
                          <span className="tag-file-link__meta">
                            {file.navMeta}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
