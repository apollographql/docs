const {algoliaSettings} = require('apollo-algolia-transform');
const {
  remarkTypescript,
  highlightPreservation,
  isWrapped
} = require('remark-typescript');
const {query, transformer} = require('./algolia');
const yaml = require('js-yaml');
const fs = require('fs');
const remoteSources = require('./sources/remote');

const gatsbyRemarkPlugins = [
  '@fec/remark-a11y-emoji/gatsby',
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

const plugins = [
  'gatsby-plugin-svgr',
  '@chakra-ui/gatsby-plugin',
  'gatsby-plugin-combine-redirects', // local plugin
  'gatsby-plugin-loadable-components-ssr',
  // {
  //   resolve: 'gatsby-plugin-check-links', // local plugin
  //   options: {
  //     ignore: ['/react/api/core/ApolloClient', '/react/v2/api/apollo-client']
  //   }
  // },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      icon: 'src/assets/favicon.svg'
    }
  },
  // 'gatsby-plugin-offline',
  'gatsby-plugin-remove-serviceworker',
  {
    resolve: 'gatsby-plugin-apollo',
    options: {
      uri: process.env.API_URL + '/api/graphql',
      credentials: 'include'
    }
  },
  {
    resolve: 'gatsby-plugin-next-seo',
    options: {
      titleTemplate: '%s - Apollo GraphQL Docs',
      openGraph: {
        type: 'website',
        site_name: 'Apollo Docs'
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
        [
          remarkTypescript,
          {
            filter: isWrapped({wrapperComponent: 'MultiCodeBlock'}),
            customTransformations: [highlightPreservation()],
            prettierOptions: {
              trailingComma: 'all',
              singleQuote: true
            }
          }
        ]
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
      id: process.env.GTM_CONTAINER_ID,
      includeInDevelopment: false
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
      indexName: 'docs',
      queries: [
        {
          query,
          transformer,
          settings: {
            ...algoliaSettings,
            attributesForFaceting: ['categories', 'docset', 'type']
          }
        }
      ]
    }
  },
  {
    resolve: '@colliercz/gatsby-transformer-gitinfo',
    // Will match all .md* files, except README.md
    options: {
      include: /\.mdx?$/i,
      ignore: /README/i
    }
  },
  {
    resolve: 'gatsby-source-apiserver',
    options: {
      typePrefix: 'Odyssey',
      name: 'Course',
      method: 'GET',
      url: 'https://www.apollographql.com/tutorials/courses-api/courses.json',
      entityLevel: 'odyssey-courses'
    }
  }
];

if (process.env.CONTEXT === 'production') {
  plugins.push({
    resolve: 'gatsby-plugin-sitemap',
    options: {
      query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
              pageContext
            }
          }
        }
      `,
      resolvePages: ({allSitePage}) =>
        // filter out internal pages
        allSitePage.nodes.filter(page => !page.pageContext.internal)
    }
  });
}

const isLocalMode = process.env.DOCS_MODE === 'local';

plugins.push(
  ...Object.entries(remoteSources).map(([name, {remote, branch}]) => ({
    resolve: '@theowenyoung/gatsby-source-git',
    options: {
      remote,
      name,
      branch,
      rootDir: 'docs/source',
      patterns:
        isLocalMode || process.env.DOCS_LOCAL ? 'config.json' : undefined
    }
  }))
);

if (process.env.DOCS_LOCAL) {
  plugins.push(
    'gatsby-plugin-local-docs', // local plugin
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: '/',
        path: 'local/source'
      }
    }
  );
} else {
  const localSources = yaml.load(fs.readFileSync('sources/local.yml', 'utf8'));

  plugins.push(
    ...Object.entries(localSources).map(([name, path]) => ({
      resolve: 'gatsby-source-filesystem',
      options: {
        name,
        path
      }
    }))
  );

  if (isLocalMode) {
    plugins.push('gatsby-plugin-local-docs');
  }
}

module.exports = {
  pathPrefix: '/docs',
  siteMetadata: {
    siteUrl: 'https://www.apollographql.com'
  },
  plugins
};
