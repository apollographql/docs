import Header from './Header';
import NavItems, {NavContext, isGroupActive} from './NavItems';
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
import {useLocalStorage} from '@rehooks/local-storage';

export const SIDEBAR_WIDTH = 300;

function flattenNavItems(items) {
  return items.flatMap(item =>
    Array.isArray(item.children)
      ? [item, ...flattenNavItems(item.children)]
      : item
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
      flattenNavItems(navItems)
        .filter(item => Array.isArray(item.children))
        .reduce(
          (acc, group) => ({
            ...acc,
            [group.id]: isGroupActive(group.children, basePath, uri)
          }),
          {}
        ),
    [navItems, basePath, uri]
  );

  const [nav, setNav] = useLocalStorage('nav', initialNavState);
  const isAllExpanded = useMemo(() => Object.values(nav).every(Boolean), [nav]);

  return (
    <SlideFade
      initial
      in={!isHidden}
      offsetY="0"
      offsetX={SIDEBAR_WIDTH / -2}
      unmountOnExit
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
          <Button size="xs" fontSize="sm" roundedRight="0" colorScheme="indigo">
            {docset}
          </Button>
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
                  Object.keys(nav).reduce(
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
          <NavContext.Provider value={{uri, basePath, nav, setNav}}>
            <NavItems items={navItems} />
          </NavContext.Provider>
        </chakra.nav>
      </chakra.aside>
    </SlideFade>
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
