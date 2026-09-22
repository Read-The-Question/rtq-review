# `@rtq/review-store`

Server-only persistence for review comments, review outcomes, state-scoped
image metadata, and product-wide review findings. Runtime code must use the
high-level `comments`, `outcomes`, `imageMetadata`, and `findings` repositories exported from
`@rtq/review-store/server`; schema, SQLite, migration, and database-path modules
are package internals. The package deliberately has no default export path, so
runtime consumers must opt into the explicit server entry point.

The `./types` export contains type-only identity and record contracts for code
that does not need database access. Do not import the package root into client
components.

The canonical database remains `rtq-review/database/review-content.sqlite`.
Run migrations and tracking checks from the workspace root:

```sh
pnpm database:migrate
pnpm database:tracking:check
```

The `findings` repository keeps cross-cutting observations separate from paper
comments. `append` creates an idempotent `todo` row with canonical source
provenance, `listTodo` returns only the active inbox in chronological order,
and `markProcessed` atomically records `processedAt` and `processedBy`. There is
no Jira URL field; external consumers own any onward Jira mapping.

## Resolve current-state comments

Comments are identified by the question node's UUID and review side. Their RAG
state records the content-state snapshot against which the feedback was made.
Paper collection, file path, and `rtq-question-id` are not comment identity, so
the same comment resolves from canonical TOML and every derived paper
projection containing that UUID.

Cross-repository consumers use the read-only, versioned resolver rather than
opening SQLite or importing the writable repository:

```sh
pnpm --silent review-comments:resolve
```

It accepts a JSON request on standard input:

```json
{
  "schemaVersion": 1,
  "targets": [
    {
      "uuid": "QUESTION-UUID",
      "side": "answer",
      "ragState": "rag_wf_ng3"
    }
  ]
}
```

The response contains every matching append-only comment in deterministic
chronological order. No match is represented by an empty `matches` array. The
resolver opens the tracked database read-only and does not inspect TOML, run
migrations, or change any stored data.

## Resolve current-state outcomes

The read-only resolution command accepts one versioned JSON request on standard
input. Callers send the UUID, side, and current canonical RAG state for every
question side they want to synchronize:

```json
{
  "schemaVersion": 1,
  "targets": [
    {
      "uuid": "QUESTION-UUID",
      "side": "answer",
      "ragState": "rag_wf_ng2"
    }
  ]
}
```

Run the workspace command with pnpm's lifecycle output suppressed so standard
output contains only the response contract:

```sh
pnpm --silent review-outcomes:resolve
```

The command performs one read-only batch lookup and emits a single compact JSON
line. `matches` contains only outcomes whose UUID, side, and reviewed RAG state
exactly match a requested target:

```json
{
  "schemaVersion": 1,
  "matches": [
    {
      "uuid": "QUESTION-UUID",
      "side": "answer",
      "ragState": "rag_wf_ng2",
      "outcome": "PRG",
      "reviewer": "reviewer-name",
      "createdAt": "2026-09-09T10:00:00.000Z",
      "updatedAt": "2026-09-09T10:05:00.000Z"
    }
  ]
}
```

No match is represented by an empty `matches` array. Results are ordered by
UUID, side, and RAG state. Errors go to standard error with a non-zero exit
code. The resolver does not inspect canonical files, calculate transitions,
write TOML, call Google Sheets, or modify the review database.

## List outcomes and image metadata for content sync

Image classification is stored separately in `review_image_metadata`, keyed by
UUID, image side, and exact image RAG state. Empty arrays explicitly clear
canonical classification; no exact-state row means canonical arrays remain
unchanged.

Frequent cross-repository synchronization lists actionable rows before reading
canonical TOML:

```sh
pnpm --silent review-sync:candidates
```

The versioned command returns separate `outcomes` and `imageMetadata` arrays
through one read-only SQLite connection. Outcomes contain only `PRG`, `PRBD`,
and `PRCS`; image metadata remains independent from outcomes.

Occasional pruning accepts all current UUID + side + RAG identities, a cutoff,
and an explicit apply flag:

```sh
pnpm --silent review-sync:prune
```

It reports or transactionally deletes stale outcomes and image metadata at or
before the cutoff. Exact current rows and comments are never deleted. The
existing `review-sync:resolve` exact-target command remains available for
compatibility.
