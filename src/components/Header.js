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
import {useAccentColor, useTagColors} from '../utils';

const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT + HEADER_BORDER_WIDTH;

export default function Header({docset, versions, currentVersion}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const buttonTextColor = useAccentColor();
  const [tagBg, tagTextColor] = useTagColors();
  return (
    <Flex
      align="center"
      as="header"
      px="4"
      boxSizing="content-box"
      pos="sticky"
      top="0"
      zIndex="1"
      bg={bg}
      css={{
        height: HEADER_HEIGHT,
        borderBottomWidth: HEADER_BORDER_WIDTH
      }}
    >
      <HStack spacing="4" mr="auto" fontWeight="semibold">
        <Flex as={GatsbyLink} to="/" align="center">
          <Box
            as={ApolloLogo}
            fill="current"
            role="img"
            aria-label="Apollo logo"
            h="6"
            mt="0.5" // offset to vertically align better w/ docs tag
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
