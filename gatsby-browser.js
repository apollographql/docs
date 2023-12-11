import {withPrefix} from 'gatsby';
export {wrapPageElement} from './gatsby-ssr';

// The redirects object contains key-value pairs
// where the key is the old URL and the value is the new URL
// e.g.   '/graphos/explorer/connecting-authenticating#scripting': '/graphos/explorer/scripting'

const redirects = {
  '/graphos/explorer/connecting-authenticating#scripting':
    '/graphos/explorer/scripting',
  '/graphos/explorer/connecting-authenticating#script-types':
    '/graphos/explorer/scripting#script-types',
  '/graphos/explorer/connecting-authenticating#important-considerations-for-explorer-scripts':
    '/graphos/explorer/scripting#script-types',
  '/graphos/explorer/connecting-authenticating#preflight-scripts':
    '/graphos/explorer/scripting#preflight-scripts',
  '/graphos/explorer/connecting-authenticating#creating-preflight-scripts':
    '/graphos/explorer/scripting#add-preflight-scripts',
  '/graphos/explorer/connecting-authenticating#disabling-preflight-scripts':
    '/graphos/explorer/scripting#turn-off-preflight-scripts',
  '/graphos/explorer/connecting-authenticating#operation-scripts':
    '/graphos/explorer/scripting#operation-scripts',
  '/graphos/explorer/connecting-authenticating#creating-operation-scripts':
    '/graphos/explorer/scripting#add-operation-scripts',
  '/graphos/explorer/connecting-authenticating#enabling-operation-scripts':
    '/graphos/explorer/scripting#turn-on-operation-scripts',
  '/graphos/explorer/connecting-authenticating#chaining-operations':
    '/graphos/explorer/scripting#chaining-operations',
  '/graphos/explorer/connecting-authenticating#scripting-api-reference':
    '/graphos/explorer/scripting#scripting-api-reference',
  '/graphos/explorer/connecting-authenticating#examples':
    '/graphos/explorer/scripting#examples',
  '/graphos/explorer/connecting-authenticating#operation-scripts-1':
    '/graphos/explorer/scripting#examples'
};

const prefixedRedirects = Object.fromEntries(
  Object.entries(redirects).map(([from, to]) => [
    withPrefix(from),
    withPrefix(to)
  ])
);

export const onRouteUpdate = ({location}) => {
  // Client-side redirects for links with anchors
  if (location.hash.length > 0) {
    const path = location.pathname + location.hash;
    if (path in prefixedRedirects) {
      const redirectURL =
        location.origin + prefixedRedirects[path] + location.search;
      window.location.replace(redirectURL);
    }
  }
};
