import DocsetMenu from './DocsetMenu';
import Header from './Header';
import NavItems, {isGroupActive} from './NavItems';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SlideFade,
  Tooltip,
  chakra
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronsDown, FiChevronsUp} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {NavContext} from '../utils';
import {useLocalStorage} from '@rehooks/local-storage';

export const SIDEBAR_WIDTH = 300;

function flattenNavItems(items) {
  return items.flatMap(item =>
    item.children ? [item, ...flattenNavItems(item.children)] : item
  );
}

export default function Sidebar({
  docset,
  navItems,
  uri,
  basePath,
  currentVersion,
  versions,
  isHidden,
  onHide
}) {
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

  return (
    <NavContext.Provider value={{uri, basePath, nav, setNav}}>
      <SlideFade
        initial={false}
        in={!isHidden}
        offsetY="0"
        offsetX={-SIDEBAR_WIDTH}
      >
        <chakra.aside
          h="100vh"
          w={SIDEBAR_WIDTH}
          borderRightWidth="1px"
          pos="fixed"
          top="0"
          left="0"
          overflow="auto"
          zIndex="0"
        >
          <Header onToggleHidden={onHide} />
          <Flex pl="4" pr="2">
            <DocsetMenu label={docset} />
            {versions && (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="xs"
                  ml="px"
                  roundedLeft="0"
                  fontSize="sm"
                >
                  {currentVersion}
                </MenuButton>
                <MenuList>
                  {versions.map((version, index) => (
                    <GatsbyLink key={index} to={'/' + version.slug}>
                      <MenuItem>{version.label}</MenuItem>
                    </GatsbyLink>
                  ))}
                </MenuList>
              </Menu>
            )}
            <Tooltip
              label={`${isAllExpanded ? 'Collapse' : 'Expand'} all categories`}
            >
              <IconButton
                ml="auto"
                size="xs"
                fontSize="md"
                icon={isAllExpanded ? <FiChevronsUp /> : <FiChevronsDown />}
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
              />
            </Tooltip>
          </Flex>
          <chakra.nav py="2" pr="2">
            <NavItems items={navItems} />
          </chakra.nav>
        </chakra.aside>
      </SlideFade>
    </NavContext.Provider>
  );
}

Sidebar.propTypes = {
  uri: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  docset: PropTypes.string.isRequired,
  currentVersion: PropTypes.string,
  versions: PropTypes.array,
  navItems: PropTypes.array.isRequired,
  isHidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};
