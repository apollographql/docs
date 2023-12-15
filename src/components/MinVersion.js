import PropTypes from 'prop-types';
import React from 'react';
import {Flex} from '@chakra-ui/react';

export const MinVersion = ({version, children}) => {
  return (
    <Flex align="center">
      {React.cloneElement(children, {minVersion: version})}
    </Flex>
  );
};

MinVersion.propTypes = {
  version: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};
