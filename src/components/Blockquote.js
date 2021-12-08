import React from 'react';
import {Box, useColorModeValue} from '@chakra-ui/react';

export default function Blockquote(props) {
  const borderColor = useColorModeValue('indigo.500', 'indigo.200');
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="2px"
      borderColor={borderColor}
      fontSize="md"
      {...props}
    />
  );
}
