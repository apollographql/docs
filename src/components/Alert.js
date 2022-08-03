import PropTypes from 'prop-types';
import React from 'react';
import {Box, useColorModeValue} from '@chakra-ui/react';

export const Alert = ({children}) => {
  const bgColor = useColorModeValue('yellow.200', 'yellow.600');

  return (
    <Box
      textAlign="center"
      py="3"
      px="4"
      bgColor={bgColor}
      style={{borderRadius: 4}}
    >
      {children}
    </Box>
  );
};

Alert.propTypes = {
  children: PropTypes.node
};
