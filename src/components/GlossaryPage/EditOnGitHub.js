import React from 'react';
import {Button, Text} from '@chakra-ui/react';
import {FiGithub} from 'react-icons/fi';

const EditOnGitHub = term => {
  console.log(term.term);
  const url = `https://github.com/apollographql/dxe/blob/main/packages/apollopedia/terms/${term.term}.md`;

  return (
    <Button
      aria-label="Edit on GitHub"
      as="a"
      href={url}
      variant="link"
      _dark={{
        color: 'gray.200'
      }}
      size="lg"
      leftIcon={<FiGithub />}
    >
      <Text as="span" display={{base: 'none', lg: 'inline'}}>
        Edit on GitHub
      </Text>
      <Text as="span" display={{base: 'inline', lg: 'none'}}>
        Edit
      </Text>
    </Button>
  );
};

export default EditOnGitHub;
