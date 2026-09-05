type NodeLineRef = {
  inheritLineIndex: number | null;
  tagsLineIndex: number | null;
};

function splitEditableLines(raw: string) {
  const lineEnding = raw.includes('\r\n') ? '\r\n' : '\n';
  const hasTrailingNewline = raw.endsWith(lineEnding);
  const content = hasTrailingNewline
    ? raw.slice(0, raw.length - lineEnding.length)
    : raw;

  return {
    hasTrailingNewline,
    lineEnding,
    lines: content.length > 0 ? content.split(/\r?\n/) : [''],
  };
}

function scanNodeLineRefs(raw: string) {
  const refs = new Map<string, NodeLineRef>();
  const { lines } = splitEditableLines(raw);
  let sectionIndex = -1;
  let questionIndex = -1;
  let subquestionIndex = -1;
  let subsubquestionIndex = -1;
  let subquestionCounters = new Map<number, number>();
  let subsubquestionCounters = new Map<string, number>();
  let currentPath: string | null = null;

  const pathFor = (
    nextSectionIndex: number,
    nextQuestionIndex: number,
    nextSubquestionIndex: number | null = null,
    nextSubsubquestionIndex: number | null = null,
  ) => {
    const parts = [`s${nextSectionIndex}`, `q${nextQuestionIndex}`];

    if (nextSubquestionIndex !== null) {
      parts.push(`sq${nextSubquestionIndex}`);
    }

    if (nextSubsubquestionIndex !== null) {
      parts.push(`ssq${nextSubsubquestionIndex}`);
    }

    return parts.join('.');
  };

  for (const [lineIndex, line] of lines.entries()) {
    if (/^\[\[sections\]\]\s*$/.test(line)) {
      sectionIndex += 1;
      questionIndex = -1;
      subquestionIndex = -1;
      subsubquestionIndex = -1;
      subquestionCounters = new Map<number, number>();
      subsubquestionCounters = new Map<string, number>();
      currentPath = null;
      continue;
    }

    if (/^\[\[sections\.questions\]\]\s*$/.test(line)) {
      questionIndex += 1;
      subquestionIndex = -1;
      subsubquestionIndex = -1;
      currentPath = pathFor(sectionIndex, questionIndex);
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (/^\[\[sections\.questions\.subquestions\]\]\s*$/.test(line)) {
      const nextSubquestionIndex = subquestionCounters.get(questionIndex) ?? 0;
      subquestionCounters.set(questionIndex, nextSubquestionIndex + 1);
      subquestionIndex = nextSubquestionIndex;
      subsubquestionIndex = -1;
      currentPath = pathFor(sectionIndex, questionIndex, subquestionIndex);
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (
      /^\[\[sections\.questions\.subquestions\.subquestions\]\]\s*$/.test(line)
    ) {
      const key = `${questionIndex}:${subquestionIndex}`;
      const nextSubsubquestionIndex = subsubquestionCounters.get(key) ?? 0;
      subsubquestionCounters.set(key, nextSubsubquestionIndex + 1);
      subsubquestionIndex = nextSubsubquestionIndex;
      currentPath = pathFor(
        sectionIndex,
        questionIndex,
        subquestionIndex,
        subsubquestionIndex,
      );
      refs.set(currentPath, {
        inheritLineIndex: null,
        tagsLineIndex: null,
      });
      continue;
    }

    if (!currentPath) {
      continue;
    }

    const currentRef = refs.get(currentPath);

    if (!currentRef) {
      continue;
    }

    if (/^rtq-tags\s*=/.test(line)) {
      currentRef.tagsLineIndex = lineIndex;
    } else if (/^rtq-inherit-tags\s*=/.test(line)) {
      currentRef.inheritLineIndex = lineIndex;
    }
  }

  return { lines, refs };
}

function formatTagLine(tags: string[]) {
  return `rtq-tags = [${tags.map(tag => JSON.stringify(tag)).join(', ')}]`;
}

function formatInheritLine(value: boolean) {
  return `rtq-inherit-tags = ${value ? 'true' : 'false'}`;
}

function preserveTrailingNewline(raw: string, lines: string[]) {
  const { hasTrailingNewline, lineEnding } = splitEditableLines(raw);
  const normalized = lines.join(lineEnding);
  return hasTrailingNewline ? `${normalized}${lineEnding}` : normalized;
}

export function applyTagMutationToRaw(input: {
  explicitInherit: boolean | null;
  explicitTags: string[];
  nodePath: string;
  raw: string;
}) {
  const { lines, refs } = scanNodeLineRefs(input.raw);
  const targetRef = refs.get(input.nodePath);

  if (!targetRef?.tagsLineIndex && targetRef?.tagsLineIndex !== 0) {
    throw new Error(`Could not locate rtq-tags for ${input.nodePath}.`);
  }

  lines[targetRef.tagsLineIndex] = formatTagLine(input.explicitTags);

  if (input.explicitInherit !== null) {
    if (targetRef.inheritLineIndex === null) {
      lines.splice(
        targetRef.tagsLineIndex + 1,
        0,
        formatInheritLine(input.explicitInherit),
      );
    } else {
      lines[targetRef.inheritLineIndex] = formatInheritLine(
        input.explicitInherit,
      );
    }
  }

  return preserveTrailingNewline(input.raw, lines);
}
