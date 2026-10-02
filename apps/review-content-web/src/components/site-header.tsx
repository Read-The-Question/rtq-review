import Link from 'next/link';

export function SiteHeader({
  compact = false,
  showReviewStorage = false,
}: {
  compact?: boolean;
  showReviewStorage?: boolean;
}) {
  return (
    <header className={`masthead${compact ? ' masthead--compact' : ''}`}>
      <Link className="wordmark" href="/" aria-label="RTQ Review Content home">
        <span aria-hidden="true">RTQ</span>
        <span>Review content</span>
      </Link>
      <div className="masthead-status">
        <span className="read-only-dot" aria-hidden="true" />
        <span>Direct source · read only</span>
        {showReviewStorage ? (
          <>
            <span aria-hidden="true">·</span>
            <span>Outcomes & comments → local SQLite</span>
          </>
        ) : null}
      </div>
    </header>
  );
}
