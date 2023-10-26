import PropTypes from 'prop-types';
import React, {createContext, useContext, useMemo} from 'react';

const ApiDocContext = createContext();

export const Provider = ({value, children}) => {
  const allNodes = useMemo(() => {
    const allNodes = {};
    function traverse(node) {
      if (node.canonicalReference) {
        allNodes[node.canonicalReference] = node;
      }
      if (node.constructorMethod) traverse(node.constructorMethod);
      node.properties?.forEach(traverse);
      node.methods?.forEach(traverse);
    }
    value.forEach(traverse);
    return allNodes;
  }, [value]);

  return (
    <ApiDocContext.Provider value={allNodes}>{children}</ApiDocContext.Provider>
  );
};

Provider.propTypes = {
  value: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired
};

export function useApiDocContext(canonicalReference) {
  const ctx = useContext(ApiDocContext);
  if (!ctx)
    throw new Error(
      '`useApiDocContext` can only be used wrapped in `ApiDocContext.Prodiver`!'
    );
  const value = ctx[canonicalReference];
  if (!value)
    throw new Error(
      'No value found for canonicalReference: ' + canonicalReference
    );
  return value;
}
