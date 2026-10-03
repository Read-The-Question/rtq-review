import type { ImageTagOccurrence } from './paper-types.ts';

export function markdownWithOccurrenceMarkers(
  markdown: string,
  occurrences: ImageTagOccurrence[],
) {
  let cursor = 0;
  let output = '';
  const marked = new Map<string, ImageTagOccurrence>();

  for (const [index, occurrence] of occurrences.entries()) {
    const start = markdown.indexOf(occurrence.previewMarkdown, cursor);
    if (start < 0) {
      continue;
    }

    const marker = String(index);
    output += markdown.slice(cursor, start);
    output += `<div data-image-tag-occurrence="${marker}"></div>`;
    cursor = start + occurrence.previewMarkdown.length;
    marked.set(marker, occurrence);
  }

  output += markdown.slice(cursor);
  return { marked, markdown: output };
}
