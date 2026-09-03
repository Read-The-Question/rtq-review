---
title: Fumadocs architecture
description: How RTQ Docs turns allowlisted Markdown from RTQ working trees into one documentation website.
---

RTQ Docs is an internal Next.js application assembled from the standard
Fumadocs project scaffold. Fumadocs supplies the documentation compiler, source
model, search integration, and user interface; Next.js supplies the application
runtime and routes. RTQ-specific configuration decides which working-tree files
become documentation and where they appear.

## Mental model

The application is deliberately a thin presentation layer over documentation
that remains owned by an RTQ repository or application:

```text
Allowlisted Markdown in an owning working tree
  -> fumadocs-mdx compiles Markdown or MDX
  -> fumadocs-core builds pages, slugs, navigation, and search input
  -> Next.js routes request a page from the combined source
  -> fumadocs-ui renders the page, sidebar, table of contents, and controls
```

There is no maintained copy of a source document in a central content folder,
no database, and no repository-wide Markdown scan. Every published source has
an explicit physical root and an explicit file allowlist.

## Responsibilities

### Next.js

Next.js provides the executable web application. Its App Router maps files in
`src/app` to pages and HTTP endpoints, renders server components, produces the
production build, and watches module dependencies during development.

The optional catch-all route at `src/app/docs/[[...slug]]/page.tsx` renders all
documentation URLs. Adding a documentation source does not require another
page route.

### `fumadocs-mdx`

`fumadocs-mdx` compiles allowlisted Markdown into data and React components.
Each `defineDocs()` declaration identifies a physical owner directory and the
same two allowed patterns: `README.md` and `docs/**/*.md`. These values are
repeated as string literals because the Fumadocs macro discovers publication
boundaries while compiling the application.

The `createMDX()` wrapper in `next.config.mjs` connects this compiler to
Next.js. `source.config.ts` converts raw HTML-like nodes to visible text before
Fumadocs' table-of-contents plugin, preserving placeholders without editing
their owning Markdown files.

### `fumadocs-core`

`fumadocs-core` converts compiled collections into a common source. The source
supports page lookup, stable URL slugs, a page tree, static route generation,
and search indexing.

The source loader in `src/lib/source.ts` combines independently named
collections. Each source keeps a stable key so documents from different
repositories cannot be flattened into one ambiguous path tree.

### `fumadocs-ui`

`fumadocs-ui` supplies the documentation shell and default MDX components. RTQ
Docs uses its navigation, responsive sidebar, search interface, page layout,
table of contents, typography, repository source link, and themes. The
application imports the supplied neutral theme and preset rather than
maintaining a custom documentation design system.

## Standard scaffold and RTQ configuration

The standard `create-fumadocs-app` scaffold supplied the Next.js layouts,
documentation catch-all page, search route, MDX component mapping, styles, and
build configuration. RTQ Docs removes the scaffold's optional LLM exports, raw
Markdown negotiation, generated Open Graph images, and unused navigation-icon
integration because they are not required for internal documentation browsing.

RTQ-specific code is concentrated in a few places:

| Location                                                  | RTQ responsibility                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Location                                                  | RTQ responsibility                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------  |
| `src/lib/documentation-sources.ts`                        | Owner identity, physical and repository paths, allowlists, labels, and path translation     |
| `src/lib/source.ts`                                       | Explicit Fumadocs collections, combined loader, navigation labels, titles, and source links |
| `source.config.ts`                                        | Preserve raw HTML-like fragments as visible documentation text                              |
| `src/app/docs/[[...slug]]/page.tsx`                       | Looks up and renders any page from the combined source                                      |
| `src/lib/__tests__/documentation-sources.test.ts`         | Inventory, inclusion, exclusion, hierarchy, route, and repository-path checks               |
| `package.json`                                            | Development, validation, and production commands                                            |

An owner's `README.md` and Markdown beneath its `docs/` folder are sources.
`AGENTS.md`, `CLAUDE.md`, source code, build output, and Markdown in any other
folder remain excluded. An old or AI-related document is still included when
it already lives beneath an approved `docs/` boundary; deciding whether it
should be moved or deleted is separate work in the owning repository.

## From a file to a page

For this document, the mappings are:

```text
Physical file
apps/docs-web/docs/architecture/fumadocs-architecture.md

Virtual Fumadocs path
rtq-review/apps/docs-web/docs/architecture/fumadocs-architecture.md

Public page
/docs/rtq-review/apps/docs-web/docs/architecture/fumadocs-architecture
```

The route retains the repository and workspace ownership path. Page-tree
transformers independently present friendly labels such as `RTQ Review`,
`Apps`, `RTQ Docs`, and `Docs`, while the source-relative
`architecture/fumadocs-architecture.md` hierarchy remains beneath them.

When a browser requests the public URL, the documentation catch-all route:

1. Awaits the Next.js route parameters.
2. Looks up the slug in the combined Fumadocs source.
3. Returns `notFound()` when the slug is not allowlisted.
4. Renders the compiled MDX component in the standard `DocsPage`.
5. Supplies the generated table of contents and repository source URL.

The parent documentation layout passes `source.getPageTree()` to the standard
`DocsLayout`. Consequently, all registered sources share one application and
search endpoint while retaining separate top-level navigation roots.

## Routes derived from the source

| Route               | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `/`                 | Redirect to `/docs`                             |
| `/docs`             | Documentation shell and complete navigation     |
| `/docs/[[...slug]]` | HTML page for any configured document           |
| `/api/search`       | Search across every page in the combined source |

These are shared routes: registering another source supplies more page data,
not another copy of the route set.

## Adding a documentation source

A new source needs the following decisions before code is changed:

1. Choose a stable source key and ownership route composed from repository,
   `apps` or `packages` where applicable, and the filesystem owner name.
2. Choose a human-readable label independently from that stable route.
3. Identify the physical owner directory relative to RTQ Docs.
4. Record the owning Git repository, default branch, and repository-relative
   directory so source links are correct.
5. Use only the conventional `README.md` and `docs/**/*.md` allowlist unless a
   later requirement explicitly changes the convention.
6. Preserve the source-relative hierarchy; README remains an explicit
   `README.md` item and `docs/` remains an explicit `Docs` section.
7. Add inclusion, exclusion, path, route, build, and live-update validation.

The source descriptor belongs in `src/lib/documentation-sources.ts`. A matching
`defineDocs()` collection belongs in `src/lib/source.ts`. The collection is
converted with its full ownership route as `baseDir` and then added to the
existing `loader()` source map. The shared catch-all page, documentation
layout, and search route require no duplication.

The macro directory and file patterns are intentionally explicit literals. A
small amount of repeated declaration is preferable to hiding publication
boundaries behind dynamic discovery that the compiler cannot verify.

### Source in `rtq-review`

For another application in this workspace, the collection directory points to
the owner root relative to `apps/docs-web`, for example `../review-web`. Only
its root README and Markdown beneath its `docs/` folder are published. Files
elsewhere in `apps/review-web` remain invisible.

### Source in a sibling repository

For `rtq-content`, `rtq-env`, or `rtq-web`, the source directory points to that
repository's working tree using the agreed sibling-checkout layout. The
repository must be present at that location whenever RTQ Docs starts or builds.
Fumadocs reads local files; it does not clone repositories or authenticate with
Git hosting.

A deployed build must therefore check out or mount every configured repository
before running the documentation build. Changing the checkout layout requires
updating the declared physical paths or introducing a separately approved path
configuration strategy.

## Live updates and production builds

The development command uses Next.js' default Turbopack mode. Its filesystem
root is the common `Read-The-Question` directory, which contains the docs app
and every selected sibling repository. Without this boundary Turbopack can read
content discovered by the Fumadocs macro but cannot reliably track an external
file as a watched dependency.

Fumadocs already supplies the required development watcher. It registers each
configured collection, filters events through that collection's explicit file
patterns, regenerates its generated source index after additions, renames, or
deletions, coalesces overlapping regeneration work, reports initialization
failures, prevents duplicate initialization, and closes the watcher when the
process exits. Next.js tracks the compiled Markdown modules and sends its
normal development refresh to connected browsers after invalidation. A custom
watcher, server-sent-event route, and client refresh component would duplicate
those responsibilities, so none are present.

Only `README.md` and `docs/**/*.md` enter the Fumadocs collections. Changes to
dependency folders, build output, agent instructions, planning files, and
other unrelated Markdown do not alter content or navigation. The sources are
always read from the active local working trees; there is no branch catalogue,
version history, snapshot, or copied content.

The production command retains the known-good Webpack path because the current
Fumadocs macro loader did not complete under the Turbopack production build in
this environment. This does not affect Turbopack development live reload.
`generateStaticParams()` enumerates the configured pages and Next.js emits
static documentation at build time. A long-running `next start` process does
not observe later working-tree edits, so production freshness requires a new
build and deployment.

The automated `test:live-reload` integration check starts the development
server on an available local port and exercises a unique temporary file in the
external `rtq-env/docs` source. It verifies additions, content changes, renames,
deletions, and both page and navigation invalidation, with cleanup in a
`finally` block.

## Validation checklist

For every added source:

- Confirm that included files resolve beneath the intended physical root.
- Confirm that files outside the allowlist return no page.
- Confirm the visible source label and stable URL namespace.
- Confirm nested paths remain nested beneath the source root.
- Confirm repository source links point to the owning repository and branch.
- Run `pnpm --filter rtq-docs-web test:live-reload` to verify external add,
  edit, rename, delete, page-content, and navigation invalidation.
- Run formatting, lint, type, automated test, and production-build checks.

This keeps RTQ Docs extensible while preserving the central rule: the website
presents explicitly selected documentation from its owning working tree and
does not become another maintained copy of that documentation.
