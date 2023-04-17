import React from 'react';
import {Button} from '@chakra-ui/react';
import {FaDiscord} from 'react-icons/fa';

export default function StudioButton() {
  return (
    <Button
      flexShrink={0}
      colorScheme="indigo"
      variant="ghost"
      as="a"
      ml="2"
      href="https://discord.gg/yFZJH2QYrK"
      target="_blank"
      rel="noopener noreferrer"
      d={{base: 'none', lg: 'flex'}}
    >
      <FaDiscord />
    </Button>
  );
}
