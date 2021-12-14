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
  const {site, allMarkdownRemark, allMdx} = data;

  let allGAData = {};
  if (process.env.NODE_ENV !== 'test') {
    const metricsFetcher = new MetricsFetcher({viewId: '163147389'});
    allGAData = await metricsFetcher.fetchAll();
  }

  const allPages = allMarkdownRemark.nodes.concat(allMdx.nodes);
  const records = allPages.flatMap(page => {
    const {id, fields, frontmatter, parent, tableOfContents, htmlAst, mdxAST} =
      page;
    const {slug} = fields;
    const {name: fileName, gitRemote, sourceInstanceName} = parent;

    const url = site.siteMetadata.siteUrl + slug;
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
