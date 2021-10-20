import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

export default function Wrapper({children}) {
  return (
    <Box
      fontSize="lg"
      sx={{
        '>*:not(style)~*:not(style)': {
          mt: 6
        }
      }}
    >
      {children}
    </Box>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};
