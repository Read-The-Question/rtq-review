import Link from 'next/link';

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`masthead${compact ? ' masthead--compact' : ''}`}>
      <Link className="wordmark" href="/" aria-label="RTQ Review Content home">
        <span aria-hidden="true">RTQ</span>
        <span>Review content</span>
      </Link>
      <div className="masthead-status">
        <span className="read-only-dot" aria-hidden="true" />
        Direct source · read only
      </div>
    </header>
  );
}
