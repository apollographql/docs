const {algoliaSettings} = require('apollo-algolia-transform');
const {query, transformer} = require('./algolia');

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

const remoteSources = {
  react: {
    remote: 'https://github.com/trevorblades/apollo-client',
    branch: 'tb/experimental-docs'
  },
  'react/v2': {
    remote: 'https://github.com/trevorblades/apollo-client',
    branch: 'tb/experimental-v2'
  },
  'apollo-server': {
    remote: 'https://github.com/trevorblades/apollo-server',
    branch: 'tb/experimental-docs'
  },
  'apollo-server/v2': {
    remote: 'https://github.com/trevorblades/apollo-server',
    branch: 'tb/experimental-v2'
  },
  ios: {
    remote: 'https://github.com/trevorblades/apollo-ios',
    branch: 'tb/experimental-docs'
  },
  kotlin: {
    remote: 'https://github.com/trevorblades/apollo-kotlin',
    branch: 'tb/experimental-docs'
  },
  'kotlin/v2': {
    remote: 'https://github.com/trevorblades/apollo-kotlin',
    branch: 'tb/experimental-v2'
  },
  federation: {
    remote: 'https://github.com/trevorblades/federation',
    branch: 'tb/experimental-v1'
  },
  'federation/v2': {
    remote: 'https://github.com/trevorblades/federation',
    branch: 'tb/experimental-docs'
  },
  rover: {
    remote: 'https://github.com/trevorblades/rover',
    branch: 'tb/experimental-docs'
  },
  router: {
    remote: 'https://github.com/trevorblades/router',
    branch: 'tb/experimental-docs'
  }
};

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
      ...Object.entries(remoteSources).map(([name, {remote, branch}]) => ({
        resolve: '@theowenyoung/gatsby-source-git',
        options: {
          remote,
          name,
          branch,
          rootDir: 'docs/source'
        }
      }))
    ];

const plugins = [
  'gatsby-plugin-svgr',
  '@chakra-ui/gatsby-plugin',
  'gatsby-transformer-json',
  'gatsby-plugin-sitemap',
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
      rehypePlugins: [[require('rehype-autolink-headings'), {behavior: 'wrap'}]]
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
  {
    resolve: 'gatsby-plugin-env-variables',
    options: {
      allowList: ['ALGOLIA_APP_ID', 'ALGOLIA_SEARCH_KEY']
    }
  },
  {
    resolve: 'gatsby-plugin-algolia',
    options: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_WRITE_KEY,
      skipIndexing: process.env.CONTEXT !== 'production',
      indexName: 'experimental', // TODO: change this to 'docs' before launch
      queries: [
        {
          query,
          transformer,
          settings: {
            ...algoliaSettings,
            attributesForFaceting: ['categories', 'docset', 'type'],
            // put docs for current version at top, then by page views and index
            customRanking: [
              'desc(isCurrentVersion)',
              ...algoliaSettings.customRanking
            ]
          }
        }
      ]
    }
  }
];

module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.apollographql.com/docs'
  },
  plugins: plugins.concat(sources)
};
