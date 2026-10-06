# RTQ Review Paper Browser

Shared paper-discovery boundary for the maintained Review Content and Review
Tag Next.js applications. It owns the serializable collection and paper view
model, collection hierarchy, metadata filtering, collection-scoped content
search, pagination, link construction, browser components, accessibility
states, responsive browser styling, and the selected-paper outline used by
both review applications.

The server entrypoint reads through `@rtq/review-paper-model`; browser clients
never receive repository paths or filesystem functions. Applications provide
only serializable route configuration and compose their own secondary
navigation around the shared browser. The selected-paper outline is shared;
review controls, content rendering, and mutation surfaces remain private to
each application.

Exports:

- `@rtq/review-paper-browser/model` — serializable models, filtering,
  pagination, query normalization, and route helpers.
- `@rtq/review-paper-browser/server` — workspace loading and the shared content
  search response adapter.
- `@rtq/review-paper-browser/browser` — the interactive paper browser.
- `@rtq/review-paper-browser/frame` — common masthead, workspace state, and
  composable secondary navigation.
- `@rtq/review-paper-browser/paper-outline` — the continuous, active-node-aware
  selected-paper outline shared by review surfaces, with composable match and
  status badges.
- `@rtq/review-paper-browser/paper-outline.css` — shared sticky outline and
  responsive presentation.
- `@rtq/review-paper-browser/paper-shape` — inline shape renderer and Markdown
  span bridge.
- `@rtq/review-paper-browser/paper-shape.css` — shared shape sizing and layout.
- `@rtq/review-paper-browser/styles.css` — the shared responsive presentation.

## PaperShape

Import `PaperShapeSpan` from `@rtq/review-paper-browser/paper-shape` as the
`react-markdown` `span` renderer and import
`@rtq/review-paper-browser/paper-shape.css` in an app's global stylesheet.
It recognizes the inert marker from `remarkPaperShape`, leaves ordinary spans
unchanged, and renders a 48px (`xl`) or 64px (`2xl`) SVG shape with an isolated
pattern ID. The graphic is decorative; the enclosing group labels the shape
and pattern, and keeps inline text or KaTeX MathML accessible. Stripe and
wavy-hatch strokes use 30% of the inherited ink opacity in both themes;
shape outlines and foreground content keep full-strength inherited ink.
