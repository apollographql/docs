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
  const {name, childMdx, childMarkdownRemark, sourceInstanceName} = data.file;
  const {frontmatter} = childMdx || childMarkdownRemark;
  const {title, description, standalone} = frontmatter;
  const {sidebar} = pageContext;

  const path = name === 'index' ? uri : dirname(uri);
  const content = (
    <PathContext.Provider value={path}>
      {childMdx ? (
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{childMdx.body}</MDXRenderer>
        </MDXProvider>
      ) : (
        <Wrapper>{renderAst(childMarkdownRemark.htmlAst)}</Wrapper>
      )}
    </PathContext.Provider>
  );

  return (
    <Layout>
      <Helmet title={title}>
        <meta name="description" content={description} />
      </Helmet>
      {standalone ? (
        content
      ) : (
        <Grid templateColumns="300px 1fr">
          <chakra.aside borderRightWidth="1px" pr="2">
            {sidebar && (
              <chakra.nav>
                <NavItems
                  uri={uri}
                  items={sidebar}
                  basePath={sourceInstanceName}
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
            {content}
          </Box>
        </Grid>
      )}
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
      sourceInstanceName
      childMdx {
        body
        frontmatter {
          title
          description
          standalone
        }
      }
      childMarkdownRemark {
        html
        htmlAst
        frontmatter {
          title
          description
        }
      }
    }
  }
`;
