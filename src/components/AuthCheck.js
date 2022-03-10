import PropTypes from 'prop-types';
import React from 'react';
import {Center, Spinner} from '@chakra-ui/react';
import {gql, useQuery} from '@apollo/client';

const GET_USER = gql`
  query GetUser {
    me {
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
  const {data, loading, error} = useQuery(GET_USER);

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

  if (!data.me) {
    return <div>log in to your apollo account</div>;
  }

  const hasAccess = data.me.memberships.some(membership =>
    APOLLO_ORGS.includes(membership.account.id)
  );

  if (!hasAccess) {
    return <div>access denied</div>;
  }

  return children;
}

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired
};
