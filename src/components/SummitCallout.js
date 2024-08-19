import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from './RelativeLink';
import {Box, Flex, Icon, Text} from '@chakra-ui/react';
import {SummitIcon} from './Icons';

export const SummitCallout = ({
  topic,
  workshopName,
  panelName,
  URL,
  ...props
}) => {
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
      <Flex align="center">
        <Icon as={SummitIcon} mr={1} />
        <Text>
          <strong>Want to learn about {topic} in-person?</strong>
        </Text>
      </Flex>
      <Text>
        Don't miss the{' '}
        <RelativeLink
          href={
            URL +
            '?utm_campaign=docs_content_callouts&utm_medium=website&utm_source=docs'
          }
        >
          {workshopName ? workshopName : panelName}
        </RelativeLink>{' '}
        {workshopName ? 'workshop' : 'panel'} at this year's GraphQL Summit.
      </Text>
    </Box>
  );
};

SummitCallout.propTypes = {
  topic: PropTypes.string.isRequired,
  workshopName: PropTypes.string,
  panelName: PropTypes.string,
  URL: PropTypes.string.isRequired
};
