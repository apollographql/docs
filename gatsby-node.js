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
      allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        nodes {
          id
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
    }
  `);

  data.allFile.nodes.forEach(node => {
    const [{fields}] = node.children;
    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id: node.id
      }
    });
  });
};
