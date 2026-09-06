# RTQ Review Content Web

Internal Next.js application for reviewing RTQ paper content directly from the
active `rtq-content` checkout. Unlike Review Markdown Web, this application does
not consume generated Markdown. Paper content is always read-only; review
outcomes use `review-api` and Google Sheets while comments remain machine-local.

The application currently provides collection and file browsing, full nested
paper presentation, five-axis runtime tag filters, independent question and
answer content-RAG filters, rendered and raw content views, allowlisted
canonical paper assets, Google Sheets outcome submission, and local append-only
review comments.

Its direct-TOML KaTeX macro path and current semantic-colour conformance are
recorded in the canonical
[RTQ KaTeX Semantic Colour Architecture](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/design-system/katex-semantic-colours.md).

## Requirements

- Node.js 24.19.0 and pnpm 10.15.1 from the workspace root
- A sibling `../rtq-content` checkout, or `RTQ_CONTENT_ROOT` set to a complete
  `rtq-content` Git root
- The local `review-api` service at `http://localhost:4567`, or
  `RTQ_REVIEW_API_BASE_URL` set to its server-only URL

`RTQ_REVIEWER` sets the short reviewer identity sent with outcomes and recorded
with comments; it defaults to `up` and accepts letters, numbers, dots,
underscores, and hyphens.

## Local use

From the `rtq-review` workspace root:

```bash
pnpm review-content-web:dev
```

Open `http://localhost:3004`.

The paper index reads the current working tree on each refresh. A selected paper
uses a stable route shaped as `/papers/<collection>/<source-relative-path>`.

## Review controls

- Combine tags within any of the five dimensions and filter question and answer
  content-RAG states independently. The shared URL preserves the complete
  filter scope across refreshes, along with the active matching question.
- Use **Clear all** to reset both state facets, all five tag dimensions, and the
  active question while retaining unrelated display parameters.
- Use the display strip to show or hide workings and answers, dimensional tags,
  raw TOML values, and the review-status panel. Use **Show everything** to reveal
  immutable feedback from RAG states other than the current state; it is off by
  default. Display preferences stay in local browser storage.
- Use the Previous/Next controls or `J`/`K` (`Alt` + arrow keys also work) to
  move through matching top-level question trees.
- All TOML and assets remain read-only. The asset route exposes only question
  images, manual working/answer images, and generated long-division SVGs.

## Review persistence

Question and answer outcomes are submitted to Google Sheets through the local
`review-api`; the UI labels successful submissions as such and keeps the new
outcome visible for the current browser session. Canonical TOML remains the
cross-reload outcome source after the existing Sheets synchronization runs.

Comments never call `review-api`. They are appended through Drizzle to
`<rtq-content>/database/review-content.sqlite` on this machine. Every question,
subquestion, and sub-subquestion uses its own UUID for feedback; its own
`rtq-question-id` is retained only when present. Nested nodes inherit only the
corresponding question or answer RAG state from their containing top-level
question. Current-state comments appear against their exact node by default;
**Show everything** also reveals earlier-state history. All comments are
read-only after creation, with no edit, delete, or reset route. The database,
journal, WAL, and SHM files are ignored by the content repository and are not
backed up by Git; back up the database file separately if this local review
history must be retained.

## Checks and production build

```bash
pnpm --filter rtq-review-content-web format:check
pnpm --filter rtq-review-content-web lint:check
pnpm --filter rtq-review-content-web types
pnpm --filter rtq-review-content-web test
pnpm --filter rtq-review-content-web database:ignore:check
pnpm --filter rtq-review-content-web build
```

With the dev server running, the representative live-content route smoke test
is available as:

```bash
pnpm --filter rtq-review-content-web test:browser
```
