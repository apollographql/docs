import React from 'react';
import {ArrowRightIcon} from '../Icons';
import {Button} from '@chakra-ui/react';
import {useUser} from '../../utils';

export default function StudioButton() {
  const {user} = useUser();
  return (
    <Button
      flexShrink={0}
      colorScheme="navy"
      _dark={{
        color: 'silver.300'
      }}
      variant="ghost"
      rightIcon={<ArrowRightIcon />}
      as="a"
      ml="2"
      href={`https://studio.apollographql.com${
        user ? '' : '/signup'
      }?referrer=docs`}
      target="_blank"
      rel="noopener noreferrer"
      d={{base: 'none', lg: 'flex'}}
      onClick={() => {
        window.gtag?.('event', 'studio_button_click', {
          value: user ? 1 : 0
        });
      }}
    >
      Launch GraphOS Studio
    </Button>
  );
}
