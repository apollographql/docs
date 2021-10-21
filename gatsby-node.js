const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');

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
      value: parent.gitRemote___NODE
        ? path.join(
            '/',
            getNode(parent.gitRemote___NODE).sourceInstanceName,
            filePath
          )
        : filePath
    });
  }
};

exports.createPages = async ({actions, graphql}) => {
  const {data} = await graphql(`
    {
      pages: allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        nodes {
          id
          gitRemote {
            sourceInstanceName
          }
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
      sidebars: allFile(filter: {relativePath: {eq: "docs/sidebar.json"}}) {
        nodes {
          internal {
            content
          }
          gitRemote {
            sourceInstanceName
          }
        }
      }
    }
  `);

  const sidebars = data.sidebars.nodes.reduce(
    (acc, {internal, gitRemote}) => ({
      [gitRemote.sourceInstanceName]: JSON.parse(internal.content)
    }),
    {}
  );

  data.pages.nodes.forEach(({id, children, gitRemote}) => {
    const [{fields}] = children;
    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id,
        sidebar: sidebars[gitRemote?.sourceInstanceName]
      }
    });
  });
};
