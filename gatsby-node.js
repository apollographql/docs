const {
  createFilePath,
  createRemoteFileNode
} = require('gatsby-source-filesystem');
const {join} = require('path');
const {kebabCase} = require('lodash');

exports.sourceNodes = ({
  actions: {createNode},
  createNodeId,
  store,
  cache,
  reporter
}) =>
  // download Apollo Client typedoc output and save it as a file node
  createRemoteFileNode({
    url: 'https://apollo-client-docs.netlify.app/docs.json',
    store,
    cache,
    createNode,
    createNodeId,
    reporter
  });

exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        // fallbacks needed for Algolia search-insights
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        // because we use `path` a lot
        path: require.resolve('path-browserify')
      }
    }
  });
};

exports.onCreateNode = async ({node, getNode, loadNodeContent, actions}) => {
  const {type, mediaType} = node.internal;
  switch (type) {
    case 'File':
      if (mediaType === 'application/json' || node.base === '_redirects') {
        // save the raw content of JSON files as a field
        const content = await loadNodeContent(node);
        actions.createNodeField({
          node,
          name: 'content',
          value: content
        });
      }
      break;
    case 'MarkdownRemark':
    case 'Mdx': {
      // add slugs for MD/MDX pages based on their file names
      const filePath = createFilePath({
        node,
        getNode
      });

      const {sourceInstanceName} = getNode(node.parent);
      actions.createNodeField({
        node,
        name: 'slug',
        // prefix slugs with their docset path (configured by source name)
        value: join('/', sourceInstanceName, filePath)
      });
      break;
    }
    default:
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
      tags: allMdx {
        group(field: frontmatter___tags) {
          name: fieldValue
        }
      }
    }
  `);

  data.pages.nodes.forEach(({id, sourceInstanceName, children}) => {
    const [{fields}] = children;

    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id,
        basePath: sourceInstanceName
      }
    });
  });

  data.tags.group.forEach(tag => {
    actions.createPage({
      path: `/technotes/tags/${kebabCase(tag.name)}`,
      component: require.resolve('./src/templates/tag'),
      context: {
        tag: tag.name,
        basePath: 'technotes'
      }
    });
  });
};

exports.createSchemaCustomization = ({actions: {createTypes}}) => {
  const typeDefs = `
    type MdxFrontmatter {
      headingDepth: Int
    }

    type MarkdownRemarkFrontmatter {
      headingDepth: Int
    }
  `;
  createTypes(typeDefs);
};
