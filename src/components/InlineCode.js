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
      color="rgb(63, 32, 186)"
      bgColor="rgb(252, 253, 255)"
      _dark={{
        color: 'rgb(173, 155, 246)',
        bgColor: 'rgb(6, 15, 47)'
      }}
      {...props}
    />
  );
}
