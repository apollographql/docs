import PropTypes from 'prop-types';
import React from 'react';
import {TabContext} from './Tabs';

export function Tab({label, children}) {
  const currentTab = React.useContext(TabContext);

  if (label !== currentTab) {
    return null;
  }

  return children;
}

Tab.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node
};
