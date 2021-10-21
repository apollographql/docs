import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import Layout from '../components/Layout';
import NavItems from '../components/NavItems';
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
  Grid,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  chakra
} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {dirname} from 'path-browserify';
import {graphql} from 'gatsby';

const components = {
  a: RelativeLink,
  pre: CodeBlock,
  p: Text,
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

export default function PageTemplate({data, uri, pageContext}) {
  const {gitRemote, childMdx, childMarkdownRemark} = data.file;
  const {frontmatter} = childMdx || childMarkdownRemark;
  const {title, description} = frontmatter;
  const {sidebar} = pageContext;
  return (
    <Layout>
      <Helmet title={title} />
      <Grid templateColumns="300px 1fr">
        <chakra.aside>
          {sidebar && (
            <chakra.nav>
              <NavItems
                uri={uri}
                items={sidebar}
                basePath={gitRemote?.sourceInstanceName}
              />
            </chakra.nav>
          )}
        </chakra.aside>
        <Box px="10" py="12" as="main">
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
      </Grid>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      name
      gitRemote {
        sourceInstanceName
      }
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
