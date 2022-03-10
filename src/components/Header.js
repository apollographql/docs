import PropTypes from 'prop-types';
import React from 'react';
import Search from './Search';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  useColorMode
} from '@chakra-ui/react';
import {FiArrowRight, FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {gql, useQuery} from '@apollo/client';
import {useTagColors} from '../utils';

const GET_USER = gql`
  query GetUser {
    me {
      name
    }
  }
`;

function StudioButton() {
  const {data} = useQuery(GET_USER);
  return (
    <Button
      ml="2"
      colorScheme="indigo"
      variant="ghost"
      rightIcon={<FiArrowRight />}
      d={{base: 'none', lg: 'flex'}}
    >
      {data?.me ? 'Launch' : 'Try'} Apollo Studio
    </Button>
  );
}

const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT + HEADER_BORDER_WIDTH;

export default function Header({children, algoliaFilters}) {
  const {toggleColorMode, colorMode} = useColorMode();
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
  );
}

Header.propTypes = {
  children: PropTypes.node,
  algoliaFilters: PropTypes.array
};
