import PropTypes from 'prop-types';
import React from 'react';
import {TOTAL_HEADER_HEIGHT} from '../Header';
import {chakra} from '@chakra-ui/react';

export const SIDEBAR_WIDTH_BASE = 250;
export const SIDEBAR_WIDTH_XL = 300;

export const Sidebar = ({children, isHidden}) => (
  <chakra.aside
    d={{base: 'none', md: 'block'}}
    h={
      // account for header border
      `calc(100vh - ${TOTAL_HEADER_HEIGHT}px)`
    }
    w={{
      base: SIDEBAR_WIDTH_BASE,
      xl: SIDEBAR_WIDTH_XL
    }}
    borderRightWidth="1px"
    pos="fixed"
    left="0"
    zIndex="1"
    overflow="auto"
    transitionProperty="common"
    transitionDuration="normal"
    bg="bg"
    css={{top: TOTAL_HEADER_HEIGHT}}
    style={{
      opacity: isHidden ? 0 : 1,
      transform: isHidden ? 'translateX(-100%)' : 'none'
    }}
  >
    {children}
  </chakra.aside>
);

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  isHidden: PropTypes.bool.isRequired
};
