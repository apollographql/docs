import PropTypes from 'prop-types';
import React, {createContext, useContext, useRef} from 'react';
import {Box, Flex, Stack, Tooltip, chakra} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {OutlinkIcon} from '../Icons';
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
    openSidebar,
    onKeyboardSelect,
    clickToSelect,
    isLocked
  } = useContext(DocsetContext);

  const timeoutRef = useRef();

  const config = configs[docset];

  const isActiveMenu = activeDocset === docset;
  const isActivePath =
    pathContext.basePath === docset ||
    config.versions?.some(version => pathContext.basePath === version.slug);

  const docsetLink =
    config.link ?? (docset.startsWith('/') ? docset : `/${docset}`);
  const isExternal = !docsetLink.startsWith('/');

  const linkProps = isExternal
    ? {
        as: 'a',
        href: docsetLink,
        target: '_blank'
      }
    : {
        as: GatsbyLink,
        to: docsetLink
      };

  return (
    <Tooltip isDisabled={!isLocked} label={config.docset} placement="right">
      <Box
        px="4"
        py="2"
        {...linkProps}
        display="flex"
        alignItems="center"
        whiteSpace="nowrap"
        onFocus={() => {
          openSidebar?.();
          if (!clickToSelect) {
            setActiveDocset(docset);
          }
        }}
        onMouseEnter={() => {
          if (!clickToSelect) {
            timeoutRef.current = setTimeout(() => {
              setActiveDocset(docset);
            }, 100);
          }
        }}
        onMouseLeave={() => {
          if (!clickToSelect) {
            clearTimeout(timeoutRef.current);
          }
        }}
        onMouseMove={event => {
          if (!clickToSelect && event.movementY === 0) {
            clearTimeout(timeoutRef.current);
            setActiveDocset(docset);
          }
        }}
        onClick={event => {
          if (clickToSelect) {
            event.preventDefault();
            setActiveDocset(docset);
          } else if (event.detail === 0) {
            event.preventDefault();
            onKeyboardSelect();
          }
        }}
        position="relative"
        _after={{
          content: isActivePath && '""',
          width: '4',
          bg: 'primary',
          position: 'absolute',
          left: '100%',
          top: 0,
          bottom: 0
        }}
        borderRadius="md"
        borderRightRadius={isActivePath ? 0 : undefined}
        bg={
          isActivePath ? 'primary' : isActiveMenu ? 'whiteAlpha.300' : 'inherit'
        }
        color={isActivePath ? 'white' : 'inherit'}
        tabIndex="0"
        {...props}
      >
        <Box fontSize="2xl">{icon}</Box>
        {!isLocked && (
          <>
            <chakra.span
              ml="3"
              opacity={sidebarOpen ? '100' : '0'}
              transitionProperty="opacity"
              transitionDuration="normal"
              transitionTimingFunction="ease-in-out"
            >
              {config.docset}
            </chakra.span>
            {isExternal && <Box ml="2" as={OutlinkIcon} />}
          </>
        )}
      </Box>
    </Tooltip>
  );
};

SidebarCategoryLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  docset: PropTypes.string.isRequired
};
