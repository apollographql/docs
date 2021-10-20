import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import rehypeReact from 'rehype-react';
import {Button} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {graphql} from 'gatsby';

const components = {
  a: RelativeLink,
  code: CodeBlock,
  pre: 'div'
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
  const {childMdx, childMarkdownRemark} = data.file;
  const {frontmatter} = childMdx || childMarkdownRemark;
  return (
    <div>
      <Helmet title={frontmatter.title} />
      <PathContext.Provider value={path}>
        {childMdx ? (
          <MDXProvider components={mdxComponents}>
            <MDXRenderer>{childMdx.body}</MDXRenderer>
          </MDXProvider>
        ) : (
          renderAst(childMarkdownRemark.htmlAst)
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
      childMdx {
        body
        frontmatter {
          title
        }
      }
      childMarkdownRemark {
        htmlAst
        frontmatter {
          title
        }
      }
    }
  }
`;
