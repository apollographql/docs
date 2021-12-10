import Blockquote from '../components/Blockquote';
import CodeBlock from '../components/CodeBlock';
import ExpansionPanel from '../components/ExpansionPanel';
import Header from '../components/Header';
import InlineCode from '../components/InlineCode';
import MultiCodeBlock, {
  MultiCodeBlockContext
} from '../components/MultiCodeBlock';
import NavItems, {NavContext} from '../components/NavItems';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useMemo, useState} from 'react';
import RelativeLink, {PathContext} from '../components/RelativeLink';
import TableOfContents from '../components/TableOfContents';
import Wrapper from '../components/Wrapper';
import autolinkHeadings from 'rehype-autolink-headings';
import path, {dirname} from 'path';
import rehypeReact from 'rehype-react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  OrderedList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  chakra,
  useToken
} from '@chakra-ui/react';
import {FaDiscourse, FaGithub} from 'react-icons/fa';
import {
  FiChevronDown,
  FiChevronsDown,
  FiChevronsUp,
  FiStar
} from 'react-icons/fi';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {rehype} from 'rehype';
import {useLocalStorage} from '@rehooks/local-storage';

const LIST_SPACING = 2;

const components = {
  h1: props => <Heading as="h1" size="3xl" {...props} />,
  h2: props => <Heading as="h2" size="2xl" {...props} />,
  h3: props => <Heading as="h3" size="xl" {...props} />,
  h4: props => <Heading as="h4" size="lg" {...props} />,
  h5: props => <Heading as="h5" size="md" {...props} />,
  h6: props => <Heading as="h6" size="sm" {...props} />,
  ul: props => <UnorderedList spacing={LIST_SPACING} {...props} />,
  ol: props => <OrderedList spacing={LIST_SPACING} {...props} />,
  li: ListItem,
  p: Text,
  a: RelativeLink,
  pre: CodeBlock,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  blockquote: Blockquote
};

const mdxComponents = {
  ...components,
  wrapper: Wrapper,
  inlineCode: InlineCode,
  Button,
  ExpansionPanel,
  MultiCodeBlock
};

const {processSync} = rehype()
  .data('settings', {fragment: true})
  .use(autolinkHeadings, {behavior: 'wrap'})
  .use(rehypeReact, {
    createElement,
    Fragment,
    components: {
      ...components,
      code: InlineCode
    }
  });

function flattenNavItems(items) {
  return items.flatMap(item =>
    Array.isArray(item.children)
      ? [item, ...flattenNavItems(item.children)]
      : item
  );
}

export default function PageTemplate({data, uri, pageContext}) {
  const [scrollPaddingTop, tocPaddingBottom] = useToken('space', [12, 4]);
  const [language, setLanguage] = useLocalStorage('language');

  const {siteUrl} = data.site.siteMetadata;
  const {
    name,
    childMdx,
    childMarkdownRemark,
    sourceInstanceName,
    gitRemote,
    relativePath
  } = data.file;
  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, standalone} = frontmatter;
  const {versions, docset, navItems, version} = pageContext;

  const [nav, setNav] = useState(
    flattenNavItems(navItems)
      .filter(navItem => Array.isArray(navItem.children))
      .reduce(
        (acc, navGroup) => ({
          ...acc,
          [navGroup.id]: false // TODO: determine if this is default active based on URL
        }),
        {}
      )
  );

  const isAllExpanded = useMemo(() => Object.values(nav).every(Boolean), [nav]);

  const content = (
    <MultiCodeBlockContext.Provider value={{language, setLanguage}}>
      <PathContext.Provider value={name === 'index' ? uri : dirname(uri)}>
        {childMdx ? (
          <MDXProvider components={mdxComponents}>
            <MDXRenderer>{childMdx.body}</MDXRenderer>
          </MDXProvider>
        ) : (
          <Wrapper>{processSync(childMarkdownRemark.html).result}</Wrapper>
        )}
      </PathContext.Provider>
    </MultiCodeBlockContext.Provider>
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
            scrollPaddingTop
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
            <Flex pl="4" pr="2" py="1">
              <Button
                size="xs"
                fontSize="sm"
                roundedRight="0"
                colorScheme="indigo"
              >
                {docset}
              </Button>
              {versions && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown />}
                    size="xs"
                    ml="px"
                    roundedLeft="0"
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
              <Tooltip
                label={`${
                  isAllExpanded ? 'Collapse' : 'Expand'
                } all categories`}
              >
                <IconButton
                  ml="auto"
                  size="xs"
                  fontSize="md"
                  icon={isAllExpanded ? <FiChevronsUp /> : <FiChevronsDown />}
                  onClick={() =>
                    setNav(prev =>
                      Object.keys(prev).reduce(
                        (acc, key) => ({
                          ...acc,
                          [key]: !isAllExpanded
                        }),
                        {}
                      )
                    )
                  }
                />
              </Tooltip>
            </Flex>
            <chakra.nav py="2" pr="2">
              <NavContext.Provider
                value={{uri, basePath: sourceInstanceName, nav, setNav}}
              >
                <NavItems
                  uri={uri}
                  items={navItems}
                  basePath={sourceInstanceName}
                />
              </NavContext.Provider>
            </chakra.nav>
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
            <Flex
              direction="column"
              as="aside"
              ml="10"
              w="250px"
              flexShrink="0"
              pos="sticky"
              top={scrollPaddingTop}
              pb={tocPaddingBottom}
              maxH={`calc(100vh - ${scrollPaddingTop} - ${tocPaddingBottom})`}
            >
              <Heading size="md" mb="3">
                {title}
              </Heading>
              <TableOfContents headings={headings} />
              <Stack align="flex-start" spacing="3" mt="8">
                <Button
                  onClick={() => window.freddyWidget?.show()}
                  variant="link"
                  size="lg"
                  leftIcon={<FiStar />}
                >
                  Rate article
                </Button>
                {gitRemote && (
                  <Button
                    as="a"
                    href={[
                      gitRemote.href,
                      'tree',
                      gitRemote.ref,
                      relativePath
                    ].join(path.sep)}
                    variant="link"
                    size="lg"
                    leftIcon={<FaGithub />}
                  >
                    Edit on GitHub
                  </Button>
                )}
                <Button
                  as="a"
                  href="https://community.apollographql.com/"
                  variant="link"
                  size="lg"
                  leftIcon={<FaDiscourse />}
                >
                  Discuss in forums
                </Button>
              </Stack>
            </Flex>
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
      relativePath
      gitRemote {
        href
        ref
      }
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
