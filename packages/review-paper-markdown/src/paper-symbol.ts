import type { Data, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

export const PAPER_SYMBOL_NAMES = ["computer"] as const;
export const PAPER_SYMBOL_VARIANTS = ["full", "half", "four-fifths"] as const;
export const PAPER_SYMBOL_SIZES = ["sm", "md", "lg"] as const;
export const PAPER_SYMBOL_GROUP_GAPS = ["sm", "md", "lg"] as const;

export type PaperSymbolName = (typeof PAPER_SYMBOL_NAMES)[number];
export type PaperSymbolVariant = (typeof PAPER_SYMBOL_VARIANTS)[number];
export type PaperSymbolSize = (typeof PAPER_SYMBOL_SIZES)[number];
export type PaperSymbolGroupGap = (typeof PAPER_SYMBOL_GROUP_GAPS)[number];

const SYMBOL_PROPS = ["name", "size", "variant"] as const;
const GROUP_PROPS = ["gap"] as const;
const DEFAULT_VARIANT = "full" satisfies PaperSymbolVariant;
const DEFAULT_SIZE = "md" satisfies PaperSymbolSize;
const DEFAULT_GAP = "md" satisfies PaperSymbolGroupGap;

const SIZE_PX = {
  sm: 16,
  md: 20,
  lg: 28,
} as const satisfies Record<PaperSymbolSize, number>;

const VARIANT_RATIO = {
  full: 1,
  half: 0.5,
  "four-fifths": 0.8,
} as const satisfies Record<PaperSymbolVariant, number>;

const VARIANT_LABEL = {
  full: "One full",
  half: "One half of a",
  "four-fifths": "Four fifths of a",
} as const satisfies Record<PaperSymbolVariant, string>;

const GROUP_GAP_PX = {
  sm: 4,
  md: 8,
  lg: 12,
} as const satisfies Record<PaperSymbolGroupGap, number>;

const MARKDOWN_FENCE = /^ {0,3}(`{3,}|~{3,})/;
const PAPER_SYMBOL_TOKEN = /<\/?PaperSymbol(?:Group)?\b/;
const PAPER_SYMBOL_GROUP =
  /<PaperSymbolGroup\b(?<attributes>[^>]*)>(?<children>[\s\S]*?)<\/PaperSymbolGroup>/g;
const PAPER_SYMBOL = /<PaperSymbol\b(?<attributes>[^>]*)\/>/g;
const PAPER_SYMBOL_REMAINDER = /<\/?PaperSymbol(?:Group)?\b/;
const STATIC_ATTRIBUTE = /\s+([A-Za-z][A-Za-z0-9_-]*)\s*=\s*(["'])(.*?)\2/y;

type MarkdownFence = Readonly<{ character: "`" | "~"; length: number }>;

type MdxElement = Extract<
  RootContent,
  { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }
>;

type NativeNodeData = Data &
  Readonly<{
    hName: string;
    hProperties?: NativeProperties;
  }>;

type NativeProperties = Readonly<Record<string, string | number | boolean>>;

type NativeNode = {
  children: NativeNode[];
  data: NativeNodeData;
  type: "paperSymbolNative";
};

function isOneOf<Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value {
  return (
    typeof value === "string" && (values as readonly string[]).includes(value)
  );
}

function openingFence(value: string): MarkdownFence | undefined {
  const match = value.match(MARKDOWN_FENCE);
  return match
    ? {
        character: match[1][0] as MarkdownFence["character"],
        length: match[1].length,
      }
    : undefined;
}

function closesFence(value: string, fence: MarkdownFence): boolean {
  return new RegExp(`^ {0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(
    value,
  );
}

function isMdxElement(node: RootContent, name: string): node is MdxElement {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === name
  );
}

function isWhitespace(node: RootContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}

function staticAttributes(
  node: MdxElement,
  componentName: string,
  allowed: readonly string[],
): Record<string, string> {
  const values: Record<string, string> = {};

  for (const attribute of node.attributes ?? []) {
    if (
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.name !== "string" ||
      typeof attribute.value !== "string"
    ) {
      throw new Error(
        `${componentName} supports only static quoted-string props: ${allowed.join(", ")}.`,
      );
    }
    if (!allowed.includes(attribute.name)) {
      throw new Error(
        `${componentName} prop ${JSON.stringify(attribute.name)} is unsupported; supported props: ${allowed.join(", ")}.`,
      );
    }
    if (Object.hasOwn(values, attribute.name)) {
      throw new Error(
        `${componentName} prop ${JSON.stringify(attribute.name)} must be authored once.`,
      );
    }
    values[attribute.name] = attribute.value;
  }

  return values;
}

function nativeNode(
  hName: string,
  hProperties: NativeProperties,
  children: NativeNode[] = [],
): NativeNode {
  return {
    children,
    data: { hName, hProperties },
    type: "paperSymbolNative",
  };
}

function computerSvg(size: PaperSymbolSize): NativeNode {
  const sizePx = SIZE_PX[size];
  const pathProperties = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
  };

  return nativeNode(
    "svg",
    {
      "aria-hidden": "true",
      fill: "currentColor",
      focusable: "false",
      height: sizePx,
      preserveAspectRatio: "xMinYMid meet",
      style: "display:block;max-width:none;flex:none",
      viewBox: "0 0 24 24",
      width: sizePx,
      xmlns: "http://www.w3.org/2000/svg",
    },
    [
      nativeNode("rect", {
        fill: "currentColor",
        height: 14,
        rx: 2,
        stroke: "currentColor",
        strokeWidth: 1.5,
        width: 20,
        x: 2,
        y: 3,
      }),
      nativeNode("path", { ...pathProperties, d: "M8 21h8" }),
      nativeNode("path", { ...pathProperties, d: "M12 17v4" }),
    ],
  );
}

function attributesFromSource(
  source: string,
  componentName: string,
  allowed: readonly string[],
): Record<string, string> {
  const values: Record<string, string> = {};
  let offset = 0;

  while (offset < source.length) {
    if (/^\s*$/.test(source.slice(offset))) break;
    STATIC_ATTRIBUTE.lastIndex = offset;
    const match = STATIC_ATTRIBUTE.exec(source);
    if (!match) {
      throw new Error(
        `${componentName} supports only static quoted-string props: ${allowed.join(", ")}.`,
      );
    }
    const [, name, , value] = match;
    if (!allowed.includes(name)) {
      throw new Error(
        `${componentName} prop ${JSON.stringify(name)} is unsupported; supported props: ${allowed.join(", ")}.`,
      );
    }
    if (Object.hasOwn(values, name)) {
      throw new Error(
        `${componentName} prop ${JSON.stringify(name)} must be authored once.`,
      );
    }
    values[name] = value;
    offset = STATIC_ATTRIBUTE.lastIndex;
  }

  return values;
}

function validateSymbolValues(attributes: Record<string, string>): {
  name: PaperSymbolName;
  size: PaperSymbolSize;
  variant: PaperSymbolVariant;
} {
  if (!isOneOf(PAPER_SYMBOL_NAMES, attributes.name)) {
    throw new Error(
      `PaperSymbol prop "name" received ${JSON.stringify(attributes.name)}; allowed values: ${PAPER_SYMBOL_NAMES.join(", ")}.`,
    );
  }
  if (
    attributes.variant !== undefined &&
    !isOneOf(PAPER_SYMBOL_VARIANTS, attributes.variant)
  ) {
    throw new Error(
      `PaperSymbol prop "variant" received ${JSON.stringify(attributes.variant)}; allowed values: ${PAPER_SYMBOL_VARIANTS.join(", ")}.`,
    );
  }
  if (
    attributes.size !== undefined &&
    !isOneOf(PAPER_SYMBOL_SIZES, attributes.size)
  ) {
    throw new Error(
      `PaperSymbol prop "size" received ${JSON.stringify(attributes.size)}; allowed values: ${PAPER_SYMBOL_SIZES.join(", ")}.`,
    );
  }

  return {
    name: attributes.name,
    size: attributes.size ?? DEFAULT_SIZE,
    variant: attributes.variant ?? DEFAULT_VARIANT,
  };
}

function paperSymbolHtml(attributesSource: string): string {
  const { name, size, variant } = validateSymbolValues(
    attributesFromSource(attributesSource, "PaperSymbol", SYMBOL_PROPS),
  );
  const sizePx = SIZE_PX[size];
  const visibleWidth = Math.round(sizePx * VARIANT_RATIO[variant] * 100) / 100;
  const label = `${VARIANT_LABEL[variant]} ${name} pictogram symbol`;

  return [
    `<span aria-label="${label}" data-paper-symbol="" data-paper-symbol-name="${name}" data-paper-symbol-size="${size}" data-paper-symbol-variant="${variant}" role="img" style="display:inline-flex;flex:none;overflow:hidden;vertical-align:middle;line-height:1;height:${sizePx}px;width:${visibleWidth}px">`,
    `<svg aria-hidden="true" fill="currentColor" focusable="false" height="${sizePx}" preserveAspectRatio="xMinYMid meet" style="display:block;max-width:none;flex:none" viewBox="0 0 24 24" width="${sizePx}" xmlns="http://www.w3.org/2000/svg">`,
    '<rect fill="currentColor" height="14" rx="2" stroke="currentColor" stroke-width="1.5" width="20" x="2" y="3"></rect>',
    '<path d="M8 21h8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    '<path d="M12 17v4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    "</svg></span>",
  ].join("");
}

function replacePaperSymbolChunk(chunk: string): string {
  const withGroups = chunk.replace(
    PAPER_SYMBOL_GROUP,
    (_match, _attributes, _children, _offset, _source, groups) => {
      const attributes = attributesFromSource(
        groups.attributes,
        "PaperSymbolGroup",
        GROUP_PROPS,
      );
      if (
        attributes.gap !== undefined &&
        !isOneOf(PAPER_SYMBOL_GROUP_GAPS, attributes.gap)
      ) {
        throw new Error(
          `PaperSymbolGroup prop "gap" received ${JSON.stringify(attributes.gap)}; allowed values: ${PAPER_SYMBOL_GROUP_GAPS.join(", ")}.`,
        );
      }
      const renderedChildren: string[] = [];
      const remainder = groups.children.replace(
        PAPER_SYMBOL,
        (
          _symbolMatch: string,
          _symbolAttributes: string,
          ...args: unknown[]
        ) => {
          const symbolGroups = args.at(-1) as
            { attributes: string } | undefined;
          const rendered = paperSymbolHtml(symbolGroups?.attributes ?? "");
          renderedChildren.push(rendered);
          return "";
        },
      );
      if (renderedChildren.length === 0 || remainder.trim()) {
        throw new Error(
          "PaperSymbolGroup requires one or more direct PaperSymbol children.",
        );
      }
      const gap = attributes.gap ?? DEFAULT_GAP;
      return `<span data-paper-symbol-group="" data-paper-symbol-group-gap="${gap}" style="display:inline-flex;align-items:center;vertical-align:middle;column-gap:${GROUP_GAP_PX[gap]}px">${renderedChildren.join("")}</span>`;
    },
  );

  const rendered = withGroups.replace(
    PAPER_SYMBOL,
    (_match, _attributes, _offset, _source, groups) =>
      paperSymbolHtml(groups.attributes),
  );
  if (PAPER_SYMBOL_REMAINDER.test(rendered)) {
    throw new Error("Malformed or unmatched PaperSymbol markup.");
  }
  return rendered;
}

/**
 * Convert authored symbols to inert inline HTML for non-MDX renderers while
 * preserving fenced examples byte-for-byte.
 */
export function toPaperSymbolCompatibilityMarkdown(markdown: string): string {
  if (!PAPER_SYMBOL_TOKEN.test(markdown)) return markdown;

  const lines = markdown.match(/.*(?:\r\n|\n|$)/g)?.filter(Boolean) ?? [];
  const output: string[] = [];
  let activeChunk = "";
  let fence: MarkdownFence | undefined;

  const flush = () => {
    if (activeChunk) {
      output.push(replacePaperSymbolChunk(activeChunk));
      activeChunk = "";
    }
  };

  for (const line of lines) {
    const content = line.replace(/\r?\n$/, "");
    if (fence) {
      output.push(line);
      if (closesFence(content, fence)) fence = undefined;
      continue;
    }

    const nextFence = openingFence(content);
    if (nextFence) {
      flush();
      fence = nextFence;
      output.push(line);
    } else {
      activeChunk += line;
    }
  }
  flush();
  return output.join("");
}

function paperSymbolNode(node: MdxElement): NativeNode {
  const attributes = staticAttributes(node, "PaperSymbol", SYMBOL_PROPS);
  const { name, size, variant } = validateSymbolValues(attributes);
  if (node.children.some((child) => !isWhitespace(child))) {
    throw new Error(
      "PaperSymbol must be empty and authored as a self-closing component.",
    );
  }

  const sizePx = SIZE_PX[size];
  const visibleWidth = Math.round(sizePx * VARIANT_RATIO[variant] * 100) / 100;

  return nativeNode(
    "span",
    {
      "aria-label": `${VARIANT_LABEL[variant]} ${name} pictogram symbol`,
      dataPaperSymbol: "",
      dataPaperSymbolName: name,
      dataPaperSymbolSize: size,
      dataPaperSymbolVariant: variant,
      role: "img",
      style: `display:inline-flex;flex:none;overflow:hidden;vertical-align:middle;line-height:1;height:${sizePx}px;width:${visibleWidth}px`,
    },
    [computerSvg(size)],
  );
}

function paperSymbolGroupNode(node: MdxElement): NativeNode {
  const attributes = staticAttributes(node, "PaperSymbolGroup", GROUP_PROPS);
  if (
    attributes.gap !== undefined &&
    !isOneOf(PAPER_SYMBOL_GROUP_GAPS, attributes.gap)
  ) {
    throw new Error(
      `PaperSymbolGroup prop "gap" received ${JSON.stringify(attributes.gap)}; allowed values: ${PAPER_SYMBOL_GROUP_GAPS.join(", ")}.`,
    );
  }

  const children = node.children.filter(
    (child): child is MdxElement =>
      !isWhitespace(child) && isMdxElement(child, "PaperSymbol"),
  );
  if (
    children.length === 0 ||
    node.children.some(
      (child) => !isWhitespace(child) && !isMdxElement(child, "PaperSymbol"),
    )
  ) {
    throw new Error(
      "PaperSymbolGroup requires one or more direct PaperSymbol children.",
    );
  }

  const gap = attributes.gap ?? DEFAULT_GAP;
  return nativeNode(
    "span",
    {
      dataPaperSymbolGroup: "",
      dataPaperSymbolGroupGap: gap,
      style: `display:inline-flex;align-items:center;vertical-align:middle;column-gap:${GROUP_GAP_PX[gap]}px`,
    },
    children.map(paperSymbolNode),
  );
}

function transformChildren(parent: Root | Parent): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index] as RootContent;
    if (isMdxElement(child, "PaperSymbol")) {
      parent.children[index] = paperSymbolNode(child) as unknown as RootContent;
    } else if (isMdxElement(child, "PaperSymbolGroup")) {
      parent.children[index] = paperSymbolGroupNode(
        child,
      ) as unknown as RootContent;
    } else if ("children" in child) {
      transformChildren(child);
    }
  }
}

/**
 * Validate PaperSymbol authoring and convert it to native span/SVG nodes for
 * all ReactMarkdown and static review renderers.
 */
export const remarkPaperSymbol: Plugin<[], Root> = () => (tree) => {
  transformChildren(tree);
};
