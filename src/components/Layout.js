import DocsetMenu from './DocsetMenu';
import Header, {TOTAL_HEADER_HEIGHT} from './Header';
import MobileNav from './MobileNav';
import PropTypes from 'prop-types';
import React, {Fragment, useMemo} from 'react';
import Sidebar, {
  SIDEBAR_WIDTH_BASE,
  SIDEBAR_WIDTH_XL,
  SidebarNav
} from './Sidebar';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronsRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {PathContext} from '../utils';
import {dirname} from 'path';

export default function Layout({children, data, uri, pageContext}) {
  const {name, basePath} = data.file;
  const {docset, versions, currentVersion, navItems} = pageContext;

  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');

  const switcher = useMemo(
    () => (
      <ButtonGroup isAttached>
        <DocsetMenu key={basePath} colorScheme="indigo">
          {docset}
        </DocsetMenu>
        {versions.length > 1 && (
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<FiChevronDown />}
              borderLeft="none"
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
      </ButtonGroup>
    ),
    [docset, basePath, versions, currentVersion]
  );

  return (
    <>
      <PathContext.Provider
        value={{
          uri,
          basePath,
          path: name === 'index' ? uri : dirname(uri)
        }}
      >
        <Header>
          <MobileNav>
            <SidebarNav navItems={navItems} darkBg="gray.700">
              <Box px="3" pt="1" pb="2">
                {switcher}
              </Box>
            </SidebarNav>
          </MobileNav>
          <Box d={{base: 'none', md: 'flex'}}>{switcher}</Box>
        </Header>
        <Fade in={sidebarHidden} unmountOnExit delay={0.25}>
          <Tooltip placement="right" label="Show sidebar">
            <IconButton
              d={{base: 'none', md: 'flex'}}
              pos="fixed"
              mt="2"
              left="2"
              size="sm"
              variant="outline"
              fontSize="md"
              icon={<FiChevronsRight />}
              css={{top: TOTAL_HEADER_HEIGHT}}
              onClick={() => setSidebarHidden(false)}
            />
          </Tooltip>
        </Fade>
        <Sidebar key={basePath} isHidden={sidebarHidden}>
          <SidebarNav
            navItems={navItems}
            onHide={() => setSidebarHidden(true)}
          />
        </Sidebar>
        <Box
          marginLeft={{
            base: 0,
            md: sidebarHidden ? 0 : SIDEBAR_WIDTH_BASE,
            xl: sidebarHidden ? 0 : SIDEBAR_WIDTH_XL
          }}
          transitionProperty="margin-left"
          transitionDuration="normal"
        >
          {children}
        </Box>
      </PathContext.Provider>
    </>
  );
}

Layout.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};
