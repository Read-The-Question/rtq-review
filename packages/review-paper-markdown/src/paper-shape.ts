import type { Data, Parent, PhrasingContent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

export const PAPER_SHAPE_NAMES = [
  "square",
  "circle",
  "triangle",
  "hexagon",
] as const;
export const PAPER_SHAPE_PATTERNS = [
  "plain",
  "vertical-stripes",
  "wavy-hatch",
] as const;
export const PAPER_SHAPE_SIZES = ["xl", "2xl"] as const;

export type PaperShapeName = (typeof PAPER_SHAPE_NAMES)[number];
export type PaperShapePattern = (typeof PAPER_SHAPE_PATTERNS)[number];
export type PaperShapeSize = (typeof PAPER_SHAPE_SIZES)[number];

type MdxElement = Extract<
  RootContent,
  { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }
>;
type ShapeNode = {
  type: "paperShapeNative";
  children: PhrasingContent[];
  data: Data & {
    hName: "span";
    hProperties: {
      dataPaperShape: "";
      dataPaperShapeName: PaperShapeName;
      dataPaperShapePattern: PaperShapePattern;
      dataPaperShapeSize: PaperShapeSize;
    };
  };
};

function isPaperShape(node: RootContent): node is MdxElement {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "PaperShape"
  );
}

function shapeAttributes(node: MdxElement): Record<string, string> {
  const values: Record<string, string> = {};
  for (const attribute of node.attributes ?? []) {
    if (
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.value !== "string"
    ) {
      throw new Error("PaperShape supports only static quoted-string props.");
    }
    if (!["name", "pattern", "size"].includes(attribute.name)) {
      throw new Error(`PaperShape prop "${attribute.name}" is unsupported.`);
    }
    if (Object.hasOwn(values, attribute.name)) {
      throw new Error(
        `PaperShape prop "${attribute.name}" must be authored once.`,
      );
    }
    values[attribute.name] = attribute.value;
  }
  return values;
}

function isAllowed<Value extends string>(
  options: readonly Value[],
  value: string | undefined,
): value is Value {
  return value !== undefined && options.includes(value as Value);
}

function inlineChildren(node: MdxElement): PhrasingContent[] {
  const children =
    node.type === "mdxJsxFlowElement" &&
    node.children.length === 1 &&
    node.children[0].type === "paragraph"
      ? node.children[0].children
      : node.children;
  if (
    children.some(
      (child) =>
        ![
          "text",
          "inlineCode",
          "inlineMath",
          "emphasis",
          "strong",
          "delete",
          "link",
          "linkReference",
          "image",
          "imageReference",
          "break",
          "footnoteReference",
        ].includes(child.type),
    )
  ) {
    throw new Error("PaperShape supports only inline children.");
  }
  return children as PhrasingContent[];
}

function toShapeNode(node: MdxElement): ShapeNode {
  const attributes = shapeAttributes(node);
  if (!isAllowed(PAPER_SHAPE_NAMES, attributes.name)) {
    throw new Error(
      `PaperShape prop "name" must be square, circle, triangle, or hexagon.`,
    );
  }
  if (
    attributes.pattern !== undefined &&
    !isAllowed(PAPER_SHAPE_PATTERNS, attributes.pattern)
  ) {
    throw new Error(`PaperShape prop "pattern" is invalid.`);
  }
  if (
    attributes.size !== undefined &&
    !isAllowed(PAPER_SHAPE_SIZES, attributes.size)
  ) {
    throw new Error(`PaperShape prop "size" is invalid.`);
  }
  return {
    type: "paperShapeNative",
    children: inlineChildren(node),
    data: {
      hName: "span",
      hProperties: {
        dataPaperShape: "",
        dataPaperShapeName: attributes.name,
        dataPaperShapePattern: attributes.pattern ?? "plain",
        dataPaperShapeSize: attributes.size ?? "xl",
      },
    },
  };
}

function transformChildren(parent: Root | Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (isPaperShape(child)) {
      parent.children[index] = toShapeNode(child) as unknown as RootContent;
    } else if ("children" in child) {
      transformChildren(child);
    }
  }
}

/** Lower PaperShape MDX to an inert inline marker without serializing its children. */
export const remarkPaperShape: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};
