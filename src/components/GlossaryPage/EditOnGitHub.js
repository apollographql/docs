import React from 'react';
import {ButtonLink} from '../RelativeLink';
import {GitHubIcon} from '../Icons';
import {Text} from '@chakra-ui/react';

const EditOnGitHub = term => {
  const url = `https://github.com/apollographql/dxe/blob/main/packages/apollopedia/terms/${term.term}.md`;

  return (
    <ButtonLink
      variant="link"
      color="tertiary"
      fontWeight="medium"
      fontSize="inherit"
      aria-label="Edit on GitHub"
      my="4"
      as="a"
      href={url}
    >
      <GitHubIcon /> <Text style={{marginLeft: '0.5rem'}}>Edit on GitHub</Text>
    </ButtonLink>
  );
};

export default EditOnGitHub;
