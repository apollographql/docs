import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

export default function Wrapper({children}) {
  return (
    <Box
      sx={{
        '>*:not(style)~*:not(style)': {
          mt: 5
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
