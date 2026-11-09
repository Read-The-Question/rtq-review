import { parsePaperImageListColumns } from "./paper-image-list.ts";

/**
 * Review-site rendering of PaperImageList (web PRD D8/D9), for lists that
 * remarkPaperImageList marked with data-image-list.
 *
 * Same markup as rtq-web's PaperViewImageList: each image keeps its standalone
 * size and the list only places the items; paper-image-list.css reads a list
 * without columns as a stack below 28rem and side by side from there, and
 * keeps columns at every width. Decision D7: when several image versions are
 * visible, one list is drawn per version, stacked and labelled. Per-image
 * review chrome is drawn after the lists.
 */

export type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

export type PaperImageListVersion = Readonly<{
  label: string;
  version: string;
  /** The image's standalone width in CSS px, or null to fill the line. */
  width: number | null;
}>;

export type RehypePaperImageListOptions = Readonly<{
  /** Optional review chrome for one image, drawn after the sets. */
  chrome?: (image: HastNode) => HastNode | undefined;
  /** The image's versions in display order, or undefined if not an image. */
  resolve: (image: HastNode) => readonly PaperImageListVersion[] | undefined;
  /** The image as it should appear inside the list for one version. */
  select: (image: HastNode, version: string) => HastNode;
}>;

function formatNumber(value: number): string {
  return String(Number(value.toFixed(4)));
}

function element(
  tagName: string,
  properties: Record<string, unknown>,
  children: HastNode[] = [],
): HastNode {
  return { children, properties, tagName, type: "element" };
}

function text(value: string): HastNode {
  return { type: "text", value };
}

function isBlankText(node: HastNode): boolean {
  return node.type === "text" && (node.value ?? "").trim() === "";
}

/**
 * remark-rehype keeps hProperties keys as written ("data-image-list") while
 * parsed HTML uses hast property names ("dataImageList"); accept both.
 */
function propertyValue(node: HastNode, name: string): unknown {
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return node.properties?.[name] ?? node.properties?.[kebab];
}

function findImage(
  node: HastNode,
  resolve: RehypePaperImageListOptions["resolve"],
): HastNode | undefined {
  if (node.type === "element" && resolve(node)) return node;
  for (const child of node.children ?? []) {
    const found = findImage(child, resolve);
    if (found) return found;
  }
  return undefined;
}

type SetEntry = Readonly<{
  caption: HastNode[];
  image: HastNode;
  versions: readonly PaperImageListVersion[];
}>;

function getEntry(
  item: HastNode,
  resolve: RehypePaperImageListOptions["resolve"],
): SetEntry | undefined {
  const blocks = (item.children ?? []).filter((node) => !isBlankText(node));
  const [first, ...rest] = blocks;
  const leading =
    first?.tagName === "p"
      ? (first.children ?? []).filter((node) => !isBlankText(node))
      : first
        ? [first]
        : [];
  const imageIndex = leading.findIndex((node) => findImage(node, resolve));
  if (imageIndex === -1) return undefined;
  const image = findImage(leading[imageIndex]!, resolve)!;
  const caption = [
    ...leading.slice(imageIndex + 1),
    ...rest.flatMap((node) =>
      node.tagName === "p" ? (node.children ?? []) : [node],
    ),
  ];
  const [firstCaption] = caption;
  if (firstCaption?.type === "text") {
    caption[0] = {
      ...firstCaption,
      value: (firstCaption.value ?? "").trimStart(),
    };
  }
  return { caption, image, versions: resolve(image) ?? [] };
}

function buildList(
  list: HastNode,
  entries: readonly SetEntry[],
  version: PaperImageListVersion,
  select: RehypePaperImageListOptions["select"],
  showLabel: boolean,
): HastNode {
  const columns = parsePaperImageListColumns(
    String(propertyValue(list, "dataColumns") ?? ""),
  );
  const sized = entries.map((entry) => {
    const match = entry.versions.find(
      (candidate) => candidate.version === version.version,
    );
    return { entry, match, width: (match ?? entry.versions[0]!).width };
  });
  const widths = sized.map(({ width }) => width);
  const listedStyleType = String(
    propertyValue(list, "dataListStyleType") ?? "none",
  );
  const listStyle = [
    `--rtq-image-list-list-style: ${listedStyleType}`,
    ...(columns !== undefined
      ? [
          `--rtq-image-list-columns: ${columns}`,
          `--rtq-image-list-cell: ${
            widths.includes(null)
              ? "1fr"
              : `${formatNumber(Math.max(...(widths as number[])))}px`
          }`,
        ]
      : []),
  ].join("; ");

  const listItems = sized.map(({ entry, match, width }) =>
    element(
      "li",
      width === null
        ? {}
        : { style: `--rtq-image-list-item-width: ${formatNumber(width)}px` },
      [
        element("figure", { className: ["rtq-image-list-item"] }, [
          element("span", { className: ["rtq-image-list-media"] }, [
            match
              ? select(entry.image, version.version)
              : element("span", { className: ["rtq-image-list-missing"] }, [
                  text(`No ${version.label}`),
                ]),
          ]),
          ...(entry.caption.length
            ? [
                element(
                  "figcaption",
                  { className: ["rtq-image-list-caption"] },
                  structuredClone(entry.caption),
                ),
              ]
            : []),
        ]),
      ],
    ),
  );

  return element(
    "div",
    {
      className: ["rtq-image-list-version"],
      dataVersion: version.version,
    },
    [
      ...(showLabel
        ? [
            element("span", { className: ["rtq-image-list-label"] }, [
              text(version.label),
            ]),
          ]
        : []),
      element(
        "div",
        { className: ["rtq-image-list"], dataSlot: "paper-image-list" },
        [
          element(
            list.tagName ?? "ul",
            {
              ...list.properties,
              className: ["rtq-image-list-list"],
              role: "list",
              style: listStyle,
            },
            listItems,
          ),
        ],
      ),
    ],
  );
}

function transformList(
  list: HastNode,
  options: RehypePaperImageListOptions,
): HastNode | undefined {
  const items = (list.children ?? []).filter(
    (node) => node.type === "element" && node.tagName === "li",
  );
  const entries = items.map((item) => getEntry(item, options.resolve));
  if (
    entries.length === 0 ||
    entries.some((entry) => !entry?.versions.length)
  ) {
    return undefined;
  }
  const complete = entries as SetEntry[];
  const versions: PaperImageListVersion[] = [];
  for (const entry of complete) {
    for (const version of entry.versions) {
      if (!versions.some((known) => known.version === version.version)) {
        versions.push(version);
      }
    }
  }
  const chrome = options.chrome
    ? complete.map((entry) => options.chrome!(entry.image))
    : [];

  return element(
    "div",
    { className: ["rtq-image-lists"], dataSlot: "paper-image-lists" },
    [
      ...versions.map((version) =>
        buildList(list, complete, version, options.select, versions.length > 1),
      ),
      ...(chrome.some(Boolean)
        ? [
            element(
              "ol",
              { className: ["rtq-image-list-chrome"] },
              chrome.map((node) => element("li", {}, node ? [node] : [])),
            ),
          ]
        : []),
    ],
  );
}

function visit(node: HastNode, options: RehypePaperImageListOptions): void {
  const children = node.children ?? [];
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]!;
    if (
      child.type === "element" &&
      (child.tagName === "ul" || child.tagName === "ol") &&
      propertyValue(child, "dataImageList") !== undefined
    ) {
      const replacement = transformList(child, options);
      if (replacement) {
        children[index] = replacement;
        continue;
      }
    }
    visit(child, options);
  }
}

/** Renders lists marked by remarkPaperImageList (see module comment). */
export function rehypePaperImageList(options: RehypePaperImageListOptions) {
  return (tree: unknown): void => {
    if (tree && typeof tree === "object" && "type" in tree) {
      visit(tree as HastNode, options);
    }
  };
}
