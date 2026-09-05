import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="rtq-shell">
      <section className="rtq-empty-state">
        <h1>Review page not found.</h1>
        <p>
          The file may have been removed or moved out of the copied markdown
          workspace.
        </p>
        <Link href="/" className="rtq-back-link">
          Return to all review sections
        </Link>
      </section>
    </main>
  );
}
