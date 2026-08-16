export default function NotFoundPage() {
  return (
    <main className="not-found-shell">
      <div className="not-found-card">
        <p className="tag-main__eyebrow">Missing route</p>
        <h1>That file route could not be resolved.</h1>
        <p>
          Go back to the index and choose a file from one of the supported TOML
          folders.
        </p>
      </div>
    </main>
  );
}
