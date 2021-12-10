import React from 'react';
import {Box, Flex, Kbd, useColorModeValue} from '@chakra-ui/react';
import {FiSearch} from 'react-icons/fi';

export default function SearchButton() {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.400', 'gray.500');
  return (
    <Flex
      borderColor={borderColor}
      borderWidth="1px"
      p="2"
      lineHeight="none"
      align="center"
      w="full"
      as="button"
      rounded="lg"
      shadow="md"
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
