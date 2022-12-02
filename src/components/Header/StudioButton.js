import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {useUser} from '../../utils';

export default function StudioButton() {
  const {user} = useUser();
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
      {user ? 'Launch' : 'Try'} Apollo Studio
    </Button>
  );
}
