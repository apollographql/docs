import PropTypes from 'prop-types';
import React from 'react';
import {
  BookIcon,
  DOCSET_ICONS,
  OdysseyIcon,
  RepositoryIcon,
  TechnotesIcon
} from '../Icons';

export default function ResultIcon({result}) {
  let {type} = result;
  const {docset} = result;
  if (type === undefined && result.term !== undefined) {
    type = 'apollopedia';
  }
  console.log(type, docset);

  switch (type) {
    case 'docs':
      if (docset in DOCSET_ICONS) {
        return DOCSET_ICONS[docset];
      }
      break;
    case 'apollopedia':
      return <RepositoryIcon />;
    case 'blog':
      return <BookIcon />;
    case 'odyssey':
      return <OdysseyIcon />;
    default:
      return <TechnotesIcon />;
  }

  return DOCSET_ICONS.default;
}

ResultIcon.propTypes = {
  result: PropTypes.object.isRequired
};
