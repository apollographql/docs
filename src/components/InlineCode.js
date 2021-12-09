import React from 'react';
import {chakra, useColorModeValue} from '@chakra-ui/react';

export default function InlineCode(props) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('pink.600', 'pink.300');
  return (
    <chakra.code
      fontFamily="mono"
      fontSize="calc(1em / 1.125)"
      px="1"
      py="0.5"
      rounded="sm"
      color={textColor}
      bgColor={bgColor}
      {...props}
    />
  );
}
