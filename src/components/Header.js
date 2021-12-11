import PropTypes from 'prop-types';
import React from 'react';
import SearchButton from './SearchButton';
import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Link,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import {FiChevronsLeft, FiMoon, FiSun} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as Logo} from '@apollo/space-kit/logos/mark.svg';

export default function Header({onToggleHidden}) {
  const {toggleColorMode, colorMode} = useColorMode();
  const paddingBottom = useToken('space', 4);
  const darkBg = useToken('colors', 'gray.800');
  const headerBg = useColorModeValue('white', darkBg);
  return (
    <Box pos="sticky" top="0" zIndex="1">
      <Box
        pl="4"
        pr="2"
        pt="2"
        pb={paddingBottom}
        bgImage={`linear-gradient(${[
          'to top',
          'transparent',
          `${headerBg} ${paddingBottom}`
        ]})`}
      >
        <Flex align="center" as="header" mb="2">
          <HStack mr="auto" fontWeight="semibold">
            <Box as={Logo} fill="current" h="7" />
            <Link as={GatsbyLink} to="/">
              Apollo Docs
            </Link>
          </HStack>
          <ButtonGroup spacing="1" mr="0.5" size="sm" variant="ghost">
            <Tooltip label="Hide sidebar">
              <IconButton
                isRound
                fontSize="lg"
                onClick={onToggleHidden}
                icon={<FiChevronsLeft />}
              />
            </Tooltip>
            <IconButton
              isRound
              fontSize="lg"
              onClick={toggleColorMode}
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
            />
          </ButtonGroup>
        </Flex>
        <SearchButton />
      </Box>
    </Box>
  );
}

Header.propTypes = {
  onToggleHidden: PropTypes.func.isRequired
};
