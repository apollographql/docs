import Layout from '../components/Layout';
import React from 'react';
import {Box, Button, Heading} from '@chakra-ui/react';
import {Link as GastbyLink} from 'gatsby';

export default function HomePage() {
  return (
    <Layout>
      <Box py="16" px="10">
        <Heading size="3xl">Welcome to Apollo</Heading>
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
