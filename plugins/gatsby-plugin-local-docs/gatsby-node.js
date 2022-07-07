exports.createSchemaCustomization = ({actions: {createTypes}}) => {
  // add schema types that aren't automatically inferred when running against
  // a local docset from a different directory
  const typeDefs = `
    type File implements Node {
      gitRemote: GitRemote
    }

    # this type is only available when remote content is being sourced
    type GitRemote implements Node {
      full_name: String
      name: String
      href: String
      ref: String
    }

    type MdxFrontmatter {
      toc: Boolean # this frontmatter is only used in the docs homepage
      tags: [String] # this is only used by technotes
    }

    type MarkdownRemarkFrontmatter {
      description: String
    }
  `;
  createTypes(typeDefs);
};
