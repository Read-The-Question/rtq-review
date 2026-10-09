'use client';

import { ThemeToggle } from '@rtq/review-paper-browser/theme-toggle';
import {
  ArrowLeft,
  FileText,
  ImageIcon,
  PanelRight,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { refreshPaperDocumentAction } from '@/app/actions';
import { ImageTagDocument } from '@/components/image-tag-document';
import { NodeDocument } from '@/components/node-document';
import { PaperPdfPane } from '@/components/paper-pdf-pane';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { isReadOnlyFolder } from '@/lib/paper-folder-metadata';
import {
  type PaperImageMode,
  parsePaperImageMode,
} from '@/lib/paper-image-mode';
import type { PaperPdf } from '@/lib/paper-pdf';
import type {
  ImageTagCatalog,
  PaperDocument,
  TagCatalog,
} from '@/lib/paper-types';
import { mergeTagCorpusSourceDocument } from '@/lib/tag-corpus-document';
import { formatCount } from '@/lib/utils';

type TagEditorAppProps = {
  browseHref?: string;
  imageTagCatalog: ImageTagCatalog;
  initialDocument: PaperDocument;
  pdf?: PaperPdf;
  searchPanel?: ReactNode;
  tagCatalog: TagCatalog;
};

const REVIEW_MODE_STORAGE_KEY = 'rtq-tag-web:review-mode:v1';
const PDF_VISIBILITY_STORAGE_KEY = 'rtq-tag-web:show-original-pdf:v1';
const PAPER_IMAGE_MODE_STORAGE_KEY = 'rtq-tag-web:paper-image-mode:v1';
const IMAGE_NODES_ONLY_STORAGE_KEY = 'rtq-tag-web:image-nodes-only:v1';

export function TagEditorApp({
  browseHref = '/',
  imageTagCatalog,
  initialDocument,
  pdf,
  searchPanel,
  tagCatalog,
}: TagEditorAppProps) {
  const [document, setDocument] = useState<PaperDocument>(initialDocument);
  const [mode, setMode] = useState<'image' | 'question'>('question');
  const [paperImageMode, setPaperImageMode] = useState<PaperImageMode>('all');
  const [imageNodesOnly, setImageNodesOnly] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const isCorpus = document.corpus?.kind === 'search';
  const isReadOnly = isReadOnlyFolder(document.folderKey);
  const [saveState, setSaveState] = useState<{
    message: string;
    tone: 'error' | 'idle' | 'saving' | 'success';
  }>({ message: 'Ready', tone: 'idle' });
  const latestDocumentRef = useRef(document);

  const updateDocument = useCallback((nextDocument: PaperDocument) => {
    setDocument(currentDocument => {
      const resolvedDocument = currentDocument.corpus
        ? mergeTagCorpusSourceDocument(currentDocument, nextDocument)
        : nextDocument;
      latestDocumentRef.current = resolvedDocument;
      return resolvedDocument;
    });
  }, []);

  useEffect(() => {
    latestDocumentRef.current = document;
  }, [document]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedMode = window.localStorage.getItem(REVIEW_MODE_STORAGE_KEY);
      const storedPaperImageMode = window.localStorage.getItem(
        PAPER_IMAGE_MODE_STORAGE_KEY,
      );
      setMode(storedMode === 'image' ? 'image' : 'question');
      setPaperImageMode(parsePaperImageMode(storedPaperImageMode));
      setImageNodesOnly(
        window.localStorage.getItem(IMAGE_NODES_ONLY_STORAGE_KEY) === 'true',
      );
      setShowPdf(
        pdf?.state === 'available' &&
          window.localStorage.getItem(PDF_VISIBILITY_STORAGE_KEY) === 'true',
      );
      setPreferencesLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pdf?.state]);

  useEffect(() => {
    if (!preferencesLoaded) {
      return;
    }
    window.localStorage.setItem(REVIEW_MODE_STORAGE_KEY, mode);
    window.localStorage.setItem(PAPER_IMAGE_MODE_STORAGE_KEY, paperImageMode);
    window.localStorage.setItem(
      IMAGE_NODES_ONLY_STORAGE_KEY,
      String(imageNodesOnly),
    );
    window.localStorage.setItem(PDF_VISIBILITY_STORAGE_KEY, String(showPdf));
  }, [imageNodesOnly, mode, paperImageMode, preferencesLoaded, showPdf]);

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
    async (options?: { notify?: boolean; source?: PaperDocument }) => {
      const baseDocument = options?.source ?? latestDocumentRef.current;
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
    if (isCorpus) {
      return;
    }

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
  }, [isCorpus, refreshDocument, saveState.tone]);

  return (
    <main
      className={
        searchPanel ? 'editor-shell editor-shell--with-search' : 'editor-shell'
      }>
      <header className="editor-topbar">
        <div className="editor-topbar__left">
          <Link className="editor-back-link" href={browseHref}>
            <ArrowLeft className="h-4 w-4" />
            Back to papers
          </Link>
          <div>
            <p className="tag-main__eyebrow">{document.folderKey}</p>
            <h1>{document.title}</h1>
            <p className="tag-main__subtitle">
              {formatCount(document.questionCount, 'top-level question')} across{' '}
              {formatCount(
                document.sections.length,
                isCorpus ? 'source paper' : 'section',
              )}
            </p>
          </div>
        </div>

        <div className="editor-topbar__right">
          {!isCorpus ? (
            <Link className="editor-back-link" href="/search">
              <Search className="h-4 w-4" />
              Search all questions
            </Link>
          ) : null}
          <div
            className={`status-chip status-chip--${isReadOnly ? 'idle' : saveState.tone}`}>
            <Sparkles className="h-4 w-4" />
            {isReadOnly ? 'Read-only' : saveState.message}
          </div>
          <ThemeToggle />
        </div>
      </header>

      {searchPanel}

      <section className="tag-main__meta">
        {isCorpus ? (
          <>
            <span>
              <strong>Collection:</strong> {document.folderKey}
            </span>
            <span>
              <strong>Source papers:</strong> {document.sections.length}
            </span>
            <span>
              <strong>Mode:</strong> combined editable results
            </span>
          </>
        ) : (
          <>
            <span>
              <strong>Source file:</strong> {document.relativePath}
            </span>
            <span>
              <strong>School:</strong> {document.meta.schoolId ?? 'unknown'}
            </span>
            <span>
              <strong>Paper ID:</strong> {document.meta.paperId ?? 'missing'}
            </span>
          </>
        )}
      </section>

      <section className="review-mode-bar" aria-label="Tag review controls">
        <div
          className="review-mode-tabs"
          role="tablist"
          aria-label="Review mode">
          <button
            aria-selected={mode === 'question'}
            className={
              mode === 'question'
                ? 'review-mode-tab review-mode-tab--active'
                : 'review-mode-tab'
            }
            onClick={() => setMode('question')}
            role="tab"
            type="button">
            <FileText aria-hidden="true" className="h-4 w-4" />
            Question tags
          </button>
          <button
            aria-selected={mode === 'image'}
            className={
              mode === 'image'
                ? 'review-mode-tab review-mode-tab--active'
                : 'review-mode-tab'
            }
            onClick={() => setMode('image')}
            role="tab"
            type="button">
            <ImageIcon aria-hidden="true" className="h-4 w-4" />
            Image tags
            <span>{document.imageOccurrences.length}</span>
          </button>
        </div>

        <div className="review-mode-view-controls">
          {mode === 'image' ? (
            <details className="tag-view-menu">
              <summary>
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                View options
              </summary>
              <div className="tag-view-menu__panel">
                <div className="tag-view-option">
                  <span>
                    <strong>Only questions with images</strong>
                    <small>
                      Hide unrelated questions from the page and navigation.
                    </small>
                  </span>
                  <Switch
                    aria-label="Only questions with images"
                    checked={imageNodesOnly}
                    onCheckedChange={setImageNodesOnly}
                  />
                </div>
              </div>
            </details>
          ) : null}
          <label className="image-version-control">
            <span>Image versions</span>
            <select
              onChange={event =>
                setPaperImageMode(event.target.value as PaperImageMode)
              }
              value={paperImageMode}>
              <option value="all">All related assets</option>
              <option value="prepared">Prepared preferred</option>
            </select>
          </label>
          {pdf?.state === 'available' ? (
            <button
              aria-pressed={showPdf}
              className={
                showPdf ? 'pdf-toggle pdf-toggle--active' : 'pdf-toggle'
              }
              onClick={() => setShowPdf(current => !current)}
              type="button">
              <PanelRight aria-hidden="true" className="h-4 w-4" />
              {showPdf ? 'PDF shown' : 'Show original PDF'}
            </button>
          ) : pdf?.state === 'unavailable' ? (
            <span className="pdf-unavailable-note" role="status">
              Original PDF unavailable
            </span>
          ) : null}
        </div>
      </section>

      <Separator />

      <div
        className={
          showPdf && pdf?.state === 'available'
            ? 'tag-workspace-grid tag-workspace-grid--with-pdf'
            : 'tag-workspace-grid'
        }>
        {mode === 'question' ? (
          <NodeDocument
            document={document}
            onDocumentChange={updateDocument}
            onDocumentRefresh={source => refreshDocument({ source })}
            onSaveStateChange={setSaveState}
            paperImageMode={paperImageMode}
            readOnly={isReadOnly}
            tagCatalog={tagCatalog}
          />
        ) : (
          <ImageTagDocument
            catalog={imageTagCatalog}
            document={document}
            imageNodesOnly={imageNodesOnly}
            onDocumentChange={updateDocument}
            onDocumentRefresh={source => refreshDocument({ source })}
            onSaveStateChange={setSaveState}
            paperImageMode={paperImageMode}
            readOnly={isReadOnly}
          />
        )}
        {showPdf && pdf?.state === 'available' ? (
          <PaperPdfPane onHide={() => setShowPdf(false)} pdf={pdf} />
        ) : null}
      </div>
    </main>
  );
}
