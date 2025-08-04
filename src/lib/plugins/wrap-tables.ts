import type { Element, Root } from "hast";
import type { Plugin } from "unified";

import { visit } from "unist-util-visit";

export const wrapTables: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "table" &&
        parent &&
        Array.isArray(parent.children)
      ) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["my-6 w-full overflow-y-auto"] },
          children: [node],
        };
        parent.children[index!] = wrapper;
      }
    });
  };
}
