# RTQ Docs Web

Internal Fumadocs application for reading selected documentation directly from
the active RTQ repository working trees.

## Current sources

The `Review - Tag` section reads
[`../review-tag-web/README.md`](../review-tag-web/README.md) directly. The
`RTQ Docs` section reads Markdown beneath [`docs`](docs) directly. The Fumadocs
source configuration allowlists those locations; it does not scan or expose
`AGENTS.md`, `CLAUDE.md`, the application-level `README.md`, or other Markdown
outside the configured roots.

No maintained documentation copy is stored in this app. Fumadocs' generated
`.source` output is reproducible and ignored by Git.

## Functional routes

- `/` provides the internal landing page.
- `/docs/[[...slug]]` renders every configured documentation page.
- `/api/search` searches the combined documentation source.

The application deliberately omits machine-readable documentation exports,
raw-Markdown negotiation, and generated social preview images. Each rendered
page retains a link to its owning repository source.

## Local use

From the repository root:

```sh
pnpm docs-web:dev
```

Open `http://localhost:3003/docs/review-tag` or
`http://localhost:3003/docs/rtq-docs/architecture/fumadocs-architecture`.

While the development server is running, edit
`apps/review-tag-web/README.md`. The page should update without running a
content-generation command or restarting the server.

The development and production scripts use Next.js' supported Webpack mode.
That mode tracks the allowlisted Markdown file as a module dependency, so an
edit invalidates the rendered page. The current Turbopack integration serves
the external file but does not reliably invalidate it after an edit.

## Checks

```sh
pnpm --filter rtq-docs-web format:check
pnpm --filter rtq-docs-web lint:check
pnpm --filter rtq-docs-web types
pnpm --filter rtq-docs-web test
pnpm --filter rtq-docs-web build
```
