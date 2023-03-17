import PropTypes from 'prop-types';
import React, {useCallback, useContext, useEffect, useRef} from 'react';
import SidebarNav from './SidebarNav';
import {AiOutlineHome} from '@react-icons/all-files/ai/AiOutlineHome';
import {
  Box,
  Button,
  DarkMode,
  Flex,
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
import {FiExternalLink} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {IoSchoolOutline} from 'react-icons/io5';
import {PathContext} from '../../utils';
import {TOTAL_HEADER_HEIGHT} from '../Header';
import {useLocalStorage} from 'react-use';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 93;

export const PAGE_SIDEBAR_MARGIN = SIDEBAR_WIDTH + COLLAPSED_SIDEBAR_WIDTH;

export const SIDEBAR_WIDTH_BASE = 450;
export const SIDEBAR_WIDTH_XL = 500;

export function Sidebar({children, configs, isHidden}) {
  const outerSidebarRef = useRef();
  const sidebarRef = useRef();
  const sidebarNavRef = useRef();

  const pathContext = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useLocalStorage('docs:active', null);
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('docs:sidebar', false);

  const dismissSidebar = useCallback(() => {
    if (sidebarOpen) {
      setActiveDocset(null);
      setSidebarOpen(false);
    }
  }, [sidebarOpen, setActiveDocset, setSidebarOpen]);

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

  const leftNavBgColor = useColorModeValue('gray.800', 'gray.900');

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
      <Box
        w={SIDEBAR_WIDTH}
        color="white"
        fontWeight="semibold"
        bgColor={leftNavBgColor}
        flexShrink="0"
        overflow="auto"
        overscrollBehavior="none"
        onMouseOver={event => {
          setSidebarOpen(true);

          if (event.target === event.currentTarget) {
            setActiveDocset(null);
          }
        }}
      >
        <DocsetContext.Provider
          value={{
            configs,
            activeDocset,
            setActiveDocset,
            sidebarOpen,
            setSidebarOpen,
            onKeyboardSelect: () => {
              setSidebarOpen(false);
              sidebarNavRef.current?.focusFirstLink();
            }
          }}
        >
          <Stack
            p="4"
            spacing="4"
            divider={
              <StackDivider
                css={{width: !sidebarOpen && COLLAPSED_SIDEBAR_WIDTH - 32}}
                borderColor="whiteAlpha.300"
              />
            }
          >
            <SidebarCategory title="Start">
              <SidebarCategoryLink docset="/" icon={<AiOutlineHome />} />
              <Flex
                as="a"
                w="full"
                align="center"
                href="https://www.apollographql.com/tutorials"
                target="_blank"
                onMouseOver={() => setActiveDocset(null)}
                _hover={{bg: 'whiteAlpha.300'}}
                px="4"
                rounded="md"
              >
                <Box as={IoSchoolOutline} fontSize="2xl" />
                <chakra.span
                  ml="3"
                  mr="2"
                  py="2"
                  opacity={sidebarOpen ? 1 : 0}
                  transitionProperty="opacity"
                  transitionDuration="normal"
                  transitionTimingFunction="ease-in-out"
                >
                  Tutorials
                </chakra.span>
                <FiExternalLink />
              </Flex>
            </SidebarCategory>
            <SidebarCategory title="SDKs">
              <SidebarCategoryLink
                docset="apollo-server"
                icon={DOCSET_ICONS['apollo-server']}
              />
              <SidebarCategoryLink
                docset="react"
                icon={DOCSET_ICONS['apollo-client']}
              />
              <SidebarCategoryLink
                docset="kotlin"
                icon={DOCSET_ICONS['apollo-kotlin']}
              />
              <SidebarCategoryLink
                docset="ios"
                icon={DOCSET_ICONS['apollo-ios']}
              />
            </SidebarCategory>
            <SidebarCategory
              title={
                <>
                  GraphOS{' '}
                  <chakra.span ml="auto">
                    <DarkMode>
                      <Button
                        as={GatsbyLink}
                        to="/graphos/quickstart/cloud"
                        fontFamily="body"
                        size="xs"
                        leftIcon={<span>🚀</span>}
                        colorScheme="yellow"
                        variant="outline"
                        onClick={dismissSidebar}
                      >
                        Get started
                      </Button>
                    </DarkMode>
                  </chakra.span>
                </>
              }
            >
              <SidebarCategoryLink docset="graphos" icon={DOCSET_ICONS.graphos}>
                <span>Building Graphs</span>
              </SidebarCategoryLink>
              <SidebarCategoryLink
                docset="graphos/delivery"
                icon={DOCSET_ICONS.delivery}
              />
              <SidebarCategoryLink
                docset="graphos/metrics"
                icon={DOCSET_ICONS.metrics}
              />
              <SidebarCategoryLink
                docset="graphos/security"
                icon={DOCSET_ICONS.security}
              />
              <SidebarCategoryLink
                docset="federation"
                icon={DOCSET_ICONS.federation}
              />
              <SidebarCategoryLink
                docset="graphos/org"
                icon={DOCSET_ICONS.org}
              />
              <SidebarCategoryLink docset="rover" icon={DOCSET_ICONS.rover} />
              <SidebarCategoryLink docset="router" icon={DOCSET_ICONS.router} />
              <SidebarCategoryLink
                docset="technotes"
                icon={DOCSET_ICONS.technotes}
              />
            </SidebarCategory>
          </Stack>
        </DocsetContext.Provider>
      </Box>
      <Box
        ref={sidebarRef}
        id="sidebar"
        w={SIDEBAR_WIDTH}
        flexShrink="0"
        borderRightWidth={1}
        bg="bg"
        transform={
          sidebarOpen
            ? 'none'
            : `translateX(-${SIDEBAR_WIDTH - COLLAPSED_SIDEBAR_WIDTH}px)`
        }
        shadow={sidebarOpen ? 'xl' : 'none'}
        transitionProperty="transform"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
        overflow="auto"
        overscrollBehavior="none"
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
              onVersionChange={version => {
                setActiveDocset(version.slug);
              }}
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
