import PropTypes from 'prop-types';
import React from 'react';
import Search from '../Search';
import StudioButton from './StudioButton';
import {ReactComponent as ApolloLogo} from '@apollo/icons/logos/LogoType.svg';
import {ReactComponent as ApolloMark} from '@apollo/icons/logos/LogoSymbol.svg';
import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {
  MoonIcon,
  NarrowViewportIcon,
  SunIcon,
  WidenViewportIcon
} from '../Icons';
import {usePageWidthContext} from '../PageWidthContext';

const EYEBROW_HEIGHT = 32; // 0;
const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT =
  EYEBROW_HEIGHT + HEADER_HEIGHT + HEADER_BORDER_WIDTH;

function Eyebrow({children}) {
  return (
    <Center
      bg="navy.200"
      color="white"
      _dark={{
        bg: 'black.200'
      }}
      _hover={{bg: 'primary'}}
      css={{height: EYEBROW_HEIGHT}}
      fontSize="sm"
      fontWeight="semibold"
      as="a"
      href="https://reg.summit.graphql.com/flow/apollo/summit24/speaker-landing-page/page/home?utm_campaign=2024-05-14_GraphQLSummit&utm_medium=website&utm_source=docs"
      target="_blank"
      rel="noopener noreferrer"
      px="3"
    >
      <span>{children}</span>
    </Center>
  );
}

Eyebrow.propTypes = {
  children: PropTypes.node.isRequired
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
  algoliaFilters: PropTypes.array
};

export function Header({children, algoliaFilters}) {
  const {toggleColorMode} = useColorMode();
  const {pageWidth, togglePageWidth, showExpandButton} = usePageWidthContext();

  return (
    <Box pos="sticky" top="0" zIndex="2">
      <Eyebrow>
        Here&apos;s your chance to speak at GraphQL Summit in New York City,
        October 8 - 10, 2024! 🏙️ Submit your proposal by May 20.
      </Eyebrow>
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
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="widest"
              rounded="sm"
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="sm"
              _dark={{
                bg: 'bg',
                borderColor: 'navy.400',
                color: 'inherit'
              }}
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
        {process.env.ALGOLIA_SEARCH_KEY && (
          <Search algoliaFilters={algoliaFilters} />
        )}
        {showExpandButton && (
          <Tooltip
            label={
              pageWidth === 'jumbo'
                ? 'Collapse to default width'
                : 'Expand to extended width'
            }
          >
            <IconButton
              aria-label="Toggle page width"
              fontSize="xl"
              variant="ghost"
              onClick={togglePageWidth}
              icon={
                pageWidth === 'jumbo' ? (
                  <NarrowViewportIcon />
                ) : (
                  <WidenViewportIcon />
                )
              }
            />
          </Tooltip>
        )}
        <Tooltip
          label={
            <Text>
              <Text as="span" display="none" _dark={{display: 'inline'}}>
                Switch to light mode
              </Text>
              <Text as="span" display="inline" _dark={{display: 'none'}}>
                Switch to dark mode
              </Text>
            </Text>
          }
        >
          <IconButton
            aria-label="Toggle color mode"
            fontSize="xl"
            variant="ghost"
            onClick={toggleColorMode}
            icon={
              <>
                <Icon
                  as={SunIcon}
                  display="none"
                  _dark={{
                    display: 'block'
                  }}
                />
                <Icon
                  as={MoonIcon}
                  display="block"
                  _dark={{
                    display: 'none'
                  }}
                />
              </>
            }
          />
        </Tooltip>
        <StudioButton />
      </Flex>
    </Box>
  );
}
