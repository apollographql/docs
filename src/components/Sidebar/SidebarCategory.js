import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {Box, List, ListItem, chakra} from '@chakra-ui/react';
import {PathContext} from '../../utils';

export const DocsetContext = createContext();

export const SidebarCategory = ({children, title}) => {
  return (
    <div>
      <Box
        mb="4"
        fontSize="sm"
        letterSpacing="wider"
        fontFamily="mono"
        textTransform="uppercase"
      >
        {title}
      </Box>
      <List spacing="2">{children}</List>
    </div>
  );
};

SidebarCategory.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export const SidebarCategoryLink = ({children, icon, docset}) => {
  const pathContext = useContext(PathContext);
  const {activeDocset, setActiveDocset, sidebarOpen} =
    useContext(DocsetContext);
  const isActiveMenu = activeDocset === docset;
  const isActivePath = pathContext.basePath === docset;
  return (
    <ListItem
      px="4"
      display="flex"
      alignItems="center"
      onFocus={() => setActiveDocset(docset)}
      onMouseEnter={() => setActiveDocset(docset)}
      position="relative"
      _after={{
        content: isActivePath && '""',
        width: '4',
        bg: 'purple.500',
        position: 'absolute',
        left: '100%',
        top: 0,
        bottom: 0
      }}
      borderRadius="md"
      borderRightRadius={isActivePath ? 0 : undefined}
      bg={
        isActivePath
          ? 'purple.500'
          : isActiveMenu
          ? 'whiteAlpha.300'
          : 'inherit'
      }
      tabIndex="0"
    >
      <Box fontSize="2xl">{icon}</Box>
      <chakra.span
        py="2"
        ml="2"
        transition="opacity ease-in-out 100ms"
        opacity={sidebarOpen ? '100' : '0'}
      >
        {children}
      </chakra.span>
    </ListItem>
  );
};

SidebarCategoryLink.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType.isRequired,
  docset: PropTypes.string.isRequired
};
