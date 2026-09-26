# RTQ Review Paper Markdown

Renderer-neutral Markdown compatibility shared by the maintained RTQ review
applications. It does not import application UI or content repositories.

## PaperAuthorNote

`PaperAuthorNote` is a children-only, internal authoring wrapper. The shared
transform renders it as a semantic, visibly labelled note in review surfaces
while preserving Markdown, GFM tables and lists, KaTeX source, and supported
paper components inside it. The wrapper accepts no attributes, must be a
standalone non-empty block, and cannot be nested. Fenced examples remain
literal.

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
`density`, `firstColumnStartPadding`, `grid`, `indent`, `rowHeaders`, and
`width`. Values are exact, case-sensitive static strings; unsupported,
duplicate, expression-valued, or structurally invalid authoring is rejected.

`remarkPaperTable` validates and transfers presentation metadata to the GFM
table. `rehypePaperTable` applies column and row header semantics, then wraps
both authored and raw GFM tables in the same defaulted presentation boundary.
Run `validatePaperTableMarkdown` from `@rtq/review-paper-markdown/validate` at
the server preparation boundary so invalid TOML becomes a reviewer-facing
issue before client rendering.

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
`firstColumnStartPadding`, `grid`, `indent`, and `width`.
`PaperViewTableCell` supports `tone="default|muted"`.
`PaperViewTableCellLabel` preserves ordinary Markdown/MDX children, including
maths and empty-value geometry handled by the application's KaTeX plugins. It
provides the default subordinate label size without imposing a semantic colour.
Use `\rtqMathsCellLabelNumber{number}` for a muted numeric cell label.

Both table paths pass through `rehypePaperTable`, which adds one
`.rtq-paper-table` presentation wrapper. Applications import the shared
essential presentation contract. It also gives adjacent table wrappers the
same default relationship spacing used by production paper rich text:

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
