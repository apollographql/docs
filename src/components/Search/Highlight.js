import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Markup} from 'interweave';
import {chakra} from '@chakra-ui/react';

export default function Highlight({value}) {
  const transform = useCallback((node, children) => {
    if (node.tagName === 'MARK') {
      return (
        <chakra.mark
          bg="none"
          color="indigo.500"
          _dark={{
            color: 'inherit'
          }}
          fontWeight="semibold"
          textDecoration="underline"
        >
          {children}
        </chakra.mark>
      );
    }
  }, []);

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
