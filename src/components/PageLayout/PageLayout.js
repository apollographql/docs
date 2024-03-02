import AuthCheck from '../AuthCheck';
import Footer from '../Footer';
import Header from '../Header';
import MobileNav from '../MobileNav';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import Sidebar, {
  DefaultSidebarNav,
  PAGE_SIDEBAR_MARGIN,
  SidebarNav
} from '../Sidebar';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {Box, Fade, IconButton, Tooltip} from '@chakra-ui/react';
import {DoubleChevronRightIcon} from '../Icons';
import {PageTocProvider} from '../PageTocContext';
import {PageWidthProvider} from '../PageWidthContext';
import {PathContext} from '../../utils';
import {dirname} from 'path';
import {navigate} from 'gatsby';
import {signupTracer} from '@apollo/signup-tracer';
import {useConfig} from '../../utils/config';
import {utmGrabber} from '@apollo/utm-grabber';

export const PAGE_PADDING_TOP = 40;
export const PAGE_PADDING_BOTTOM = 48;
export const PAGE_FOOTER_HEIGHT = 56;

export function PageLayout({pageContext, children, location, data}) {
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');
  const [sidebarLocked, setSidebarLocked] = useLocalStorage(
    'sidebar:locked',
    false
  );

  const lockProps = {
    isLocked: sidebarLocked,
    onLockToggle: () => setSidebarLocked(!sidebarLocked)
  };

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
      {...lockProps}
    />
  );

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());
    utmGrabber();
    signupTracer('docs');
  }, []);

  return (
    <PageWidthProvider key={now}>
      <PageTocProvider>
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
          <Sidebar
            isHidden={sidebarHidden}
            hideSidebar={hideSidebar}
            {...lockProps}
          >
            {internal ? (
              <AuthCheck
                fallback={
                  <DefaultSidebarNav hideSidebar={hideSidebar} {...lockProps} />
                }
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
            <Tooltip placement="right" label="Show navigation">
              <IconButton
                d={{base: 'none', md: 'flex'}}
                pos="fixed"
                css={{bottom: PAGE_FOOTER_HEIGHT / 2}}
                transform="translateY(50%)"
                left="3"
                size="sm"
                variant="outline"
                fontSize="lg"
                icon={<DoubleChevronRightIcon />}
                onClick={() => setSidebarHidden(false)}
              />
            </Tooltip>
          </Fade>
        </PathContext.Provider>
      </PageTocProvider>
    </PageWidthProvider>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
