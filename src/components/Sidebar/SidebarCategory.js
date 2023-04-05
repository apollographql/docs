import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {Box, Flex, Stack, chakra} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {PathContext} from '../../utils';

export const DocsetContext = createContext();

export const SidebarCategory = ({children, title}) => {
  const {sidebarOpen} = useContext(DocsetContext);
  return (
    <div>
      <Flex
        mb="4"
        align="center"
        fontSize="md"
        sx={{
          span: {
            opacity: Number(sidebarOpen)
          }
        }}
      >
        {title}
      </Flex>
      <Stack as="nav" spacing="2">
        {children}
      </Stack>
    </div>
  );
};

SidebarCategory.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired
};

export const SidebarCategoryLink = ({icon, docset, ...props}) => {
  const pathContext = useContext(PathContext);
  const {
    configs,
    activeDocset,
    setActiveDocset,
    sidebarOpen,
    setSidebarOpen,
    onKeyboardSelect,
    clickToSelect
  } = useContext(DocsetContext);

  const config = configs[docset];

  const isActiveMenu = activeDocset === docset;
  const isActivePath =
    pathContext.basePath === docset ||
    config.versions?.some(version => pathContext.basePath === version.slug);

  return (
    <Box
      px="4"
      as={GatsbyLink}
      to={docset.startsWith('/') ? docset : `/${docset}`}
      display="flex"
      alignItems="center"
      onFocus={() => {
        setSidebarOpen?.(true);
        if (!clickToSelect) {
          setActiveDocset(docset);
        }
      }}
      onMouseMove={event => {
        if (!clickToSelect && event.movementY === 0) {
          setActiveDocset(docset);
        }
      }}
      onClick={event => {
        if (clickToSelect) {
          event.preventDefault();
          setActiveDocset(docset);
        } else if (event.nativeEvent.pointerType !== 'mouse') {
          event.preventDefault();
          onKeyboardSelect();
        }
      }}
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
      {...props}
    >
      <Box fontSize="2xl">{icon}</Box>
      <chakra.span
        py="2"
        ml="3"
        opacity={sidebarOpen ? '100' : '0'}
        transitionProperty="opacity"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
      >
        {config.docset}
      </chakra.span>
    </Box>
  );
};

SidebarCategoryLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  docset: PropTypes.string.isRequired
};
