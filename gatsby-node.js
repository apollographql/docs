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
      value: path.join(
        '/',
        parent.gitRemote___NODE
          ? getNode(parent.gitRemote___NODE).sourceInstanceName
          : parent.sourceInstanceName,
        filePath
      )
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
      sidebars: allFile(filter: {base: {eq: "sidebar.json"}}) {
        nodes {
          internal {
            content
          }
          sourceInstanceName
          gitRemote {
            sourceInstanceName
          }
        }
      }
    }
  `);

  const sidebars = data.sidebars.nodes.reduce(
    (acc, {internal, gitRemote, sourceInstanceName}) => ({
      [gitRemote?.sourceInstanceName || sourceInstanceName]: JSON.parse(
        internal.content
      )
    }),
    {}
  );

  data.pages.nodes.forEach(({id, children, gitRemote, sourceInstanceName}) => {
    const [{fields}] = children;
    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id,
        sidebar: sidebars[gitRemote?.sourceInstanceName || sourceInstanceName]
      }
    });
  });
};
