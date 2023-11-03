import PropTypes from 'prop-types';
import React, {createContext, useContext, useMemo} from 'react';

const ApiDocContext = createContext();

export const Provider = ({value, children}) => {
  const allNodes = useMemo(() => {
    const allNodes = {};
    function traverse(node) {
      if (
        node.canonicalReference &&
        Object.keys(node).length >
          Object.keys(allNodes[node.canonicalReference] || {}).length
      ) {
        allNodes[node.canonicalReference] = node;
      }
      node.children?.forEach(traverse);
      node.references?.forEach(n => n.target && traverse(n.target));
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

export function useApiDocContext() {
  const ctx = useContext(ApiDocContext);
  if (!ctx)
    throw new Error(
      '`useApiDocContext` can only be used wrapped in `ApiDocContext.Prodiver`!'
    );
  /**
   * @param {string | { canonicalReference: string }} canonicalReference
   * @param {boolean} throwIfNotFound
   */
  return function getItem(canonicalReference, throwIfNotFound = true) {
    if (!canonicalReference) return null;
    if (typeof canonicalReference !== 'string') {
      // eslint-disable-next-line prefer-destructuring
      canonicalReference = canonicalReference.canonicalReference;
    }
    const value = ctx[canonicalReference];
    if (throwIfNotFound && !value)
      throw new Error(
        'No value found for canonicalReference: ' + canonicalReference
      );
    return value;
  };
}
