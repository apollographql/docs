import Footer from './Footer';
import Header, {TOTAL_HEADER_HEIGHT} from './Header';
import MobileNav from './MobileNav';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import Sidebar, {PAGE_SIDEBAR_MARGIN, SidebarNav} from './Sidebar';
import getShareImage from '@jlengstorf/get-share-image';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Divider,
  Fade,
  Flex,
  Heading,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {DOCS_PAGE_WIDTH_VAR, usePageWidthContext} from './PageWidthContext';
import {FiChevronsRight} from 'react-icons/fi';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PathContext} from '../utils';
import {dirname} from 'path';
import {graphql, navigate, useStaticQuery} from 'gatsby';

export const PAGE_PADDING_TOP = 40;
export const PAGE_PADDING_BOTTOM = 48;

export function PageSeo({docset, title, description}) {
  const {uri} = useContext(PathContext);

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

  const titleFont = encodeURIComponent('Source Sans Pro');

  return (
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
  );
}

PageSeo.propTypes = {
  title: PropTypes.string.isRequired,
  docset: PropTypes.string.isRequired,
  description: PropTypes.string
};

export function PageContent({
  title,
  subtitle,
  children,
  pagination,
  aside,
  ...props
}) {
  const {pageRefCallback} = usePageWidthContext();
  return (
    <Flex
      ref={pageRefCallback}
      maxW={`var(${DOCS_PAGE_WIDTH_VAR})`}
      mx="auto"
      align="flex-start"
      px={{base: 6, md: 10}}
      as="main"
      css={{
        paddingTop: PAGE_PADDING_TOP,
        paddingBottom: PAGE_PADDING_BOTTOM
      }}
    >
      <Box flexGrow="1" w="0">
        <Heading as="h1" size="2xl">
          {title}
        </Heading>
        {subtitle}
        <Divider my="8" />
        <Box fontSize={{md: 'lg'}} lineHeight={{md: 1.7}} {...props}>
          {children}
        </Box>
        {pagination}
      </Box>
      {aside}
    </Flex>
  );
}

PageContent.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  pagination: PropTypes.element,
  aside: PropTypes.element
};

export default function PageLayout({pageContext, children, location}) {
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

  const {
    basePath,
    fileName,
    docset,
    versions,
    currentVersion,
    navItems,
    algoliaFilters,
    configs
  } = pageContext;

  const {pathname} = location;

  return (
    <PathContext.Provider
      value={{
        uri: pathname,
        basePath,
        path: fileName === 'index' ? pathname : dirname(pathname)
      }}
    >
      <Header algoliaFilters={algoliaFilters}>
        <MobileNav configs={configs} defaultDocset={docset} />
      </Header>
      <Fade in={sidebarHidden} unmountOnExit delay={0.25}>
        <Tooltip placement="right" label="Show sidebar">
          <IconButton
            d={{base: 'none', md: 'flex'}}
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
      <Sidebar configs={configs} isHidden={sidebarHidden}>
        <SidebarNav
          versions={versions}
          currentVersion={currentVersion}
          docset={docset}
          navItems={navItems}
          onVersionChange={version => {
            navigate(`/${version.slug}`);
          }}
        />
      </Sidebar>
      <Box
        marginLeft={{
          base: 0,
          md: sidebarHidden ? 0 : PAGE_SIDEBAR_MARGIN
        }}
        transitionProperty="margin-left"
        transitionDuration="normal"
      >
        {children}
        <Footer />
      </Box>
    </PathContext.Provider>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
