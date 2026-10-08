import type { ReactNode } from 'react';

import { ThemeToggle } from './theme-toggle.tsx';

export function PaperBrowserFrame({
  appLabel,
  children,
  connectionDetail,
  connectionLabel,
  connectionTone,
  eyebrow,
  heading,
  homeHref = '/',
  status,
  summary,
}: {
  appLabel: string;
  children: ReactNode;
  connectionDetail: string;
  connectionLabel: string;
  connectionTone: 'ready' | 'warning';
  eyebrow: string;
  heading: string;
  homeHref?: string;
  status: ReactNode;
  summary: string;
}) {
  return (
    <main className="paper-browser-shell" id="top">
      <header className="paper-browser-masthead">
        <a
          aria-label={`${appLabel} home`}
          className="paper-browser-wordmark"
          href={homeHref}
        >
          <span aria-hidden="true">RTQ</span>
          <span>{appLabel}</span>
        </a>
        <div className="paper-browser-masthead-controls">
          <div className="paper-browser-masthead-status">
            <span className="paper-browser-status-dot" aria-hidden="true" />
            {status}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="paper-browser-intro">
        <div>
          <p className="paper-browser-eyebrow">{eyebrow}</p>
          <h1>{heading}</h1>
          <p className="paper-browser-summary">{summary}</p>
        </div>
        <aside
          className={`paper-browser-connection paper-browser-connection--${connectionTone}`}
        >
          <span className="paper-browser-connection-light" aria-hidden="true" />
          <div>
            <p>{connectionLabel}</p>
            <span>{connectionDetail}</span>
          </div>
        </aside>
      </section>

      {children}
    </main>
  );
}

export function PaperBrowserSecondaryNavigation({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <nav className="paper-browser-secondary-navigation" aria-label={label}>
      <p>{label}</p>
      {children}
    </nav>
  );
}

export function PaperBrowserSecondaryLink({
  action,
  children,
  href,
}: {
  action: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <a className="paper-browser-secondary-link" href={href}>
      <span>{children}</span>
      <strong>{action}</strong>
    </a>
  );
}

export function PaperBrowserUnavailable({ detail }: { detail: string }) {
  return (
    <section className="paper-browser-unavailable" aria-live="polite">
      <p className="paper-browser-eyebrow">Paper index unavailable</p>
      <h2>Connect a complete rtq-content checkout.</h2>
      <p>{detail}</p>
    </section>
  );
}
