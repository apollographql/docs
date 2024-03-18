import NavItems, {GA_EVENT_CATEGORY_SIDEBAR, NavContext} from './NavItems';
import PropTypes from 'prop-types';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
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
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  CollapseListIcon,
  DoubleChevronLeftIcon,
  ExpandListIcon,
  LockIcon,
  UnlockIcon
} from '../Icons';
import {PAGE_FOOTER_HEIGHT} from '../PageLayout';
import {flattenNavItems} from '../../utils';

const SidebarButton = props => (
  <IconButton size="sm" variant="ghost" {...props} />
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
      hideSidebar,
      isLocked,
      onLockToggle
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
            [group.id]: !group.isDefaultCollapsed
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
              icon={<ChevronLeftIcon />}
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
                rightIcon={<ChevronDownIcon />}
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
        <Flex
          align="center"
          mt="auto"
          flexShrink={0}
          pos="sticky"
          bottom="0"
          pl="4"
          pr="2"
          bg="bg"
          borderTopWidth={1}
          css={{
            height: PAGE_FOOTER_HEIGHT
          }}
        >
          <chakra.span fontWeight="semibold" fontSize="sm">
            Navigation controls
          </chakra.span>
          <HStack spacing="1" ml="auto">
            {navGroups.length > 0 && (
              <Tooltip
                label={`${
                  isAllExpanded ? 'Collapse' : 'Expand'
                } all categories`}
              >
                <div>
                  <SidebarButton
                    aria-label={`${
                      isAllExpanded ? 'Collapse' : 'Expand'
                    } all categories`}
                    icon={
                      isAllExpanded ? <CollapseListIcon /> : <ExpandListIcon />
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
            {hideSidebar && (
              <Tooltip label="Hide navigation">
                <div>
                  <SidebarButton
                    aria-label="Hide navigation"
                    onClick={hideSidebar}
                    icon={<DoubleChevronLeftIcon />}
                  />
                </div>
              </Tooltip>
            )}
            {onLockToggle && (
              <Tooltip label={`${isLocked ? 'Unlock' : 'Lock'} sidebar`}>
                <div>
                  <SidebarButton
                    aria-label={`${isLocked ? 'Unlock' : 'Lock'} sidebar`}
                    icon={isLocked ? <LockIcon /> : <UnlockIcon />}
                    onClick={onLockToggle}
                  />
                </div>
              </Tooltip>
            )}
          </HStack>
        </Flex>
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
  hideSidebar: PropTypes.func,
  isLocked: PropTypes.bool,
  onLockToggle: PropTypes.func
};

SidebarNav.displayName = 'SidebarNav';

export default SidebarNav;
