# Review Paper Assets

Shared server-side SVG preparation for Content Review and Tag Review. The
`RTQ_CONTENT_ROOT` checkout owns parsing, inline sanitisation/ID namespacing,
intentional natural sizing and the common 75% readability floor.

`prepareReviewSvg(path, namespace, renderMode)` invokes
`papers:images:svg:prepare`. Inline delivery also requests `--review-css`,
compiling utilities found in that SVG against the retained light palette.
Consumers mount inline markup inside `.rtq-review-inline-svg`; the compiled
rules are scoped there and do not redefine the review application's theme.
The current review surfaces use a light colour scheme, not production
light/dark parity.

Each SVG is shown at its natural size, shrinks proportionally to the returned
minimum width and then scrolls locally. Raster display-size presets are not
applied to SVGs. Per-variant accessibility and source provenance remain owned
by the consuming paper model and its matching sidecar.

Preparation errors propagate to the application's existing error boundary.
The bounded cache invalidates edited artwork and, for inline output, retained
colour-snapshot changes. Restart after changing the preparation tool itself.
Consumer tests use an explicit process-boundary fixture; canonical parsing,
sanitisation and colour compilation are covered by the assets package.
