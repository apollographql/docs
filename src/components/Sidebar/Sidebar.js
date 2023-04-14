import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import SidebarNav from './SidebarNav';
import {Box, chakra} from '@chakra-ui/react';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  LeftSidebarNav,
  SIDEBAR_WIDTH
} from './LeftSidebarNav';
import {DocsetContext} from './SidebarCategory';
import {PathContext} from '../../utils';
import {TOTAL_HEADER_HEIGHT} from '../Header';
import {useConfigs} from '../../utils/config';
import {useKey} from 'react-use';

export const PAGE_SIDEBAR_MARGIN = SIDEBAR_WIDTH + COLLAPSED_SIDEBAR_WIDTH;

export function Sidebar({children, isHidden, hideSidebar}) {
  const outerSidebarRef = useRef();
  const sidebarRef = useRef();
  const sidebarNavRef = useRef();

  const configs = useConfigs();

  const pathContext = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathContext.uri]);

  const dismissSidebar = useCallback(() => {
    if (sidebarOpen) {
      setActiveDocset(null);
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  useKey('Escape', dismissSidebar, undefined, [dismissSidebar]);

  useEffect(() => {
    // scroll the active nav group into view if one exists
    if (!window.isInitiallyLoaded) {
      const group = sidebarRef.current.querySelector('[data-group="true"]');
      if (group) {
        group.scrollIntoView();
      }

      window.isInitiallyLoaded = true;
    } else {
      sidebarRef.current.scrollTop = window.sidebarScroll;
    }
  }, []);

  useEffect(() => {
    const handleWindowClick = event => {
      if (!outerSidebarRef.current?.contains(event.target)) {
        dismissSidebar();
      }
    };

    window.addEventListener('click', handleWindowClick);
    window.addEventListener('scroll', dismissSidebar);

    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('scroll', dismissSidebar);
    };
  }, [dismissSidebar]);

  return (
    <chakra.aside
      ref={outerSidebarRef}
      d={{
        base: 'none',
        md: 'flex'
      }}
      w={PAGE_SIDEBAR_MARGIN}
      h={
        // account for header border
        `calc(100vh - ${TOTAL_HEADER_HEIGHT}px)`
      }
      pos="fixed"
      left="0"
      zIndex="1"
      transitionProperty="visibility, opacity, transform"
      transitionDuration="normal"
      css={{top: TOTAL_HEADER_HEIGHT}}
      style={{
        visibility: isHidden ? 'hidden' : 'visible',
        opacity: isHidden ? 0 : 1,
        transform: isHidden ? 'translateX(-100%)' : 'none'
      }}
    >
      <DocsetContext.Provider
        value={{
          configs,
          activeDocset,
          setActiveDocset,
          sidebarOpen,
          setSidebarOpen,
          dismissSidebar,
          onKeyboardSelect: () => {
            setSidebarOpen(false);
            sidebarNavRef.current?.focusFirstLink();
          }
        }}
      >
        <LeftSidebarNav
          w={SIDEBAR_WIDTH}
          onMouseOver={() => setSidebarOpen(true)}
        />
        <Box
          ref={sidebarRef}
          id="sidebar"
          w={SIDEBAR_WIDTH}
          flexShrink="0"
          borderRightWidth={1}
          bg="bg"
          transform={
            sidebarOpen
              ? 'translateX(0)'
              : `translateX(-${SIDEBAR_WIDTH - COLLAPSED_SIDEBAR_WIDTH}px)`
          }
          shadow={sidebarOpen ? 'xl' : 'none'}
          transitionProperty="transform"
          transitionDuration="normal"
          transitionTimingFunction="ease-in-out"
        >
          {activeDocset ? (
            <PathContext.Provider
              value={{
                ...pathContext,
                basePath: `/${activeDocset}`
              }}
            >
              <SidebarNav
                key={activeDocset}
                ref={sidebarNavRef}
                currentVersion={configs[activeDocset].currentVersion}
                versions={configs[activeDocset].versions}
                docset={configs[activeDocset].docset}
                navItems={configs[activeDocset].navItems}
                hideSidebar={hideSidebar}
                onVersionChange={version => {
                  setActiveDocset(version.slug);
                }}
              />
            </PathContext.Provider>
          ) : (
            children
          )}
        </Box>
      </DocsetContext.Provider>
    </chakra.aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  isHidden: PropTypes.bool,
  hideSidebar: PropTypes.func
};
