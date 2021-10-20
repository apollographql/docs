import Layout from '../components/Layout';
import React from 'react';
import {Box, Button} from '@chakra-ui/react';
import {Link as GastbyLink} from 'gatsby';

export default function HomePage() {
  return (
    <Layout>
      <Box px="10" py="12">
        docs home page
        <Button as={GastbyLink} to="/apollo-server">
          Apollo Server
        </Button>
      </Box>
    </Layout>
  );
}
