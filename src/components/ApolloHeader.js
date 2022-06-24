import Header from './Header';
import MobileNav from './MobileNav';
import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';
import {SidebarNav} from './Sidebar';

export function ApolloHeader({
  algoliaFilters,
  navItems,
  renderSwitcher,
  renderSwitcher1
}) {
  return (
    <Header algoliaFilters={algoliaFilters}>
      <MobileNav>
        <SidebarNav navItems={navItems} darkBg="gray.700">
          <Box px="3" pt="1" pb="3">
            {renderSwitcher}
          </Box>
        </SidebarNav>
      </MobileNav>
      {renderSwitcher1}
    </Header>
  );
}

ApolloHeader.propTypes = {
  algoliaFilters: PropTypes.any,
  navItems: PropTypes.any,
  renderSwitcher: PropTypes.any,
  renderSwitcher1: PropTypes.any
};
