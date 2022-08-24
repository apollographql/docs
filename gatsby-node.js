const {
  createFilePath,
  createRemoteFileNode
} = require('gatsby-source-filesystem');
const {join} = require('path');
const {v5} = require('uuid');
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

const getNavItems = items =>
  // turn a sidebar configuration object to an array of nav items
  Object.entries(items).map(([title, path]) =>
    typeof path === 'string'
      ? {title, path} // links are treated normally
      : {
          title,
          // generate an id for each group, for use with the sidebar nav state
          id: v5(JSON.stringify(path), v5.DNS),
          // recurse over its children and turn them into nav items
          children: getNavItems(path)
        }
  );

exports.createPages = async ({actions, graphql}) => {
  const {data} = await graphql(`
    {
      pages: allFile(filter: {extension: {in: ["md", "mdx"]}}) {
        nodes {
          id
          gitRemote {
            full_name
          }
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
      configs: allFile(filter: {base: {eq: "config.json"}}) {
        nodes {
          fields {
            content
          }
          gitRemote {
            full_name
          }
          sourceInstanceName
        }
      }
      tags: allMdx {
        group(field: frontmatter___tags) {
          name: fieldValue
        }
      }
    }
  `);

  const configs = data.configs.nodes.reduce((acc, node) => {
    // TODO: convert configs to YAML
    const {title, version, sidebar, algoliaFilters, internal} = JSON.parse(
      node.fields.content
    );
    return {
      ...acc,
      [node.sourceInstanceName]: {
        docset: title,
        currentVersion: version,
        navItems: getNavItems(sidebar),
        algoliaFilters,
        internal
      }
    };
  }, {});

  data.pages.nodes.forEach(({id, gitRemote, sourceInstanceName, children}) => {
    const [{fields}] = children;
    const versions = data.configs.nodes
      .filter(
        node => gitRemote && node.gitRemote?.full_name === gitRemote.full_name
      )
      .map(node => {
        const {version} = JSON.parse(node.fields.content);
        return {
          label: version,
          slug: node.sourceInstanceName
        };
      })
      .sort((a, b) => b.label.localeCompare(a.label));

    actions.createPage({
      path: fields.slug,
      component: require.resolve('./src/templates/page'),
      context: {
        id,
        versions,
        ...configs[sourceInstanceName]
      }
    });
  });

  data.tags.group.forEach(tag => {
    actions.createPage({
      path: `/technotes/tags/${kebabCase(tag.name)}`,
      component: require.resolve('./src/templates/tag'),
      context: {
        tag: tag.name,
        ...configs.technotes
      }
    });
  });
};
