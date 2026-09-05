# RTQ Review Content Web

Internal Next.js application for reviewing RTQ paper content directly from the
active `rtq-content` checkout. Unlike Review Markdown Web, this application does
not consume generated Markdown. Paper content is always read-only; later tasks
add review outcomes and comments through `review-api` and Google Sheets.

The current foundation validates the sibling repository and establishes the
read-only paper-model boundary. Collection browsing, TOML parsing, dimensional
filters, paper rendering, and review controls are implemented by the remaining
PRD tasks.

## Requirements

- Node.js 24.19.0 and pnpm 10.15.1 from the workspace root
- A sibling `../rtq-content` checkout, or `RTQ_CONTENT_ROOT` set to a complete
  `rtq-content` Git root

## Local use

From the `rtq-review` workspace root:

```bash
pnpm review-content-web:dev
```

Open `http://localhost:3004`.

## Checks and production build

```bash
pnpm --filter rtq-review-content-web format:check
pnpm --filter rtq-review-content-web lint:check
pnpm --filter rtq-review-content-web types
pnpm --filter rtq-review-content-web test
pnpm --filter rtq-review-content-web build
```
