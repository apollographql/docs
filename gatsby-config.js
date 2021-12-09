const gatsbyRemarkPlugins = [
  'gatsby-remark-mermaid',
  {
    resolve: 'gatsby-remark-copy-linked-files',
    options: {
      ignoreFileExtensions: []
    }
  },
  {
    resolve: 'gatsby-remark-autolink-headers',
    options: {
      icon: false
    }
  }
];

const sources = process.env.DOCS_PATH
  ? [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: '/',
          path: process.env.DOCS_PATH
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
  siteMetadata: {
    siteUrl: 'https://www.apollographql.com/docs'
  },
  plugins: [
    'gatsby-plugin-svgr',
    '@chakra-ui/gatsby-plugin',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/favicon.svg'
      }
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-next-seo',
      options: {
        titleTemplate: '%s - Apollo GraphQL Docs',
        openGraph: {
          type: 'website'
        },
        twitter: {
          site: '@apollographql',
          cardType: 'summary_large_image'
        }
      }
    },
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
        gatsbyRemarkPlugins,
        remarkPlugins: [
          [require('remark-typescript'), {wrapperComponent: 'MultiCodeBlock'}]
        ],
        rehypePlugins: [
          [require('rehype-autolink-headings'), {behavior: 'wrap'}]
        ]
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: gatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['UA-74643563-13', 'G-0BGG5V2W2K']
      }
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-M964NS9'
      }
    },
    ...sources
  ]
};
