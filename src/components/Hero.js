import React from 'react';
import {Box, Heading, useColorModeValue} from '@chakra-ui/react';

export default function HomePage() {
  const heroBg = useColorModeValue('indigo.200', 'indigo.600');
  return (
    <Box py="16" px="10" bg={heroBg}>
      <Heading mb="2" size="3xl">
        Welcome to Apollo Docs
      </Heading>
      <Heading fontWeight="semibold">Explore the Apollo platform</Heading>
    </Box>
  );
}
