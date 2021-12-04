import PropTypes from 'prop-types';
import React from 'react';

export default function MultiCodeBlock({children}) {
  console.log(children);
  return <div>{children}</div>;
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
