import Link from 'next/link';

import { ReviewRuntime } from '@/components/review-runtime';
import { rtqPaths } from '@/lib/rtq-config';
import { listContentSections } from '@/lib/rtq-content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sections = await listContentSections();

  return (
    <>
      <ReviewRuntime watchMode="home" />
      <main className="rtq-shell">
        <div className="rtq-page-header">
          <div>
            <p className="rtq-eyebrow">Internal Review Workspace</p>
            <h1>Read The Question</h1>
            <p className="rtq-subtitle">
              Runtime-indexed markdown review pages with local review actions
              and live content refresh.
            </p>
          </div>
        </div>

        {sections.length === 0 ? (
          <section className="rtq-empty-state">
            <h2>No review files are currently loaded.</h2>
            <p>
              Copy generated markdown families into{' '}
              <code>{rtqPaths.contentRoot}</code> and this page will populate on
              the next refresh or watcher event.
            </p>
          </section>
        ) : (
          <div className="rtq-section-grid">
            {sections.map(section => (
              <section key={section.key} className="rtq-section-card">
                <div className="rtq-section-heading">
                  <div>
                    <p className="rtq-section-key">{section.key}</p>
                    <h2>{section.label}</h2>
                  </div>
                  <span className="rtq-section-count">
                    {section.documents.length}{' '}
                    {section.documents.length === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <ul className="rtq-document-list">
                  {section.documents.map(document => (
                    <li key={document.slug}>
                      <Link
                        href={document.slugPath}
                        className="rtq-document-link">
                        <span className="rtq-document-title">
                          {document.title}
                        </span>
                        <span className="rtq-document-meta">
                          {document.rawQuestionCount
                            ? `${document.rawQuestionCount} question${
                                document.rawQuestionCount === '1' ? '' : 's'
                              }`
                            : 'Open review page'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
