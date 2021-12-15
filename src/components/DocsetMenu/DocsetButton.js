import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {Button} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {NavContext} from '../../utils';

export default function DocsetButton({to, ...props}) {
  const {uri} = useContext(NavContext);
  return (
    <Button
      as={GatsbyLink}
      to={to}
      colorScheme={uri === to ? 'indigo' : 'gray'}
      {...props}
    />
  );
}

DocsetButton.propTypes = {
  to: PropTypes.string.isRequired
};
