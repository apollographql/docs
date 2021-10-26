import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import GithubSlugger from 'github-slugger';
import Header from '../components/Header';
import InlineCode from '../components/InlineCode';
import Layout from '../components/Layout';
import NavItems from '../components/NavItems';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useMemo} from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import Wrapper from '../components/Wrapper';
import rehypeReact from 'rehype-react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  chakra
} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {dirname} from 'path-browserify';
import {graphql} from 'gatsby';

const LIST_SPACING = 2;
const HEADING_OFFSET = 8;

const components = {
  p: Text,
  h1(props) {
    return <Heading as="h1" pt={HEADING_OFFSET} size="3xl" {...props} />;
  },
  h2(props) {
    return <Heading pt={HEADING_OFFSET} size="2xl" {...props} />;
  },
  h3(props) {
    return <Heading as="h3" pt={HEADING_OFFSET} {...props} />;
  },
  h4(props) {
    return <Heading as="h4" pt={HEADING_OFFSET} size="lg" {...props} />;
  },
  h5(props) {
    return <Heading as="h5" pt={HEADING_OFFSET} size="md" {...props} />;
  },
  h6(props) {
    return <Heading as="h6" pt={HEADING_OFFSET} size="sm" {...props} />;
  },
  a: RelativeLink,
  pre: CodeBlock,
  ul(props) {
    return <UnorderedList spacing={LIST_SPACING} {...props} />;
  },
  ol(props) {
    return <OrderedList spacing={LIST_SPACING} {...props} />;
  },
  li: ListItem,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td
};

const mdxComponents = {
  ...components,
  wrapper: Wrapper,
  inlineCode: InlineCode,
  Button,
  ExpansionPanel
};

const renderAst = new rehypeReact({
  createElement,
  Fragment,
  components: {
    ...components,
    code: InlineCode
  }
}).Compiler;

export default function PageTemplate({data, uri, pageContext}) {
  const {name, childMdx, childMarkdownRemark, sourceInstanceName} = data.file;
  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, standalone} = frontmatter;
  const {sidebar} = pageContext;

  const toc = useMemo(() => {
    const slugger = new GithubSlugger();
    return headings.map(heading => ({
      ...heading,
      id: slugger.slug(heading.value)
    }));
  }, [headings]);

  console.log(toc);

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
        <Grid templateColumns="300px 1fr" alignItems="flex-start">
          <chakra.aside
            h="100vh"
            borderRightWidth="1px"
            pos="sticky"
            top="0"
            overflow="auto"
            zIndex="0"
          >
            <Header />
            {sidebar && (
              <chakra.nav py="2" pr="2">
                <NavItems
                  uri={uri}
                  items={sidebar}
                  basePath={sourceInstanceName}
                />
              </chakra.nav>
            )}
          </chakra.aside>
          <Box px="10" py="12" as="main">
            <Heading size="3xl">{title}</Heading>
            {description && (
              <Heading mt="4" fontWeight="medium">
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
        headings {
          depth
          value
        }
        frontmatter {
          title
          description
          standalone
        }
      }
      childMarkdownRemark {
        html
        htmlAst
        headings {
          depth
          value
        }
        frontmatter {
          title
          description
        }
      }
    }
  }
`;
