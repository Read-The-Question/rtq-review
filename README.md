# RTQ review

`rtq-review` is the private pnpm workspace for RTQ's internal review tools.

The living [review outcome workflow](docs/architecture/review-outcome-workflow.md)
documents how a state-scoped decision moves from Review Content Web through the
shared database and into canonical paper TOML during an operator-controlled
sync.

All review renderers share the authoring meanings and conformance inventory in
the canonical
[RTQ KaTeX Semantic Colour Architecture](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/design-system/katex-semantic-colours.md).
Application-local documentation should link there rather than define another
maths-colour macro catalogue.

## Applications

- [`apps/docs-web`](apps/docs-web) is the internal Fumadocs application for
  reading selected documentation directly from the active RTQ repository
  working trees.
- [`apps/review-content-web`](apps/review-content-web) is the direct-content
  Next.js reviewer and the primary review application. It reads paper TOML
  from the active `rtq-content` checkout without generated Markdown, submits
  outcomes and append-only comments to the shared SQLite database, and keeps a
  separate product-wide findings inbox there as well.
- [`apps/review-tag-web`](apps/review-tag-web) is the maintained Next.js
  application for reviewing and editing tags directly in canonical paper TOML.
- [`apps/review-question-viewer-web`](apps/review-question-viewer-web) is the
  maintained Next.js application for displaying one selected canonical paper
  question.

Content Review and Tag Review accept occurrence-local
`PaperImage renderMode="inline"|"external"` in questions, workings and answers,
including nested content. Omission requests external delivery. Their preferred
artifact (generated when present, otherwise manual) must match that request;
invalid values, stale delivery and inline raster/missing assets produce
preparation errors. Comparison references retain their own recorded delivery,
so an original external PNG can remain beside an inline generated SVG.

Diagram delivery is generated from the exact occurrence in canonical
`rtq-content/packages/papers/papers/toml`, never from a derived review collection.
Editing TOML does not regenerate assets automatically. Explicitly regenerate
diagrams and refresh their technical manifests before reviewing the new mode;
do not edit delivery into `.diagram.json` inputs or generated sidecars.
Question Viewer retains its separate manual/external-only image renderer;
generated and inline diagram parity there is not part of this delivery change.

## Setup

From the repository root:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
```

The workspace uses Node `24.19.0` and pnpm `10.15.1`.

The three maintained Next.js reviewers resolve a sibling `../rtq-content`
checkout from this workspace root. For a different layout, set
`RTQ_CONTENT_ROOT` to the whole `rtq-content` Git root. Absolute values are
accepted; relative values are resolved from this `rtq-review` workspace, not
from the command's current directory. The resolver validates
`@rtq/content-workspace`, `@rtq/papers`, and `@rtq/maths-assets` before use and
derives papers and assets from that one checkout.

Review Content Web exposes canonical paper TOML, the eight generated focus,
topic, and RAG collections, and exemplar tiers. Its five dimensional tag axes
use OR matching within an axis and AND matching across axes. Question and
answer RAG-state filters are independent. Filter state is encoded in the URL,
while display preferences are remembered in browser storage; Reset filters
clears both. Source TOML remains read-only: review outcomes and contextual
append-only comments go to the SQLite database. The main database is committed
with `rtq-review` so its feedback can be read on other machines; SQLite journal,
WAL, and SHM sidecars remain ignored.

Run an application from the workspace root on its assigned port:

```sh
pnpm review-content-web:dev          # http://localhost:3001
pnpm review-tag-web:dev              # http://localhost:3002
pnpm review-question-viewer-web:dev  # http://localhost:3003
pnpm docs-web:dev                    # http://localhost:3004/docs
```

Port `3000` remains reserved for the main RTQ website. Review Content Web uses
`3001`, Review Tag Web uses `3002`, Review Question Viewer uses `3003`, and
Docs Web uses `3004`. See each application README for its content, asset, and
runtime prerequisites.

The same applications can be started from the workspace root:

```sh
pnpm docs-web:dev
pnpm review-content-web:dev
pnpm review-tag-web:dev
pnpm review-question-viewer-web:dev
```

The maintained Next.js commands use workspace-installed Node dependencies.
