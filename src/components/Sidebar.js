import NavItems, {isGroupActive} from './NavItems';
import PropTypes from 'prop-types';
import React, {useContext, useMemo} from 'react';
import {
  Button,
  Flex,
  IconButton,
  Tooltip,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';
import {FiChevronsDown, FiChevronsLeft, FiChevronsUp} from 'react-icons/fi';
import {HEADER_HEIGHT} from './Header';
import {NavContext, PathContext} from '../utils';
import {useLocalStorage} from '@rehooks/local-storage';

export const SIDEBAR_WIDTH = 250;

function flattenNavItems(items) {
  return items.flatMap(item =>
    item.children ? [item, ...flattenNavItems(item.children)] : item
  );
}

export default function Sidebar({navItems, isHidden, onHide}) {
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

  const bg = useColorModeValue('white', 'gray.800');

  return (
    <chakra.aside
      // account for header border
      h={`calc(100vh - ${HEADER_HEIGHT + 1}px)`}
      w={SIDEBAR_WIDTH}
      borderRightWidth="1px"
      pos="fixed"
      left="0"
      zIndex="0"
      overflow="auto"
      transitionProperty="common"
      transitionDuration="normal"
      bg={bg}
      css={{top: HEADER_HEIGHT}}
      style={{
        opacity: isHidden ? 0 : 1,
        transform: isHidden ? `translateX(-${SIDEBAR_WIDTH}px)` : 'none'
      }}
    >
      <Flex px="1" pt="2" pb="2" pos="sticky" top="0" bg={bg} zIndex="1">
        <Button
          mr="auto"
          size="sm"
          variant="ghost"
          rightIcon={isAllExpanded ? <FiChevronsUp /> : <FiChevronsDown />}
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
        <Tooltip label="Hide sidebar">
          <IconButton
            size="sm"
            variant="ghost"
            fontSize="md"
            onClick={onHide}
            icon={<FiChevronsLeft />}
          />
        </Tooltip>
      </Flex>
      <NavContext.Provider value={{nav, setNav}}>
        <chakra.nav pt="1" pr="2" pb="4">
          <NavItems items={navItems} />
        </chakra.nav>
      </NavContext.Provider>
    </chakra.aside>
  );
}

Sidebar.propTypes = {
  navItems: PropTypes.array.isRequired,
  isHidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};
