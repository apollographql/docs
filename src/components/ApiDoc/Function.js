import PropTypes from 'prop-types';
import React from 'react';
import {ApiDocHeading, DocBlock, ParameterTable, useApiDocContext} from '.';

export function FunctionSignature({
  canonicalReference,
  parameterTypes = false
}) {
  const {displayName, parameters, returnType} =
    useApiDocContext(canonicalReference);
  return (
    <>
      {displayName}(
      {parameters
        .map(
          p =>
            `${p.name}${p.optional ? '?' : ''}${
              parameterTypes ? ': ' + p.type : ''
            }`
        )
        .join(', ')}
      ): {returnType}
    </>
  );
}

FunctionSignature.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  parameterTypes: PropTypes.bool
};

export function FunctionDetails({canonicalReference}) {
  return (
    <>
      <ApiDocHeading canonicalReference={canonicalReference} headingLevel={3} />
      <DocBlock
        canonicalReference={canonicalReference}
        remark
        remarkCollapsible
        example
      />
      <ParameterTable canonicalReference={canonicalReference} />
    </>
  );
}

FunctionDetails.propTypes = {
  canonicalReference: PropTypes.string.isRequired
};
