import PropTypes from 'prop-types';
import React from 'react';
import {SimpleGrid} from '@chakra-ui/react';

export default function CodeColumns({cols = 2, children}) {
  return (
    <SimpleGrid columns={cols} spacing="4">
      {children}
    </SimpleGrid>
  );
}

CodeColumns.propTypes = {
  cols: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node.isRequired
};
