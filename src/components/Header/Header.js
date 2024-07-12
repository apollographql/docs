import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Search from '../Search';
import StudioButton from './StudioButton';
import {ReactComponent as ApolloLogo} from '@apollo/icons/logos/LogoType.svg';
import {ReactComponent as ApolloMark} from '@apollo/icons/logos/LogoSymbol.svg';
import {
  Box,
  Link,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {
  MoonIcon,
  NarrowViewportIcon,
  SunIcon,
  WidenViewportIcon,
  CloseIcon,
} from '../Icons';
import {usePageWidthContext} from '../PageWidthContext';

const EYEBROW_HEIGHT = 36; // 0;
const HEADER_HEIGHT = 60;
const HEADER_BORDER_WIDTH = 1;
export const TOTAL_HEADER_HEIGHT =
  EYEBROW_HEIGHT + HEADER_HEIGHT + HEADER_BORDER_WIDTH;


const Eyebrow = ({children}) => {
  // State to manage visibility
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const isEyebrowHidden = localStorage.getItem('isEyebrowHidden') === 'true';
    setIsVisible(!isEyebrowHidden);
  }, []);

  const handleClose = () => {
    // Hide the Eyebrow
    setIsVisible(false);
    // Persist state in localStorage
    localStorage.setItem('isEyebrowHidden', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Box  justifyContent="center" alignItems="center" display="flex"
      bg="navy.300"
      color="white"
      _dark={{
        bg: 'primary',
        _hover: {bg: 'navy.300'}
      }}
      _hover={{bg: 'primary'}}
      css={{height: EYEBROW_HEIGHT}}
      fontSize="sm"
      fontWeight="semibold"
      px="3"
    >
      <Link
      as={GatsbyLink}
      href="https://summit.graphql.com/?utm_campaign=docs_eyebrow"
      target="_blank"
      textDecoration="underline"
      rel="noopener noreferrer">{children}</Link>
      <Button position="absolute" height={`${EYEBROW_HEIGHT}px`} borderRadius={0} bg="transparent" right="0" top="0" ml="auto"  onClick={handleClose}><CloseIcon/></Button>
    </Box>
  );
};

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
        <Text as="span" display={{base: 'none', lg: 'inline'}}>
          Join us from October 8-10 in New York City to learn the latest tips,
          trends, and news about GraphQL Federation and API platform
          engineering.
        </Text>
        <Text as="span" display={{base: 'inline', lg: 'none'}}>
          Join us for GraphQL Summit 2024 in NYC
        </Text>
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
