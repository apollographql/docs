import React from 'react';
import {Box} from '@chakra-ui/react';
import {FiSearch} from 'react-icons/fi';

export default function SearchButton(props) {
  return (
    <Box
      d={{base: 'none', sm: 'flex'}}
      alignItems="center"
      borderWidth="1px"
      h="10"
      px="3"
      lineHeight="none"
      w="full"
      as="button"
      rounded="md"
      bg="gray.50"
      _dark={{
        bg: 'black.200'
      }}
      _focus={{
        outline: 'none',
        shadow: 'outline'
      }}
      {...props}
    >
      <FiSearch />
      <Box
        ml="2"
        color="gray.500"
        _dark={{
          color: 'gray.500'
        }}
      >
        Search Apollo (Cmd+K or /)
      </Box>
    </Box>
  );
}
