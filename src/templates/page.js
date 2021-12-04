import CodeBlock from '../components/CodeBlock';
import CustomHeading from '../components/CustomHeading';
import ExpansionPanel from '../components/ExpansionPanel';
import GatsbyLink from 'gatsby-link';
import Header from '../components/Header';
import InlineCode from '../components/InlineCode';
import MultiCodeBlock from '../components/MultiCodeBlock';
import NavItems from '../components/NavItems';
import PropTypes from 'prop-types';
import React, {Fragment, createElement} from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import TableOfContents from '../components/TableOfContents';
import Wrapper from '../components/Wrapper';
import rehypeReact from 'rehype-react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  chakra,
  useTheme
} from '@chakra-ui/react';
import {FiChevronDown} from 'react-icons/fi';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {dirname} from 'path-browserify';
import {graphql} from 'gatsby';

const LIST_SPACING = 2;

const components = {
  p: Text,
  h1(props) {
    return <CustomHeading depth={1} {...props} />;
  },
  h2(props) {
    return <CustomHeading depth={2} {...props} />;
  },
  h3(props) {
    return <CustomHeading depth={3} {...props} />;
  },
  h4(props) {
    return <CustomHeading depth={4} {...props} />;
  },
  h5(props) {
    return <CustomHeading depth={5} {...props} />;
  },
  h6(props) {
    return <CustomHeading depth={6} {...props} />;
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
  ExpansionPanel,
  MultiCodeBlock
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
  const {space} = useTheme();

  const {siteUrl} = data.site.siteMetadata;
  const {name, childMdx, childMarkdownRemark, sourceInstanceName} = data.file;
  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, standalone} = frontmatter;
  const {config, versions} = pageContext;
  const {title: docset, sidebar, version} = config;

  const content = (
    <PathContext.Provider value={name === 'index' ? uri : dirname(uri)}>
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
    <>
      <GatsbySeo
        title={title}
        description={description}
        canonical={siteUrl + uri}
        openGraph={{
          title,
          description
        }}
      />
      <Global
        styles={{
          html: {
            scrollPaddingTop: space[12]
          }
        }}
      />
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
            <Flex px="2" py="1">
              <Button size="xs" fontSize="sm" variant="ghost" mr="auto">
                {docset}
              </Button>
              {versions && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown />}
                    size="xs"
                    fontSize="sm"
                  >
                    {version}
                  </MenuButton>
                  <MenuList>
                    {versions.map((version, index) => (
                      <GatsbyLink key={index} to={'/' + version.slug}>
                        <MenuItem>{version.label}</MenuItem>
                      </GatsbyLink>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </Flex>
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
          <Flex maxW="6xl" align="flex-start" px="10" py="12" as="main">
            <Box flexGrow="1" w="0">
              <Heading size="3xl">{title}</Heading>
              {description && (
                <Heading mt="4" fontWeight="normal">
                  {description}
                </Heading>
              )}
              <Divider my="8" />
              {content}
            </Box>
            <chakra.aside
              ml="10"
              w="250px"
              flexShrink="0"
              pos="sticky"
              top="12"
            >
              <Heading size="md" mb="3">
                {title}
              </Heading>
              <TableOfContents headings={headings} />
            </chakra.aside>
          </Flex>
        </Grid>
      )}
    </>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
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
