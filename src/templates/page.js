import PropTypes from 'prop-types';
import React from 'react';
import rehypeReact from 'rehype-react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {graphql} from 'gatsby';

const renderAst = new rehypeReact({
  createElement: React.createElement
}).Compiler;

export default function PageTemplate({data}) {
  const [{body, htmlAst}] = data.file.children;
  return (
    <div>{body ? <MDXRenderer>{body}</MDXRenderer> : renderAst(htmlAst)}</div>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired
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
