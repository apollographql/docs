import PropTypes from 'prop-types';
import React from 'react';
import {Box, Heading, Tag} from '@chakra-ui/react';

export const CustomHeading = ({children, minVersion, ...props}) => {
  return (
    <Heading {...props}>
      <span>{children}</span>
      {minVersion && (
        <Box display="inline-block" transform="translateY(50%)" ml="2">
          <Tag transform="translateY(-50%)">Since {minVersion}</Tag>
        </Box>
      )}
    </Heading>
  );
};

CustomHeading.propTypes = {
  children: PropTypes.node.isRequired,
  minVersion: PropTypes.string
};
