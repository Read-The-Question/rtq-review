# RTQ Tag Review Web

Internal Next.js application for browsing RTQ maths-paper TOML and reviewing
or editing question tags. It reads canonical `@rtq/papers` and
`@rtq/maths-assets` from one validated `rtq-content` checkout.

Use the
[RTQ development environment bootstrap](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-web-bootstrap.md)
for the complete review-stack setup and startup sequence, and the
[RTQ repository landscape](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-repository-landscape.md)
for the direct TOML edit and canonical-asset ownership boundaries.
Its KaTeX macro path and current semantic-colour conformance are recorded in the
[RTQ KaTeX Semantic Colour Architecture](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/design-system/katex-semantic-colours.md).

## Requirements

- Node.js 24.19.0 (declared by the `rtq-review` workspace root)
- Corepack with pnpm 10.15.1
- A compatible sibling `rtq-content` checkout, or `RTQ_CONTENT_ROOT` set to
  that Git root

With nvm, run `nvm install` on first use and `nvm use` from the workspace root
later. Otherwise select Node 24.19.0 with your version manager. Enable the
package manager shim once on a new machine, then install the locked workspace
dependencies:

```bash
cd /path/to/rtq-review
corepack enable
pnpm install --frozen-lockfile
```

## Local use

```bash
cd /path/to/rtq-review/apps/review-tag-web
pnpm dev --port 3001
```

Open `http://localhost:3001`. The shared `@rtq/papers` review stack starts this
workspace application on the same port.

PaperImage binaries, sidecars, technical manifests, and generated LongDivision
sources are read directly from `@rtq/maths-assets`. The browser receives only
allowlisted external PaperImage binaries through the app's same-origin route;
JSON metadata and generated LongDivision sources remain non-public, with
LongDivision prepared inline by the canonical asset-repository command. No
paper assets are mirrored into this repository's `public/` tree.

## Checks and production build

```bash
pnpm format:check
pnpm lint:check
pnpm types
pnpm test
pnpm build
```

Use `pnpm format:fix` and `pnpm lint:fix` for the corresponding safe automatic
fixes.
