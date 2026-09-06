const OPEN = /^ {0,3}<PaperTable(?:[ \t]+[^>\r\n]*)?>[ \t]*$/;
const CLOSE = /^ {0,3}<\/PaperTable>[ \t]*$/;
const PREFIX = /^ {0,3}<\/?PaperTable\b/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

type MarkdownFence = Readonly<{ character: '`' | '~'; length: number }>;

function linesWithEndings(value: string): string[] {
  return value.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
}

function lineContent(value: string): string {
  return value.replace(/\r?\n$/, '');
}

function openingFence(value: string): MarkdownFence | undefined {
  const match = value.match(FENCE);
  return match
    ? {
        character: match[1][0] as MarkdownFence['character'],
        length: match[1].length,
      }
    : undefined;
}

function closesFence(value: string, fence: MarkdownFence): boolean {
  return new RegExp(`^ {0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(
    value,
  );
}

/** Preserve a PaperTable body as ordinary GFM while removing its MDX shell. */
export function normalizePaperTableMarkdown(value: string): string {
  const output: string[] = [];
  let fence: MarkdownFence | undefined;
  let paperTableOpen = false;

  for (const line of linesWithEndings(value)) {
    const content = lineContent(line);
    if (fence) {
      output.push(line);
      if (closesFence(content, fence)) fence = undefined;
      continue;
    }

    const nextFence = openingFence(content);
    if (nextFence) {
      fence = nextFence;
      output.push(line);
    } else if (OPEN.test(content)) {
      if (paperTableOpen) throw new Error('Nested PaperTable is unsupported.');
      paperTableOpen = true;
    } else if (CLOSE.test(content)) {
      if (!paperTableOpen) {
        throw new Error('PaperTable closing tag has no opening tag.');
      }
      paperTableOpen = false;
    } else if (PREFIX.test(content)) {
      throw new Error(`Malformed PaperTable wrapper: ${content.trim()}`);
    } else {
      output.push(line);
    }
  }

  if (paperTableOpen) throw new Error('PaperTable is not closed.');
  return output.join('');
}
