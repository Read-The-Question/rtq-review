# RTQ Tag Review Web

Internal Next.js application for browsing RTQ maths-paper TOML and reviewing
or editing question tags. It reads canonical `@rtq/papers` and
`@rtq/maths-assets` from one validated `rtq-content` checkout.

Use the
[RTQ development environment bootstrap](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-web-bootstrap.md)
for the complete review-stack setup and startup sequence, and the
[RTQ repository landscape](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/platform/rtq-repository-landscape.md)
for the direct TOML edit and canonical-asset ownership boundaries.
Its KaTeX macro path and current semantic-colour conformance are recorded in the
[RTQ KaTeX Semantic Colour Architecture](https://github.com/Read-The-Question/rtq-web/blob/develop/apps/web/docs/architecture/design-system/katex-semantic-colours.md).

## Requirements

- Node.js 24.19.0 (declared by the `rtq-review` workspace root)
- Corepack with pnpm 10.15.1
- A compatible sibling `rtq-content` checkout, or `RTQ_CONTENT_ROOT` set to
  that Git root

With nvm, run `nvm install` on first use and `nvm use` from the workspace root
later. Otherwise select Node 24.19.0 with your version manager. Enable the
package manager shim once on a new machine, then install the locked workspace
dependencies:

```bash
cd /path/to/rtq-review
corepack enable
pnpm install --frozen-lockfile
```

## Local use

```bash
cd /path/to/rtq-review
pnpm review-tag-web:dev
```

Open `http://localhost:3002`. The shared `@rtq/papers` review stack starts this
workspace application on the same port.

The home page and `/papers/<collection>` routes use the workspace-owned
`@rtq/review-paper-browser` implementation shared with Review Content Web. It
provides the same collection hierarchy, filename and metadata filtering,
collection-scoped question-content search, pagination, URL query state, paper
rows, and responsive navigation. The selected
`/papers/<collection>/<source-relative-path>` route is where Tag Review
diverges into its editable Question Tags and Image Tags surface. Former
`/files/<folder>/<slug>` bookmarks receive a permanent redirect to the common
route shape.

PaperImage binaries, sidecars, technical manifests, and generated LongDivision
sources are read directly from `@rtq/maths-assets`. The browser receives only
allowlisted external PaperImage binaries through the app's same-origin route;
JSON metadata and generated LongDivision sources remain non-public, with
LongDivision prepared inline by the canonical asset-repository command. No
paper assets are mirrored into this repository's `public/` tree.

Manual images use `questions/manual/`, `workings/manual/`, or
`answers/manual/`; sidecar and technical-manifest lookups use the same paths.
Old flat question URLs are not served. `PaperImage` authoring and generated
long-division paths are unchanged. Doctor is not a reviewer build/startup gate.

Question Tags and Image Tags are separate review modes. Image Tags discovers
authored `PaperImage` components in question, working, and answer fields and
uses the same paper hierarchy, question body, working, answer, and navigation
as Question Tags. Each authored image stays inline at its exact content
position and gains the same current/edit/final tag-panel pattern immediately
below it. Multiple images in one field are independently editable. Writes
revalidate the source version, resolve exactly one node by `rtq-uuid`, and
update only the selected component prop; positional question coordinates
remain an asset-resolution detail.

Both review modes use the same continuous selected-paper outline as Review
Content Web. The rail follows the active nested node; Question Tags shows
inheritance exceptions, while Image Tags marks direct image counts and missing
assets and retains ancestor nodes as context.

The vocabulary and drawing-guide contract are read from the canonical
[`image-dimensional-tags.json`](https://github.com/Read-The-Question/rtq-content/blob/develop/packages/assets/docs/architecture/image-dimensional-tags.json)
version-5 catalog owned by `@rtq/maths-assets`. The editor supports one optional
family and multiple optional types, without cross-dimension prerequisites,
and validates every member of the complete assignment before a
write. Omission is unclassified and image tags never inherit from question tags
or neighbouring images. Image tags remain rendering-neutral and do not change
asset URLs, sidecars, manifests, accessibility data, or artwork.

The editor displays each selected value's vocabulary approval (`approved` or
`pending-approval`), independent guide status and last-updated date. Both approval
states remain selectable. Vocabulary approval
does not approve this image or its tag assignment, and does not modify review
outcomes. Pending vocabulary needs agreement before executable drawing.
Missing and placeholder guidance must be established/completed and approved
before drawing; even an available guide does not establish renderer support.
Unsupported selections remain visible for explicit correction. Changing or
removing family never removes a type. The type picker toggles individual members;
removing the last member omits the attribute. Guidance for every selected type is
shown, including any pending vocabulary or incomplete guide.

The existing regex content search can select type membership with
`PaperImage\b[^>\r\n]*\btype="(?:[^" ]+ )*triangle(?: [^" ]+)*"`.
This finds triangle alone or alongside other types without matching
`supertriangle`; there is no new image-filter API.

Image-tag edits accept whitespace-separated static double-quoted component
attributes. Preview rendering accepts and ignores both `family` and `type`,
with distinct type identifiers separated by one ASCII space inside the string.
Existing single-value source remains valid. The tags are discovery/guidance
clues, not normative drawing instructions or runtime primitive selection.
Preview rendering remains tolerant,
including incomplete or unsupported assignments, so classification problems do
not hide the artwork needed for review. Mutation validation remains stricter
than preview tolerance.

Canonical and full focus papers also expose an optional, persistent Original
PDF pane in either review mode. The same-origin PDF route contains reads under
`original-papers/pdf-rtq`, supports inline GET/HEAD and byte ranges, and never
exposes filesystem paths to the browser.

Inline division uses semantic Tailwind utilities. The shared source
configuration in `packages/repository-paths` resolves SVGs through the same
`RTQ_CONTENT_ROOT` as rendering; no class safelist is maintained. Regenerate
canonical division assets before starting/building after a class migration.
Existing reviewer colours are preserved. Run `pnpm paper-svg:styles:test`
from the review workspace for compiler coverage.

The generated `corpusAllTopicsToml` collection and discovered
`exemplarsLevel<Tier>Toml` collections can be browsed in Tag Review, but are
read-only. Tag mutations remain available only for the canonical and existing
editable derived collections.

Authored `PaperList` wrappers render through the shared review Markdown
contract in every question, answer, working, formula, and tip field. The
wrapper changes only the browser-native list marker; it does not expand Tag
Review's content-editing boundary.

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
