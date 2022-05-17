import React from 'react';
import {Box, useColorModeValue} from '@chakra-ui/react';
import {FiSearch} from 'react-icons/fi';

export default function SearchButton(props) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.400', 'gray.500');
  return (
    <Box
      d={{base: 'none', sm: 'flex'}}
      alignItems="center"
      borderWidth="1px"
      h="10"
      px="3"
      lineHeight="none"
      maxW={{base: '2xs', xl: 'xs'}}
      w="full"
      as="button"
      rounded="md"
      bg={bgColor}
      _focus={{
        outline: 'none',
        shadow: 'outline'
      }}
      {...props}
    >
      <FiSearch />
      <Box ml="2" color={textColor}>
        Search Apollo (Cmd+K or /)
      </Box>
    </Box>
  );
}
