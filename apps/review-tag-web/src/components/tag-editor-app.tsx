'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { refreshPaperDocumentAction } from '@/app/actions';
import { FileCommandPalette } from '@/components/file-command-palette';
import { NodeDocument } from '@/components/node-document';
import { Separator } from '@/components/ui/separator';
import { isReadOnlyFolder } from '@/lib/paper-paths';
import type {
  FileIndexItem,
  PaperDocument,
  TagCatalog,
} from '@/lib/paper-types';
import { formatCount } from '@/lib/utils';

type TagEditorAppProps = {
  browseHref?: string;
  files: FileIndexItem[];
  initialDocument: PaperDocument;
  tagCatalog: TagCatalog;
};

export function TagEditorApp({
  browseHref = '/',
  files,
  initialDocument,
  tagCatalog,
}: TagEditorAppProps) {
  const [document, setDocument] = useState<PaperDocument>(initialDocument);
  const isReadOnly = isReadOnlyFolder(document.folderKey);
  const [saveState, setSaveState] = useState<{
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }>({ message: 'Ready', tone: 'idle' });
  const latestDocumentRef = useRef(document);

  const updateDocument = useCallback((nextDocument: PaperDocument) => {
    latestDocumentRef.current = nextDocument;
    setDocument(nextDocument);
  }, []);

  useEffect(() => {
    latestDocumentRef.current = document;
  }, [document]);

  useEffect(() => {
    if (saveState.tone !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveState({ message: 'Ready', tone: 'idle' });
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [saveState]);

  const refreshDocument = useCallback(
    async (options?: { notify?: boolean }) => {
      const baseDocument = latestDocumentRef.current;
      const refreshResult = await refreshPaperDocumentAction({
        folderKey: baseDocument.folderKey,
        relativePath: baseDocument.relativePath,
        versionHash: baseDocument.versionHash,
      });
      const latestDocument = latestDocumentRef.current;

      if (latestDocument.versionHash !== baseDocument.versionHash) {
        return latestDocument;
      }

      if (!refreshResult.changed) {
        return latestDocument;
      }

      updateDocument(refreshResult.document);

      if (options?.notify) {
        setSaveState({ message: 'Updated from disk', tone: 'success' });
      }

      return refreshResult.document;
    },
    [updateDocument],
  );

  useEffect(() => {
    const poll = () => {
      if (
        saveState.tone === 'saving' ||
        window.document.visibilityState === 'hidden'
      ) {
        return;
      }

      refreshDocument({ notify: true }).catch(() => {
        // External writers can leave a file briefly unreadable while replacing it.
      });
    };

    const intervalId = window.setInterval(poll, 2500);

    return () => window.clearInterval(intervalId);
  }, [refreshDocument, saveState.tone]);

  return (
    <main className="editor-shell">
      <header className="editor-topbar">
        <div className="editor-topbar__left">
          <Link className="editor-back-link" href={browseHref}>
            <ArrowLeft className="h-4 w-4" />
            Back to files
          </Link>
          <div>
            <p className="tag-main__eyebrow">{document.folderKey}</p>
            <h1>{document.title}</h1>
            <p className="tag-main__subtitle">
              {formatCount(document.questionCount, 'top-level question')} across{' '}
              {formatCount(document.sections.length, 'section')}
            </p>
          </div>
        </div>

        <div className="editor-topbar__right">
          <div
            className={`status-chip status-chip--${isReadOnly ? 'idle' : saveState.tone}`}>
            <Sparkles className="h-4 w-4" />
            {isReadOnly ? 'Read-only' : saveState.message}
          </div>
          <FileCommandPalette files={files} />
        </div>
      </header>

      <section className="tag-main__meta">
        <span>
          <strong>Source file:</strong> {document.relativePath}
        </span>
        <span>
          <strong>School:</strong> {document.meta.schoolId ?? 'unknown'}
        </span>
        <span>
          <strong>Paper ID:</strong> {document.meta.paperId ?? 'missing'}
        </span>
      </section>

      <Separator />

      <div className="tag-workspace-grid">
        <NodeDocument
          document={document}
          onDocumentChange={updateDocument}
          onDocumentRefresh={refreshDocument}
          onSaveStateChange={setSaveState}
          readOnly={isReadOnly}
          tagCatalog={tagCatalog}
        />
      </div>
    </main>
  );
}
