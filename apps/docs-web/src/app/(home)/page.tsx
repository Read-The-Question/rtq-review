import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">RTQ Docs</h1>
      <p>
        Open the{" "}
        <Link href="/docs/review-tag" className="font-medium underline">
          Review - Tag documentation
        </Link>
        {" or "}
        <Link
          href="/docs/rtq-docs/architecture/fumadocs-architecture"
          className="font-medium underline"
        >
          RTQ Docs architecture
        </Link>
        , both sourced directly from their owning workspace folders.
      </p>
    </div>
  );
}
