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
const {join} = require('path');

const isProduction = process.env.CONTEXT === 'production';

const isLocalMode = process.env.DOCS_MODE === 'local';
const isSingleDocset = isLocalMode || process.env.DOCS_LOCAL;

const gatsbyRemarkPlugins = [
  '@fec/remark-a11y-emoji/gatsby',
  {
    resolve: require.resolve('./plugins/remark-mermaid-cached')
  },
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
            family: 'Inter',
            variants: ['400', '600', '700']
          },
          {
            family: 'Fira Code',
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
    resolve: 'gatsby-plugin-apollo-client-api-doc',
    options: {
      file: isSingleDocset
        ? join(__dirname, 'local/public/client.api.json')
        : 'https://apollo-client-docs.netlify.app/client.api.json'
    }
  },
  {
    resolve: 'gatsby-plugin-google-gtag',
    options: {
      // todo: remove ua property in the nearish future
      trackingIds: ['UA-74643563-13', 'G-0BGG5V2W2K', 'G-3WEVC01XLB']
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
      apiKey: isProduction
        ? process.env.ALGOLIA_WRITE_KEY
        : process.env.GATSBY_STAGING_DOCS_ALGOLIA_KEY,
      // skipIndexing: process.env.CONTEXT !== 'production',
      indexName: isProduction ? 'docs' : 'staging_docs',
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
    resolve: 'gatsby-plugin-apollo-onetrust',
    options: {
      autoBlockSrc: process.env.OT_AUTOBLOCK_SRC,
      otSDKStubSrc: process.env.OT_SDKSTUB_SRC,
      dataDomainScript: process.env.OT_DATA_DOMAIN_SCRIPT,
      skip: !isProduction
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

for (const name in remoteSources) {
  const {remote, branch} = remoteSources[name];

  // source the config file for each docset
  const {pathname, username, password} = new URL(remote);
  plugins.push({
    resolve: 'gatsby-source-remote-file',
    options: {
      url: `https://raw.githubusercontent.com${pathname}/${branch}/docs/source/config.json`,
      name: `${name}/config`,
      auth: {
        htaccess_user: username,
        htaccess_pass: password
      },
      // so that deploy previews for other docsets don't fail
      errorHandling: 'warn'
    }
  });

  if (!isSingleDocset) {
    // source the content for each docset, excluding the config file
    plugins.push({
      resolve: '@theowenyoung/gatsby-source-git',
      options: {
        remote,
        name,
        branch,
        rootDir: 'docs/source',
        patterns: '**/!(config.json)'
      }
    });
  }
}

const localSources = yaml.load(fs.readFileSync('sources/local.yml', 'utf8'));

if (process.env.DOCS_LOCAL) {
  localSources['/'] = 'local/source';
}

plugins.push(
  ...Object.entries(localSources).map(([name, path]) => ({
    resolve: 'gatsby-source-filesystem',
    options: {
      name,
      path
    }
  }))
);

plugins.push({
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'graphos/img',
    path: 'src/content/graphos/img'
  }
});

if (isSingleDocset) {
  plugins.push('gatsby-plugin-local-docs');
}

module.exports = {
  pathPrefix: '/docs',
  siteMetadata: {
    siteUrl: 'https://www.apollographql.com'
  },
  plugins
};
