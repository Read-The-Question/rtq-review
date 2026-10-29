# RTQ Review Paper Markdown

Renderer-neutral Markdown compatibility shared by the maintained RTQ review
applications. It does not import application UI or content repositories.

## PaperAuthorNote

`PaperAuthorNote` is an internal authoring wrapper. The shared transform
renders it as a semantic, visibly labelled note in review surfaces while
preserving Markdown, GFM tables and lists, KaTeX source, and supported paper
components inside it. The optional literal `type` prop accepts only the
documented `rtq.paperauthornote.*` identifiers and is emitted as
`data-paper-author-note-type`. No other props are supported. The wrapper must
be a standalone non-empty block and cannot be nested. Fenced examples remain
literal.

## PaperSymbol

`PaperSymbol`, `PaperSymbolGroup`, and `PaperSymbolSpace` share the
content-owned symbol contract. `PaperSymbolSpace` renders an aria-hidden,
symbol-sized layout box for intentionally empty pictogram cells; it draws no
symbol and contributes no accessible content.

`four-pane-pictogram` is a custom inline SVG renderer rather than a Lucide
icon. Its `quarter`, `half`, `three-quarters`, and `full` variants use a fixed
two-by-two footprint and draw shared pane borders exactly once. Other symbols
continue to support the clipped `full`, `half`, and `four-fifths` variants.
`tally-marks` is a count-aware inline renderer composed from Lucide's
`Tally1`–`Tally5` geometry. It requires a positive-integer `count`, groups each
fifth mark diagonally across the preceding four, grows horizontally with the
count, and does not accept `variant`.
`black-smiling-face` is a separate full-only custom renderer with a filled
current-colour face and background-colour eyes and smile; the existing
Lucide-backed `smiling-face` remains an outline symbol.
The square, circle, triangle, and hexagon equation symbols instead use the
same outline paths as `PaperShape`, both in remark output and compatibility
HTML. Symbols keep their sizes, clipped variants, and accessible image labels;
other pictogram symbols retain their existing drawings.

## PaperShape

`PaperShape` is an inline geometric container, not a pictogram symbol. Author
`<PaperShape name="square|circle|triangle|hexagon|card" pattern="plain|vertical-stripes|wavy-hatch" size="xl|2xl">inline Markdown or $56$</PaperShape>`,
or use a self-closing tag for a blank shape. The `name` prop is required;
`pattern` defaults to `plain` and `size` to `xl` (48px; `2xl` is 64px).
The `card` name draws a portrait rounded rectangle while retaining the same
fixed footprint and centred accessible-child contract.
Only static quoted props and inline children are supported. The remark
transform preserves child Markdown and maths as AST nodes in a native span
marker, including inside GFM cells; the browser package draws the accessible
shape. Fenced examples stay literal. Call `validatePaperShapeMarkdown` at the
server preparation boundary to report invalid authoring before rendering.
`hasActivePaperShapeMarkdown` detects parsed shape nodes rather than
lookalikes in inline code or fenced examples.
Each maintained app also exposes `pnpm test:paper-shape:canonical` (run from
that app) to parse and render the authored Dulwich specimen-paper-b question
`C6D90BB5-335A-409A-9ED3-BCFDD0ED672D`. This focused check requires the
sibling `rtq-content` checkout, so it is separate from fixture-only app tests.

## PaperList

`PaperList` wraps exactly one Markdown ordered or unordered list and accepts an
optional `listStyleType`:

```mdx
<PaperList listStyleType="lower-alpha">

1. First
2. Second

</PaperList>
```

The supported values are `none`, `disc`, `circle`, `square`, `decimal`,
`decimal-leading-zero`, `lower-alpha`, `upper-alpha`, `lower-roman`, and
`upper-roman`. Values are trimmed and normalized case-insensitively. Missing or
unsupported values resolve from the direct list semantics: ordered lists use
`decimal` and unordered lists use `disc`.

The remark transform removes the wrapper and applies the validated native CSS
`list-style-type` to that list. It does not add marker artwork, layout,
typography, colour, or context-specific styling. Nested wrappers are resolved
independently, and fenced source examples remain literal.

Use `validatePaperListMarkdown` from `@rtq/review-paper-markdown/validate` on a
server preparation boundary when malformed content needs to become a
reviewer-facing preparation issue rather than a render failure.

## PaperSmall

`PaperSmall` marks supplementary or fine-print phrasing content. The shared
`remarkPaperSmall` transform converts inline and standalone single-line usage
to semantic native `<small data-paper-small>` output while preserving inline
Markdown and maths. It keeps inert native attributes, discards executable or
style attributes, and unwraps unsupported flow children as readable unstyled
content rather than leaving an unsupported MDX node for ReactMarkdown.

## PaperTable

`PaperTable` wraps exactly one GFM pipe table. The shared transform implements
the RTQ web contract for `align`, `blankCorner`, `cellAlign`, `columnHeaders`,
`columnWidths`, `density`, `firstColumnStartPadding`, `grid`, `indent`, `rowHeaderWeight`,
`rowHeaders`, `totals` and `width`. Values are exact, case-sensitive static strings; unsupported,
duplicate, expression-valued, or structurally invalid authoring is rejected.

`remarkPaperTable` validates and transfers presentation metadata to the GFM
table. `rehypePaperTable` applies column and row header semantics, then wraps
both authored and raw GFM tables in the same defaulted presentation boundary.
Run `validatePaperTableMarkdown` from `@rtq/review-paper-markdown/validate` at
the server preparation boundary so invalid TOML becomes a reviewer-facing
issue before client rendering.

`density` is `compact`, `regular` or `roomy` (the default) and sets cell
padding only; table type follows the text of the field around it.
The retired `density="default"` is rejected with an error naming `regular`. `grid` has
no fixed default: an unset grid is not emitted, and `paper-table.css` gives it
its voice default from the nearest `[data-variant]` ancestor, which is `framed`
inside a `question` and `horizontal` everywhere else. Applications that render
paper fields mark each field's voice with `data-variant`, and may define the
`--rtq-paper-table-stroke-ink`, `-stroke-medium` and `-stroke-soft` colours;
otherwise the rules fall back to the app's `--line`/`--rule` tokens.

Row labels are regular weight by default. `rowHeaderWeight="strong"` makes them
semibold through `--rtq-paper-table-label-weight-strong`; it names intent, not a
font weight, and requires `rowHeaders="first-column"` (or authored
`scope="row"` cells on a structured root), because otherwise there are no row
labels to weigh. Only `strong` is emitted on the wrapper as
`data-row-header-weight`.

`columnWidths` is `content` (the default: each column as wide as its content)
or `equal`, for grids and number rows read as a set. For `equal`,
`rehypePaperTable` inserts a `<colgroup data-slot="paper-table-columns">` with
one `col` per column (the widest row, counting `colSpan`) after any caption,
sets `--rtq-paper-table-column-count` on the table and `data-column-widths` on
the wrapper; `paper-table.css` gives each `col` an equal share. The table stays
auto-layout, so `fit` stays fit and `full` shares the full width equally. Row
labels (`rowHeaders="first-column"` or a structured `scope="row"` header cell)
are counted in the `colgroup` and join the equal share.

Empty cells keep one line of height through a zero-width `::after`, so a blank
answer row needs no phantom content: write an empty cell.

## PaperViewStructuredTable

`PaperViewStructuredTable` is the direct-composition alternative for tables that
GFM cannot express. It supports `PaperViewTableCaption`, `PaperViewTableHead`,
`PaperViewTableBody`, `PaperViewTableRow`, `PaperViewTableHeaderCell`, `PaperViewTableCell`,
and `PaperViewTableCellLabel`.

`remarkPaperStructuredTable` lowers these components to native `table`,
`caption`, `thead`, `tbody`, `tr`, `th`, `td`, and `span` elements. It does not
validate child order, row lengths, column counts, or presentation values. That
is an intentional difference from the validated `PaperTable` GFM path.

The structured root supports `align`, `cellAlign`, `density`,
`firstColumnStartPadding`, `grid`, `indent`, and `width`. It also preserves the
opt-in `borderModel="cells"` contract: `cellBorder="all|none"` cascades from
the root to a row and then to an individual header or data cell. The nearest
authored value wins, while the default table-owned border model remains
unchanged. In the cells model, row labels draw the firm label rule, and each
cell's resolved `cellBorder` decides whether the label and totals rules draw on
it, so an explicit `cellBorder="none"` row or cell stays unruled.
`PaperViewTableCell` supports `tone="default|blocked"`; the retired
`tone="muted"` is rejected with an error naming `blocked`.
`PaperViewTableCellLabel` preserves ordinary Markdown/MDX children, including
maths and empty-value geometry handled by the application's KaTeX plugins. It
provides the default subordinate label size without imposing a semantic colour.
Use `\rtqMathsCellLabelNumber{number}` for a muted numeric cell label.

Both table paths pass through `rehypePaperTable`, which adds one
`.rtq-paper-table` presentation wrapper. Applications import the shared
essential presentation contract. It also gives adjacent table wrappers the
same default relationship spacing used by production paper rich text.
Applications that port the full production rhythm (as review-content-web does
in `globals.css`) cover this pair in their own sibling rules:

```css
@import "@rtq/review-paper-markdown/paper-table.css";
```

Register `remarkPaperListMdx` before the paper component transforms so MDX
elements exist in the syntax tree:

```ts
remarkPlugins: [
  remarkGfm,
  remarkMath,
  remarkPaperListMdx,
  remarkPaperTable,
  remarkPaperStructuredTable,
];

rehypePlugins: [rehypePaperTable, rehypeKatex];
```

Legacy renderers that also contain generated HTML compatibility markup use
`toPaperMdxCompatibilityMarkdown` before parsing and `remarkPaperNativeMdx`
after the paper transforms. These adapters preserve package-owned comment
metadata and lowercase native elements; they are not part of the
structured-table validation contract.

The canonical author-facing syntax and examples live in
`rtq-content/packages/papers/docs/architecture/paper-table-authoring.md`.
