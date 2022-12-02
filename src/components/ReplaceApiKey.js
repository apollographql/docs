import PropTypes from 'prop-types';
import React from 'react';
import {useUser} from '../utils';

function recursiveMap(
  children,
  graphRef = '<YOUR_GRAPH_REF>',
  apiKey = '<YOUR_API_KEY>'
) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      if (typeof child === 'string') {
        return child
          .replace(/% apiKey %/g, apiKey)
          .replace(/% graphRef %/g, graphRef);
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
    for (const {account} of user.memberships) {
      for (const {id, variants, apiKeys} of account.graphs) {
        if (apiKeys?.length) {
          const graphRef = `${id}@${variants[0].name}`;
          return [graphRef, apiKeys[0].token];
        }
      }
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
