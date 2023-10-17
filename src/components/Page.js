import * as sharedContent from '../content/shared';
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
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
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
  chakra
} from '@chakra-ui/react';
import {CustomHeading} from './CustomHeading';
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
import {HighlightKeyTerms} from '@apollo/pedia';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {MinVersion} from './MinVersion';
import {
  PAGE_FOOTER_HEIGHT,
  PAGE_PADDING_BOTTOM,
  PAGE_PADDING_TOP,
  PageContent,
  PageSeo
} from './PageLayout';
import {PreviewFeature} from './PreviewFeature';
import {SiDiscord} from 'react-icons/si';
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
  h1: props => <CustomHeading as="h1" size="2xl" {...props} />,
  h2: props => <CustomHeading as="h2" size="xl" {...props} />,
  h3: props => <CustomHeading as="h3" size="lg" {...props} />,
  h4: props => <CustomHeading as="h4" size="md" {...props} />,
  h5: props => <CustomHeading as="h5" size="sm" {...props} />,
  h6: props => <CustomHeading as="h6" size="xs" {...props} />,
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
  li: ({children, ...props}) => (
    <ListItem
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 3
          }
        }
      }}
      {...props}
    >
      <HighlightKeyTerms>{children}</HighlightKeyTerms>
    </ListItem>
  ),
  p: ({children}) => {
    return (
      <Text>
        <HighlightKeyTerms>{children}</HighlightKeyTerms>
      </Text>
    );
  },
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
  ...sharedContent,
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
  ButtonLink,
  MinVersion,
  PreviewFeature,
  ApolloLogo,
  ApolloMark
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
  const {title, description, toc, tags, headingDepth, minVersion, noIndex} =
    frontmatter;

  const {docset, versions, currentVersion, navItems, versionBanner} =
    useConfig(basePath);

  const defaultVersion = useMemo(
    () => versions.find(version => !version.slug.includes('/')),
    [versions]
  );

  const editOnGitHub = useMemo(() => {
    const repo = `https://github.com/${
      gitRemote?.full_name ?? 'apollographql/docs'
    }`;

    const repoPath = ['tree', gitRemote?.ref || 'main'];

    if (gitRemote) {
      repoPath.push('docs', 'source');
    } else {
      repoPath.push('src', 'content');

      if (basePath === '/') {
        repoPath.push('basics');
      } else {
        repoPath.push(basePath);

        const graphOSBasicsContent = [
          'graphs',
          'operations',
          'quickstart',
          'routing',
          'api-keys',
          'data-privacy',
          'platform-api',
          'sub-processors',
          'index'
        ];

        // Check to see if the current page is within the GraphOS Basics section
        if (
          basePath === 'graphos' &&
          graphOSBasicsContent.some(content => relativePath.startsWith(content))
        ) {
          // The additional `basics` segment added to the repo path as it is not in the url
          repoPath.push('basics');
        }
      }
    }

    repoPath.push(relativePath);

    return (
      <Button
        aria-label="Edit on GitHub"
        as="a"
        href={`${repo}/${join(...repoPath)}`}
        variant="link"
        _dark={{
          color: 'gray.200'
        }}
        size="lg"
        leftIcon={<FiGithub />}
      >
        <Text as="span" display={{base: 'none', lg: 'inline'}}>
          Edit on GitHub
        </Text>
        <Text as="span" display={{base: 'inline', lg: 'none'}}>
          Edit
        </Text>
      </Button>
    );
  }, [gitRemote, basePath, relativePath]);

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
      <PageSeo
        noindex={noIndex === true}
        title={title}
        description={description}
        docset={docset}
      />
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
            rounded: 'md',
            _dark: {
              shadow: 'dark-lg'
            }
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
        minVersion={minVersion}
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
          aria-label="Ask a question on our forums"
          as="a"
          href="https://community.apollographql.com/"
          variant="link"
          size="lg"
          _dark={{
            color: 'gray.200'
          }}
          leftIcon={<FiMessageCircle />}
        >
          Forums
        </Button>
        <Button
          aria-label="Join our Discord server"
          as="a"
          href="https://discord.gg/yFZJH2QYrK"
          variant="link"
          size="lg"
          _dark={{
            color: 'gray.200'
          }}
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
