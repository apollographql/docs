import NotFound from '../pages/404';
import PropTypes from 'prop-types';
import React from 'react';
import {Center, Spinner} from '@chakra-ui/react';
import {useUser} from '../utils';
export default function AuthCheck({
  children,
  // TODO: more granular message like "access denied" or "please log in"
  fallback = <NotFound />
}) {
  const {loading, isInternal} = useUser();

   if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  return isInternal ? children : fallback;
}

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};