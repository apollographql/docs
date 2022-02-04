import PropTypes from 'prop-types';
import React from 'react';
import {chakra, useColorModeValue} from '@chakra-ui/react';

export default function InlineCode({colorScheme = 'pink', ...props}) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.300`
  );
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

InlineCode.propTypes = {
  colorScheme: PropTypes.string
};
