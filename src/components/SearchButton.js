import React from 'react';
import {Box, Flex, useColorModeValue} from '@chakra-ui/react';
import {FiSearch} from 'react-icons/fi';

export default function SearchButton() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.400', 'gray.500');
  return (
    <Flex
      borderWidth="1px"
      h="10"
      px="3"
      lineHeight="none"
      align="center"
      maxW="sm"
      w="full"
      as="button"
      rounded="lg"
      bg={bgColor}
      _focus={{shadow: 'outline'}}
    >
      <FiSearch />
      <Box ml="2" color={textColor}>
        Search Apollo (Press /)
      </Box>
    </Flex>
  );
}
