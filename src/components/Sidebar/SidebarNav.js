import NavItems, {isGroupActive} from '../NavItems';
import PropTypes from 'prop-types';
import React, {useContext, useMemo} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Tooltip,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';
import {BsChevronContract, BsChevronExpand} from 'react-icons/bs';
import {FiChevronsLeft} from 'react-icons/fi';
import {NavContext, PathContext} from '../../utils';

function flattenNavItems(items) {
  return items.flatMap(item =>
    item.children ? [item, ...flattenNavItems(item.children)] : item
  );
}

export function SidebarNav({navItems, onHide, darkBg = 'gray.800', children}) {
  const {uri, basePath} = useContext(PathContext);
  const initialNavState = useMemo(
    () =>
      // create a mapping of nav group ids to their default open state, based on
      // whether one of their children is the current page
      flattenNavItems(navItems)
        .filter(item => item.children)
        .reduce(
          (acc, group) => ({
            ...acc,
            [group.id]: isGroupActive(group.children, basePath, uri)
          }),
          {}
        ),
    [navItems, basePath, uri]
  );

  const navGroups = useMemo(
    // keep a copy of the valid nav group ids
    () => Object.keys(initialNavState),
    [initialNavState]
  );

  // save nav state in storage
  const [nav, setNav] = useLocalStorage('nav', initialNavState);

  // compute expand/collapse all state from nav state
  const isAllExpanded = useMemo(() => {
    // get an array of the state of all nav items that also exist in the list of
    // valid nav group ids (above)
    const activeGroups = Object.entries(nav)
      .filter(([key]) => navGroups.includes(key))
      .map(([, value]) => value);
    return activeGroups.length && activeGroups.every(Boolean);
  }, [navGroups, nav]);

  const bg = useColorModeValue('white', darkBg);

  return (
    <>
      <Box p="2" pl="0" pos="sticky" top="0" bg={bg} zIndex="1">
        {children}
        <Flex>
          <Button
            mr="auto"
            size="sm"
            variant="ghost"
            roundedRight="full"
            roundedLeft="none"
            isDisabled={!navGroups.length}
            leftIcon={
              isAllExpanded ? <BsChevronContract /> : <BsChevronExpand />
            }
            onClick={() =>
              setNav(
                Object.keys(initialNavState).reduce(
                  (acc, key) => ({
                    ...acc,
                    [key]: !isAllExpanded
                  }),
                  {}
                )
              )
            }
          >
            {isAllExpanded ? 'Collapse' : 'Expand'} all
          </Button>
          {onHide && (
            <Tooltip label="Hide sidebar">
              <IconButton
                size="sm"
                variant="ghost"
                fontSize="md"
                onClick={onHide}
                icon={<FiChevronsLeft />}
              />
            </Tooltip>
          )}
        </Flex>
      </Box>
      <NavContext.Provider value={{nav, setNav}}>
        <chakra.nav pt="1" pr="2" pb="4">
          <NavItems items={navItems} />
        </chakra.nav>
      </NavContext.Provider>
    </>
  );
}

SidebarNav.propTypes = {
  children: PropTypes.node,
  navItems: PropTypes.array.isRequired,
  onHide: PropTypes.func,
  darkBg: PropTypes.string
};
