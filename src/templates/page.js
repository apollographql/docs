import Blockquote from '../components/Blockquote';
import CodeBlock from '../components/CodeBlock';
import CodeColumns from '../components/CodeColumns';
import DocsetMenu from '../components/DocsetMenu';
import EmbeddableExplorer from '../components/EmbeddableExplorer';
import ExpansionPanel, {
  ExpansionPanelList,
  ExpansionPanelListItem
} from '../components/ExpansionPanel';
import Footer from '../components/Footer';
import Header, {TOTAL_HEADER_HEIGHT} from '../components/Header';
import InlineCode from '../components/InlineCode';
import MultiCodeBlock, {
  MultiCodeBlockContext
} from '../components/MultiCodeBlock';
import Pagination from '../components/Pagination';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useMemo} from 'react';
import RelativeLink from '../components/RelativeLink';
import Sidebar, {
  SIDEBAR_WIDTH_BASE,
  SIDEBAR_WIDTH_XL
} from '../components/Sidebar';
import TableOfContents from '../components/TableOfContents';
import TypeScriptApiBox from '../components/TypeScriptApiBox';
import VersionBanner from '../components/VersionBanner';
import autolinkHeadings from 'rehype-autolink-headings';
import getShareImage from '@jlengstorf/get-share-image';
import path, {dirname} from 'path';
import rehypeReact from 'rehype-react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Fade,
  Flex,
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
import {FiChevronDown, FiChevronsRight, FiStar} from 'react-icons/fi';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {PathContext} from '../utils';
import {YouTube} from 'mdx-embed';
import {rehype} from 'rehype';
import {useMermaidStyles} from '../utils/mermaid';

const LIST_SPACING = 4;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const components = {
  h1: props => <Heading as="h1" size="2xl" {...props} />,
  h2: props => <Heading as="h2" size="xl" {...props} />,
  h3: props => <Heading as="h3" size="lg" {...props} />,
  h4: props => <Heading as="h4" size="md" {...props} />,
  h5: props => <Heading as="h5" size="sm" {...props} />,
  h6: props => <Heading as="h6" size="xs" {...props} />,
  ul: props => <UnorderedList spacing={LIST_SPACING} {...props} />,
  ol: props => <OrderedList spacing={LIST_SPACING} {...props} />,
  li: props => (
    <ListItem
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 3
          }
        }
      }}
      {...props}
    />
  ),
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
  inlineCode: InlineCode,
  Button, // TODO: consider making pages import this from @chakra-ui/react
  ExpansionPanel,
  ExpansionPanelList,
  ExpansionPanelListItem,
  MultiCodeBlock,
  YouTube,
  CodeColumns,
  TypeScriptApiBox,
  TypescriptApiBox: TypeScriptApiBox,
  EmbeddableExplorer
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

export default function PageTemplate({data, uri, pageContext}) {
  const paddingTop = useToken('space', 10);
  const paddingBottom = useToken('space', 12);
  const scrollPaddingTop = useMemo(
    () => `calc(${paddingTop} + ${TOTAL_HEADER_HEIGHT}px)`,
    [paddingTop]
  );

  const [language, setLanguage] = useLocalStorage('language');
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

  const mermaidStyles = useMermaidStyles();

  const {siteUrl} = data.site.siteMetadata;
  const {
    name,
    childMdx,
    childMarkdownRemark,
    basePath,
    gitRemote,
    relativePath
  } = data.file;

  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description} = frontmatter;
  const {docset, versions, currentVersion, navItems} = pageContext;
  const titleFont = encodeURIComponent('Source Sans Pro');

  const defaultVersion = useMemo(
    () => versions.find(version => !version.slug.includes('/')),
    [versions]
  );

  const editOnGitHub = useMemo(
    () =>
      gitRemote && (
        <Button
          as="a"
          href={[gitRemote.href, 'tree', gitRemote.ref, relativePath].join(
            path.sep
          )}
          variant="link"
          size="lg"
          leftIcon={<FaGithub />}
        >
          Edit on GitHub
        </Button>
      ),
    [gitRemote, relativePath]
  );

  return (
    <>
      <GatsbySeo
        title={title}
        description={description}
        canonical={siteUrl + uri}
        openGraph={{
          title,
          description,
          images: [
            {
              url: getShareImage({
                title,
                tagline: docset,
                titleFont,
                titleFontSize: 80,
                titleExtraConfig: '_bold',
                taglineFont: titleFont,
                textColor: 'FFFFFF',
                textLeftOffset: 80,
                textAreaWidth: 1120,
                cloudName: 'apollographql',
                imagePublicID: 'apollo-docs-template2_dohzxt'
              })
            }
          ]
        }}
      />
      <Global
        styles={{
          html: {
            scrollPaddingTop
          },
          '.mermaid': {
            lineHeight: 'normal',
            ...mermaidStyles
          }
        }}
      />
      <PathContext.Provider
        value={{
          uri,
          basePath,
          path: name === 'index' ? uri : dirname(uri)
        }}
      >
        <Header>
          <ButtonGroup variant="outline" isAttached shadow="sm" rounded="md">
            <DocsetMenu color="primary">{docset}</DocsetMenu>
            {versions.length > 1 && (
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} ml="-px">
                  {currentVersion}
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
          </ButtonGroup>
        </Header>
        <Fade in={sidebarHidden} unmountOnExit delay={0.25}>
          <Tooltip placement="right" label="Show sidebar">
            <IconButton
              pos="fixed"
              mt="2"
              left="2"
              size="sm"
              variant="outline"
              fontSize="md"
              icon={<FiChevronsRight />}
              css={{top: TOTAL_HEADER_HEIGHT}}
              onClick={() => setSidebarHidden(false)}
            />
          </Tooltip>
        </Fade>
        <Sidebar
          navItems={navItems}
          isHidden={sidebarHidden}
          onHide={() => setSidebarHidden(true)}
        />
        <Box
          marginLeft={{
            base: 0,
            md: sidebarHidden ? 0 : SIDEBAR_WIDTH_BASE,
            xl: sidebarHidden ? 0 : SIDEBAR_WIDTH_XL
          }}
          transitionProperty="margin-left"
          transitionDuration="normal"
        >
          {defaultVersion && defaultVersion.slug !== basePath && (
            <VersionBanner
              versionLabels={[defaultVersion.label, currentVersion]}
              to={'/' + defaultVersion.slug}
            />
          )}
          <Flex
            maxW="7xl"
            mx="auto"
            align="flex-start"
            px="10"
            as="main"
            sx={{
              paddingTop,
              paddingBottom
            }}
          >
            <Box flexGrow="1" w="0">
              <Heading as="h1" size="2xl">
                {title}
              </Heading>
              {description && (
                <Heading size="lg" mt="2" fontWeight="normal">
                  {description}
                </Heading>
              )}
              <Divider my="8" />
              <Box
                sx={{
                  fontSize: 'lg',
                  [HEADINGS]: {
                    a: {
                      color: 'inherit'
                    },
                    code: {
                      bg: 'none',
                      p: 0
                    }
                  },
                  '>': {
                    ':not(:last-child)': {
                      mb: 6
                    },
                    [HEADINGS]: {
                      ':not(:first-child)': {
                        mt: 10,
                        mb: 4
                      }
                    }
                  },
                  'img.screenshot': {
                    shadow: 'md',
                    rounded: 'md'
                  }
                }}
              >
                <MultiCodeBlockContext.Provider value={{language, setLanguage}}>
                  {childMdx ? (
                    <MDXProvider components={mdxComponents}>
                      <MDXRenderer>{childMdx.body}</MDXRenderer>
                    </MDXProvider>
                  ) : (
                    processSync(childMarkdownRemark.html).result
                  )}
                </MultiCodeBlockContext.Provider>
                <Box display={{lg: 'none'}}>{editOnGitHub}</Box>
              </Box>
              <Pagination navItems={navItems} />
            </Box>
            {uri !== '/' && (
              // hide the table of contents on the home page
              <chakra.aside
                display={{base: 'none', lg: 'flex'}}
                flexDirection="column"
                ml="10"
                w="250px"
                flexShrink="0"
                pos="sticky"
                top={scrollPaddingTop}
                maxH={`calc(100vh - ${scrollPaddingTop} - ${paddingBottom})`}
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
                  {editOnGitHub}
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
              </chakra.aside>
            )}
          </Flex>
          <Footer />
        </Box>
      </PathContext.Provider>
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
      basePath: sourceInstanceName
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
