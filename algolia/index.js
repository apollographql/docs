const {
  // MetricsFetcher,
  // METRICS,
  createRecords,
  getMdxHeading,
  getChildrenText
} = require('apollo-algolia-transform');
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    // netlify escapes every newline (\n), so we need to unescape them
    // https://answers.netlify.com/t/long-environment-variable-with-line-breaks-n/8514
    private_key: process.env.GOOGLE_AUTH_KEY.replace(/\\n/gm, '\n'),
    client_email: process.env.GOOGLE_AUTH_EMAIL
  }
});

// set the start date to 6 months ago
const date = new Date();
date.setMonth(date.getMonth() - 6);
const startDate = date.toISOString().split('T').shift();

const fetchReport = async (offset = 0) => {
  const [response] = await analyticsDataClient.runReport({
    property: 'properties/363627814',
    dateRanges: [
      {
        startDate,
        endDate: 'today'
      }
    ],
    offset,
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

  return response;
};

const runReport = async () => {
  const report = {};

  let fetchedRows = 0;
  let response = await fetchReport();

  while (fetchedRows < response.rowCount) {
    for (const row of response.rows) {
      const pagePath = row.dimensionValues[0].value;
      try {
        const url = new URL(decodeURIComponent(pagePath), 'https://foo.bar');

        // ensure that the path ends with a trailing slash
        let normalizedPathPath = url.pathname.endsWith('/')
          ? url.pathname
          : url.pathname + '/';
        normalizedPathPath = normalizedPathPath.replace(/^\/docs\//, '/');

        const pageViews = Number(row.metricValues[0].value);
        if (normalizedPathPath in report) {
          report[normalizedPathPath] += pageViews;
          continue;
        }

        report[normalizedPathPath] = pageViews;
      } catch {
        // do nothing
      }
    }

    fetchedRows += response.rows.length;
    response = await fetchReport(fetchedRows);
  }

  return report;
};

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

  const report = await runReport();

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
          pageviews: report[slug] ?? 0,
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
