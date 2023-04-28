import { createFilePath } from "gatsby-source-filesystem";
import type { GatsbyNode } from "gatsby";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  getNode,
  actions,
}) => {
  const { createNodeField } = actions;
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({
      node,
      getNode,
    });
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};
