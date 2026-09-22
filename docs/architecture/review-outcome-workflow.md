# Review outcome workflow

Status: living architecture, updated 14 September 2026.

This document describes how Review Content Web records review decisions and how
those decisions later change canonical paper TOML. It is intentionally a living
document: the database-backed path is implemented and remains under review as
its reviewer-facing workflow is refined.

The central rule is that a review decision and a content-state transition are
two separate events. The review website records a state-scoped decision. A
later, operator-controlled sync in `rtq-content` decides whether that decision
still applies to the current canonical state and, if it does, updates TOML.

## Ownership and sources of truth

| Concern                                              | Owner                                | Source of truth                                                                                                           |
| ---------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Current question, answer, and image state            | `rtq-content/packages/papers`        | Complete papers under `papers/toml`                                                                                       |
| RAG vocabulary and transition policy                 | `rtq-content/packages/papers`        | `docs/architecture/rag-states.md`, `scripts/papers/lib/reader/rag_reader.rb`, and `scripts/papers/lib/rag_review_sync.rb` |
| Review comments, outcomes, and image metadata        | `rtq-review/packages/review-store`   | `database/review-content.sqlite` through `@rtq/review-store/server`                                                       |
| Reviewer interaction and live-target validation      | `rtq-review/apps/review-content-web` | The current canonical paper read from the active `rtq-content` checkout                                                   |
| Comment resolution across repositories               | `rtq-review/packages/review-store`   | The versioned `review-comments:resolve` standard-input/standard-output contract                                           |
| Sync resolution across repositories                  | `rtq-review/packages/review-store`   | The versioned `review-sync:resolve` standard-input/standard-output contract                                               |
| TOML inventory, transition calculation, and mutation | `rtq-content/packages/papers`        | `scripts/papers/lib/database_review_sync.rb` and the shared RAG transition engine                                         |

Review Content Web never owns or edits canonical content state. Review Store
does not maintain a mirror of current state and does not decide the successor
state. The content sync does not open SQLite or import Drizzle internals.

## End-to-end flow

```text
Reviewer opens a canonical question
  -> Review Content Web reads its UUID and all four current RAG states
  -> reviewer submits an outcome for one side
  -> the server re-reads canonical TOML and rejects a stale target
  -> exactly one configured destination stores the review decision
  -> canonical TOML remains unchanged

Operator runs the database-outcome sync in rtq-content
  -> sync inventories every top-level UUID and all four review targets
  -> Not Applicable image targets are excluded from outcome resolution
  -> review-store resolves separate exact-state outcome and image-metadata matches
  -> rtq-content applies the current transition policy
  -> dry-run reports, or apply edits, canonical content and companion review fields
  -> stored review outcomes remain unchanged
```

### 1. Open the review page

Review Content Web reads the selected complete paper directly from canonical
`papers/toml`. For each top-level question, question content, question images,
answer content, and answer images are independent review targets. Each target has:

- the question UUID;
- a side: `question`, `question-image`, `answer`, or `answer-image`;
- the current canonical RAG value for that side.

In database mode, the page also requests stored outcomes for those exact
targets. An outcome recorded for the same UUID and side at an earlier state is
not displayed as the current decision.

Every canonical image target starts at `rag_wf_ng2` and participates in the
ordinary review controls, pending-review requests, lookups, rows, and
transitions. A PRG review advances it directly to NG3. Image panels expose the
controlled image metadata and let the reviewer select `generated` and
`screenshot` together when both apply. A separate decorative option maps to
`ignored = ["decorative"]`. The structured `types` and `ignored` arrays are stored independently for the
exact UUID, image side, and image RAG state. An explicit pair of empty arrays
records that the target has no included image; absence of a matching row means
canonical arrays remain unchanged. Each checkbox change saves immediately,
without requiring or replacing an outcome. Client writes for one target are
serialized, so the latest selection is durable across refreshes.
The shared readers retain `rag_wf_notapplicable` only for historical
compatibility, and canonical content must not author it.

### 2. Submit a review request

Review Content Web uses descriptive actions while retaining the canonical code
as an internal request value:

| Reviewer-facing action | Internal value | Content transition after sync |
| ---------------------- | -------------- | ----------------------------- |
| Looks good             | `PRG`          | Advance to the next state     |
| Make a change          | `PRCR`         | No change                     |
| Change Complete        | `PRCC`         | No change                     |
| Block it               | `PRBD`         | Move to Blocked               |
| Coming Soon            | `PRCS`         | Move to Coming Soon           |
| Reset                  | no value       | No change                     |

Simple mode exposes Looks good, Make a change, and Reset. Detailed mode adds
the other three canonical actions. Reset clears the request for the exact
state-scoped target and returns it to the missing/`PRNS` default
representation; `PRNS` is not submitted as another transition trigger.

Review Content Web, Review Markdown Web, and Review API all reject retired
outcomes at their request boundaries. The generated Markdown controls use the
same five actionable values and provide Reset separately.

Before writing anything, the server resolves the submitted paper and UUID from
the active content checkout again. It compares the submitted side and RAG state
with live canonical TOML. A page that became stale cannot record an outcome for
the old state; the route rejects it and the reviewer must reload.

### 3. Store the outcome in one destination

`RTQ_REVIEW_OUTCOME_DESTINATION` selects the writer:

| Value           | Behaviour                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `database`      | Store or clear the outcome through the shared Review Store package. This is the default.                            |
| `google-sheets` | Forward the existing request to Review API and Google Sheets. This is the retained compatibility and rollback path. |

The branches are exclusive. A request never writes to both destinations, and a
database failure does not fall back to Google Sheets. An unsupported setting is
a configuration error.

In database mode, one `review_outcomes` row represents the latest decision for
one state-scoped target:

| Field                | Meaning                                                              |
| -------------------- | -------------------------------------------------------------------- |
| `rtq_uuid`           | Canonical top-level question identity                                |
| `side`               | One of the four content or image review sides                        |
| `rag_state`          | Canonical state in which the review occurred                         |
| `outcome`            | Review decision such as `PRG`                                        |
| `reviewer`           | Reviewer identity supplied by the application                        |
| `created_at`         | Time this state-scoped decision was first stored                     |
| `updated_at`         | Time the outcome or image metadata was last replaced                 |

The unique identity is `rtq_uuid + side + rag_state`. Submitting another
decision for that identity replaces the outcome and reviewer while retaining
the original creation time. Reset deletes only that exact outcome. It does not
delete comments.

The row deliberately does not store a paper path, a mirror of current
canonical state, a calculated next state, or an applied/consumed flag.

`review_image_metadata` separately stores `image_types_json` and
`image_ignored_json` for `rtq_uuid + image side + rag_state`, with the same
audit fields. Outcome reset and replacement never delete or rewrite metadata.

### 4. Leave canonical TOML unchanged until sync

Approval is a recorded instruction, not an immediate mutation. After the
review request succeeds, the selected content or image track remains in its original
state. This pull boundary keeps canonical edits visible, reviewable, and under
the operator's control.

The successful request is nevertheless visible immediately in Review Content
Web. The page updates its already-loaded outcome map in memory, so the target's
review badge, filter classification, and facet counts change without pretending
that canonical content RAG has advanced. Reset removes that transient outcome
from the same presentation state.

The review surface groups the four independent targets into two reviewer
contexts: Question pairs question content with question images, and Answer
pairs answer content with answer images. Both tracks in the active context keep
their own controls, comments, outcomes, status backgrounds, and commands.

The full filter panel shows only the two RAG and outcome facets in the active
context. Question filters never narrow the Answer context, and Answer filters
never narrow the Question context. Inactive selections remain in the URL so
switching context restores that lens, but the filter engine ignores them until
their context is active. The facets classify only exact current-state outcomes.
They contain only canonical review values, presented as **Pending**
for `PRNS` or no exact outcome, **Approved** for `PRG`, **Reviewed (Comments)**
for `PRCR`, **Ready For Review** for `PRCC`, **Blocked** for `PRBD`, and
**Coming Soon** for `PRCS`. A load failure is reported as unavailable and is
never treated as Pending. There are no synthetic or inverse filter options.
Selections within one facet use OR. The two active outcome facets also form one
OR group, so a match in either the main-content or image outcome keeps the
question in the active review queue. The two active RAG facets and common
dimensional facets continue to combine with AND. The selections use the URL parameters
`question-review`, `question-image-review`, `answer-review`, and
`answer-image-review`.

Each top-level question heading also summarizes the two tracks in the active
context. The main content surface uses the content outcome background, while a
persistent image-status block uses the image outcome background even when the
inline review panel is hidden. Actionable outcomes use the same semantic label
and colour mapping as their controls, while current-state comment counts remain
visually distinct. Prior-state comment counts appear in this scan surface only
when **Show previous feedback** is enabled. The sticky review toolbar exposes a
compact Filters control and active-filter count; it moves focus to the normal
non-sticky filter panel, which offers a return control to the question the
reviewer was inspecting.

### 5. Resolve only currently applicable outcomes

From `rtq-content/packages/papers`, the database sync first parses every
complete canonical paper. It validates unique top-level UUIDs and recognised
states for all four review targets before asking Review Store for anything.

It sends all current targets to this command in the sibling `rtq-review`
workspace:

```sh
pnpm --silent review-sync:resolve
```

The versioned JSON request contains only UUID, side, and current RAG state. The
resolver opens SQLite once and returns separate `outcomes` and `imageMetadata`
arrays containing only exact matches. It does not return comment history or
irrelevant rows from other states, and it performs no transition or write.

### 6. Calculate and apply the transition in `rtq-content`

The sync passes each matching outcome and current state to the same canonical
RAG workflow used by the existing review sync. The transition ladder is not
copied into this document; consult the current sources listed in the ownership
table before changing its behaviour.

Preview the complete plan:

```sh
pnpm papers:review-outcomes:sync
```

Apply the reported plan:

```sh
pnpm papers:review-outcomes:sync:apply
```

Dry-run is the default. Apply mode uses the line-preserving TOML updater. `PRG`,
`PRBD`, and `PRCS` update the matching content or image state field and reset
its companion review outcome to `PRNS`.
`PRCR` and `PRCC` do not change content RAG; they are retained in the companion
review field. Reset is represented by the absence of an exact database outcome,
so the sync returns a retained companion signal to `PRNS`. The database path also copies `types` and `ignored` from an exact-state
`review_image_metadata` row into the matching canonical image fields,
independently of any outcome. Empty arrays explicitly clear the canonical
arrays; no exact-state metadata row preserves them. Metadata and an image RAG
transition can still be applied in the same dry-run/apply plan. The
database path never changes companion TOML comment fields, derived TOML,
generated Markdown, PDFs, assets, Google Sheets, comments, or the review
database.

## Replay and failure behaviour

The design does not need an “applied” database flag:

- If a run stops before a TOML edit, canonical state still matches the stored
  outcome, so the next run proposes it again.
- If a TOML edit was made but later discarded, the restored state matches and
  the outcome becomes applicable again.
- If a TOML edit remains, that side is now at its successor state. The earlier
  outcome no longer matches, so another sync does nothing unless a separate
  outcome exists for the successor state.
- Clearing a retained PRCR or PRCC row causes the next sync to reset only the
  matching companion TOML review field; comment history remains untouched.
- A single sync calculates at most one transition for the state it observed;
  it does not cascade through outcomes stored for several future states.
- Image metadata comes from the same exact UUID, image side, and current-state
  outcome as the transition; a stale outcome cannot update current arrays.
- Inventory, resolver, contract, or transition errors fail the run rather than
  silently skipping questionable data. The complete plan is built before apply
  mode edits any file.

For example, a question at `rag_wf_ng2` with a `PRG` stored for
`rag_wf_ng2` advances according to the current transition engine. On the next
run the same stored row is inert because the canonical question no longer has
that reviewed state. Restoring the TOML question to `rag_wf_ng2` makes the row
applicable again.

## Comments are separate review facts

Comments and outcomes intentionally use different storage semantics:

- comments are append-only and may have many rows for one UUID, side, and
  state;
- outcomes are replaceable and have at most one row for one UUID, side, and
  state;
- current-state comments are shown by default;
- comments from prior states remain available through **Show previous
  feedback**;
- advancing or resetting an outcome never removes comment history.

Nested question nodes can have their own comment identity and inherit the
containing top-level side state. Outcome submission and canonical sync remain
limited to the top-level review targets currently supported by Review Content
Web.

Comment identity is the node UUID plus review side. The stored RAG state is the
reviewed content-state snapshot used to distinguish current feedback from
history. `rtq-question-id`, collection, and file path describe a particular
paper projection and must never qualify comment lookup. Cross-repository
consumers resolve exact current-state comments through the read-only
`pnpm --silent review-comments:resolve` contract using only UUID, side, and RAG
state.

## Database ownership and migrations

`@rtq/review-store` is the only owner of the Drizzle schema, migration journal,
SQLite connection, database-path resolution, and persistence queries. Runtime
applications use its high-level server APIs. Cross-repository callers use the
resolver command rather than importing the database layer.

From the `rtq-review` root:

```sh
pnpm database:migrate
pnpm database:tracking:check
```

Drizzle records applied migrations in its migration table inside the SQLite
database. Running the migration command again applies only migrations that are
not already recorded.

## Current verification

The implementation has focused tests for state and side isolation, replacement
and Reset, stale review submissions, exclusive destination selection,
current-state resolution, replay after canonical reset, and one-stage-per-sync
behaviour.

On 10 September 2026, the live canonical dry-run completed successfully across
12,548 question/answer targets. The database contained no outcome rows and no
exact matching outcomes, so it proposed zero transitions and zero field
changes.

## Known gaps and future refinements

This is the architecture record, not the final operational runbook. Record
newly identified behavioural gaps and decisions here before changing the
implementation. The later operations task will add final rollback, inspection,
dashboard-refresh, troubleshooting, and validation procedures once the
workflow is accepted.
