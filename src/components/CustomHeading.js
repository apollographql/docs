import PropTypes from 'prop-types';
import React from 'react';
import {Box, Heading} from '@chakra-ui/react';

const HEADING_SIZES = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm'
};

export default function CustomHeading({depth, ...props}) {
  return (
    <Box pt="10">
      <Heading as={'h' + depth} size={HEADING_SIZES[depth]} {...props} />
    </Box>
  );
}

CustomHeading.propTypes = {
  id: PropTypes.string,
  depth: PropTypes.number.isRequired
};
