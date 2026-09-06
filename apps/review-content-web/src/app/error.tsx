'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="route-message">
      <p className="eyebrow">Review interrupted</p>
      <h1>The live paper could not be prepared.</h1>
      <p>
        Check the terminal for the source or asset contract error, then retry
        without regenerating Markdown.
      </p>
      <button onClick={unstable_retry} type="button">
        Try again
      </button>
    </main>
  );
}
