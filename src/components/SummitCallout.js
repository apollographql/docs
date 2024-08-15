import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@chakra-ui/react';
import {PrimaryLink} from './RelativeLink'

export const SummitCallout = ({topic, workshopName, URL, ...props}) => {
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
      👥 <strong>Want to learn about {topic} in-person?</strong>
      </Text>
      <Text>Don't miss out on the <PrimaryLink href={URL}>{workshopName}</PrimaryLink> workshop at this year's GraphQL Summit.</Text>
    </Box>
  );
};

SummitCallout.propTypes = {
  topic: PropTypes.string.isRequired,
  workshopName: PropTypes.string.isRequired,
  URL: PropTypes.string.isRequired
};
