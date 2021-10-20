import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import Layout from '../components/Layout';
import PropTypes from 'prop-types';
import React, {Fragment, createElement} from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import Wrapper from '../components/Wrapper';
import rehypeReact from 'rehype-react';
import {
  Box,
  Button,
  Code,
  Divider,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList
} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {dirname} from 'path-browserify';
import {graphql} from 'gatsby';

const components = {
  a: RelativeLink,
  pre: CodeBlock,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem
};

const mdxComponents = {
  ...components,
  wrapper: Wrapper,
  inlineCode: Code,
  Button,
  ExpansionPanel
};

const renderAst = new rehypeReact({
  createElement,
  Fragment,
  components: {
    ...components,
    code: Code
  }
}).Compiler;

export default function PageTemplate({data, uri}) {
  const {childMdx, childMarkdownRemark} = data.file;
  const {frontmatter} = childMdx || childMarkdownRemark;
  const {title, description} = frontmatter;
  return (
    <Layout>
      <Helmet title={title} />
      <Box px="10" py="12">
        <Heading size="2xl">{title}</Heading>
        {description && (
          <Heading mt="2" size="lg" fontWeight="medium">
            {description}
          </Heading>
        )}
        <Divider my="8" />
        <PathContext.Provider
          value={data.file.name === 'index' ? uri : dirname(uri)}
        >
          {childMdx ? (
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{childMdx.body}</MDXRenderer>
            </MDXProvider>
          ) : (
            <Wrapper>{renderAst(childMarkdownRemark.htmlAst)}</Wrapper>
          )}
        </PathContext.Provider>
      </Box>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      name
      childMdx {
        body
        frontmatter {
          title
          description
        }
      }
      childMarkdownRemark {
        htmlAst
        frontmatter {
          title
          description
        }
      }
    }
  }
`;
