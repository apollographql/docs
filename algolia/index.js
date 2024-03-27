const {
  // MetricsFetcher,
  // METRICS,
  createRecords,
  getMdxHeading,
  getChildrenText
} = require('apollo-algolia-transform');
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient({});

const runReport = async () => {
  const [response] = await analyticsDataClient.runReport({
    property: 'properties/363627814',
    dateRanges: [
      {
        startDate: '2024-01-01',
        endDate: 'today'
      }
    ],
    dimensions: [
      {
        name: 'pagePath'
      }
    ],
    metrics: [
      {
        name: 'screenPageViews'
      }
    ]
  });

  const report = {};

  for (const row of response.rows) {
    const pagePathWithoutHash = decodeURIComponent(
      row.dimensionValues[0].value
    ).split('#')[0];

    const pageViews = Number(row.metricValues[0].value);
    if (pagePathWithoutHash in report) {
      report[pagePathWithoutHash] += pageViews;
      continue;
    }

    report[pagePathWithoutHash] = pageViews;
  }

  console.log(report);
};

runReport();

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
    let docset = node.sourceInstanceName;
    // when the sourceInstanceName equals "__PROGRAMMATIC__", we need to extract
    // the docset name from the path
    if (docset === '__PROGRAMMATIC__') {
      // an example relativeDirectory looks like:
      // .cache/caches/gatsby-source-remote-file/2740f1d9...c765648d9fe/react/v2
      const paths = node.relativeDirectory.split('/');
      docset = paths.pop();
      // If the last part of the path has to do with a version, use the
      // penultimate part of the path
      if (/^v\d+$/.test(docset)) {
        docset = paths.pop();
      }
    }
    return {
      ...acc,
      [docset]: internal === true
    };
  }, {});

  // let allGAData = {};
  // if (process.env.NODE_ENV !== 'test') {
  //   const metricsFetcher = new MetricsFetcher({viewId: '163147389'});
  //   allGAData = await metricsFetcher.fetchAll();
  // }

  const allPages = allMarkdownRemark.nodes.concat(allMdx.nodes);
  const records = allPages
    .filter(
      page =>
        // pages must not be internal, AND
        !isInternal[page.parent.sourceInstanceName] &&
        // must also not match the pattern /ios/api/ or /ios/*/api/
        !/\/ios\/(.*\/)?api\/?/.test(page.fields.slug)
    )
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

      // omit older version docs (anything with a slash in the path) from results
      if (gitRemote && /\w\//.test(sourceInstanceName)) {
        return [];
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
          // pageviews: allGAData[url]?.[METRICS.uniquePageViews] || 0,
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

    allMarkdownRemark (filter: {frontmatter: {noIndex: {ne: true}}}) {
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

    allMdx (filter: {frontmatter: {noIndex: {ne: true}}}) {
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
        relativeDirectory
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
