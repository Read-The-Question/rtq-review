import {
  stripPaperImageListWrapperLines,
  stripPaperListWrapperLines,
} from '@rtq/review-paper-markdown';
import {
  validatePaperImageListMarkdown,
  validatePaperListMarkdown,
} from '@rtq/review-paper-markdown/validate';

export type PreparedPaperListMarkdown = Readonly<{
  issue?: string;
  markdown: string;
}>;

export function preparePaperListMarkdown(
  markdown: string,
): PreparedPaperListMarkdown {
  try {
    validatePaperListMarkdown(markdown);
    validatePaperImageListMarkdown(markdown);
    return { markdown };
  } catch (error) {
    return {
      issue:
        error instanceof Error
          ? error.message
          : 'PaperList preparation failed.',
      markdown: stripPaperImageListWrapperLines(
        stripPaperListWrapperLines(markdown),
      ),
    };
  }
}
