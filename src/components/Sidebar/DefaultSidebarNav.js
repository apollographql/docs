import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import SidebarNav from './SidebarNav';
import {PathContext} from '../../utils';
import {useConfig} from '../../utils/config';

export const DefaultSidebarNav = ({hideSidebar}) => {
  const {docset, navItems} = useConfig('/');
  const pathContext = useContext(PathContext);
  return (
    <PathContext.Provider
      value={{
        ...pathContext,
        basePath: '/'
      }}
    >
      <SidebarNav
        docset={docset}
        navItems={navItems}
        hideSidebar={hideSidebar}
      />
    </PathContext.Provider>
  );
};

DefaultSidebarNav.propTypes = {
  hideSidebar: PropTypes.func.isRequired
};
