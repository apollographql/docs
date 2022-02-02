import PropTypes from 'prop-types';
import React from 'react';
import {Markup} from 'interweave';
import {chakra, useColorModeValue} from '@chakra-ui/react';

export default function Highlight({value}) {
  const markColor = useColorModeValue('indigo.500', 'inherit');
  return (
    <Markup
      content={value}
      allowList={['mark']}
      transform={(node, children) => {
        if (node.tagName === 'MARK') {
          return (
            <chakra.mark
              bg="none"
              color={markColor}
              fontWeight="semibold"
              textDecoration="underline"
            >
              {children}
            </chakra.mark>
          );
        }
      }}
    />
  );
}

Highlight.propTypes = {
  value: PropTypes.string.isRequired
};
