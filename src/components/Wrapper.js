import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

export default function Wrapper({children}) {
  return (
    <Box
      fontSize="lg"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 6
          },
          [['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]: {
            ':not(:last-child)': {
              mt: 10
            }
          }
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
