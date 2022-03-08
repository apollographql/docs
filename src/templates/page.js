import Blockquote from '../components/Blockquote';
import CodeBlock from '../components/CodeBlock';
import CodeColumns from '../components/CodeColumns';
import EmbeddableExplorer from '../components/EmbeddableExplorer';
import ExpansionPanel, {
  ExpansionPanelList,
  ExpansionPanelListItem
} from '../components/ExpansionPanel';
import Footer from '../components/Footer';
import InlineCode from '../components/InlineCode';
import MultiCodeBlock, {
  MultiCodeBlockContext
} from '../components/MultiCodeBlock';
import Pagination from '../components/Pagination';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useMemo} from 'react';
import RelativeLink from '../components/RelativeLink';
import TableOfContents from '../components/TableOfContents';
import TypeScriptApiBox from '../components/TypeScriptApiBox';
import VersionBanner from '../components/VersionBanner';
import autolinkHeadings from 'rehype-autolink-headings';
import getShareImage from '@jlengstorf/get-share-image';
import rehypeReact from 'rehype-react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  chakra,
  useToken
} from '@chakra-ui/react';
import {FaDiscourse, FaGithub} from 'react-icons/fa';
import {FiStar} from 'react-icons/fi';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {TOTAL_HEADER_HEIGHT} from '../components/Header';
import {YouTube} from 'mdx-embed';
import {graphql} from 'gatsby';
import {rehype} from 'rehype';
import {sep} from 'path';
import {useFieldTableStyles} from '../utils';
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

  const mermaidStyles = useMermaidStyles();
  const fieldTableStyles = useFieldTableStyles();

  const {siteUrl} = data.site.siteMetadata;
  const {childMdx, childMarkdownRemark, basePath, gitRemote, relativePath} =
    data.file;

  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, toc} = frontmatter;
  const {docset, versions, currentVersion, navItems} = pageContext;

  const shareImage = useMemo(() => {
    const titleFont = encodeURIComponent('Source Sans Pro');
    return getShareImage({
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
    });
  }, [docset, title]);

  const defaultVersion = useMemo(
    () => versions.find(version => !version.slug.includes('/')),
    [versions]
  );

  const editOnGitHub = useMemo(
    () =>
      gitRemote && (
        <Button
          as="a"
          href={[gitRemote.href, 'tree', gitRemote.ref, relativePath].join(sep)}
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
          images: [{url: shareImage}]
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
      {defaultVersion && defaultVersion.slug !== basePath && (
        <VersionBanner
          versionLabels={[defaultVersion.label, currentVersion]}
          to={'/' + defaultVersion.slug}
        />
      )}
      <Flex
        maxW="6xl"
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
            <chakra.h2
              fontSize={{base: 'xl', md: '2xl'}}
              lineHeight="normal"
              mt={{base: 2, md: 3}}
              fontWeight="normal"
            >
              {description}
            </chakra.h2>
          )}
          <Divider my="8" />
          <Box
            fontSize={{md: 'lg'}}
            lineHeight={{md: 1.7}}
            sx={{
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
              },
              '.field-table': fieldTableStyles,
              '.sticky-table': {
                rounded: 'md',
                overflow: 'auto',
                shadow: 'inner',
                borderWidth: 1,
                table: {
                  borderWidth: 0,
                  [['td', 'th']]: {
                    ':first-of-type': {
                      position: 'sticky',
                      left: 0,
                      bg: 'bg',
                      borderRightWidth: 1
                    }
                  },
                  'tr:last-child': {
                    td: {
                      borderBottom: 'none'
                    }
                  }
                }
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
            <Box d={{lg: 'none'}}>{editOnGitHub}</Box>
          </Box>
          <Pagination navItems={navItems} />
        </Box>
        {toc !== false && (
          // hide the table of contents on the home page
          <chakra.aside
            d={{base: 'none', lg: 'flex'}}
            flexDirection="column"
            ml={{base: 10, xl: 16}}
            w={250}
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
          toc
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
