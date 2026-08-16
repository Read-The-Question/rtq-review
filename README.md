# RTQ review

`rtq-review` is the private pnpm workspace for RTQ's internal review tools.

## Applications

- [`apps/review-legacy-gatsby-web`](apps/review-legacy-gatsby-web) retains the
  generated-Markdown Gatsby reviewer. It is currently unused but remains the
  sole review consumer of copied paper assets until it is explicitly retired.

The other review applications and the review API will move into this workspace
in separate migrations. They are not part of this initial workspace setup.

## Setup

From the repository root:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
```

The workspace uses Node `22.22.3` and pnpm `10.15.1`.

Run the legacy Gatsby application from its directory:

```sh
cd apps/review-legacy-gatsby-web
pnpm develop
```

It runs at `http://localhost:8000`. See the
[application README](apps/review-legacy-gatsby-web/README.md) for content and
asset preparation details.
