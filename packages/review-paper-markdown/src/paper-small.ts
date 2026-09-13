import type {
  Data,
  Emphasis,
  Parent,
  Paragraph,
  Root,
  RootContent,
} from "mdast";
import type { Plugin } from "unified";

type MdxFlowElement = Extract<RootContent, { type: "mdxJsxFlowElement" }>;
type MdxTextElement = Extract<RootContent, { type: "mdxJsxTextElement" }>;
type MdxElement = MdxFlowElement | MdxTextElement;
type PaperSmallProperties = Readonly<Record<string, string>>;

type PaperSmallData = Data &
  Readonly<{
    hName: "small";
    hProperties: PaperSmallProperties;
  }>;

function isPaperSmall(node: RootContent): node is MdxElement {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "PaperSmall"
  );
}

function paperSmallProperties(node: MdxElement): PaperSmallProperties {
  const properties: Record<string, string> = {};

  for (const attribute of node.attributes ?? []) {
    if (
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.name !== "string" ||
      typeof attribute.value !== "string"
    ) {
      continue;
    }
    if (
      attribute.name === "className" ||
      attribute.name === "dir" ||
      attribute.name === "id" ||
      attribute.name === "lang" ||
      attribute.name === "title" ||
      attribute.name.startsWith("aria-") ||
      attribute.name.startsWith("data-")
    ) {
      properties[attribute.name] = attribute.value;
    }
  }

  properties.dataPaperSmall = "";
  return properties;
}

function paperSmallData(node: MdxElement): PaperSmallData {
  return {
    hName: "small",
    hProperties: paperSmallProperties(node),
  };
}

function convertPaperSmall(node: MdxElement): readonly RootContent[] {
  if (node.type === "mdxJsxTextElement") {
    const small: Emphasis = {
      children: node.children,
      data: paperSmallData(node),
      type: "emphasis",
    };
    return [small];
  }

  const child = node.children[0];
  if (node.children.length === 1 && child?.type === "paragraph") {
    const small: Paragraph = {
      ...child,
      data: {
        ...child.data,
        ...paperSmallData(node),
      },
    };
    return [small];
  }

  // PaperSmall is phrasing content. Keep malformed flow content readable and
  // unstyled instead of leaving an unsupported MDX node for ReactMarkdown.
  return node.children;
}

function transformChildren(parent: Root | Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (isPaperSmall(child)) {
      const replacements = convertPaperSmall(child);
      parent.children.splice(index, 1, ...replacements);
      for (const replacement of replacements) {
        if ("children" in replacement) transformChildren(replacement);
      }
      index += replacements.length - 1;
    } else if ("children" in child) {
      transformChildren(child);
    }
  }
}

/** Convert the authored PaperSmall MDX primitive to semantic native small. */
export const remarkPaperSmall: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};
