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

Open `http://localhost:3005/docs`, then choose a repository in the sidebar. For
example:

- `/docs/rtq-review/apps/review-tag-web/README`
- `/docs/rtq-review/apps/docs-web/docs/architecture/fumadocs-architecture`
- `/docs/rtq-content/packages/assets/docs/architecture/paper-assets`
- `/docs/rtq-env/docs/environment-manifest`
- `/docs/rtq-web/apps/web/docs/architecture/frontend/routing`

While the development server is running, edits, additions, renames, and
deletions beneath any allowlisted source are reflected without copying content,
running a content-generation command, or restarting the server. Fumadocs
regenerates its source index for structural changes, while Next.js invalidates
compiled Markdown dependencies and refreshes connected development browsers.

Development uses Next.js' default Turbopack mode. `next.config.mjs` sets its
filesystem root to the common `Read-The-Question` directory so the active
`rtq-content`, `rtq-env`, `rtq-review`, and `rtq-web` working trees are all
inside the watched boundary. This reads only the current checkouts; it creates
no branch catalogue, history, snapshot, or maintained documentation copy.

The production build continues to select Webpack explicitly because the
current Fumadocs macro loader does not complete under a Turbopack production
build. Production output is static and must be rebuilt after documentation
changes; live updates apply to `next dev`, not `next start`.

`source.config.ts` preserves raw HTML-like fragments as visible text before
Fumadocs builds its table of contents. This allows existing Markdown
placeholders such as `<tag>` to render without changing the source documents.

## Checks

```sh
pnpm --filter rtq-docs-web format:check
pnpm --filter rtq-docs-web lint:check
pnpm --filter rtq-docs-web types
pnpm --filter rtq-docs-web test
pnpm --filter rtq-docs-web test:live-reload
pnpm --filter rtq-docs-web build
```

`test:live-reload` starts RTQ Docs on an available local port and creates one
uniquely named temporary Markdown file in the sibling `rtq-env/docs` folder. It
automatically verifies add, edit, rename, delete, page-content, and navigation
invalidation, then removes the temporary file and stops the server even if the
check fails. Set `RTQ_DOCS_LIVE_RELOAD_REPOSITORY` to another checkout with the
same configured `rtq-env` route when the repositories are stored elsewhere.
