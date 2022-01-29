import DocsetMenu from './DocsetMenu';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './Search';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
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
import {useTagColors} from '../utils';

export const HEADER_HEIGHT = 60;

export default function Header({docset, versions, currentVersion}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const buttonTextColor = useColorModeValue('indigo.500', 'indigo.200');
  const [tagBg, tagTextColor] = useTagColors();
  return (
    <Flex
      align="center"
      as="header"
      px="4"
      boxSizing="content-box"
      shadow="sm"
      pos="sticky"
      top="0"
      zIndex="1"
      bg={bg}
      css={{height: HEADER_HEIGHT}}
    >
      <HStack spacing="4" mr="auto" fontWeight="semibold">
        <Flex align="center">
          <Box
            as={ApolloLogo}
            fill="current"
            role="img"
            aria-label="Apollo logo"
            h="6"
            // center the logo text vertically
            transform="translateY(3.08578178%)"
          />
          <Box
            ml="1.5"
            px="1.5"
            fontSize="sm"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="widest"
            bg={tagBg}
            color={tagTextColor}
            rounded="sm"
            transform="translateY(-3.08578178%)"
          >
            Docs
          </Box>
        </Flex>
        <ButtonGroup isAttached>
          <DocsetMenu color={buttonTextColor}>{docset}</DocsetMenu>
          {versions?.length > 1 && (
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} ml="px">
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
      <IconButton
        mr="2"
        fontSize="xl"
        variant="ghost"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
      />
      <Search />
    </Flex>
  );
}

Header.propTypes = {
  docset: PropTypes.string.isRequired,
  versions: PropTypes.array,
  currentVersion: PropTypes.string
};
