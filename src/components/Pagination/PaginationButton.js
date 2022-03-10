import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {Box, Button} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {PathContext, getFullPath} from '../../utils';

export default function PaginationButton({item, label, ...props}) {
  const {basePath} = useContext(PathContext);
  return (
    <Button
      h="auto"
      py="2"
      variant="ghost"
      as={GatsbyLink}
      to={getFullPath(item.path, basePath)}
      {...props}
    >
      <div>
        <Box
          textTransform="uppercase"
          letterSpacing="wider"
          fontWeight="normal"
          fontSize="xs"
        >
          {label}
        </Box>
        <Box fontSize="lg">{item.title}</Box>
      </div>
    </Button>
  );
}

PaginationButton.propTypes = {
  item: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};
