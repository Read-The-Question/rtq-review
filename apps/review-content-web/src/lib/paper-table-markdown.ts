import { stripPaperTableWrapperLines } from '@rtq/review-paper-markdown';
import {
  hasMarkdownTable,
  validatePaperTableMarkdown,
} from '@rtq/review-paper-markdown/validate';

export type PreparedPaperTableMarkdown = Readonly<{
  hasTable: boolean;
  issue?: string;
  markdown: string;
}>;

/** Validate authored PaperTable configuration while preserving it for render. */
export function preparePaperTableMarkdown(
  markdown: string,
): PreparedPaperTableMarkdown {
  try {
    validatePaperTableMarkdown(markdown);
    return { hasTable: hasMarkdownTable(markdown), markdown };
  } catch (error) {
    const fallback = stripPaperTableWrapperLines(markdown);
    return {
      hasTable: hasMarkdownTable(fallback),
      issue:
        error instanceof Error
          ? error.message
          : 'PaperTable preparation failed.',
      markdown: fallback,
    };
  }
}
