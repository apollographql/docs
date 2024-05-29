import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../../components/RelativeLink';
import {Box, Text} from '@chakra-ui/react';
import {Caution} from '../../components/Caution';

export const SSOLegacyUsers = ({idp, appType}) => {
  const anchor =
    idp !== 'your IdP' ? `#assign-users-in-${idp.toLowerCase()}` : undefined;
  return (
    <Box>
      <Text mb={4}>
        In the setup wizard, click the <strong>Enable SSO</strong> button to
        finalize setup.
      </Text>

      <Caution>
        Enabling SSO ends all active login sessions and removes non-SSO users
        from your GraphOS organization. You must{' '}
        {anchor ? (
          <RelativeLink href={anchor}>assign users</RelativeLink>
        ) : (
          'assign users'
        )}{' '}
        to your {appType} in {idp} to give them access.
      </Caution>
      <br />
      <Text mb={4}>
        If team members could previously login before you implemented SSO, they
        must re-login to GraphOS Studio via SSO. Signing in creates a new user
        profile for them. Personal API keys associated with non-SSO users will
        be lost. Additionally, you must reassign any{' '}
        <RelativeLink href="/graphos/org/members/#organization-wide-member-roles">
          GraphOS roles
        </RelativeLink>{' '}
        associated with non-SSO users.
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
