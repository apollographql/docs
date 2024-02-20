import NotFound from '../pages/404';
import PropTypes from 'prop-types';
import React from 'react';
import {Center, Spinner} from '@chakra-ui/react';
import {hasMembership, useMemberships} from '../utils';
export default function AuthCheck({
  children,
  // TODO: more granular message like "access denied" or "please log in"
  fallback = <NotFound />
}) {
  const {memberships, loading, error} = useMemberships();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!memberships) {
    return null;
  }

  const hasAccess = hasMembership(memberships);

  if (!hasAccess) {
    return fallback;
  }

  return children;
}

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};
