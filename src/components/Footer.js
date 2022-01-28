import React from 'react';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {Box, Heading, Link, SimpleGrid, Text} from '@chakra-ui/react';

export default function Footer() {
  return (
    <SimpleGrid as="footer" columns="4" borderTopWidth="1px" px="10" py="12">
      <div>
        <Box mb="2" as={ApolloLogo} fill="current" h="8" />
        <Text>&copy; Apollo Graph Inc.</Text>
      </div>
      <div>
        <Heading mb="2" size="md">
          Resources
        </Heading>
        <Link isExternal href="https://odyssey.apollographql.com">
          GraphQL Tutorials
        </Link>
      </div>
    </SimpleGrid>
  );
}
