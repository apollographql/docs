import PropTypes from 'prop-types';
import React from 'react';
import {ButtonGroup, Heading} from '@chakra-ui/react';

export default function DocsetGroup({title, children}) {
  return (
    <div>
      <Heading mb="2" size="sm">
        {title}
      </Heading>
      <ButtonGroup>{children}</ButtonGroup>
    </div>
  );
}

DocsetGroup.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};
