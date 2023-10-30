import PropTypes from 'prop-types';
import React from 'react';
import {ApiDocHeading, DocBlock, PropertySignatureTable} from '.';
export function InterfaceDetails({canonicalReference, headingLevel, link}) {
  return (
    <>
      <ApiDocHeading
        canonicalReference={canonicalReference}
        headingLevel={headingLevel}
        link={link}
      />
      <DocBlock
        canonicalReference={canonicalReference}
        heading
        headingLevel={3}
      />
      <PropertySignatureTable
        canonicalReference={canonicalReference}
        methods
        properties
      />
    </>
  );
}

InterfaceDetails.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  headingLevel: PropTypes.number,
  link: PropTypes.bool
};
