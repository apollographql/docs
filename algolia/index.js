const {
  MetricsFetcher,
  METRICS,
  createRecords,
  getMdxHeading,
  getChildrenText
} = require('apollo-algolia-transform');

function getMdHeading(child) {
  if (child.type === 'element') {
    // test that this element is a heading (h1, h2, etc.) and save the digit
    const match = child.tagName.match(/^h(\d)$/);
    if (match) {
      return {
        title: getChildrenText(child),
        hash: '#' + child.properties.id,
        depth: Number(match[1]) // use the saved digit as the depth property
      };
    }
  }
}

async function transformer({data}) {
  const {site, allMarkdownRemark, allMdx, configs} = data;

  // create mapping of sources to their internal status
  const isInternal = configs.nodes.reduce((acc, node) => {
    const {internal} = JSON.parse(node.fields.content);
    return {
      ...acc,
      [node.sourceInstanceName]: internal === true
    };
  }, {});

  let allGAData = {};
  if (process.env.NODE_ENV !== 'test') {
    const metricsFetcher = new MetricsFetcher({viewId: '163147389'});
    allGAData = await metricsFetcher.fetchAll();
  }

  const allPages = allMarkdownRemark.nodes.concat(allMdx.nodes);
  const records = allPages
    // exclude internal-only pages
    .filter(page => !isInternal[page.parent.sourceInstanceName])
    // create multiple records per page, but keep a flat array
    .flatMap(page => {
      const {
        id,
        fields,
        frontmatter,
        parent,
        tableOfContents,
        htmlAst,
        mdxAST
      } = page;
      const {slug} = fields;
      const {name: fileName, gitRemote, sourceInstanceName} = parent;

      const {pathPrefix, siteMetadata} = site;
      const url = siteMetadata.siteUrl + pathPrefix + slug;
      const docset = gitRemote
        ? gitRemote.name
        : sourceInstanceName === '/'
        ? 'basics'
        : sourceInstanceName;

      const categories = ['documentation'];
      if (['apollo-client', 'apollo-ios', 'apollo-kotlin'].includes(docset)) {
        categories.push('client');
      }

      return createRecords({
        children: (mdxAST || htmlAst).children,
        url,
        id,
        getHeading: mdxAST ? getMdxHeading : getMdHeading,
        tableOfContents,
        otherProperties: {
          // for auto-generated mobile docs, not all have frontmatter. if a title
          // isn't set, use the name of the file
          title: frontmatter.title || fileName,
          type: 'docs',
          docset,
          slug,
          isCurrentVersion: !/\w\//.test(sourceInstanceName),
          pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0,
          categories
        }
      });
    });

  console.log('Created %s Algolia records', records.length);

  return records;
}

const query = `
  query AlgoliaQuery {
    site {
      pathPrefix
      siteMetadata {
        siteUrl
      }
    }

    allMarkdownRemark {
      nodes {
        ...NodeFragment
        htmlAst
        tableOfContents
        frontmatter {
          title
          description
        }
        fields {
          slug
        }
      }
    }

    allMdx {
      nodes {
        ...NodeFragment
        mdxAST
        tableOfContents
        frontmatter {
          title
          description
        }
        fields {
          slug
        }
      }
    }
    
    configs: allFile(filter: {base: {eq: "config.json"}}) {
      nodes {
        fields {
          content
        }
        sourceInstanceName
      }
    }
  }

  fragment NodeFragment on Node {
    id
    parent {
      ... on File {
        name
        sourceInstanceName
        gitRemote {
          name
        }
      }
    }
  }
`;

module.exports = {transformer, query};
