import Blockquote from './Blockquote';
import CodeColumns from './CodeColumns';
import DocsetMenu from './DocsetMenu';
import ExpansionPanel from './ExpansionPanel';
import Footer from './Footer';
import InlineCode from './InlineCode';
import Pagination from './Pagination';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useCallback, useMemo} from 'react';
import RelativeLink, {PrimaryLink} from './RelativeLink';
import TypeScriptApiBox from './TypeScriptApiBox';
import VersionBanner from './VersionBanner';
import autolinkHeadings from 'rehype-autolink-headings';
import getShareImage from '@jlengstorf/get-share-image';
import path, {dirname} from 'path';
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
  Table,
  Tag,
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
import {
  EmbeddableExplorer,
  MarkdownCodeBlock,
  MultiCodeBlock,
  MultiCodeBlockContext
} from '@apollo/chakra-helpers';
import {FaGithub} from 'react-icons/fa';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {PathContext, useFieldTableStyles} from '../utils';
import {SIDEBAR_WIDTH_BASE, SIDEBAR_WIDTH_XL} from './Sidebar';
import {TOTAL_HEADER_HEIGHT} from './Header';
import {YouTube} from './YouTube';
import {graphql, useStaticQuery} from 'gatsby';
import {kebabCase} from 'lodash';
import {rehype} from 'rehype';
import {useMermaidStyles} from '../utils/mermaid';

// these must be imported after MarkdownCodeBlock
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import {ApolloHeader} from './ApolloHeader';
import {ApolloSidebar} from './ApolloSidebar';
import {ApolloTableOfContents} from './ApolloTableOfContents';

const LIST_SPACING = 4;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const NESTED_LIST_STYLES = {
  [['ul', 'ol']]: {
    mt: 3,
    fontSize: 'md',
    lineHeight: 'normal'
  }
};

const components = {
  h1: props => <Heading as="h1" size="2xl" {...props} />,
  h2: props => <Heading as="h2" size="xl" {...props} />,
  h3: props => <Heading as="h3" size="lg" {...props} />,
  h4: props => <Heading as="h4" size="md" {...props} />,
  h5: props => <Heading as="h5" size="sm" {...props} />,
  h6: props => <Heading as="h6" size="xs" {...props} />,
  ul: props => (
    <UnorderedList
      spacing={LIST_SPACING}
      sx={{
        ...NESTED_LIST_STYLES,
        ul: {
          listStyleType: 'circle'
        }
      }}
      {...props}
    />
  ),
  ol: props => (
    <OrderedList spacing={LIST_SPACING} sx={NESTED_LIST_STYLES} {...props} />
  ),
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
  pre: MarkdownCodeBlock,
  table: props => (
    <Box
      rounded="md"
      borderWidth={1}
      overflow="auto"
      sx={{table: {borderWidth: 0}}}
    >
      <Table {...props} />
    </Box>
  ),
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: props => (
    <Td
      sx={{
        fontSize: 'md'
      }}
      {...props}
    />
  ),
  blockquote: Blockquote,
  undefined: Fragment // because remark-a11y-emoji adds <undefined> around stuff
};

const mdxComponents = {
  ...components,
  inlineCode: InlineCode,
  Button, // TODO: consider making pages import this from @chakra-ui/react
  ExpansionPanel,
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

export default function Page({file, pageContext, uri}) {
  const paddingTop = useToken('space', 10);
  const paddingBottom = useToken('space', 12);
  const scrollMarginTop = useMemo(
    () => `calc(${paddingTop} + ${TOTAL_HEADER_HEIGHT}px)`,
    [paddingTop]
  );

  const [language, setLanguage] = useLocalStorage('language');
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

  const mermaidStyles = useMermaidStyles();
  const fieldTableStyles = useFieldTableStyles();

  const {
    site: {
      siteMetadata: {siteUrl}
    }
  } = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  );

  const {
    name,
    childMdx,
    childMarkdownRemark,
    basePath,
    gitRemote,
    relativePath
  } = file;

  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, toc, tags} = frontmatter;
  const {docset, versions, currentVersion, navItems, algoliaFilters} =
    pageContext;
  const titleFont = encodeURIComponent('Source Sans Pro');

  const defaultVersion = useMemo(
    () => versions.find(version => !version.slug.includes('/')),
    [versions]
  );

  const editOnGitHub = useMemo(() => {
    const repo = gitRemote?.href || 'https://github.com/apollographql/docs';

    const repoPath = ['tree', gitRemote?.ref || 'main'];

    if (gitRemote) {
      repoPath.push('docs', 'source');
    } else {
      repoPath.push('src', 'content', basePath === '/' ? 'basics' : basePath);
    }

    repoPath.push(relativePath);

    return (
      <Button
        as="a"
        href={`${repo}/${path.join(...repoPath)}`}
        variant="link"
        size="lg"
        leftIcon={<FaGithub />}
      >
        Edit on GitHub
      </Button>
    );
  }, [gitRemote, basePath, relativePath]);

  const renderSwitcher = useCallback(
    props => (
      <DocsetMenu
        docset={docset}
        versions={versions}
        currentVersion={currentVersion}
        {...props}
      />
    ),
    [docset, versions, currentVersion]
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
        <ApolloHeader
          algoliaFilters={algoliaFilters}
          navItems={navItems}
          renderSwitcher={renderSwitcher({size: 'sm'})}
          renderSwitcher1={renderSwitcher({d: {base: 'none', md: 'flex'}})}
        />
        <ApolloSidebar
          in={sidebarHidden}
          onClick={() => setSidebarHidden(false)}
          navItems={navItems}
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
            maxW="6xl"
            mx="auto"
            align="flex-start"
            px={{base: 6, md: 10}}
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
              {tags?.length && (
                <Flex gap={1} mt={{base: 2, md: 3}}>
                  {tags.map(tag => (
                    <PrimaryLink
                      key={tag}
                      href={`/technotes/tags/${kebabCase(tag)}`}
                    >
                      <Tag size="lg">{tag}</Tag>
                    </PrimaryLink>
                  ))}
                </Flex>
              )}
              <Divider my="8" />
              <Box
                fontSize={{md: 'lg'}}
                lineHeight={{md: 1.7}}
                css={{
                  [HEADINGS]: {
                    scrollMarginTop
                  }
                }}
                sx={{
                  [HEADINGS]: {
                    a: {
                      color: 'inherit'
                    },
                    code: {
                      bg: 'none',
                      p: 0,
                      color: 'secondary'
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
                    shadow: 'inner',
                    table: {
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
            <ApolloTableOfContents
              toc={toc}
              top={scrollMarginTop}
              paddingBottom={paddingBottom}
              title={title}
              headings={headings}
              onClick={() => window.freddyWidget?.show()}
              editOnGitHub={editOnGitHub}
            />
          </Flex>
          <Footer />
        </Box>
      </PathContext.Provider>
    </>
  );
}

Page.propTypes = {
  file: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired
};
