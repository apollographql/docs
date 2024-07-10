import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../../components/RelativeLink';
import {Box, Text} from '@chakra-ui/react';
import {Caution} from '../../components/Caution';

export const SSOLegacyUsers = ({idp, appType}) => {
  const anchor = `#assign-users-in-${idp.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Box>
      <Text mb={4}>
        In the setup wizard, click the <strong>Enable SSO</strong> button to
        finalize setup.
      </Text>

      <Caution>
        Enabling SSO ends all active login sessions and removes non-SSO users
        from your GraphOS organization. To give them access again, you must{' '}
        {anchor ? (
          <RelativeLink href={anchor}>assign them</RelativeLink>
        ) : (
          'assign users'
        )}{' '}
        to your {appType} in {idp}. Enabling SSO also removes personal API keys
        associated with non-SSO users.
      </Caution>

      <Text mt={4}>
        If team members could previously login before you implemented SSO, they
        must re-login to GraphOS Studio via SSO. Signing in creates a new user
        profile for them. You must reassign any{' '}
        <RelativeLink href="/graphos/org/members/#organization-wide-member-roles">
          GraphOS roles
        </RelativeLink>{' '}
        previously associated with non-SSO users.
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
