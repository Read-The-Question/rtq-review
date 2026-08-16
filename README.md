# RTQ review

`rtq-review` is the private pnpm workspace for RTQ's internal review tools.

## Applications

- [`apps/review-legacy-gatsby-web`](apps/review-legacy-gatsby-web) retains the
  generated-Markdown Gatsby reviewer. It is currently unused but remains the
  sole review consumer of copied paper assets until it is explicitly retired.
- [`apps/review-web`](apps/review-web) is the maintained Next.js application
  for reviewing generated paper Markdown and submitting review actions.
- [`apps/review-tag-web`](apps/review-tag-web) is the maintained Next.js
  application for reviewing and editing tags directly in canonical paper TOML.

The question viewer and review API will move into this workspace in separate
migrations.

## Setup

From the repository root:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
```

The workspace uses Node `22.22.3` and pnpm `10.15.1`.

Run an application from its directory:

```sh
cd apps/review-web
pnpm dev

# Or run the tag reviewer on its established port:
cd ../review-tag-web
pnpm dev -- --port 3001

# Or run the retained Gatsby application:
cd ../review-legacy-gatsby-web
pnpm develop
```

The maintained reviewer runs at `http://localhost:3000`; Gatsby runs at
`http://localhost:8000`. See each application README for its content and asset
preparation details.
