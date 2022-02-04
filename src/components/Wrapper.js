import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export default function Wrapper({children}) {
  return (
    <Box
      fontSize="lg"
      sx={{
        [HEADINGS]: {
          a: {
            color: 'inherit'
          },
          code: {
            bg: 'none',
            p: 0
          }
        },
        '>': {
          ':not(:last-child)': {
            mb: 6
          },
          [HEADINGS]: {
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
