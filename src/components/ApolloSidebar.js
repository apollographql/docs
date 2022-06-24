import PropTypes from 'prop-types';
import React from 'react';
import Sidebar, {SidebarNav} from './Sidebar';
import {Fade, IconButton, Tooltip} from '@chakra-ui/react';
import {FiChevronsRight} from 'react-icons/fi';
import {TOTAL_HEADER_HEIGHT} from './Header';

ApolloSidebar.propTypes = {
  in: PropTypes.any,
  onClick: PropTypes.func,
  navItems: PropTypes.any,
  onHide: PropTypes.func
};

export function ApolloSidebar(props) {
  return (
    <div>
      <Fade in={props.in} unmountOnExit delay={0.25}>
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
            onClick={props.onClick}
          />
        </Tooltip>
      </Fade>
      <Sidebar isHidden={props.in}>
        <SidebarNav navItems={props.navItems} onHide={props.onHide} />
      </Sidebar>
    </div>
  );
}
