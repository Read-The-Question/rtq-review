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

`fumadocs-mdx` compiles allowlisted Markdown and MDX into data and React
components. Each `defineDocs()` declaration identifies a physical directory
and its allowed file patterns. These values are string literals because the
Fumadocs macro discovers them while compiling the application.

The `createMDX()` wrapper in `next.config.mjs` connects this compiler to
Next.js.

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

| Location                                | RTQ responsibility                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/lib/documentation-sources.ts`      | Source identity, physical and repository paths, allowlists, and path translation                       |
| `src/lib/source.ts`                     | Fumadocs collection declarations, combined loader, source-root labels, landing pages, and source links |
| `src/app/docs/[[...slug]]/page.tsx`     | Looks up and renders any page from the combined source                                                 |
| `src/lib/documentation-sources.test.ts` | Inclusion, exclusion, namespace, hierarchy, and repository-path checks                                 |
| `package.json`                          | Development, validation, and production commands                                                       |

The application-level `README.md`, `AGENTS.md`, `CLAUDE.md`, source code, and
build output are not documentation sources. The RTQ Docs-owned source begins at
`apps/docs-web/docs`, so only allowlisted Markdown beneath that boundary is
eligible for publication.

## From a file to a page

For this document, the mappings are:

```text
Physical file
apps/docs-web/docs/architecture/fumadocs-architecture.md

Virtual Fumadocs path
rtq-docs/architecture/fumadocs-architecture.md

Public page
/docs/rtq-docs/architecture/fumadocs-architecture
```

The `rtq-docs` key is stable and machine-oriented. The page-tree transformer
changes its visible root label to `RTQ Docs`. The source-relative
`architecture/fumadocs-architecture.md` hierarchy remains below that root, so
the navigation presents this page in an `Architecture` section.

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
| `/`                 | Small RTQ Docs landing page                     |
| `/docs/[[...slug]]` | HTML page for any configured document           |
| `/api/search`       | Search across every page in the combined source |

These are shared routes: registering another source supplies more page data,
not another copy of the route set.

## Adding a documentation source

A new source needs the following decisions before code is changed:

1. Choose a stable, lowercase source key used in URLs, such as `content`.
2. Choose its human-readable navigation label, such as `Content`.
3. Identify the physical directory relative to the RTQ Docs application.
4. Record the owning Git repository, default branch, and repository-relative
   directory so source links are correct.
5. Define the exact allowed files or globs beneath the physical root.
6. Decide whether one file is the source landing page.
7. Confirm that nested paths should keep their source-relative hierarchy.
8. Add inclusion, exclusion, path, route, build, and live-update validation.

The source descriptor belongs in `src/lib/documentation-sources.ts`. A matching
`defineDocs()` collection belongs in `src/lib/source.ts`. The collection is
converted with `toFumadocsSource({ baseDir: source.key })` and then added to the
existing `loader()` source map. The shared catch-all page, documentation
layout, and search route require no duplication.

The macro directory and file patterns are intentionally explicit literals. A
small amount of repeated declaration is preferable to hiding publication
boundaries behind dynamic discovery that the compiler cannot verify.

### Source in `rtq-review`

For another application in this workspace, the collection directory can use a
path relative to `apps/docs-web`, for example `../review-web/docs`. Only the
configured root and patterns are published. Files elsewhere in
`apps/review-web` remain invisible.

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

The development command uses Next.js Webpack mode. Fumadocs makes each selected
Markdown file a compilation dependency, and Webpack watches those dependencies.
Saving an allowlisted document invalidates its compiled page and updates a
connected development browser without copying content, running a generation
command, or restarting the application.

The current Turbopack integration can initially read the external source but
did not reliably invalidate the rendered page after an external edit during
the proof of fit. For that reason both the development and production scripts
explicitly select supported Webpack mode. No custom filesystem watcher exists.

A production build is different: `generateStaticParams()` enumerates the
configured pages and Next.js emits static documentation at build time. A
long-running `next start` process does not observe later working-tree edits.
Production freshness therefore requires a new build and deployment, or a later
approved runtime compilation and invalidation design. Development live reload
must not be mistaken for production runtime synchronization.

## Validation checklist

For every added source:

- Confirm that included files resolve beneath the intended physical root.
- Confirm that files outside the allowlist return no page.
- Confirm the visible source label and stable URL namespace.
- Confirm nested paths remain nested beneath the source root.
- Confirm repository source links point to the owning repository and branch.
- Edit a representative source while the development server is running and
  verify the rendered page changes without a restart.
- Restore the source and confirm the rendered page changes back.
- Run formatting, lint, type, automated test, and production-build checks.

This keeps RTQ Docs extensible while preserving the central rule: the website
presents explicitly selected documentation from its owning working tree and
does not become another maintained copy of that documentation.
