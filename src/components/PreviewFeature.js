import PropTypes from 'prop-types';
import React from 'react';
import {Box, Link} from '@chakra-ui/react';

export const PreviewFeature = ({discordLink}) => {
  return (
    <Box
      pl="4"
      py="1"
      borderLeftWidth="2px"
      borderColor="primary"
      fontSize="md"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }}
    >
      This feature is currently in{' '}
      <Link
        color={'primary'}
        href="https://www.apollographql.com/docs/resources/product-launch-stages#preview"
      >
        preview
      </Link>
      . Your questions and feedback are highly valued{'—'}don&apos;t hesitate to
      get in touch with your Apollo contact or on the official
      <Link color={'primary'} href={discordLink}>
        {' '}
        Apollo GraphQL Discord
      </Link>
      .
    </Box>
  );
};

PreviewFeature.propTypes = {
  discordLink: PropTypes.node.isRequired
};
