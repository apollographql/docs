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
import React, {Fragment, createElement, useMemo, useState} from 'react';
import RelativeLink, {ButtonLink, PrimaryLink} from './RelativeLink';
import RuleExpansionPanel from './RuleExpansionPanel';
import TableOfContents from './TableOfContents';
import TrackableButton from './TrackableButton';
import TrackableLink from './TrackableLink';
import TypeScriptApiBox from './TypeScriptApiBox';
import VersionBanner from './VersionBanner';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeReact from 'rehype-react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {ReactComponent as ApolloLogo} from '@apollo/icons/logos/LogoType.svg';
import {ReactComponent as ApolloMark} from '@apollo/icons/logos/LogoSymbol.svg';
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  ListItem,
  OrderedList,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  chakra
} from '@chakra-ui/react';
import {Caution} from './Caution';
import {CustomHeading, MinVersionTag} from './CustomHeading';
import {
  DiscordIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  GitHubIcon,
  QuoteIcon
} from './Icons';
import {
  EmbeddableExplorer,
  MarkdownCodeBlock,
  MultiCodeBlock,
  MultiCodeBlockContext
} from '@apollo/chakra-helpers';
import {EnterpriseFeature} from './EnterpriseFeature';
import {ErrorCode} from './ErrorCode';
import {ExperimentalFeature} from './ExperimentalFeature';
import {Link as GatsbyLink} from 'gatsby';
import {Global} from '@emotion/react';
import {HighlightKeyTerms} from '@apollo/pedia';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {MinVersion} from './MinVersion';
import {Note} from './Note';
import {
  PAGE_FOOTER_HEIGHT,
  PAGE_PADDING_BOTTOM,
  PAGE_PADDING_TOP,
  PageContent,
  PageSeo
} from './PageLayout';
import {PremiumFeature} from './PremiumFeature';
import {PreviewFeature} from './PreviewFeature';
import {Property} from './Property';
import {PropertyList} from './PropertyList';
import {RouterErrorCodes} from './RouterErrorCodes';
import {TOTAL_HEADER_HEIGHT} from './Header';
import {Tab} from './Tab';
import {Tabs} from './Tabs';
import {Tip} from './Tip';
import {WistiaEmbed} from './WistiaEmbed';
import {YouTube} from './YouTube';
import {join} from 'path';
import {kebabCase} from 'lodash';
import {rehype} from 'rehype';
import {useApiDocContext} from './ApiDoc';
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
import {ResponsiveGridStyles} from './ApiDoc/ResponsiveGrid';

// use JS syntax highlighting for rhai codeblocks
Prism.languages.rhai = Prism.languages.javascript;

const LIST_SPACING = 4;
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const SCROLL_TARGETS = HEADINGS.concat('p');

const SCROLL_MARGIN_TOP = PAGE_PADDING_TOP + TOTAL_HEADER_HEIGHT;

const NESTED_LIST_STYLES = {
  [['ul', 'ol']]: {
    mt: 3,
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
      borderRadius={props.unround ? 0 : 4}
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
  Caution,
  ExpansionPanel,
  ExpansionPanelList,
  ExpansionPanelListItem,
  MultiCodeBlock,
  Note,
  YouTube,
  Property,
  PropertyList,
  ErrorCode,
  Tab,
  Tabs,
  WistiaEmbed,
  CodeColumns,
  TypeScriptApiBox,
  TypescriptApiBox: TypeScriptApiBox,
  EmbeddableExplorer,
  RuleExpansionPanel,
  ButtonLink,
  Tip,
  MinVersion,
  MinVersionTag,
  EnterpriseFeature,
  ExperimentalFeature,
  PremiumFeature,
  PreviewFeature,
  ApolloLogo,
  ApolloMark,
  TrackableButton,
  TrackableLink,
  useApiDocContext,
  PrimaryLink,
  MDXRenderer,
  RouterErrorCodes
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
  const [isTocHidden, setIsTocHidden] = useState(false);

  const toggleTocHidden = () => {
    setIsTocHidden(isTocHidden => !isTocHidden);
  };

  const {childMdx, childMarkdownRemark, basePath, gitRemote, relativePath} =
    file;

  const {frontmatter, headings} = childMdx || childMarkdownRemark;
  const {
    title,
    subtitle,
    description,
    toc,
    tags,
    headingDepth,
    minVersion,
    noIndex
  } = frontmatter;

  const publishedSubtitle = subtitle ? subtitle : description;

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
        leftIcon={<GitHubIcon />}
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
      <ResponsiveGridStyles />
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
              color: 'tertiary',
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
          [SCROLL_TARGETS]: {
            scrollMarginTop: SCROLL_MARGIN_TOP
          }
        }}
        minVersion={minVersion}
        title={title}
        subtitle={
          <>
            {publishedSubtitle && (
              <chakra.h2
                fontSize={{base: 'xl', md: '2xl'}}
                lineHeight="normal"
                mt={{base: 2, md: 3}}
                fontWeight="normal"
              >
                {publishedSubtitle}
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
            !isTocHidden ? (
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
                  On this page
                  <Tooltip label="Hide sidebar">
                    <IconButton
                      aria-label="Hide sidebar"
                      fontSize="md"
                      variant="ghost"
                      onClick={toggleTocHidden}
                      icon={
                        <>
                          <Icon
                            as={DoubleChevronRightIcon}
                            display="none"
                            _dark={{
                              display: 'block'
                            }}
                          />
                        </>
                      }
                    />
                  </Tooltip>
                </Heading>

                <TableOfContents
                  headings={headings}
                  // jc: passing undefined here as headingDepth returns null if it doesn't exist in the frontmatter
                  // and we need undefined in order to make use of default props
                  headingDepth={headingDepth ?? undefined}
                />
              </chakra.aside>
            ) : (
              <chakra.aside
                d={{base: 'none', xl: 'flex'}}
                flexDirection="column"
                ml={{base: 10, xl: 16}}
                w={'1em'}
                flexShrink="0"
                pos="sticky"
                css={{top: SCROLL_MARGIN_TOP}}
                maxH={`calc(100vh - ${SCROLL_MARGIN_TOP}px - ${PAGE_PADDING_BOTTOM}px - ${PAGE_FOOTER_HEIGHT}px)`}
              >
                <Tooltip label="Show sidebar" placement="left">
                  <IconButton
                    aria-label="Show sidebar"
                    fontSize="md"
                    variant="outline"
                    onClick={toggleTocHidden}
                    icon={
                      <>
                        <Icon
                          as={DoubleChevronLeftIcon}
                          display="none"
                          _dark={{
                            display: 'block'
                          }}
                        />
                      </>
                    }
                  />
                </Tooltip>
              </chakra.aside>
            )
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
          leftIcon={<QuoteIcon />}
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
          leftIcon={<DiscordIcon />}
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
