import DocsetMenu from './DocsetMenu';
import Footer from './Footer';
import Header, {TOTAL_HEADER_HEIGHT} from './Header';
import MobileNav from './MobileNav';
import PropTypes from 'prop-types';
import React, {Fragment, useCallback, useContext} from 'react';
import Sidebar, {
  SIDEBAR_WIDTH_BASE,
  SIDEBAR_WIDTH_XL,
  SidebarNav
} from './Sidebar';
import getShareImage from '@jlengstorf/get-share-image';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Divider,
  Fade,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  useToken
} from '@chakra-ui/react';
import {FiChevronsRight} from 'react-icons/fi';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PathContext} from '../utils';
import {graphql, useStaticQuery} from 'gatsby';

export function usePageLayoutProps(props) {
  const paddingTop = useToken('space', 10);
  const paddingBottom = useToken('space', 12);
  return {
    ...props,
    paddingTop,
    paddingBottom
  };
}

export default function Page({
  pageContext,
  title,
  description,
  children,
  banner,
  subtitle,
  pagination,
  aside,
  paddingTop,
  paddingBottom,
  contentProps
}) {
  const {uri} = useContext(PathContext);
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

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

  const {docset, versions, currentVersion, navItems, algoliaFilters} =
    pageContext;
  const titleFont = encodeURIComponent('Source Sans Pro');

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
      <Header algoliaFilters={algoliaFilters}>
        <MobileNav>
          <SidebarNav navItems={navItems} darkBg="gray.700">
            <Box px="3" pt="1" pb="3">
              {renderSwitcher({size: 'sm'})}
            </Box>
          </SidebarNav>
        </MobileNav>
        {renderSwitcher({d: {base: 'none', md: 'flex'}})}
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
      <Sidebar isHidden={sidebarHidden}>
        <SidebarNav navItems={navItems} onHide={() => setSidebarHidden(true)} />
      </Sidebar>
      <Box
        marginLeft={{
          base: 0,
          md: sidebarHidden ? 0 : SIDEBAR_WIDTH_BASE,
          xl: sidebarHidden ? 0 : SIDEBAR_WIDTH_XL
        }}
        transitionProperty="margin-left"
        transitionDuration="normal"
      >
        {banner}
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
            {subtitle}
            <Divider my="8" />
            <Box fontSize={{md: 'lg'}} lineHeight={{md: 1.7}} {...contentProps}>
              {children}
            </Box>
            {pagination}
          </Box>
          {aside}
        </Flex>
        <Footer />
      </Box>
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired,
  paddingTop: PropTypes.string.isRequired,
  paddingBottom: PropTypes.string.isRequired,
  banner: PropTypes.element,
  pagination: PropTypes.element,
  aside: PropTypes.element,
  subtitle: PropTypes.node,
  description: PropTypes.string,
  contentProps: PropTypes.object
};
