const gatsbyRemarkPlugins = [
  'gatsby-remark-mermaid',
  {
    resolve: 'gatsby-remark-copy-linked-files',
    options: {
      ignoreFileExtensions: []
    }
  }
];

const sources = process.env.DOCS_DEV_PATH
  ? [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: '/',
          path: process.env.DOCS_DEV_PATH
        }
      }
    ]
  : [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: '/',
          path: 'src/content/basics'
        }
      },
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: 'studio',
          path: 'src/content/studio'
        }
      },
      {
        resolve: 'gatsby-source-git',
        options: {
          remote: 'https://github.com/apollographql/apollo-server',
          name: 'apollo-server',
          branch: 'tb/experimental-docs',
          patterns: 'docs/**'
        }
      },
      {
        resolve: 'gatsby-source-git',
        options: {
          remote: 'https://github.com/apollographql/apollo-server',
          name: 'apollo-server/v2',
          branch: 'tb/experimental-v2',
          patterns: 'docs/**'
        }
      }
    ];

module.exports = {
  plugins: [
    'gatsby-plugin-svgr',
    '@chakra-ui/gatsby-plugin',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: 'Source Sans Pro',
              variants: ['400', '600', '700']
            },
            {
              family: 'Source Code Pro',
              variants: ['400', '600']
            }
          ]
        }
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: gatsbyRemarkPlugins
      }
    },
    ...sources
  ]
};
