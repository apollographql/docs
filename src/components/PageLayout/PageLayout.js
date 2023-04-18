import AuthCheck from '../AuthCheck';
import Footer from '../Footer';
import Header from '../Header';
import MobileNav from '../MobileNav';
import PropTypes from 'prop-types';
import React from 'react';
import Sidebar, {
  DefaultSidebarNav,
  PAGE_SIDEBAR_MARGIN,
  SidebarNav
} from '../Sidebar';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {Box, Fade, IconButton, Tooltip} from '@chakra-ui/react';
import {FiChevronsRight} from 'react-icons/fi';
import {PageWidthProvider} from '../PageWidthContext';
import {PathContext} from '../../utils';
import {dirname} from 'path';
import {navigate} from 'gatsby';
import {useConfig} from '../../utils/config';

export const PAGE_PADDING_TOP = 40;
export const PAGE_PADDING_BOTTOM = 48;
export const PAGE_FOOTER_HEIGHT = 56;

export function PageLayout({pageContext, children, location, data}) {
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

  const hideSidebar = () => setSidebarHidden(true);

  const {pathname} = location;
  const {basePath = '/'} = pageContext;

  const {docset, versions, currentVersion, navItems, algoliaFilters, internal} =
    useConfig(basePath);

  const sidebarNav = (
    <SidebarNav
      versions={versions}
      currentVersion={currentVersion}
      docset={docset}
      navItems={navItems}
      hideSidebar={hideSidebar}
      onVersionChange={version => {
        navigate(`/${version.slug}`);
      }}
    />
  );

  return (
    <PageWidthProvider>
      <PathContext.Provider
        value={{
          uri: pathname,
          basePath,
          path: data?.file?.name === 'index' ? pathname : dirname(pathname)
        }}
      >
        <Header algoliaFilters={algoliaFilters}>
          <MobileNav isInternal={internal} />
        </Header>
        <Sidebar isHidden={sidebarHidden} hideSidebar={hideSidebar}>
          {internal ? (
            <AuthCheck
              fallback={<DefaultSidebarNav hideSidebar={hideSidebar} />}
            >
              {sidebarNav}
            </AuthCheck>
          ) : (
            sidebarNav
          )}
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
        <Fade in={sidebarHidden} unmountOnExit delay={0.25}>
          <Tooltip placement="right" label="Show sidebar">
            <IconButton
              d={{base: 'none', md: 'flex'}}
              pos="fixed"
              mb="2"
              css={{bottom: PAGE_FOOTER_HEIGHT}}
              left="2"
              size="sm"
              variant="outline"
              fontSize="md"
              icon={<FiChevronsRight />}
              onClick={() => setSidebarHidden(false)}
            />
          </Tooltip>
        </Fade>
      </PathContext.Provider>
    </PageWidthProvider>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
