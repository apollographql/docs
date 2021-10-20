const gatsbyRemarkPlugins = [
  {
    resolve: 'gatsby-remark-copy-linked-files',
    options: {
      ignoreFileExtensions: []
    }
  },
  'gatsby-remark-mermaid'
];

module.exports = {
  plugins: [
    '@chakra-ui/gatsby-plugin',
    'gatsby-plugin-react-helmet',
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
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: 'src/content'
      }
    },
    {
      resolve: 'gatsby-source-git',
      options: {
        remote: 'https://github.com/apollographql/apollo-server.git',
        name: 'apollo-server',
        branch: 'tb/experimental-docs',
        patterns: 'docs/source/**'
      }
    }
  ]
};
