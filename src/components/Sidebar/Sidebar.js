import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, List, ListItem, chakra, useColorModeValue} from '@chakra-ui/react';
import {PathContext} from '../../utils';
import {SidebarNav} from './SidebarNav';
import {TOTAL_HEADER_HEIGHT} from '../Header';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 93;

export const PAGE_SIDEBAR_MARGIN = SIDEBAR_WIDTH + COLLAPSED_SIDEBAR_WIDTH;

export const SIDEBAR_WIDTH_BASE = 450;
export const SIDEBAR_WIDTH_XL = 500;

export function Sidebar({children, configs, isHidden}) {
  const sidebarRef = useRef();

  const pathContext = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState('react');

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // scroll the active nav group into view if one exists
    const group = sidebarRef.current.querySelector('[data-group="true"]');
    if (group) {
      group.scrollIntoView();
    }
  }, []);

  const leftNavBgColor = useColorModeValue('gray.800', 'gray.900');

  return (
    <chakra.aside
      ref={sidebarRef}
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
      sx={{scrollPaddingTop: 12}}
      css={{top: TOTAL_HEADER_HEIGHT}}
      style={{
        visibility: isHidden ? 'hidden' : 'visible',
        opacity: isHidden ? 0 : 1,
        transform: isHidden ? 'translateX(-100%)' : 'none'
      }}
      onMouseLeave={() => {
        setActiveDocset(null);
        setSidebarOpen(false);
      }}
    >
      <Box
        w={SIDEBAR_WIDTH}
        color="white"
        bgColor={leftNavBgColor}
        flexShrink="0"
        overflow="auto"
        onMouseOver={event => {
          setSidebarOpen(true);

          if (event.target === event.currentTarget) {
            setActiveDocset(null);
          }
        }}
      >
        <List p="4">
          {Object.entries(configs)
            .filter(
              ([path, config]) =>
                (path === '/' || !path.includes('/')) && !config.internal
            )
            .map(([path, config]) => {
              const isActiveMenu = activeDocset === path;
              const isActivePath = pathContext.basePath === path;
              return (
                <ListItem
                  py="2"
                  px="4"
                  onFocus={() => setActiveDocset(path)}
                  onMouseEnter={() => setActiveDocset(path)}
                  key={path}
                  fontSize="sm"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  position="relative"
                  _after={{
                    content: '""',
                    display: isActivePath ? 'block' : 'none',
                    width: '4',
                    bg: 'purple.500',
                    position: 'absolute',
                    left: '100%',
                    top: 0,
                    bottom: 0
                  }}
                  borderRadius="md"
                  borderRightRadius={isActivePath ? 0 : undefined}
                  bg={
                    isActivePath
                      ? 'purple.500'
                      : isActiveMenu
                      ? 'whiteAlpha.300'
                      : 'inherit'
                  }
                  tabIndex="0"
                >
                  {config.docset}
                </ListItem>
              );
            })}
        </List>
      </Box>
      <Box
        w={SIDEBAR_WIDTH}
        flexShrink="0"
        borderRightWidth={1}
        bg="bg"
        transform={
          sidebarOpen
            ? 'none'
            : `translateX(-${SIDEBAR_WIDTH - COLLAPSED_SIDEBAR_WIDTH}px)`
        }
        transition="transform ease-in-out 100ms"
        overflow="auto"
      >
        {activeDocset ? (
          <PathContext.Provider
            value={{
              ...pathContext,
              basePath: `/${activeDocset}`
            }}
          >
            <SidebarNav
              docset={configs[activeDocset].docset}
              navItems={configs[activeDocset].navItems}
            />
          </PathContext.Provider>
        ) : (
          children
        )}
      </Box>
    </chakra.aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  isHidden: PropTypes.bool,
  configs: PropTypes.object.isRequired
};
