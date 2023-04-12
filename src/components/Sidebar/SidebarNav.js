import NavItems, {GA_EVENT_CATEGORY_SIDEBAR, NavContext} from './NavItems';
import PropTypes from 'prop-types';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {BsChevronContract, BsChevronExpand} from 'react-icons/bs';
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tooltip,
  chakra
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronLeft, FiChevronsLeft} from 'react-icons/fi';
import {flattenNavItems} from '../../utils';

const SidebarButton = props => (
  <IconButton size="xs" fontSize="md" isRound {...props} />
);

const SidebarNav = forwardRef(
  (
    {
      docset,
      navItems,
      versions,
      currentVersion,
      onVersionChange,
      onGoBack,
      hideSidebar
    },
    ref
  ) => {
    const navRef = useRef();

    useImperativeHandle(ref, () => ({
      focusFirstLink: () => {
        navRef.current.querySelector('a')?.focus();
      }
    }));

    const navGroups = useMemo(
      () => flattenNavItems(navItems).filter(item => item.children),
      [navItems]
    );

    // set all nav items to open by default
    const initialNavState = useMemo(
      () =>
        navGroups.reduce(
          (acc, group) => ({
            ...acc,
            [group.id]: true
          }),
          {}
        ),
      [navGroups]
    );

    // save nav state in storage
    const [localNavState, setLocalNavState] = useLocalStorage('nav');

    // combine initial and local nav states
    const nav = useMemo(
      () => ({
        ...initialNavState,
        ...localNavState
      }),
      [localNavState, initialNavState]
    );

    // compute expand/collapse all state from nav state
    const isAllExpanded = useMemo(
      () =>
        // get an array of the state of all nav items that also exist in the list of
        // valid nav group ids (above)
        navGroups.every(group => nav[group.id]),
      [navGroups, nav]
    );

    return (
      <Flex
        direction="column"
        h="full"
        overflow="auto"
        overscrollBehavior="none"
      >
        <Flex align="center" p="4" pos="sticky" top="0" zIndex="1" bg="bg">
          {onGoBack && (
            <IconButton
              ml="-2.5"
              mr="1"
              variant="ghost"
              size="sm"
              fontSize="xl"
              icon={<FiChevronLeft />}
              onClick={onGoBack}
            />
          )}
          <chakra.h2
            mr="auto"
            fontSize="xl"
            fontWeight="semibold"
            lineHeight={1.6}
          >
            {docset}
          </chakra.h2>
          {versions?.length > 1 && (
            <Menu>
              <MenuButton
                alignSelf="flex-start"
                size="sm"
                ml="2"
                variant="outline"
                rightIcon={<FiChevronDown />}
                as={Button}
              >
                {currentVersion}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup value={currentVersion}>
                  {versions.map((version, index) => (
                    <MenuItemOption
                      key={index}
                      value={version.label}
                      onClick={event => {
                        event.stopPropagation();
                        onVersionChange?.(version);
                      }}
                    >
                      {version.label}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          )}
        </Flex>
        <NavContext.Provider
          value={{
            nav,
            setNav: setLocalNavState
          }}
        >
          <chakra.nav px="4" pb="3" ref={navRef}>
            <NavItems items={navItems} />
          </chakra.nav>
        </NavContext.Provider>
        <HStack mt="auto" p="1" pt={0} spacing="1" pos="sticky" bottom="0">
          {hideSidebar && (
            <Tooltip label="Hide sidebar">
              <div>
                <SidebarButton
                  onClick={hideSidebar}
                  icon={<FiChevronsLeft />}
                />
              </div>
            </Tooltip>
          )}
          {navGroups.length > 0 && (
            <Tooltip
              label={`${isAllExpanded ? 'Collapse' : 'Expand'} all categories`}
            >
              <div>
                <SidebarButton
                  icon={
                    isAllExpanded ? <BsChevronContract /> : <BsChevronExpand />
                  }
                  onClick={event => {
                    event.stopPropagation();

                    const expanded = !isAllExpanded;
                    setLocalNavState(
                      navGroups.reduce(
                        (acc, group) => ({
                          ...acc,
                          [group.id]: expanded
                        }),
                        {}
                      )
                    );
                    window.gtag?.('event', 'Toggle all', {
                      event_category: GA_EVENT_CATEGORY_SIDEBAR,
                      event_label: expanded ? 'expand' : 'collapse'
                    });
                  }}
                />
              </div>
            </Tooltip>
          )}
        </HStack>
      </Flex>
    );
  }
);

SidebarNav.propTypes = {
  docset: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  versions: PropTypes.array,
  currentVersion: PropTypes.string,
  onVersionChange: PropTypes.func,
  onGoBack: PropTypes.func,
  hideSidebar: PropTypes.func
};

SidebarNav.displayName = 'SidebarNav';

export default SidebarNav;
