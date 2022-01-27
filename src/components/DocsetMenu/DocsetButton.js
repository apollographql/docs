import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import path from 'path';
import {Button} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {PathContext} from '../../utils';

export default function DocsetButton({to, ...props}) {
  const {basePath} = useContext(PathContext);
  const [docsetPath] = basePath.split(path.sep);
  return (
    <Button
      as={GatsbyLink}
      to={to}
      colorScheme={path.join('/', docsetPath) === to ? 'indigo' : 'gray'}
      {...props}
    />
  );
}

DocsetButton.propTypes = {
  to: PropTypes.string.isRequired
};
