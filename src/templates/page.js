import ExpansionPanel from '../components/ExpansionPanel';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import rehypeReact from 'rehype-react';
import {Button} from '@chakra-ui/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {graphql} from 'gatsby';

const components = {
  a: RelativeLink
};

const mdxComponents = {
  ...components,
  Button,
  ExpansionPanel
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components
}).Compiler;

export default function PageTemplate({data, path}) {
  const [{body, htmlAst}] = data.file.children;
  return (
    <div>
      <PathContext.Provider value={path}>
        {body ? (
          <MDXProvider components={mdxComponents}>
            <MDXRenderer>{body}</MDXRenderer>
          </MDXProvider>
        ) : (
          renderAst(htmlAst)
        )}
      </PathContext.Provider>
    </div>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      children {
        ... on Mdx {
          body
        }
        ... on MarkdownRemark {
          htmlAst
        }
      }
    }
  }
`;
