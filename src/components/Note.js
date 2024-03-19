import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@chakra-ui/react';
import {HighlightKeyTerms} from '@apollo/pedia';

export const Note = ({children, ...props}) => {
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="4px"
      borderColor="gray.400"
      sx={{
        '>': {
          ':not(a):not(:last-child)': {
            mb: 2
          }
        }
      }}
      {...props}
    >
      <Text>
        &#9432; <strong>NOTE</strong>
      </Text>
      <HighlightKeyTerms>{children}</HighlightKeyTerms>
    </Box>
  );
};

Note.propTypes = {
  children: PropTypes.node.isRequired
};
