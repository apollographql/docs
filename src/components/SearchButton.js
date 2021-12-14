import React from 'react';
import {Box, Flex, Kbd, useColorModeValue} from '@chakra-ui/react';
import {FiSearch} from 'react-icons/fi';

export default function SearchButton() {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.400', 'gray.500');
  return (
    <Flex
      borderWidth="1px"
      p="1.5"
      lineHeight="none"
      align="center"
      w="full"
      as="button"
      rounded="lg"
      bg={bgColor}
      _focus={{shadow: 'outline'}}
    >
      <FiSearch />
      <Box ml="2" color={textColor}>
        Search Apollo
      </Box>
      <Kbd ml="auto">/</Kbd>
    </Flex>
  );
}
