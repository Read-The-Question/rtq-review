const PAPER_TABLE_OPEN_PATTERN =
  /^ {0,3}<PaperTable(?:[ \t]+[^>\r\n]*)?>[ \t]*$/;
const PAPER_TABLE_CLOSE_PATTERN = /^ {0,3}<\/PaperTable>[ \t]*$/;
const PAPER_TABLE_TAG_PREFIX_PATTERN = /^ {0,3}<\/?PaperTable\b/;
const PAPER_TABLE_KEEP_MDX_COMMENT =
  '{/* RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable */}';
const PAPER_TABLE_KEEP_HTML_COMMENT =
  '<!-- RTQ_TABLE_KEEP_AFTER: do not remove; keeps markdown table rendering stable -->';
const MARKDOWN_FENCE_OPEN_PATTERN = /^ {0,3}(`{3,}|~{3,})/;

type MarkdownFence = {
  character: '`' | '~';
  length: number;
};

function splitLinesPreservingEndings(text: string) {
  return text.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
}

function lineContent(line: string) {
  return line.replace(/\r?\n$/, '');
}

function openingFence(line: string): MarkdownFence | null {
  const match = line.match(MARKDOWN_FENCE_OPEN_PATTERN);

  if (!match) {
    return null;
  }

  const marker = match[1];
  return {
    character: marker[0] as MarkdownFence['character'],
    length: marker.length,
  };
}

function closesFence(line: string, fence: MarkdownFence) {
  const closingPattern = new RegExp(
    `^ {0,3}${fence.character}{${fence.length},}[ \\t]*$`,
  );

  return closingPattern.test(line);
}

/**
 * Remove active PaperTable authoring wrappers while preserving their GFM body.
 *
 * Tag Web is a review surface, so PaperTable presentation attributes are
 * intentionally ignored. Wrapper-like text inside fenced source examples is
 * preserved verbatim. Invalid active structures fail clearly instead of
 * silently changing the rendered paper.
 */
export function normalizePaperTableMarkdown(text: string) {
  const output: string[] = [];
  let fence: MarkdownFence | null = null;
  let paperTableOpen = false;

  for (const line of splitLinesPreservingEndings(text)) {
    const content = lineContent(line);

    if (fence) {
      output.push(line);

      if (closesFence(content, fence)) {
        fence = null;
      }

      continue;
    }

    const nextFence = openingFence(content);

    if (nextFence) {
      fence = nextFence;
      output.push(line);
      continue;
    }

    if (PAPER_TABLE_OPEN_PATTERN.test(content)) {
      if (paperTableOpen) {
        throw new Error('Nested PaperTable wrappers are not supported');
      }

      paperTableOpen = true;
      continue;
    }

    if (PAPER_TABLE_CLOSE_PATTERN.test(content)) {
      if (!paperTableOpen) {
        throw new Error('PaperTable closing tag has no matching opening tag');
      }

      paperTableOpen = false;
      continue;
    }

    if (PAPER_TABLE_TAG_PREFIX_PATTERN.test(content)) {
      throw new Error(`Malformed PaperTable wrapper: ${content.trim()}`);
    }

    if (content.trim() === PAPER_TABLE_KEEP_MDX_COMMENT) {
      output.push(
        line.replace(
          PAPER_TABLE_KEEP_MDX_COMMENT,
          PAPER_TABLE_KEEP_HTML_COMMENT,
        ),
      );
      continue;
    }

    output.push(line);
  }

  if (paperTableOpen) {
    throw new Error('PaperTable opening tag has no matching closing tag');
  }

  return output.join('');
}
