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
- [`apps/review-question-viewer-web`](apps/review-question-viewer-web) is the
  maintained Next.js application for displaying one selected canonical paper
  question.
- [`apps/review-api`](apps/review-api) is the Ruby/Sinatra service that
  validates review actions and writes review state to Google Sheets.

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

Run an application from its directory:

```sh
cd apps/review-web
pnpm dev

# Or run the tag reviewer on its established port:
cd ../review-tag-web
pnpm dev --port 3001

# Or run the question viewer on its established port:
cd ../review-question-viewer-web
pnpm dev --port 3002

# Or run the retained Gatsby application:
cd ../review-legacy-gatsby-web
pnpm develop

# Or run the review API through its Bundler-owned adapter:
cd ../review-api
pnpm dev
```

The maintained review applications use ports `3000`, `3001`, and `3002`; the
review API uses `4567`; Gatsby runs at `http://localhost:8000`. See each
application README for its content, asset, and runtime prerequisites.

The same applications can be started from the workspace root:

```sh
pnpm review-web:dev
pnpm review-tag-web:dev
pnpm review-question-viewer-web:dev
pnpm review-legacy-gatsby-web:dev
pnpm review-api:dev
```

The first four commands use workspace-installed Node dependencies. The API
adapter deliberately delegates to Bundler; install its locked Ruby dependencies
from `apps/review-api` before starting it:

```sh
cd apps/review-api
bundle install
cd ../..
pnpm review-api:dependencies:check
pnpm review-api:syntax:check
```

The API reads its application-local credential, token, and UUID-index files.
Treat them as sensitive: do not print their contents or copy their values into
logs or documentation. The complete multi-service tmux workflow remains owned
by `rtq-content/packages/papers`.
