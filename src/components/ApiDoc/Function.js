import PropTypes from 'prop-types';
import React from 'react';
import {useApiDocContext} from '.';

export function FunctionSignature({canonicalReference}) {
  const {displayName, parameters, returnType} =
    useApiDocContext(canonicalReference);
  return (
    <>
      {displayName}(
      {parameters
        .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
        .join(', ')}
      ): {returnType}
    </>
  );
}

FunctionSignature.propTypes = {
  canonicalReference: PropTypes.string.isRequired
};
