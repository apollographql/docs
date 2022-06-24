import NotFound from '../pages/404';
import PropTypes from 'prop-types';
import React from 'react';
import {Center, Spinner} from '@chakra-ui/react';
import {gql, useQuery} from '@apollo/client';

const GET_MEMBERSHIPS = gql`
  query GetMemberships {
    me {
      id
      ... on User {
        memberships {
          account {
            id
            name
            currentPlan {
              tier
            }
          }
        }
      }
    }
  }
`;

const APOLLO_ORGS = ['gh.apollographql', 'apollo-private', 'apollo'];

export default function AuthCheck({children}) {
  const {data, loading, error} = useQuery(GET_MEMBERSHIPS);

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

  if (!data) {
    return null;
  }

  const hasAccess = data.me?.memberships.some(membership =>
    APOLLO_ORGS.includes(membership.account.id)
  );

  if (!hasAccess) {
    // TODO: more granular message like "access denied" or "please log in"
    return <NotFound />;
  }

  return children;
}

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired
};
