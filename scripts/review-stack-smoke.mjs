import assert from "node:assert/strict";

const targets = [
  {
    label: "Review Content Web",
    pattern: /Choose a paper/,
    url: process.env.RTQ_REVIEW_CONTENT_URL ?? "http://127.0.0.1:3001/",
  },
  {
    label: "Review Markdown Web",
    pattern: /Read The Question/,
    url: process.env.RTQ_REVIEW_MARKDOWN_URL ?? "http://127.0.0.1:3004/",
  },
  {
    label: "RTQ Docs Web",
    pattern: /RTQ Docs/,
    url: process.env.RTQ_REVIEW_DOCS_URL ?? "http://127.0.0.1:3005/docs",
  },
];

for (const target of targets) {
  const response = await fetch(target.url, {
    signal: AbortSignal.timeout(30_000),
  });
  const body = await response.text();

  assert.equal(
    response.status,
    200,
    `${target.label} returned ${response.status} from ${target.url}`,
  );
  assert.match(
    body,
    target.pattern,
    `${target.label} did not return its expected page from ${target.url}`,
  );

  console.log(`PASS ${target.label}: ${target.url}`);
}
