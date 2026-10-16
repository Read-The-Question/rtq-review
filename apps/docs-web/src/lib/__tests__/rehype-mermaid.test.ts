import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rehypeMermaidBlocks } from "../rehype-mermaid.ts";

describe("rehypeMermaidBlocks", () => {
  it("turns Mermaid code fences into Mermaid components", () => {
    const tree = {
      children: [
        {
          children: [
            {
              properties: { className: ["language-mermaid"] },
              tagName: "code",
              type: "element",
              children: [
                {
                  type: "text",
                  value: "flowchart LR\n  A --> B\n",
                },
              ],
            },
          ],
          tagName: "pre",
          type: "element",
        },
      ],
      type: "root",
    };

    rehypeMermaidBlocks()(tree);

    assert.deepEqual(tree.children[0], {
      attributes: [
        {
          name: "chart",
          type: "mdxJsxAttribute",
          value: "flowchart LR\n  A --> B",
        },
      ],
      children: [],
      name: "Mermaid",
      type: "mdxJsxFlowElement",
    });
  });

  it("leaves other code blocks unchanged", () => {
    const codeBlock = {
      children: [{ type: "text", value: "const answer = 42;\n" }],
      properties: { className: ["language-ts"] },
      tagName: "code",
      type: "element",
    };
    const tree = {
      children: [
        {
          children: [codeBlock],
          tagName: "pre",
          type: "element",
        },
      ],
      type: "root",
    };

    rehypeMermaidBlocks()(tree);

    assert.equal(tree.children[0].children[0], codeBlock);
  });
});
