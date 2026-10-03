'use client';

import { ImageIcon } from 'lucide-react';

import { ImageNodeDocument } from '@/components/node-document';
import type { PaperImageMode } from '@/lib/paper-image-mode';
import type { ImageTagCatalog, PaperDocument } from '@/lib/paper-types';

type SaveState = {
  message: string;
  tone: 'error' | 'idle' | 'saving' | 'success';
};

export function ImageTagDocument({
  catalog,
  document,
  onDocumentChange,
  onDocumentRefresh,
  onSaveStateChange,
  paperImageMode,
  readOnly,
}: {
  catalog: ImageTagCatalog;
  document: PaperDocument;
  onDocumentChange: (document: PaperDocument) => void;
  onDocumentRefresh: (source?: PaperDocument) => Promise<PaperDocument>;
  onSaveStateChange: (state: SaveState) => void;
  paperImageMode: PaperImageMode;
  readOnly: boolean;
}) {
  if (document.imageOccurrences.length === 0) {
    return (
      <section className="document-pane image-document-empty">
        <ImageIcon aria-hidden="true" className="h-7 w-7" />
        <h2>No authored PaperImage occurrences</h2>
        <p>
          Question, working, and answer fields in this paper do not contain an
          editable PaperImage component.
        </p>
      </section>
    );
  }

  return (
    <ImageNodeDocument
      catalog={catalog}
      document={document}
      onDocumentChange={onDocumentChange}
      onDocumentRefresh={onDocumentRefresh}
      onSaveStateChange={onSaveStateChange}
      paperImageMode={paperImageMode}
      readOnly={readOnly}
    />
  );
}
