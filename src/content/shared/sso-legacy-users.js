import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../../components/RelativeLink';
import {Box, Text} from '@chakra-ui/react';

export const SSOLegacyUsers = ({idp="your IdP", appType}) => {
  const anchor = `#assign-users-in-${idp.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Box>
      <Text mb={4}>
        In the setup wizard, click the <strong>Complete</strong> button to
        finalize setup.
      </Text>
      <Text mb={4}>
        Once you click <strong>Complete</strong>, all users will be logged out of your organization,
        and will need to sign in again from <RelativeLink href="https://studio.apollographql.com/login">https://studio.apollographql.com/login</RelativeLink> using SSO. To give them access,
        ensure you've{' '}
        {anchor ? (
          <RelativeLink href={anchor}>assigned them</RelativeLink>
        ) : (
          'assign users'
        )}{' '}
        to your new {appType} in {idp}.
        </Text>
      <Text mt={4}>
        Once you&apos;ve confirmed the new configuration works as expected,
        remove any legacy Apollo applications in {idp} if you have them.
      </Text>
    </Box>
  );
};

SSOLegacyUsers.propTypes = {
  idp: PropTypes.string.isRequired,
  appType: PropTypes.string.isRequired
};
