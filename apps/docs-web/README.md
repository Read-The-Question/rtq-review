# RTQ Docs Web

Internal Fumadocs application for reading selected documentation directly from
the active RTQ repository working trees.

## Current sources

The navigation mirrors the four RTQ repositories and their current workspace
ownership:

- `rtq-content`: the repository README plus the `assets` and `papers` package
  READMEs and documentation folders;
- `rtq-env`: the repository README and documentation folder;
- `rtq-review`: the repository README, all six application READMEs, the RTQ
  Docs documentation folder, and the registered `repository-paths` package;
- `rtq-web`: the repository README plus the `web` application README and
  documentation folder and the `feature-config` package README.

Each owner is restricted to `README.md` and `docs/**/*.md`. Markdown outside
those paths—including `AGENTS.md`, `CLAUDE.md`, prompts, planning files,
application source content, and legacy content trees—is not scanned. Markdown
already inside an approved `docs/` folder remains visible until it is cleaned
up in its owning repository.

No maintained documentation copy is stored in this app. Fumadocs' generated
`.source` output is reproducible and ignored by Git.

## Functional routes

- `/` redirects to the documentation experience at `/docs`.
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

Open `http://localhost:3003/docs`, then choose a repository in the sidebar. For
example:

- `/docs/rtq-review/apps/review-tag-web/README`
- `/docs/rtq-review/apps/docs-web/docs/architecture/fumadocs-architecture`
- `/docs/rtq-content/packages/assets/docs/architecture/paper-assets`
- `/docs/rtq-env/docs/environment-manifest`
- `/docs/rtq-web/apps/web/docs/architecture/frontend/routing`

While the development server is running, edit any allowlisted source document.
The corresponding page should update without running a content-generation
command or restarting the server.

The development and production scripts use Next.js' supported Webpack mode.
That mode tracks allowlisted Markdown files as module dependencies, so an edit
invalidates the rendered page. The current Turbopack integration serves an
external file but does not reliably invalidate it after an edit.

`source.config.ts` preserves raw HTML-like fragments as visible text before
Fumadocs builds its table of contents. This allows existing Markdown
placeholders such as `<tag>` to render without changing the source documents.

## Checks

```sh
pnpm --filter rtq-docs-web format:check
pnpm --filter rtq-docs-web lint:check
pnpm --filter rtq-docs-web types
pnpm --filter rtq-docs-web test
pnpm --filter rtq-docs-web build
```
