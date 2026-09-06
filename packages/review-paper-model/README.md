# RTQ review paper model

Read-only server-side contracts for the RTQ content reviewer. This package owns
the boundary between a validated `rtq-content` checkout and review-facing paper
data; it deliberately exports no TOML or asset write operation.

The package discovers the supported canonical, derived, and exemplar paper
collections that exist in the active checkout. It provides a fault-isolated file
index and parses a selected TOML file into serializable paper metadata, sections,
and a complete three-level question tree.

The file index keeps only source summaries in a process-local cache. Every index
request enumerates the current collection directories, prunes removed entries,
and reparses only files whose filesystem fingerprint changed, so additions,
renames, removals, and metadata edits invalidate naturally. `inspectPaperSource`
performs a direct single-file read and parse for selected-source freshness checks;
`readReviewPaper` remains uncached and always returns the current file contents.

Every content value retains its source text and its project-macro-expanded text.
Repeated working formulas and tips remain ordered. `PaperTable`, `PaperImage`, and
`LongDivision` are represented as safe preparation descriptors for the rendering
layer; descriptors contain no filesystem path, asset sidecar, or generated SVG
source.

Normal paper collections always use strict TOML parsing. Only a recognized
`exemplarsLevel<Tier>Toml` placeholder document can use the constrained loose
reader. Every collection is read-only through this package.

Dimensional tags are resolved independently for family, math, frame, marker,
and reasoning. The filter API applies exact OR matching within an axis and AND
matching between axes, returns cross-filtered facet counts, preserves selected
zero-result values, and carries complete top-level question trees alongside the
IDs of the exact matching nodes. Independent question and answer content-RAG
facets participate in the same exact filter expression. URL helpers use stable
repeated parameters, preserve unrelated query parameters, and can clear the
complete tag-and-state review lens in one operation.

## Checks

```bash
pnpm format:check
pnpm types
pnpm test
```
