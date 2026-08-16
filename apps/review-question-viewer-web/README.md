# RTQ Question Viewer Web

Internal Next.js application for displaying one top-level RTQ maths question selected through its local API. It reads canonical `@rtq/papers` and `@rtq/maths-assets` from the `Read-The-Question/rtq-content` workspace using the standard Carpediem layout.

Use the
[RTQ development environment bootstrap](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-web-bootstrap.md)
for the complete review-stack setup and startup sequence, and the
[RTQ repository landscape](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-repository-landscape.md)
for the direct TOML read and canonical-asset ownership boundaries.

## Requirements

- Node.js 22.22.3 (declared by the `rtq-review` workspace root)
- Corepack with pnpm 10.15.1
- A compatible `rtq-content/packages/assets` package, or
  `RTQ_MATHS_ASSETS_ROOT` set to its absolute `assets/` directory

With nvm, run `nvm install` on first use and `nvm use` from the workspace root
later. Otherwise select Node 22.22.3 with your version manager. Enable the
package manager shim once on a new machine, then install the locked workspace
dependencies:

```bash
cd ~/Self/Carpediem/Read-The-Question/rtq-review
corepack enable
pnpm install --frozen-lockfile
```

## Local use

```bash
cd ~/Self/Carpediem/Read-The-Question/rtq-review/apps/review-question-viewer-web
pnpm dev --port 3002
```

Open `http://localhost:3002`. The shared `@rtq/papers` review stack starts this
workspace application on the same port. From `rtq-content/packages/papers`, use
`pnpm question-viewer:show -- ...` to set the active question rather than
posting to the API manually.

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
