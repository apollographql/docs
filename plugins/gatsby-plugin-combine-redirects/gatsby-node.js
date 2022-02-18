const {join} = require('path');
const {writeFileSync} = require('fs');

exports.createPages = async ({graphql}) => {
  const {data} = await graphql(`
    {
      allFile(filter: {base: {eq: "_redirects"}}) {
        nodes {
          id
          fields {
            content
          }
          sourceInstanceName
        }
      }
    }
  `);

  // combine sourced redirect files for each docset
  const redirects = data.allFile.nodes
    .flatMap(node =>
      node.fields.content
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => {
          const [from, ...rest] = line.split(/\s+/);
          // append docset path to redirect "from" path
          return [join('/', node.sourceInstanceName, from), ...rest].join(' ');
        })
    )
    .join('\n');

  // write combined redirects file
  writeFileSync('public/_redirects', redirects);
};
