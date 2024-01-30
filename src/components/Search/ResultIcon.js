import PropTypes from 'prop-types';
import React from 'react';
import {BookIcon, DOCSET_ICONS, OdysseyIcon} from '../Icons';

export default function ResultIcon({result}) {
  const {type, docset} = result;

  switch (type) {
    case 'docs':
      if (docset in DOCSET_ICONS) {
        return DOCSET_ICONS[docset];
      }
      break;
    case 'blog':
      return <BookIcon />;
    case 'odyssey':
      return <OdysseyIcon />;
    default:
  }

  return DOCSET_ICONS.default;
}

ResultIcon.propTypes = {
  result: PropTypes.object.isRequired
};
