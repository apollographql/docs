import DocsetMenu from './DocsetMenu';
import PropTypes from 'prop-types';
import React from 'react';
import SearchButton from './SearchButton';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import {FiChevronDown, FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as Logo} from '@apollo/space-kit/logos/logo.svg';

export const HEADER_HEIGHT = 50;

export default function Header({docset, versions, currentVersion}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  return (
    <Flex
      align="center"
      as="header"
      px="4"
      boxSizing="content-box"
      borderBottomWidth="1px"
      pos="sticky"
      top="0"
      zIndex="1"
      bg={bg}
      css={{height: HEADER_HEIGHT}}
    >
      <HStack spacing="4" mr="auto" fontWeight="semibold">
        <Box
          as={Logo}
          fill="current"
          h="7"
          // center the logo text vertically
          transform="translateY(3.08578178%)"
        />
        <ButtonGroup size="sm" isAttached>
          <DocsetMenu>{docset}</DocsetMenu>
          {versions?.length > 1 && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                ml="px"
                fontSize="sm"
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
      </HStack>
      <SearchButton />
      <IconButton
        ml="2"
        fontSize="lg"
        size="sm"
        variant="ghost"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
      />
    </Flex>
  );
}

Header.propTypes = {
  docset: PropTypes.string.isRequired,
  versions: PropTypes.array,
  currentVersion: PropTypes.string
};
