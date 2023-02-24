import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {AiOutlineHome} from '@react-icons/all-files/ai/AiOutlineHome';
import {
  Box,
  Stack,
  StackDivider,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';
import {DOCSET_ICONS} from '../DocsetMenu';
import {
  DocsetContext,
  SidebarCategory,
  SidebarCategoryLink
} from './SidebarCategory';
import {PathContext} from '../../utils';
import {SidebarNav} from './SidebarNav';
import {TOTAL_HEADER_HEIGHT} from '../Header';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 88;

export const PAGE_SIDEBAR_MARGIN = SIDEBAR_WIDTH + COLLAPSED_SIDEBAR_WIDTH;

export const SIDEBAR_WIDTH_BASE = 450;
export const SIDEBAR_WIDTH_XL = 500;

export function Sidebar({children, configs, isHidden}) {
  const sidebarRef = useRef();

  const pathContext = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        fontWeight="semibold"
        bgColor={leftNavBgColor}
        flexShrink="0"
        overflow="auto"
        onMouseOver={event => {
          setSidebarOpen(true);

          if (event.target === event.currentTarget) {
            // TODO: this doesn't work when the mouse is over the scrollbar
            setActiveDocset(null);
          }
        }}
      >
        <DocsetContext.Provider
          value={{
            activeDocset,
            setActiveDocset,
            sidebarOpen
          }}
        >
          <Stack
            p="4"
            spacing="4"
            divider={
              <StackDivider
                css={{width: !sidebarOpen && 56}}
                borderColor="whiteAlpha.300"
              />
            }
          >
            <SidebarCategory title="Start">
              <SidebarCategoryLink docset="/" icon={<AiOutlineHome />}>
                Home
              </SidebarCategoryLink>
            </SidebarCategory>
            <SidebarCategory title="GraphOS">
              <SidebarCategoryLink docset="graphos" icon={DOCSET_ICONS.graphos}>
                Building Graphs
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="federation"
                icon={DOCSET_ICONS.federation}
              >
                Federation
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="technotes"
                icon={DOCSET_ICONS.technotes}
              >
                Tech Notes
              </SidebarCategoryLink>
            </SidebarCategory>
            <SidebarCategory title="Tools &amp; Libraries">
              <SidebarCategoryLink docset="rover" icon={DOCSET_ICONS.rover}>
                Rover CLI
              </SidebarCategoryLink>
              <SidebarCategoryLink docset="router" icon={DOCSET_ICONS.router}>
                Apollo Router
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="apollo-server"
                icon={DOCSET_ICONS['apollo-server']}
              >
                Apollo Server
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="react"
                icon={DOCSET_ICONS['apollo-client']}
              >
                Client (React / JS)
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="kotlin"
                icon={DOCSET_ICONS['apollo-kotlin']}
              >
                Client (Kotlin)
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="ios"
                icon={DOCSET_ICONS['apollo-ios']}
              >
                Client (iOS)
              </SidebarCategoryLink>
            </SidebarCategory>
          </Stack>
        </DocsetContext.Provider>
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
        transitionProperty="transform"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
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
              key={activeDocset}
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
