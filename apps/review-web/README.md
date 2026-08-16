# RTQ Review Web

Internal Next.js application for reviewing generated RTQ answer Markdown. The
shared `@rtq/papers` review stack copies generated Markdown into `md/`. The
application serves external PaperImage binaries directly from the canonical
`rtq-content/packages/assets/assets/papers` tree; it does not use a local
paper-asset mirror. Generated LongDivision markup is already embedded in the
Markdown.

The review API defaults to `http://localhost:4567`. `pnpm dev:remote` uses the
configured RTQ review ngrok endpoint instead.

Use the
[RTQ development environment bootstrap](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-web-bootstrap.md)
for the complete review-stack setup and startup sequence, and the
[RTQ repository landscape](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-repository-landscape.md)
for this site's generated-Markdown and direct-asset ownership boundaries.

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
cd ~/Self/Carpediem/Read-The-Question/rtq-review/apps/review-web
pnpm dev
```

Open `http://localhost:3000`. For the complete multi-repository workflow, start
the review stack from `Read-The-Question/rtq-content/packages/papers` so its
generated content and review services are prepared together. PaperImage
requests are resolved at request time from `@rtq/maths-assets`; adjacent JSON
and generated manifests remain server-only and cannot be requested through the
asset route.

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
