import React from 'react';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {Heading} from '@chakra-ui/react';

export default function NotFound() {
  return (
    <>
      <GatsbySeo title="Not found" />
      <Heading>Page not found</Heading>
    </>
  );
}
