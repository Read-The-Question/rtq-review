type MdxAttribute = {
  name: string;
  type: "mdxJsxAttribute";
  value: string;
};

type ContentNode = {
  attributes?: MdxAttribute[];
  children?: ContentNode[];
  name?: string;
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

function classes(node: ContentNode): string[] {
  const className = node.properties?.className;
  if (Array.isArray(className)) return className.map(String);
  return typeof className === "string" ? className.split(/\s+/) : [];
}

function textContent(node: ContentNode): string {
  if (node.type === "text") return node.value ?? "";
  return node.children?.map(textContent).join("") ?? "";
}

function mermaidCode(node: ContentNode): string | undefined {
  if (node.type !== "element" || node.tagName !== "pre") return undefined;
  const code = node.children?.find(
    (child) => child.type === "element" && child.tagName === "code",
  );
  if (!code || !classes(code).includes("language-mermaid")) return undefined;
  return textContent(code).trim();
}

export function rehypeMermaidBlocks() {
  return (tree: ContentNode) => {
    function visit(node: ContentNode) {
      node.children?.forEach((child, index) => {
        const chart = mermaidCode(child);
        if (chart === undefined) {
          visit(child);
          return;
        }

        node.children![index] = {
          attributes: [
            {
              name: "chart",
              type: "mdxJsxAttribute",
              value: chart,
            },
          ],
          children: [],
          name: "Mermaid",
          type: "mdxJsxFlowElement",
        };
      });
    }

    visit(tree);
  };
}
