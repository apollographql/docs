import React from 'react';
import {GitHubIcon} from '../Icons';
import {PrimaryLink} from '../RelativeLink';

const EditOnGitHub = term => {
  const url = `https://github.com/apollographql/dxe/blob/main/packages/apollopedia/terms/${term.term}.md`;

  return (
    <PrimaryLink
      aria-label="Edit on GitHub"
      my="4"
      as="a"
      href={url}
      style={{display: 'flex', alignItems: 'center'}}
    >
      <GitHubIcon style={{marginRight: '0.5rem'}} /> Edit on GitHub
    </PrimaryLink>
  );
};

export default EditOnGitHub;
