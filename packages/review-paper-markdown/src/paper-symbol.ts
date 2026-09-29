import type { Data, Parent, Root, RootContent } from "mdast";
import type { Plugin } from "unified";

export const PAPER_SYMBOL_NAMES = [
  "computer",
  "lorry",
  "woodlouse",
  "square",
  "circle",
  "triangle",
  "hexagon",
  "diamond",
  "sun",
  "club-suit",
  "smiling-face",
  "black-triangle",
  "black-heart",
] as const;
export const PAPER_SYMBOL_VARIANTS = ["full", "half", "four-fifths"] as const;
export const PAPER_SYMBOL_SIZES = ["sm", "md", "lg", "xl"] as const;
export const PAPER_SYMBOL_GROUP_GAPS = ["sm", "md", "lg"] as const;

export type PaperSymbolName = (typeof PAPER_SYMBOL_NAMES)[number];
export type PaperSymbolVariant = (typeof PAPER_SYMBOL_VARIANTS)[number];
export type PaperSymbolSize = (typeof PAPER_SYMBOL_SIZES)[number];
export type PaperSymbolGroupGap = (typeof PAPER_SYMBOL_GROUP_GAPS)[number];

const SYMBOL_PROPS = ["name", "size", "variant"] as const;
const GROUP_PROPS = ["gap"] as const;
const SPACE_PROPS = ["size"] as const;
const DEFAULT_VARIANT = "full" satisfies PaperSymbolVariant;
const DEFAULT_SIZE = "md" satisfies PaperSymbolSize;
const DEFAULT_GAP = "md" satisfies PaperSymbolGroupGap;

const SIZE_PX = {
  sm: 16,
  md: 20,
  lg: 28,
  xl: 48,
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
const PAPER_SYMBOL_TOKEN = /<\/?PaperSymbol(?:Group|Space)?\b/;
const PAPER_SYMBOL_GROUP =
  /<PaperSymbolGroup\b(?<attributes>[^>]*)>(?<children>[\s\S]*?)<\/PaperSymbolGroup>/g;
const PAPER_SYMBOL_SPACE = /<PaperSymbolSpace\b(?<attributes>[^>]*)\/>/g;
const PAPER_SYMBOL = /<PaperSymbol\b(?<attributes>[^>]*)\/>/g;
const PAPER_SYMBOL_REMAINDER = /<\/?PaperSymbol(?:Group|Space)?\b/;
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
    fill: "currentColor",
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

function lorrySvg(size: PaperSymbolSize): NativeNode {
  const sizePx = SIZE_PX[size];
  const shapeProperties = {
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
      fill: "none",
      focusable: "false",
      height: sizePx,
      preserveAspectRatio: "xMinYMid meet",
      style: "display:block;max-width:none;flex:none",
      viewBox: "0 0 24 24",
      width: sizePx,
      xmlns: "http://www.w3.org/2000/svg",
    },
    [
      nativeNode("path", {
        ...shapeProperties,
        d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
      }),
      nativeNode("path", {
        ...shapeProperties,
        d: "M15 18H9",
      }),
      nativeNode("path", {
        ...shapeProperties,
        d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      }),
      nativeNode("circle", {
        ...shapeProperties,
        cx: 17,
        cy: 18,
        r: 2,
      }),
      nativeNode("circle", {
        ...shapeProperties,
        cx: 7,
        cy: 18,
        r: 2,
      }),
    ],
  );
}

function woodlouseSvg(size: PaperSymbolSize): NativeNode {
  const sizePx = SIZE_PX[size];
  const pathProperties = {
    fill: "currentColor",
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
      nativeNode("path", { ...pathProperties, d: "M12 20v-9" }),
      nativeNode("path", {
        ...pathProperties,
        d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",
      }),
      nativeNode("path", { ...pathProperties, d: "M14.12 3.88 16 2" }),
      nativeNode("path", {
        ...pathProperties,
        d: "M21 21a4 4 0 0 0-3.81-4",
      }),
      nativeNode("path", {
        ...pathProperties,
        d: "M21 5a4 4 0 0 1-3.55 3.97",
      }),
      nativeNode("path", { ...pathProperties, d: "M22 13h-4" }),
      nativeNode("path", {
        ...pathProperties,
        d: "M3 21a4 4 0 0 1 3.81-4",
      }),
      nativeNode("path", {
        ...pathProperties,
        d: "M3 5a4 4 0 0 0 3.55 3.97",
      }),
      nativeNode("path", { ...pathProperties, d: "M6 13H2" }),
      nativeNode("path", { ...pathProperties, d: "m8 2 1.88 1.88" }),
      nativeNode("path", {
        ...pathProperties,
        d: "M9 7.13V6a3 3 0 1 1 6 0v1.13",
      }),
    ],
  );
}

function clubSuitSvg(size: PaperSymbolSize): NativeNode {
  const sizePx = SIZE_PX[size];
  const pathProperties = {
    fill: "currentColor",
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
      nativeNode("path", {
        ...pathProperties,
        d: "M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z",
      }),
      nativeNode("path", {
        ...pathProperties,
        d: "M12 17.66L12 22",
      }),
    ],
  );
}

type GeometricSymbolName = Extract<
  PaperSymbolName,
  | "circle"
  | "diamond"
  | "hexagon"
  | "smiling-face"
  | "square"
  | "sun"
  | "triangle"
>;

function geometricSvg(
  name: GeometricSymbolName,
  size: PaperSymbolSize,
): NativeNode {
  const sizePx = SIZE_PX[size];
  const shapeProperties = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
  };
  let shapes: NativeNode[];

  switch (name) {
    case "square":
      shapes = [
        nativeNode("rect", {
          ...shapeProperties,
          height: 18,
          rx: 2,
          width: 18,
          x: 3,
          y: 3,
        }),
      ];
      break;
    case "circle":
      shapes = [
        nativeNode("circle", {
          ...shapeProperties,
          cx: 12,
          cy: 12,
          r: 10,
        }),
      ];
      break;
    case "triangle":
      shapes = [
        nativeNode("path", {
          ...shapeProperties,
          d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
        }),
      ];
      break;
    case "hexagon":
      shapes = [
        nativeNode("path", {
          ...shapeProperties,
          d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        }),
      ];
      break;
    case "diamond":
      shapes = [
        nativeNode("path", {
          ...shapeProperties,
          d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
        }),
      ];
      break;
    case "sun":
      shapes = [
        nativeNode("circle", {
          ...shapeProperties,
          cx: 12,
          cy: 12,
          r: 4,
        }),
        ...[
          "M12 2v2",
          "M12 20v2",
          "m4.93 4.93 1.41 1.41",
          "m17.66 17.66 1.41 1.41",
          "M2 12h2",
          "M20 12h2",
          "m6.34 17.66-1.41 1.41",
          "m19.07 4.93-1.41 1.41",
        ].map((d) => nativeNode("path", { ...shapeProperties, d })),
      ];
      break;
    case "smiling-face":
      shapes = [
        nativeNode("circle", {
          ...shapeProperties,
          cx: 12,
          cy: 12,
          r: 10,
        }),
        nativeNode("path", {
          ...shapeProperties,
          d: "M8 14s1.5 2 4 2 4-2 4-2",
        }),
        nativeNode("line", {
          ...shapeProperties,
          x1: 9,
          x2: 9.01,
          y1: 9,
          y2: 9,
        }),
        nativeNode("line", {
          ...shapeProperties,
          x1: 15,
          x2: 15.01,
          y1: 9,
          y2: 9,
        }),
      ];
      break;
  }

  return nativeNode(
    "svg",
    {
      "aria-hidden": "true",
      fill: "none",
      focusable: "false",
      height: sizePx,
      preserveAspectRatio: "xMinYMid meet",
      style: "display:block;max-width:none;flex:none",
      viewBox: "0 0 24 24",
      width: sizePx,
      xmlns: "http://www.w3.org/2000/svg",
    },
    shapes,
  );
}

function symbolSvg(name: PaperSymbolName, size: PaperSymbolSize): NativeNode {
  switch (name) {
    case "lorry":
      return lorrySvg(size);
    case "woodlouse":
      return woodlouseSvg(size);
    case "club-suit":
      return clubSuitSvg(size);
    case "black-triangle":
    case "black-heart":
      return filledShapeSvg(name, size);
    case "square":
    case "circle":
    case "triangle":
    case "hexagon":
    case "diamond":
    case "sun":
    case "smiling-face":
      return geometricSvg(name, size);
    default:
      return computerSvg(size);
  }

  function filledShapeSvg(
    name: Extract<PaperSymbolName, "black-heart" | "black-triangle">,
    size: PaperSymbolSize,
  ): NativeNode {
    const sizePx = SIZE_PX[size];
    const d =
      name === "black-triangle"
        ? "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
        : "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5";

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
        nativeNode("path", {
          d,
          fill: "currentColor",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
        }),
      ],
    );
  }
}

function symbolSvgHtml(name: PaperSymbolName): readonly string[] {
  if (name === "square") {
    return [
      '<rect fill="none" height="18" rx="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" width="18" x="3" y="3"></rect>',
    ];
  }
  if (name === "circle") {
    return [
      '<circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>',
    ];
  }
  if (name === "triangle") {
    return [
      '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "hexagon") {
    return [
      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "diamond") {
    return [
      '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "sun") {
    const shapeAttributes =
      'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"';
    return [
      `<circle cx="12" cy="12" r="4" ${shapeAttributes}></circle>`,
      ...[
        "M12 2v2",
        "M12 20v2",
        "m4.93 4.93 1.41 1.41",
        "m17.66 17.66 1.41 1.41",
        "M2 12h2",
        "M20 12h2",
        "m6.34 17.66-1.41 1.41",
        "m19.07 4.93-1.41 1.41",
      ].map((d) => `<path d="${d}" ${shapeAttributes}></path>`),
    ];
  }
  if (name === "club-suit") {
    return [
      '<path d="M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M12 17.66L12 22" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "smiling-face") {
    const shapeAttributes =
      'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"';
    return [
      `<circle cx="12" cy="12" r="10" ${shapeAttributes}></circle>`,
      `<path d="M8 14s1.5 2 4 2 4-2 4-2" ${shapeAttributes}></path>`,
      `<line x1="9" x2="9.01" y1="9" y2="9" ${shapeAttributes}></line>`,
      `<line x1="15" x2="15.01" y1="9" y2="9" ${shapeAttributes}></line>`,
    ];
  }
  if (name === "black-triangle") {
    return [
      '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "black-heart") {
    return [
      '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }
  if (name === "lorry") {
    return [
      '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M15 18H9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<circle cx="17" cy="18" fill="none" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>',
      '<circle cx="7" cy="18" fill="none" r="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>',
    ];
  }
  if (name === "woodlouse") {
    return [
      '<path d="M12 20v-9" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M14.12 3.88 16 2" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M21 21a4 4 0 0 0-3.81-4" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M21 5a4 4 0 0 1-3.55 3.97" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M22 13h-4" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M3 21a4 4 0 0 1 3.81-4" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M3 5a4 4 0 0 0 3.55 3.97" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M6 13H2" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="m8 2 1.88 1.88" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
      '<path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    ];
  }

  return [
    '<rect fill="currentColor" height="14" rx="2" stroke="currentColor" stroke-width="1.5" width="20" x="2" y="3"></rect>',
    '<path d="M8 21h8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
    '<path d="M12 17v4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>',
  ];
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
  const fill =
    name === "computer" ||
    name === "woodlouse" ||
    name === "club-suit" ||
    name === "black-triangle" ||
    name === "black-heart"
      ? "currentColor"
      : "none";

  return [
    `<span aria-label="${label}" data-paper-symbol="" data-paper-symbol-name="${name}" data-paper-symbol-size="${size}" data-paper-symbol-variant="${variant}" role="img" style="display:inline-flex;flex:none;overflow:hidden;vertical-align:middle;line-height:1;height:${sizePx}px;width:${visibleWidth}px">`,
    `<svg aria-hidden="true" fill="${fill}" focusable="false" height="${sizePx}" preserveAspectRatio="xMinYMid meet" style="display:block;max-width:none;flex:none" viewBox="0 0 24 24" width="${sizePx}" xmlns="http://www.w3.org/2000/svg">`,
    ...symbolSvgHtml(name),
    "</svg></span>",
  ].join("");
}

function paperSymbolSpaceHtml(attributesSource: string): string {
  const attributes = attributesFromSource(
    attributesSource,
    "PaperSymbolSpace",
    SPACE_PROPS,
  );
  if (
    attributes.size !== undefined &&
    !isOneOf(PAPER_SYMBOL_SIZES, attributes.size)
  ) {
    throw new Error(
      `PaperSymbolSpace prop "size" received ${JSON.stringify(attributes.size)}; allowed values: ${PAPER_SYMBOL_SIZES.join(", ")}.`,
    );
  }
  const size = attributes.size ?? DEFAULT_SIZE;
  const sizePx = SIZE_PX[size];
  return `<span aria-hidden="true" data-paper-symbol-space="" data-paper-symbol-space-size="${size}" style="display:inline-block;flex:none;vertical-align:middle;height:${sizePx}px;width:${sizePx}px"></span>`;
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

  const withSpaces = withGroups.replace(
    PAPER_SYMBOL_SPACE,
    (_match, _attributes, _offset, _source, groups) =>
      paperSymbolSpaceHtml(groups.attributes),
  );
  const rendered = withSpaces.replace(
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
    [symbolSvg(name, size)],
  );
}

function paperSymbolSpaceNode(node: MdxElement): NativeNode {
  const attributes = staticAttributes(node, "PaperSymbolSpace", SPACE_PROPS);
  if (
    attributes.size !== undefined &&
    !isOneOf(PAPER_SYMBOL_SIZES, attributes.size)
  ) {
    throw new Error(
      `PaperSymbolSpace prop "size" received ${JSON.stringify(attributes.size)}; allowed values: ${PAPER_SYMBOL_SIZES.join(", ")}.`,
    );
  }
  if (node.children.some((child) => !isWhitespace(child))) {
    throw new Error(
      "PaperSymbolSpace must be empty and authored as a self-closing component.",
    );
  }

  const size = attributes.size ?? DEFAULT_SIZE;
  const sizePx = SIZE_PX[size];
  return nativeNode("span", {
    "aria-hidden": "true",
    dataPaperSymbolSpace: "",
    dataPaperSymbolSpaceSize: size,
    style: `display:inline-block;flex:none;vertical-align:middle;height:${sizePx}px;width:${sizePx}px`,
  });
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
    } else if (isMdxElement(child, "PaperSymbolSpace")) {
      parent.children[index] = paperSymbolSpaceNode(
        child,
      ) as unknown as RootContent;
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
