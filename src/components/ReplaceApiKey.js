import PropTypes from 'prop-types';
import React from 'react';
import reactStringReplace from 'react-string-replace';
import {FiChevronDown} from 'react-icons/fi';
import {useUser} from '../utils';

function recursiveMap(
  children,
  graphRef = '<YOUR_GRAPH_REF>',
  apiKey = '<YOUR_API_KEY>'
) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      if (typeof child === 'string') {
        return (
          <>
            {reactStringReplace(child, /% apiKey %/g, () => (
              <span>
                {apiKey} <FiChevronDown />
              </span>
            ))}
          </>
        );
      }

      return child;
    }

    return React.cloneElement(
      child,
      child.props,
      recursiveMap(child.props.children, graphRef, apiKey)
    );
  });
}

function findApiKey(user) {
  if (user) {
    const [graph] = user.memberships
      .flatMap(({account}) => account.graphs)
      .filter(graph => graph.apiKeys?.length)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    if (graph) {
      const {id, variants, apiKeys} = graph;
      const graphRef = `${id}@${variants[0].name}`;
      return [graphRef, apiKeys[0].token];
    }
  }

  return [];
}

export function ReplaceApiKey({children}) {
  const {user} = useUser();
  return <>{recursiveMap(children, ...findApiKey(user))}</>;
}

ReplaceApiKey.propTypes = {
  children: PropTypes.node.isRequired
};
