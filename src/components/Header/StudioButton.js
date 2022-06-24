import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {gql, useQuery} from '@apollo/client';

const GET_USER = gql`
  query GetUser {
    me {
      id
      name
    }
  }
`;

export default function StudioButton() {
  const {data} = useQuery(GET_USER);
  return (
    <Button
      ml="2"
      colorScheme="indigo"
      variant="ghost"
      rightIcon={<FiArrowRight />}
      as="a"
      href="https://studio.apollographql.com?referrer=docs"
      target="_blank"
      rel="noopener noreferrer"
      d={{base: 'none', lg: 'flex'}}
    >
      {data?.me ? 'Launch' : 'Try'} Apollo Studio
    </Button>
  );
}
