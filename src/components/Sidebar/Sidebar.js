import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, List, ListItem, chakra} from '@chakra-ui/react';
import {PathContext} from '../../utils';
import {SidebarNav} from './SidebarNav';
import {TOTAL_HEADER_HEIGHT} from '../Header';

export const SIDEBAR_WIDTH_BASE = 450;
export const SIDEBAR_WIDTH_XL = 500;

export function Sidebar({children, configs, isHidden}) {
  const sidebarRef = useRef();

  const pathContext = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(null);

  useEffect(() => {
    // scroll the active nav group into view if one exists
    const group = sidebarRef.current.querySelector('[data-group="true"]');
    if (group) {
      group.scrollIntoView();
    }
  }, []);

  return (
    <chakra.aside
      ref={sidebarRef}
      d={{base: 'none', md: 'grid'}}
      gridTemplateColumns="repeat(2, 1fr)"
      h={
        // account for header border
        `calc(100vh - ${TOTAL_HEADER_HEIGHT}px)`
      }
      w={{
        base: SIDEBAR_WIDTH_BASE,
        xl: SIDEBAR_WIDTH_XL
      }}
      borderRightWidth="1px"
      pos="fixed"
      left="0"
      zIndex="1"
      transitionProperty="visibility, opacity, transform"
      transitionDuration="normal"
      bg="bg"
      sx={{scrollPaddingTop: 12}}
      css={{top: TOTAL_HEADER_HEIGHT}}
      style={{
        visibility: isHidden ? 'hidden' : 'visible',
        opacity: isHidden ? 0 : 1,
        transform: isHidden ? 'translateX(-100%)' : 'none'
      }}
      onMouseLeave={() => setActiveDocset(null)}
    >
      <Box overflow="auto" borderRightWidth={1}>
        <List>
          {Object.entries(configs)
            .filter(
              ([path, config]) =>
                (path === '/' || !path.includes('/')) && !config.internal
            )
            .map(([path, config]) => {
              return (
                <ListItem
                  py="2"
                  px="4"
                  onMouseEnter={() => setActiveDocset(path)}
                  key={path}
                  fontSize="sm"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  bg={
                    pathContext.basePath === path
                      ? 'purple.500'
                      : activeDocset === path
                      ? 'gray.100'
                      : 'inherit'
                  }
                  tabIndex="0"
                  onFocus={() => setActiveDocset(path)}
                >
                  {config.docset}
                </ListItem>
              );
            })}
        </List>
      </Box>
      <Box overflow="auto">
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
