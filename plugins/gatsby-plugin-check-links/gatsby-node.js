const visit = require('unist-util-visit');
const fromMarkdown = require('mdast-util-from-markdown');
const GithubSlugger = require('github-slugger');
const {dirname, resolve, isAbsolute} = require('path');

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
        const {line, column} = position.start;
        links.push({
          to: url,
          line,
          column
        });
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

  let totalBrokenLinks = 0;

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
      reporter.warn(`${brokenLinks.length} broken links found on ${slug}`);

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

      totalBrokenLinks += brokenLinks.length;
    }
  }

  reporter.warn(`${totalBrokenLinks} total broken links`);
};
