import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiGithub} from 'react-icons/fi';

const EditOnGitHub = term => {
  const url = `https://github.com/apollographql/dxe/blob/main/packages/apollopedia/terms/${term.term}.md`;

  return (
    <Button
      aria-label="Edit on GitHub"
      my="4"
      colorScheme="indigo"
      // _dark={{
      //   color: 'indigo.200'
      // }}
      variant="ghost"
      leftIcon={<FiGithub />}
      as="a"
      href={url}
    >
      Edit on GitHub
    </Button>
  );
};

export default EditOnGitHub;
