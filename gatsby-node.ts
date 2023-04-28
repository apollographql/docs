import { createFilePath } from "gatsby-source-filesystem";

export const onCreateNode = ({ node, getNode, actions }) => {
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
