# RTQ Gatsby Review Web

Internal Gatsby review surface for Markdown generated from the canonical RTQ maths-paper TOML. It is the active Gatsby review checkout; the separate `sync-and-publish/rtq-try-gatsby-md-publish` checkout remains publish-only.

## Local use

Install dependencies and start the default review mode:

```bash
npm install
npm run develop
```

The site runs at `http://localhost:8000`. Named scripts in `package.json`, such as `npm run answers_all` and `npm run questions_all`, select a specific `GATSBY_REVIEW_MODE`.

Generated Markdown belongs under `src/pages/md`. Mirrored paper assets belong under `static/assets/papers`. Both are populated by the canonical tooling in `Read-The-Question/maths-papers`; do not introduce a second exporter or asset-copy implementation here.

From `maths-papers`, `RTQ_REVIEW_GATSBY_WEB_ROOT` can override this checkout's location. The default is `Inside-Ninety-Six/rtq-review-gatsby-web`.
