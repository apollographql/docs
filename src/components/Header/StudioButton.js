import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';

export default function StudioButton() {
  return (
    <Button
      flexShrink={0}
      color="indigo.600"
      _dark={{
        color: 'indigo.200'
      }}
      variant="ghost"
      rightIcon={<FiArrowRight />}
      as="a"
      ml="2"
      href="https://studio.apollographql.com?referrer=docs"
      target="_blank"
      rel="noopener noreferrer"
      d={{base: 'none', lg: 'flex'}}
    >
      Launch GraphOS Studio
    </Button>
  );
}
