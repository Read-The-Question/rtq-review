import Link from 'next/link';

import { readReviewMacros } from '@rtq/review-paper-model';

import { MacroReviewList } from '@/components/macro-review-list';
import { SiteHeader } from '@/components/site-header';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function MacrosPage() {
  let macroDocument;

  try {
    macroDocument = await readReviewMacros();
  } catch {
    return (
      <main className="paper-shell">
        <SiteHeader compact />
        <section className="route-message">
          <p className="eyebrow">Reference unavailable</p>
          <h1>macros.toml could not be loaded.</h1>
          <p>
            Check that the active rtq-content checkout contains the canonical
            paper macro file.
          </p>
          <Link href="/">Return to the paper index</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="paper-shell macro-paper" id="macro-top">
      <SiteHeader compact />
      <header className="paper-hero">
        <div className="paper-breadcrumb">
          <Link href="/">Paper index</Link>
          <span>/</span>
          <span>Macros</span>
        </div>
        <div className="paper-title-row">
          <div>
            <p className="eyebrow">Read-only reference</p>
            <h1>Paper macros</h1>
            <code>{macroDocument.repositoryPath}</code>
          </div>
          <dl className="paper-metadata">
            <div>
              <dt>Macros</dt>
              <dd>{macroDocument.entries.length}</dd>
            </div>
            <div>
              <dt>File</dt>
              <dd>TOML</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>Read only</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>rtq-content</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="macro-document" aria-labelledby="macro-list-title">
        <div className="macro-document-heading">
          <div>
            <p className="eyebrow">One file · one review view</p>
            <h2 id="macro-list-title">Expanded macros</h2>
            <p>
              Each entry shows the content produced when the macro is used in a
              paper.
            </p>
          </div>
          <details className="macro-file-source">
            <summary>Show complete raw file</summary>
            <pre>{macroDocument.rawSource}</pre>
          </details>
        </div>

        <MacroReviewList entries={macroDocument.entries} />
      </section>

      <footer className="paper-footer">
        <span>{macroDocument.fileName} · direct from the working tree</span>
        <a href="#macro-top">Back to top</a>
      </footer>
    </main>
  );
}
