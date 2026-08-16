# RTQ Gatsby Review Web

Retained legacy Gatsby review surface for Markdown generated from the canonical
RTQ maths-paper TOML. It is not part of active review, but its generation,
static-copy, and named review-mode paths remain supported until an explicit
retirement decision. The separate
`sync-and-publish/rtq-try-gatsby-md-publish` checkout remains publish-only.

Use the
[RTQ development environment bootstrap](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-web-bootstrap.md)
for the optional legacy startup sequence, and the
[RTQ repository landscape](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-repository-landscape.md)
for the retention status and intentional Gatsby-only copy boundary. Do not use
this README as the complete multi-repository runbook.

## Local use

Install dependencies and start the default review mode:

```sh
cd ~/Self/Carpediem/Read-The-Question/rtq-review
pnpm install --frozen-lockfile
cd apps/review-legacy-gatsby-web
pnpm develop
```

The site runs at `http://localhost:8000`. Named scripts in `package.json`, such
as `pnpm answers_all` and `pnpm questions_all`, select a specific
`GATSBY_REVIEW_MODE`.

Generated Markdown belongs under `src/pages/md`. Mirrored paper assets belong under `static/assets/papers`. Both are populated by the canonical tooling in `Read-The-Question/rtq-content/packages/papers`; do not introduce a second exporter or asset-copy implementation here.

Gatsby is intentionally the sole copy-based paper-asset review consumer. Run
`pnpm papers:assets:prepare:review-gatsby` from `rtq-content/packages/papers` to refresh its
static mirror. The three maintained Next.js review applications instead serve
canonical assets directly and are not targets of this command.

From `rtq-content/packages/papers`, `RTQ_REVIEW_GATSBY_WEB_ROOT` can override
this application's location. The default is
`Read-The-Question/rtq-review/apps/review-legacy-gatsby-web`.
