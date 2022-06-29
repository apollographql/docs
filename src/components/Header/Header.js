import PropTypes from 'prop-types';
import React from 'react';
import Search from '../Search';
import StudioButton from './StudioButton';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  chakra,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import {FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {useTagColors} from '../../utils';

const EYEBROW_HEIGHT = 32;
const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT =
  EYEBROW_HEIGHT + HEADER_HEIGHT + HEADER_BORDER_WIDTH;

function Eyebrow() {
  const bg = useColorModeValue('indigo.50', 'indigo.800');
  const bgHover = useColorModeValue('indigo.100', 'indigo.700');
  return (
    <Center
      bg={bg}
      _hover={{bg: bgHover}}
      css={{height: EYEBROW_HEIGHT}}
      fontSize="sm"
      fontWeight="semibold"
      as="a"
      href="https://forms.gle/jhzZHGdnxRjx8q8R7"
      target="_blank"
      rel="noopener noreferrer"
      px="3"
    >
      <span>
        <chakra.span display={{base: 'none', md: 'inline'}}>
          Last chance to speak on stage at GraphQL Summit!
        </chakra.span>{' '}
        Submit your{' '}
        <chakra.span display={{md: 'none'}}>GraphQL Summit</chakra.span>{' '}
        proposal by July 1. 🌴
      </span>
    </Center>
  );
}

export function Header({children, algoliaFilters}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const [tagBg, tagTextColor] = useTagColors();
  return (
    <Box pos="sticky" top="0" zIndex="1">
      <Eyebrow />
      <Flex
        align="center"
        as="header"
        px="4"
        boxSizing="content-box"
        bg="bg"
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
            d={{base: 'none', md: 'flex'}}
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
          {children}
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
        {process.env.ALGOLIA_SEARCH_KEY && (
          <Search algoliaFilters={algoliaFilters} />
        )}
        <StudioButton />
      </Flex>
    </Box>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  algoliaFilters: PropTypes.array
};
