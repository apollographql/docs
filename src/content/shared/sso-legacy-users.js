import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../../components/RelativeLink';
import {Box, Text} from '@chakra-ui/react';
import {Caution} from '../../components/Caution';

export const SSOLegacyUsers = ({idp, appType}) => {
  const anchor = idp
    ? `#assign-users-in-${idp.toLowerCase()}`
    : '#assign-users';
  return (
    <Box>
      <Text mb={4}>
        In the setup wizard, click the <strong>Enable SSO</strong> button to
        finalize setup.
      </Text>

      <Caution>
        Enabling SSO ends all active login sessions and removes non-SSO users
        from your organization. Personal API keys associated with non-SSO users
        will be lost. You must{' '}
        <RelativeLink href={anchor}>assign users</RelativeLink> to your{' '}
        {appType} in {idp} to give them access. Additionally, you must reassign
        any{' '}
        <RelativeLink href="/graphos/org/members/#organization-wide-member-roles">
          GraphOS roles
        </RelativeLink>{' '}
        associated with their previous GraphOS user.
      </Caution>
      <br />
      <Text mb={4}>
        If team members could previously login before you implemented SSO, they
        must re-login to GraphOS Studio via SSO. Signing in creates a new user
        profile for them.
      </Text>

      <Text>
        Once you've confirmed the new configuration works as expected, remove
        any legacy Apollo applications in {idp} if you have them.
      </Text>
    </Box>
  );
};

SSOLegacyUsers.propTypes = {
  idp: PropTypes.string.isRequired,
  appType: PropTypes.string.isRequired
};
