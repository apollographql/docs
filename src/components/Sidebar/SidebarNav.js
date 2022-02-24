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

const flattenNavItems = items =>
  items.flatMap(item =>
    item.children ? [item, ...flattenNavItems(item.children)] : item
  );

export function SidebarNav({navItems, onHide, darkBg = 'gray.800', children}) {
  const bg = useColorModeValue('white', darkBg);
  const {uri, basePath} = useContext(PathContext);

  const navGroups = useMemo(
    () => flattenNavItems(navItems).filter(item => item.children),
    [navItems]
  );

  // save nav state in storage
  const [localNavState, setLocalNavState] = useLocalStorage('nav');
  const initialNavState = useMemo(
    () =>
      // create a mapping of nav group ids to their default open state, based on
      // whether one of their children is the current page
      navGroups.reduce((acc, group) => {
        const isActive = isGroupActive(group.children, basePath, uri);
        return isActive
          ? {
              ...acc,
              [group.id]: isActive
            }
          : acc;
      }, {}),
    [navGroups, basePath, uri]
  );

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
              setLocalNavState(
                navGroups.reduce(
                  (acc, group) => ({
                    ...acc,
                    [group.id]: !isAllExpanded
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
      <NavContext.Provider value={{nav, setNav: setLocalNavState}}>
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
