'use client';

import { PanelRightClose } from 'lucide-react';

import type { PaperPdf } from '@/lib/paper-pdf';

export function PaperPdfPane({
  onHide,
  pdf,
}: {
  onHide: () => void;
  pdf: Extract<PaperPdf, { state: 'available' }>;
}) {
  return (
    <aside className="paper-pdf-pane" aria-label="Original paper PDF">
      <header className="paper-pdf-pane__header">
        <div>
          <span>Original paper</span>
          <strong title={pdf.fileName}>{pdf.fileName}</strong>
        </div>
        <button onClick={onHide} type="button">
          <PanelRightClose aria-hidden="true" className="h-4 w-4" />
          Hide PDF
        </button>
      </header>
      <iframe
        loading="lazy"
        src={`${pdf.url}#view=FitH`}
        title={`Original paper PDF: ${pdf.fileName}`}
      />
    </aside>
  );
}
