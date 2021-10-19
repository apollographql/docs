module.exports = {
  plugins: [
    'gatsby-plugin-mdx',
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
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
        name: 'server',
        branch: 'tb/experimental-docs',
        patterns: 'docs/source/**'
      }
    }
  ]
};
