import NavItems, {GA_EVENT_CATEGORY_SIDEBAR, NavContext} from './NavItems';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  chakra
} from '@chakra-ui/react';
import {BsChevronContract, BsChevronExpand} from 'react-icons/bs';
import {FiChevronDown} from 'react-icons/fi';
import {flattenNavItems} from '../../utils';

export function SidebarNav({
  docset,
  navItems,
  versions,
  currentVersion,
  onVersionChange
}) {
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
    <>
      <Flex p="4" pos="sticky" top="0" zIndex="1" bg="bg">
        {/* TODO: the docset title below should match the title in the left sidebar */}
        <chakra.h2 mr="auto" fontSize="xl" fontWeight="semibold">
          {docset}
        </chakra.h2>
        {versions.length > 0 && (
          <Menu>
            <MenuButton
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
                      onVersionChange(version);
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
        <chakra.nav px="4" pb="3">
          {navGroups.length > 0 && (
            <HStack
              as="button"
              fontSize="sm"
              fontWeight="semibold"
              spacing="1"
              mb="4"
              onClick={() => {
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
            >
              <span>{isAllExpanded ? 'Collapse' : 'Expand'} all</span>
              <Box
                as={isAllExpanded ? BsChevronContract : BsChevronExpand}
                pointerEvents="none"
              />
            </HStack>
          )}
          <NavItems items={navItems} />
        </chakra.nav>
      </NavContext.Provider>
    </>
  );
}

SidebarNav.propTypes = {
  docset: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  versions: PropTypes.array,
  currentVersion: PropTypes.string,
  onVersionChange: PropTypes.func.isRequired
};
