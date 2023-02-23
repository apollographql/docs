import NavItems, {GA_EVENT_CATEGORY_SIDEBAR, NavContext} from './NavItems';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {BsChevronContract, BsChevronExpand} from 'react-icons/bs';
import {Button, Flex, Heading, chakra} from '@chakra-ui/react';
import {flattenNavItems} from '../../utils';

export function SidebarNav({docset, navItems}) {
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
        <Heading size="md">{docset}</Heading>
        <Button
          ml="auto"
          size="xs"
          variant="ghost"
          isDisabled={!navGroups.length}
          leftIcon={isAllExpanded ? <BsChevronContract /> : <BsChevronExpand />}
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
          {isAllExpanded ? 'Collapse' : 'Expand'} all
        </Button>
      </Flex>
      <NavContext.Provider
        value={{
          nav,
          setNav: setLocalNavState
        }}
      >
        <chakra.nav px="4">
          <NavItems items={navItems} />
        </chakra.nav>
      </NavContext.Provider>
    </>
  );
}

SidebarNav.propTypes = {
  docset: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired
};
