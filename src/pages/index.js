import React from 'react';
import {Button} from '@chakra-ui/react';
import {Link as GastbyLink} from 'gatsby';

export default function HomePage() {
  return (
    <div>
      docs home page
      <Button as={GastbyLink} to="/apollo-server">
        Apollo Server
      </Button>
    </div>
  );
}
