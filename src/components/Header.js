import PropTypes from 'prop-types';
import React from 'react';
import Search from './Search';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import {FiMenu, FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {useTagColors} from '../utils';

const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT + HEADER_BORDER_WIDTH;

export default function Header({children}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const [tagBg, tagTextColor] = useTagColors();
  return (
    <Flex
      align="center"
      as="header"
      pr="4"
      pl={{base: 2, md: 4}}
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
      <HStack spacing="4" d={{base: 'none', md: 'flex'}}>
        <Flex
          as={GatsbyLink}
          to="/"
          align="center"
          display={{base: 'none', md: 'flex'}}
        >
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
        {children}
      </HStack>
      <HStack d={{base: 'flex', md: 'none'}}>
        <IconButton variant="ghost" fontSize="2xl" icon={<FiMenu />} />
        <Box fill="current" as={ApolloMark} h="8" />
      </HStack>
      <IconButton
        ml="auto"
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
  children: PropTypes.node
};
