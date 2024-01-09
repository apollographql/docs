import React from 'react';
import {chakra} from '@chakra-ui/react';

export default function InlineCode(props) {
  return (
    <chakra.code
      fontFamily="mono"
      fontSize="calc(1em / 1.125)"
      px="1"
      py="0.5"
      rounded="sm"
      color="blue.400"
      bgColor="silver.400"
      _dark={{
        color: 'indigo.100',
        bgColor: 'black.200'
      }}
      {...props}
    />
  );
}
