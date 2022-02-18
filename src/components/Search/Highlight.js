import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Markup} from 'interweave';
import {chakra, useColorModeValue} from '@chakra-ui/react';

export default function Highlight({value}) {
  const markColor = useColorModeValue('indigo.500', 'inherit');

  const transform = useCallback(
    (node, children) => {
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
    },
    [markColor]
  );

  return (
    <Markup
      content={value}
      allowList={['mark']}
      transformOnlyAllowList
      transform={transform}
    />
  );
}

Highlight.propTypes = {
  value: PropTypes.string.isRequired
};
