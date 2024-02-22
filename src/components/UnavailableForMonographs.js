import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@chakra-ui/react';
import {HighlightKeyTerms} from '@apollo/pedia';
import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';

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
      <MarkdownInAdmonitions>
        {children
          ? {children}
          : `${capitalize(
              featureName
            )} are designed for use with supergraphs and aren't available for monographs.
            Convert your monograph to a supergraph using the Rover CLI [\`subgraph publish\` command](https://www.apollographql.com/docs/rover/commands/subgraphs/#subgraph-publish) with the [\`--convert\` flag](https://www.apollographql.com/docs/rover/commands/subgraphs/#--convert).`}
      </MarkdownInAdmonitions>
    </Box>
  );
};

UnavailableForMonographs.propTypes = {
  featureName: PropTypes.string,
  children: PropTypes.node
};
