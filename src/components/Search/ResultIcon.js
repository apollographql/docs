import PropTypes from 'prop-types';
import React from 'react';
import {BsBook} from 'react-icons/bs';
import {DOCSET_ICONS} from '../DocsetMenu';
import {VscMortarBoard} from 'react-icons/vsc';

export default function ResultIcon({result}) {
  const {type, docset} = result;

  switch (type) {
    case 'docs':
      if (docset in DOCSET_ICONS) {
        return DOCSET_ICONS[docset];
      }
      break;
    case 'blog':
      return <BsBook />;
    case 'odyssey':
      return <VscMortarBoard />;
    default:
  }

  return DOCSET_ICONS.apollo;
}

ResultIcon.propTypes = {
  result: PropTypes.object.isRequired
};
