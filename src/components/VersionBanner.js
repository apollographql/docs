import PropTypes from 'prop-types';
import React from 'react';
import {Box, Link, useColorModeValue} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';

export default function VersionBanner({to}) {
  const [bgColor, textColor] = useColorModeValue(
    ['yellow.100', 'yellow.900'],
    ['yellow.700', 'yellow.50']
  );
  return (
    <Box
      textAlign="center"
      w="full"
      py="4"
      px="8"
      bgColor={bgColor}
      color={textColor}
    >
      You&apos;re viewing documentation for a previous version of this software.{' '}
      <Link as={GatsbyLink} to={to} fontWeight="semibold">
        Switch to the latest stable version
      </Link>
    </Box>
  );
}

VersionBanner.propTypes = {
  to: PropTypes.string.isRequired
};
