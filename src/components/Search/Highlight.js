import PropTypes from 'prop-types';
import React from 'react';
import {Markup} from 'interweave';
import {chakra} from '@chakra-ui/react';

export default function Highlight({value}) {
  return (
    <Markup
      content={value}
      allowList={['mark']}
      transformOnlyAllowList
      transform={(node, children) => {
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
      }}
    />
  );
}

Highlight.propTypes = {
  value: PropTypes.string.isRequired
};
