import type {
  HastNode,
  PaperImageListVersion,
  RehypePaperImageListOptions,
} from "./paper-image-list-rehype.ts";

/**
 * rehypePaperImageList options for the raw-HTML image groups that
 * review-tag-web and review-question-viewer-web emit:
 *
 *   div.paper-image-group > div.paper-image-variant[data-provenance]
 *     [data-image-list-width] > …
 *
 * data-image-list-width is the image's standalone width in CSS px, or "fill" for a
 * full-width raster. Each image keeps its own sizing inside the list.
 */

const VERSION_LABELS: Readonly<Record<string, string>> = {
  manual: "Original",
  v1: "V1",
  v2: "V2",
};

function classNames(node: HastNode): string[] {
  const value = node.properties?.className;
  return Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(/\s+/)
      : [];
}

function hasClass(node: HastNode, name: string): boolean {
  return classNames(node).includes(name);
}

/** undefined when the image carries no list width; null fills the line. */
function listWidth(node: HastNode): number | null | undefined {
  const value = node.properties?.dataImageListWidth;
  if (value === "fill") return null;
  const width = Number(value);
  return value !== undefined && Number.isFinite(width) && width > 0
    ? width
    : undefined;
}

function variants(group: HastNode): HastNode[] {
  return (group.children ?? []).filter(
    (child) =>
      child.type === "element" && hasClass(child, "paper-image-variant"),
  );
}

/**
 * The version label replaces each image's own format badge, and the list's
 * gaps replace a single image's block margins. Sizing is kept.
 */
function withoutFormatLabel(node: HastNode): HastNode | undefined {
  if (node.type !== "element") return node;
  if (hasClass(node, "paper-image-format")) return undefined;
  const style = node.properties?.style;
  const properties =
    typeof style === "string"
      ? {
          ...node.properties,
          style: style.replace(/(^|;)\s*margin:[^;]*;?/g, "$1"),
        }
      : node.properties;
  return {
    ...node,
    properties,
    children: (node.children ?? [])
      .map(withoutFormatLabel)
      .filter((child): child is HastNode => child !== undefined),
  };
}

function singleImageVersion(node: HastNode): PaperImageListVersion | undefined {
  const width = listWidth(node);
  if (width === undefined) return undefined;
  const version = String(node.properties?.dataProvenance ?? "image");
  return { label: VERSION_LABELS[version] ?? "Image", version, width };
}

export const PAPER_IMAGE_GROUP_LIST_OPTIONS: RehypePaperImageListOptions = {
  resolve(node) {
    if (!hasClass(node, "paper-image-group")) {
      // A single sized image (review-question-viewer-web) is one version.
      const single = hasClass(node, "paper-image-variant")
        ? undefined
        : singleImageVersion(node);
      return single ? [single] : undefined;
    }
    const versions: PaperImageListVersion[] = [];
    for (const variant of variants(node)) {
      const version = String(variant.properties?.dataProvenance ?? "");
      const width = listWidth(variant);
      if (!version || width === undefined) return undefined;
      if (versions.some((known) => known.version === version)) continue;
      versions.push({
        label: VERSION_LABELS[version] ?? version,
        version,
        width,
      });
    }
    return versions.length ? versions : undefined;
  },
  select(node, version) {
    if (!hasClass(node, "paper-image-group")) {
      return withoutFormatLabel(structuredClone(node))!;
    }
    const variant = variants(node).find(
      (candidate) => String(candidate.properties?.dataProvenance) === version,
    );
    return withoutFormatLabel(structuredClone(variant ?? node))!;
  },
};
