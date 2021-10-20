import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import {FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from '@apollo/space-kit/logos/mark.svg';

export default function Layout({children}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const headerBg = useColorModeValue('white', 'gray.800');
  return (
    <>
      <Helmet
        titleTemplate="%s - Apollo GraphQL Docs"
        defaultTitle="Apollo GraphQL Docs"
      />
      <Flex
        as="header"
        align="center"
        px="4"
        py="2"
        pos="sticky"
        top="0"
        bg={headerBg}
      >
        <HStack mr="auto" fontWeight="semibold">
          <Box as={Logo} fill="current" h="7" />
          <Link as={GatsbyLink} to="/">
            Apollo Docs
          </Link>
        </HStack>
        <IconButton
          size="sm"
          isRound
          fontSize="lg"
          onClick={toggleColorMode}
          icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
        />
      </Flex>
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
