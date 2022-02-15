import React from 'react';
import {Box} from '@chakra-ui/react';
import {useAccentColor} from '../utils';

export default function Blockquote(props) {
  const borderColor = useAccentColor();
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="2px"
      borderColor={borderColor}
      fontSize="md"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }}
      {...props}
    />
  );
}
