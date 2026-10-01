const FOUR_PANE_PATH = {
  quarter: "M3 3H12V12H3Z",
  half: "M3 3H12V21H3Z M3 12H12",
  "three-quarters": "M3 3H21V12H12V21H3Z M12 3V12 M3 12H12",
  full: "M3 3H21V21H3Z M12 3V21 M3 12H21",
}

const SIZE_PX = { sm: 16, md: 20, lg: 28, xl: 48 }

const VARIANT_LABEL = {
  quarter: "One quarter of a",
  half: "One half of a",
  "three-quarters": "Three quarters of a",
  full: "One full",
}

const readAttribute = (source, name) =>
  source.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1]

const fourPaneHtml = attributes => {
  const variant = readAttribute(attributes, "variant") || "full"
  const size = readAttribute(attributes, "size") || "md"
  const path = FOUR_PANE_PATH[variant]
  const sizePx = SIZE_PX[size]
  if (!path || !sizePx) return null

  return `<span aria-label="${VARIANT_LABEL[variant]} four-pane pictogram symbol" data-paper-symbol="" data-paper-symbol-name="four-pane-pictogram" data-paper-symbol-size="${size}" data-paper-symbol-variant="${variant}" role="img" style="display:inline-flex;flex:none;overflow:hidden;vertical-align:middle;line-height:1;height:${sizePx}px;width:${sizePx}px"><svg aria-hidden="true" fill="none" focusable="false" height="${sizePx}" preserveAspectRatio="xMinYMid meet" style="display:block;max-width:none;flex:none" viewBox="0 0 24 24" width="${sizePx}" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="none" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" stroke-width="1.5"></path></svg></span>`
}

// Geometry derived from Lucide's Smile icon. The legacy renderer writes it
// manually to support a filled face with inverse eyes and mouth.
const blackSmilingFaceHtml = attributes => {
  const size = readAttribute(attributes, "size") || "md"
  const sizePx = SIZE_PX[size]
  if (!sizePx) return null
  const inverse = "var(--background, #fff)"

  return `<span aria-label="One full black smiling-face pictogram symbol" data-paper-symbol="" data-paper-symbol-name="black-smiling-face" data-paper-symbol-size="${size}" data-paper-symbol-variant="full" role="img" style="display:inline-flex;flex:none;overflow:hidden;vertical-align:middle;line-height:1;height:${sizePx}px;width:${sizePx}px"><svg aria-hidden="true" fill="none" focusable="false" height="${sizePx}" preserveAspectRatio="xMinYMid meet" style="display:block;max-width:none;flex:none" viewBox="0 0 24 24" width="${sizePx}" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" fill="currentColor" r="10"></circle><circle cx="9" cy="9" fill="${inverse}" r="1"></circle><circle cx="15" cy="9" fill="${inverse}" r="1"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" stroke="${inverse}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span>`
}

const renderCustomPaperSymbols = html =>
  html.replace(/<PaperSymbol\b([^>]*?)\/?>/gi, (source, attributes) => {
    switch (readAttribute(attributes, "name")) {
      case "four-pane-pictogram":
        return fourPaneHtml(attributes) || source
      case "black-smiling-face":
        return blackSmilingFaceHtml(attributes) || source
      default:
        return source
    }
  })

module.exports = { renderCustomPaperSymbols }
