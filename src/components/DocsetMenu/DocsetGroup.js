import PropTypes from 'prop-types';
import React from 'react';
import {Heading, Wrap, WrapItem} from '@chakra-ui/react';

export default function DocsetGroup({title, children}) {
  return (
    <div>
      <Heading mb="2" size="sm">
        {title}
      </Heading>
      <Wrap>
        {React.Children.map(children, (child, index) => (
          <WrapItem key={index}>{child}</WrapItem>
        ))}
      </Wrap>
    </div>
  );
}

DocsetGroup.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};
