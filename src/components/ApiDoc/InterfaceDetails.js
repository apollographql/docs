import PropTypes from 'prop-types';
import React from 'react';
import {ApiDocHeading, DocBlock, PropertySignatureTable} from '.';
export function InterfaceDetails({canonicalReference}) {
  return (
    <>
      <ApiDocHeading canonicalReference={canonicalReference} headingLevel={3} />
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
  canonicalReference: PropTypes.string.isRequired
};
