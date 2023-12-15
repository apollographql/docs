import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';

export const Alert = ({children}) => {
  return (
    <Box
      textAlign="center"
      py="3"
      px="4"
      bgColor="yellow.200"
      _dark={{
        bgColor: 'yellow.600'
      }}
      style={{borderRadius: 4}}
    >
      {children}
    </Box>
  );
};

Alert.propTypes = {
  children: PropTypes.node
};
