'use client';

import { PanelRightClose } from 'lucide-react';

import type { PaperPdf, PaperPdfOption } from '@/lib/paper-pdf';

export function PaperPdfPane({
  onHide,
  onSelect,
  options,
  pdf,
  selectedKey,
}: {
  onHide: () => void;
  onSelect: (key: string) => void;
  options: readonly PaperPdfOption[];
  pdf: Extract<PaperPdf, { state: 'available' }>;
  selectedKey: string;
}) {
  return (
    <aside className="paper-pdf-pane" aria-label="Original paper PDF">
      <header className="paper-pdf-pane__header">
        <div>
          <span>Original paper</span>
          {options.length > 1 ? (
            <select
              aria-label="Original paper PDF"
              onChange={event => onSelect(event.target.value)}
              value={selectedKey}>
              {options.map(option => (
                <option
                  disabled={option.pdf.state === 'unavailable'}
                  key={option.key}
                  value={option.key}>
                  {option.label}
                  {option.label === option.key ? '' : ` — ${option.key}`} ·{' '}
                  {option.matchCount}{' '}
                  {option.matchCount === 1 ? 'question' : 'questions'}
                  {option.pdf.state === 'unavailable' ? ' · unavailable' : ''}
                </option>
              ))}
            </select>
          ) : (
            <strong title={pdf.fileName}>{pdf.fileName}</strong>
          )}
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
