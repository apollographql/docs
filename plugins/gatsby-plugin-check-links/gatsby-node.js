const visit = require('unist-util-visit');
const fromMarkdown = require('mdast-util-from-markdown');
const GithubSlugger = require('github-slugger');
const {dirname, resolve, isAbsolute} = require('path');

const TRAILING_SLASH_PATTERN = /(?!^)\/$/;

exports.createPages = async ({graphql}) => {
  const {data} = await graphql(
    `
      {
        allFile(filter: {extension: {in: ["md", "mdx"]}}, limit: 100) {
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
      // is a hash or not a URL
      if (url.startsWith('#') || !/^https?:\/\//.test(url)) {
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

  const validLinks = [];
  const brokenLinks = [];

  for (const slug in pages) {
    const {name, links} = pages[slug];
    for (const link of links) {
      const fullPath = link.to.startsWith('#')
        ? slug
        : isAbsolute(link.to)
        ? link.to
        : resolve(name === 'index' ? slug : dirname(slug), link.to);

      const [absPath, heading] = fullPath.split('#');
      const trimmedPath = absPath.replace(TRAILING_SLASH_PATTERN, '');
      const target = pages[trimmedPath];

      if (target && (!heading || target.headings.includes(heading))) {
        validLinks.push(fullPath);
        continue;
      }

      brokenLinks.push(fullPath);
    }
  }

  console.log({validLinks, brokenLinks});
};
