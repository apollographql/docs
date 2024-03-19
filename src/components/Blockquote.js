import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';
import {HighlightKeyTerms} from '@apollo/pedia';

export default function Blockquote({children, ...props}) {
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="2px"
      borderColor="primary"
      sx={{
        '>': {
          ':not(a):not(:last-child)': {
            mb: 2
          }
        }
      }}
      {...props}
    >
      <HighlightKeyTerms>{children}</HighlightKeyTerms>
    </Box>
  );
}

Blockquote.propTypes = {
  children: PropTypes.node.isRequired
};
