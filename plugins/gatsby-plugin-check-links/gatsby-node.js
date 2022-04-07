const visit = require('unist-util-visit');
const fromMarkdown = require('mdast-util-from-markdown');
const GithubSlugger = require('github-slugger');
const {dirname, resolve, isAbsolute} = require('path');
const Airtable = require('airtable');
const {chunk} = require('lodash');

const TRAILING_SLASH_PATTERN = /(?!^)\/$/;

exports.createPages = async ({graphql, reporter}, {ignore = []}) => {
  const {data} = await graphql(
    `
      {
        allFile(filter: {extension: {in: ["md", "mdx"]}}) {
          nodes {
            name
            children {
              ... on Mdx {
                mdxAST
                fields {
                  slug
                }
                headings {
                  value
                }
              }
              ... on MarkdownRemark {
                rawMarkdownBody
                fields {
                  slug
                }
                headings {
                  id
                }
              }
            }
          }
        }
      }
    `
  );

  const pages = data.allFile.nodes.reduce((acc, file) => {
    const [child] = file.children;
    const {slug} = child.fields;

    const slugger = new GithubSlugger();
    const headings = child.headings.map(
      heading => heading.id || slugger.slug(heading.value)
    );

    const links = [];
    const tree = child.mdxAST || fromMarkdown(child.rawMarkdownBody);
    visit(tree, 'link', ({url, position}) => {
      // is a hash or not a URL with a protocol (http, mailto, etc.)
      if (url.startsWith('#') || !/^\w+:/.test(url)) {
        // don't report on absolute links if we're devloping a local docset
        if (!process.env.DOCS_LOCAL || !isAbsolute(url)) {
          const {line, column} = position.start;
          links.push({
            from: slug,
            to: url,
            line,
            column
          });
        }
      }
    });

    return {
      ...acc,
      // remove trailing slashes
      [slug.replace(TRAILING_SLASH_PATTERN, '')]: {
        name: file.name,
        links,
        headings
      }
    };
  }, {});

  const allBrokenLinks = [];

  for (const slug in pages) {
    const brokenLinks = [];

    const {name, links} = pages[slug];
    for (const link of links) {
      const fullPath = link.to.startsWith('#')
        ? slug
        : isAbsolute(link.to)
        ? link.to
        : resolve(name === 'index' ? slug : dirname(slug), link.to);

      const [absPath, heading] = fullPath.split('#');
      const trimmedPath = absPath.replace(TRAILING_SLASH_PATTERN, '');

      if (ignore.includes(trimmedPath)) {
        continue;
      }

      const target = pages[trimmedPath];

      // if the target doesn't exist or the heading hash is wrong
      if (!target || (heading && !target.headings.includes(heading))) {
        brokenLinks.push(link);
      }
    }

    if (brokenLinks.length) {
      reporter.warn(
        `${brokenLinks.length} broken link${
          brokenLinks.length > 1 ? 's' : ''
        } found on ${slug}`
      );

      const lineDigits = brokenLinks.map(link => link.line.toString().length);
      const maxLineDigits = Math.max(...lineDigits);
      const columnDigits = brokenLinks.map(
        link => link.column.toString().length
      );
      const maxColumnDigits = Math.max(...columnDigits);

      for (const link of brokenLinks) {
        const position = [
          link.line.toString().padStart(maxLineDigits, ' '),
          link.column.toString().padEnd(maxColumnDigits, ' ')
        ].join(':');
        reporter.warn(`${position} ${link.to}`);
      }

      reporter.warn('---');

      allBrokenLinks.push(...brokenLinks);
    }
  }

  if (allBrokenLinks.length) {
    reporter.warn(`${allBrokenLinks.length} total broken links found`);

    if (
      process.env.CONTEXT === 'deploy-preview' ||
      process.env.CONTEXT === 'production'
    ) {
      const base = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY
      }).base('appbv2QKIU1C6G9dX');

      // save all links in chunks of 10 links each
      const chunks = chunk(allBrokenLinks, 10);
      const results = await Promise.all(
        chunks.map(links =>
          base('Links').create(
            links.map(link => ({
              fields: link
            }))
          )
        )
      );

      // create report with associated links
      await base('Reports').create([
        {
          fields: {
            Branch: process.env.HEAD,
            Links: results.flatMap(records =>
              records.map(record => record.getId())
            )
          }
        }
      ]);
    }
  } else {
    reporter.success('No broken links found. Hooray! 🎉');
  }
};
