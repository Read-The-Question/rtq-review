import type {
  Blockquote,
  Data,
  Parent,
  Paragraph,
  Root,
  RootContent,
} from "mdast";
import type { Plugin } from "unified";

type MdxFlowElement = Extract<RootContent, { type: "mdxJsxFlowElement" }>;
type MdxTextElement = Extract<RootContent, { type: "mdxJsxTextElement" }>;

type PaperAuthorNoteData = Data &
  Readonly<{
    hName: "aside";
    hProperties: Readonly<Record<string, unknown>>;
  }>;

const PAPER_AUTHOR_NOTE_OPEN = /^<PaperAuthorNote>$/;
const PAPER_AUTHOR_NOTE_CLOSE = /^<\/PaperAuthorNote>$/;
const PAPER_AUTHOR_NOTE_TOKEN = /<\/?PaperAuthorNote\b/;

function isMdxPaperAuthorNote(node: RootContent): node is MdxFlowElement {
  return node.type === "mdxJsxFlowElement" && node.name === "PaperAuthorNote";
}

function isInlineMdxPaperAuthorNote(node: RootContent): node is MdxTextElement {
  return node.type === "mdxJsxTextElement" && node.name === "PaperAuthorNote";
}

function rawTag(node: RootContent): string | undefined {
  return node.type === "html" ? node.value.trim() : undefined;
}

function noteLabel(): Paragraph {
  return {
    type: "paragraph",
    children: [{ type: "text", value: "Paper author note · internal only" }],
    data: {
      hName: "header",
      hProperties: { className: ["paper-author-note__label"] },
    },
  };
}

function noteData(): PaperAuthorNoteData {
  return {
    hName: "aside",
    hProperties: {
      "aria-label": "Paper author note — internal only",
      className: ["paper-author-note"],
      dataPaperAuthorNote: "",
      role: "note",
    },
  };
}

function paperAuthorNote(children: readonly RootContent[]): Blockquote {
  if (children.length === 0) {
    throw new Error("PaperAuthorNote must contain reviewable content.");
  }

  return {
    type: "blockquote",
    children: [noteLabel(), ...children] as Blockquote["children"],
    data: noteData(),
  };
}

function transformMdxNote(node: MdxFlowElement): Blockquote {
  if ((node.attributes?.length ?? 0) > 0) {
    throw new Error("PaperAuthorNote does not accept attributes.");
  }

  transformChildren(node, true);
  return paperAuthorNote(node.children as RootContent[]);
}

function closingRawNoteIndex(
  parent: Root | Parent,
  openingIndex: number,
): number {
  for (
    let index = openingIndex + 1;
    index < parent.children.length;
    index += 1
  ) {
    const candidate = parent.children[index] as RootContent;
    const tag = rawTag(candidate);
    if (tag && PAPER_AUTHOR_NOTE_OPEN.test(tag)) {
      throw new Error("PaperAuthorNote cannot be nested.");
    }
    if (tag && PAPER_AUTHOR_NOTE_CLOSE.test(tag)) return index;
  }

  throw new Error("PaperAuthorNote opening tag has no matching closing tag.");
}

function transformChildren(parent: Root | Parent, insideNote = false): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;

    if (isInlineMdxPaperAuthorNote(child)) {
      throw new Error("PaperAuthorNote must be a standalone block.");
    }

    if (isMdxPaperAuthorNote(child)) {
      if (insideNote) throw new Error("PaperAuthorNote cannot be nested.");
      parent.children[index] = transformMdxNote(child) as RootContent;
      continue;
    }

    const tag = rawTag(child);
    if (tag && PAPER_AUTHOR_NOTE_OPEN.test(tag)) {
      if (insideNote) throw new Error("PaperAuthorNote cannot be nested.");
      if (parent.type === "paragraph") {
        throw new Error("PaperAuthorNote must be a standalone block.");
      }

      const closingIndex = closingRawNoteIndex(parent, index);
      const noteChildren = parent.children.slice(
        index + 1,
        closingIndex,
      ) as RootContent[];
      for (const noteChild of noteChildren) {
        if ("children" in noteChild) transformChildren(noteChild, true);
      }
      parent.children.splice(
        index,
        closingIndex - index + 1,
        paperAuthorNote(noteChildren) as RootContent,
      );
      continue;
    }

    if (tag && PAPER_AUTHOR_NOTE_CLOSE.test(tag)) {
      throw new Error(
        "PaperAuthorNote closing tag has no matching opening tag.",
      );
    }

    if (tag && PAPER_AUTHOR_NOTE_TOKEN.test(tag)) {
      throw new Error(`Malformed PaperAuthorNote wrapper: ${tag}`);
    }

    if ("children" in child) transformChildren(child, insideNote);
  }
}

/**
 * Render the internal-only PaperAuthorNote authoring primitive as a labelled,
 * semantic note while preserving its Markdown and maths descendants.
 */
export const remarkPaperAuthorNote: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};
