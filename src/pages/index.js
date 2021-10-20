import Layout from '../components/Layout';
import React from 'react';
import {Box, Button, Heading, useColorModeValue} from '@chakra-ui/react';
import {Link as GastbyLink} from 'gatsby';

export default function HomePage() {
  const heroBg = useColorModeValue('indigo.200', 'indigo.500');
  return (
    <Layout>
      <Box py="16" px="10" bg={heroBg}>
        <Heading mb="2" size="3xl">
          Welcome to Apollo Docs
        </Heading>
        <Heading fontWeight="semibold">Explore the Apollo platform</Heading>
      </Box>
      <Box px="10" py="12">
        docs home page
        <Button as={GastbyLink} to="/apollo-server">
          Apollo Server
        </Button>
      </Box>
    </Layout>
  );
}
