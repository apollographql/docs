import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import path from 'path';
import {Button, Tooltip} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {PathContext} from '../../utils';

export default function DocsetButton({to, tooltipLabel, ...props}) {
  const {basePath} = useContext(PathContext);
  const [docsetPath] = basePath.split(path.sep);

  const linkProps = to.startsWith('/')
    ? {
        as: GatsbyLink,
        to
      }
    : {
        as: 'a',
        href: to,
        target: '_blank'
      };

  return (
    <Tooltip hasArrow label={tooltipLabel} placement="bottom">
      <Button
        {...linkProps}
        colorScheme={path.join('/', docsetPath) === to ? 'indigo' : 'gray'}
        {...props}
      />
    </Tooltip>
  );
}

DocsetButton.propTypes = {
  to: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.string.isRequired
};
