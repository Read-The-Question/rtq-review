import { defineConfig } from "fumadocs-mdx/config";

type ContentNode = {
  type: string;
  value?: string;
  children?: ContentNode[];
};

function preserveRawMarkup() {
  return (tree: ContentNode) => {
    function visit(node: ContentNode) {
      node.children?.forEach((child, index) => {
        if (child.type === "raw") {
          node.children![index] = {
            type: "text",
            value: child.value ?? "",
          };
        } else {
          visit(child);
        }
      });
    }

    visit(tree);
  };
}

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => [preserveRawMarkup, ...plugins],
  },
});
