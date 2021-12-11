const {randomUUID} = require('crypto');
const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');

exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        path: require.resolve('path-browserify')
      }
    }
  });
};

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

function getNavItems(items) {
  return Object.entries(items).map(([key, value]) => {
    const isGroup = typeof value !== 'string';
    return {
      id: randomUUID(),
      title: key,
      [isGroup ? 'children' : 'path']: isGroup ? getNavItems(value) : value
    };
  });
}

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
          internal {
            content
          }
          gitRemote {
            full_name
          }
          sourceInstanceName
        }
      }
    }
  `);

  const configs = data.configs.nodes.reduce((acc, node) => {
    const {title, version, sidebar} = JSON.parse(node.internal.content);
    return {
      ...acc,
      [node.sourceInstanceName]: {
        docset: title,
        currentVersion: version,
        navItems: getNavItems(sidebar)
      }
    };
  }, {});

  data.pages.nodes.forEach(({id, gitRemote, sourceInstanceName, children}) => {
    const [{fields}] = children;
    const versions =
      gitRemote &&
      data.configs.nodes
        .filter(node => node.gitRemote?.full_name === gitRemote.full_name)
        .map(node => {
          const {version} = JSON.parse(node.internal.content);
          return {
            label: version,
            slug: node.sourceInstanceName
          };
        });

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
};
