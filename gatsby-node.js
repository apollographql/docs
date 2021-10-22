const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');

exports.createSchemaCustomization = ({actions}) => {
  actions.createTypes(`
    type MdxFrontmatter {
      standalone: Boolean
    }
  `);
};

exports.onCreateNode = ({node, getNode, actions}) => {
  const {type} = node.internal;
  if (type === 'MarkdownRemark' || type === 'Mdx') {
    const filePath = createFilePath({
      node,
      getNode,
      basePath: 'docs'
    });

    const parent = getNode(node.parent);
    actions.createNodeField({
      node,
      name: 'slug',
      value: path.join('/', parent.sourceInstanceName, filePath)
    });
  }
};

exports.createPages = async ({actions, graphql}) => {
  const {data} = await graphql(`
    {
      pages: allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        nodes {
          id
          sourceInstanceName
          children {
            ... on Mdx {
              fields {
                slug
              }
            }
            ... on MarkdownRemark {
              fields {
                slug
              }
            }
          }
        }
      }
      sidebars: allFile(filter: {base: {eq: "sidebar.json"}}) {
        nodes {
          internal {
            content
          }
          sourceInstanceName
        }
      }
    }
  `);

  const sidebars = data.sidebars.nodes.reduce(
    (acc, {internal, sourceInstanceName}) => ({
      ...acc,
      [sourceInstanceName]: JSON.parse(internal.content)
    }),
    {}
  );

  data.pages.nodes.forEach(({id, sourceInstanceName, children}) => {
    const [{fields}] = children;
    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id,
        sidebar: sidebars[sourceInstanceName]
      }
    });
  });
};
