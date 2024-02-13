
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@chakra-ui/react';
import { HighlightKeyTerms } from '@apollo/pedia';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export const UnavailableForMonographs = ({
  featureName = 'this feature',
  children
}) => {
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="4px"
      borderColor="gray.400"
      fontSize="lg"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }}
    >
      <Text>
        &#9432; <strong>NOTE</strong>
      </Text>
      <HighlightKeyTerms>
        {
        children ? {children} :     
        `${capitalize(featureName)} are designed for use with supergraphs and aren't available for monographs. Convert your monograph to a supergraph to use ${featureName.toLowerCase()}.`}
      </HighlightKeyTerms>
    </Box>
  );
};

UnavailableForMonographs.propTypes = {
  featureName: PropTypes.string,
  children: PropTypes.node
};