import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@chakra-ui/react';
import {HighlightKeyTerms} from '@apollo/pedia';

export const SummitCallout = ({topic, children, ...props}) => {
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="4px"
      borderColor="purple.300"
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
      🧑‍🏫 <strong>Want to learn about {topic} in-person?</strong>
      </Text>
      <HighlightKeyTerms>{children}</HighlightKeyTerms>
    </Box>
  );
};

SummitCallout.propTypes = {
  children: PropTypes.node.isRequired,
  topic: PropTypes.string.isRequired
};
