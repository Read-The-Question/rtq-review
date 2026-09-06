import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="route-message">
      <p className="eyebrow">Paper not found</p>
      <h1>This source is not in the review index.</h1>
      <p>The route may be stale, unsafe, or outside an allowed collection.</p>
      <Link href="/">Return to the paper index</Link>
    </main>
  );
}
