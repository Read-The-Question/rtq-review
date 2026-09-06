export const WORKING_SECTION_PHASES = [
  'setup',
  'equations',
  'solve',
  'verify',
  'conclusion',
  'custom',
] as const;

export type WorkingSectionPhase = (typeof WORKING_SECTION_PHASES)[number];

export type ParsedWorkingSegment = Readonly<
  | {
      kind: 'flat';
      markdown: string;
    }
  | {
      kind: 'section';
      markdown: string;
      phase: WorkingSectionPhase;
      title?: string;
      visibility: 'hidden' | 'visible';
    }
>;

export type WorkingSectionParseResult = Readonly<{
  issue?: string;
  segments?: readonly ParsedWorkingSegment[];
}>;

const ATTRIBUTE = /([A-Za-z][A-Za-z0-9_-]*)\s*=\s*["']([^"']*)["']/g;
const OPENING = /^\s*<WorkingSection\b([^>]*)>\s*$/;
const CLOSING = /^\s*<\/WorkingSection>\s*$/;
const PHASES = new Set<string>(WORKING_SECTION_PHASES);

function attributes(value: string): Readonly<Record<string, string>> {
  return Object.fromEntries(
    [...value.matchAll(ATTRIBUTE)].map((match) => [match[1], match[2]]),
  );
}

function markdown(lines: readonly string[]): string {
  return lines.join('\n').trim();
}

export function parseWorkingSections(value: string): WorkingSectionParseResult {
  const lines = value.split('\n');
  const segments: ParsedWorkingSegment[] = [];
  let flatLines: string[] = [];
  let section:
    | {
        attributes: Readonly<Record<string, string>>;
        lines: string[];
      }
    | undefined;
  let encounteredWrapper = false;
  let fenceCharacter: '`' | '~' | undefined;

  const flushFlat = () => {
    const content = markdown(flatLines);
    if (content) segments.push({ kind: 'flat', markdown: content });
    flatLines = [];
  };

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const character = fence[1][0] as '`' | '~';
      if (!fenceCharacter) fenceCharacter = character;
      else if (fenceCharacter === character) fenceCharacter = undefined;
      if (section) section.lines.push(line);
      else flatLines.push(line);
      continue;
    }
    if (fenceCharacter) {
      if (section) section.lines.push(line);
      else flatLines.push(line);
      continue;
    }

    const opening = line.match(OPENING);
    if (opening) {
      encounteredWrapper = true;
      if (section) {
        return {
          issue: 'WorkingSection blocks cannot be nested.',
        };
      }
      flushFlat();
      section = { attributes: attributes(opening[1]), lines: [] };
      continue;
    }

    if (CLOSING.test(line)) {
      encounteredWrapper = true;
      if (!section) {
        return {
          issue: 'WorkingSection has a closing tag without an opening tag.',
        };
      }
      const phaseValue = section.attributes.phase?.trim().toLowerCase();
      const title = section.attributes.title?.trim();
      const visibilityValue = section.attributes.visibility
        ?.trim()
        .toLowerCase();
      segments.push({
        kind: 'section',
        markdown: markdown(section.lines),
        phase: PHASES.has(phaseValue ?? '')
          ? (phaseValue as WorkingSectionPhase)
          : 'custom',
        ...(title ? { title } : {}),
        visibility: visibilityValue === 'hidden' ? 'hidden' : 'visible',
      });
      section = undefined;
      continue;
    }

    if (section) section.lines.push(line);
    else flatLines.push(line);
  }

  if (section) {
    return { issue: 'WorkingSection is missing its closing tag.' };
  }

  flushFlat();
  return encounteredWrapper ? { segments } : {};
}
