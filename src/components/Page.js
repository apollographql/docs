import Blockquote from './Blockquote';
import CodeColumns from './CodeColumns';
import ExpansionPanel, {
  ExpansionPanelList,
  ExpansionPanelListItem
} from './ExpansionPanel';
import InlineCode from './InlineCode';
import Pagination from './Pagination';
import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React, {Fragment, createElement, useMemo} from 'react';
import RelativeLink, {ButtonLink} from './RelativeLink';
import TableOfContents from './TableOfContents';
import TypeScriptApiBox from './TypeScriptApiBox';
import VersionBanner from './VersionBanner';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeReact from 'rehype-react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  HStack,
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
  useBreakpointValue
} from '@chakra-ui/react';
import {
  EmbeddableExplorer,
  MarkdownCodeBlock,
  MultiCodeBlock,
  MultiCodeBlockContext
} from '@apollo/chakra-helpers';
import {FeedbackButton} from './FeedbackButton';
import {FiGithub, FiMessageCircle} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {Global} from '@emotion/react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {
  PAGE_FOOTER_HEIGHT,
  PAGE_PADDING_BOTTOM,
  PAGE_PADDING_TOP,
  PageContent,
  PageSeo
} from './PageLayout';
import {TOTAL_HEADER_HEIGHT} from './Header';
import {YouTube} from './YouTube';
import {join} from 'path';
import {kebabCase} from 'lodash';
import {rehype} from 'rehype';
import {useConfig} from '../utils/config';
import {useFieldTableStyles} from '../utils';
import {useMermaidStyles} from '../utils/mermaid';

// these must be imported after MarkdownCodeBlock
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-js-templates';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import {SiDiscord} from 'react-icons/si';

// use JS syntax highlighting for rhai codeblocks
Prism.languages.rhai = Prism.languages.javascript;

const LIST_SPACING = 4;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const SCROLL_MARGIN_TOP = PAGE_PADDING_TOP + TOTAL_HEADER_HEIGHT;

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
  ExpansionPanelList,
  ExpansionPanelListItem,
  MultiCodeBlock,
  YouTube,
  CodeColumns,
  TypeScriptApiBox,
  TypescriptApiBox: TypeScriptApiBox,
  EmbeddableExplorer,
  ButtonLink
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

export default function Page({file}) {
  const [language, setLanguage] = useLocalStorage('language');

  const mermaidStyles = useMermaidStyles();
  const fieldTableStyles = useFieldTableStyles();

  const {childMdx, childMarkdownRemark, basePath, gitRemote, relativePath} =
    file;

  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {title, description, toc, tags, headingDepth} = frontmatter;

  const {docset, versions, currentVersion, navItems, versionBanner} =
    useConfig(basePath);

  const defaultVersion = useMemo(
    () => versions.find(version => !version.slug.includes('/')),
    [versions]
  );

  const editText = useBreakpointValue({
    base: 'Edit',
    lg: 'Edit on GitHub'
  });

  const editOnGitHub = useMemo(() => {
    const repo = `https://github.com/${
      gitRemote?.full_name ?? 'apollographql/docs'
    }`;

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
        href={`${repo}/${join(...repoPath)}`}
        variant="link"
        size="lg"
        leftIcon={<FiGithub />}
      >
        {editText}
      </Button>
    );
  }, [gitRemote, basePath, relativePath, editText]);

  return (
    <>
      <Global
        styles={{
          '.mermaid': {
            lineHeight: 'normal',
            ...mermaidStyles
          }
        }}
      />
      <PageSeo title={title} description={description} docset={docset} />
      {versionBanner ? (
        <VersionBanner
          versionLabels={[]}
          to={versionBanner.link.to}
          message={versionBanner.message}
        >
          {versionBanner.link.content}
        </VersionBanner>
      ) : defaultVersion && defaultVersion.slug !== basePath ? (
        <VersionBanner
          versionLabels={[defaultVersion.label, currentVersion]}
          to={'/' + defaultVersion.slug}
        >
          Switch to the latest stable version.
        </VersionBanner>
      ) : null}
      <PageContent
        sx={{
          [HEADINGS]: {
            a: {
              color: 'inherit'
            },
            code: {
              bg: 'none',
              p: 0,
              color: 'secondary',
              whiteSpace: 'normal'
            }
          },
          '>': {
            ':not(:last-child)': {
              mb: 6
            },
            ':not(style:first-child) +': {
              [HEADINGS]: {
                mt: 10,
                mb: 4
              }
            }
          },
          'img.screenshot': {
            shadow: 'md',
            rounded: 'md'
          },
          table: {
            td: {
              '>': {
                ':not(:last-child)': {
                  mb: 3
                }
              },
              [['ul', 'ol']]: {
                [['ul', 'ol']]: {
                  mt: 1
                },
                'li:not(:first-child)': {
                  mt: 1
                }
              }
            }
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
        css={{
          [HEADINGS]: {
            scrollMarginTop: SCROLL_MARGIN_TOP
          }
        }}
        title={title}
        subtitle={
          <>
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
              <HStack mt={{base: 2, md: 3}}>
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    as={GatsbyLink}
                    to={`/technotes/tags/${kebabCase(tag)}`}
                    size="lg"
                  >
                    {tag}
                  </Tag>
                ))}
              </HStack>
            )}
          </>
        }
        pagination={<Pagination navItems={navItems} />}
        aside={
          toc !== false && headings.length ? (
            // hide the table of contents on the home page
            <chakra.aside
              d={{base: 'none', xl: 'flex'}}
              flexDirection="column"
              ml={{base: 10, xl: 16}}
              w={250}
              flexShrink="0"
              pos="sticky"
              css={{top: SCROLL_MARGIN_TOP}}
              maxH={`calc(100vh - ${SCROLL_MARGIN_TOP}px - ${PAGE_PADDING_BOTTOM}px - ${PAGE_FOOTER_HEIGHT}px)`}
            >
              <Heading size="md" mb="3">
                {title}
              </Heading>
              <TableOfContents
                headings={headings}
                // jc: passing undefined here as headingDepth returns null if it doesn't exist in the frontmatter
                // and we need undefined in order to make use of default props
                headingDepth={headingDepth ?? undefined}
              />
            </chakra.aside>
          ) : null
        }
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
      </PageContent>
      <HStack
        justify="flex-end"
        px={{
          base: 6,
          md: 10,
          xl: 12
        }}
        borderTopWidth={1}
        bg="bg"
        spacing="6"
        pos="sticky"
        bottom="0"
        css={{
          height: PAGE_FOOTER_HEIGHT
        }}
      >
        <FeedbackButton title={title} />
        {editOnGitHub}
        <Button
          as="a"
          href="https://community.apollographql.com/"
          variant="link"
          size="lg"
          leftIcon={<FiMessageCircle />}
        >
          Forums
        </Button>
        <Button
          as="a"
          href="https://discord.gg/yFZJH2QYrK"
          variant="link"
          size="lg"
          onClick={() => window.gtag?.('event', 'discord_join_docs')}
          leftIcon={<SiDiscord />}
        >
          Discord
        </Button>
      </HStack>
    </>
  );
}

Page.propTypes = {
  file: PropTypes.object.isRequired
};
