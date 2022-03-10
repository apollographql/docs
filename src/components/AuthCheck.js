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
    return <div>access denied</div>;
  }

  console.log(data.me);
  return children;
}

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired
};
