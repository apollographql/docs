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
    '/graphos/explorer/scripting#examples',
  '/graphos/delivery/contracts/#setup': '/graphos/delivery/contract-setup',
  '/graphos/delivery/contracts/#automatic-updates':
    '/graphos/delivery/contract-setup#automatic-updates',
  '/graphos/delivery/contracts/#editing-a-contract':
    '/graphos/delivery/contract-setup#edit-contracts',
  '/graphos/delivery/contracts/#contract-checks':
    '/graphos/delivery/contract-setup#contract-checks',
  '/graphos/delivery/contracts/#failing-contract-checks':
    '/graphos/delivery/contract-setup#failing-contract-checks',
  '/graphos/delivery/contracts/#1-update-your-router-and-subgraphs':
    '/graphos/delivery/contract-setup#update-your-router-and-subgraphs',
  '/graphos/delivery/contracts/#2-fed1-enable-variant-support-for-tag':
    '/graphos/delivery/contract-setup#fed1-only-enable-variant-support-for-tag',
  '/graphos/delivery/contracts/#3-add-tags':
    '/graphos/delivery/contract-setup#1-add-tags-to-subgraph-schemas',
  '/graphos/delivery/contracts/#4-publish-updated-subgraph-schemas':
    '/graphos/delivery/contract-setup#2-publish-updated-subgraph-schemass',
  '/graphos/delivery/contracts/#5-create-a-contract':
    '/graphos/delivery/contract-setup#3-create-a-contract',
  '/graphos/delivery/contracts/#6-use-your-new-contract-variant':
    '/graphos/delivery/contract-setup#using-contract-variants',
  '/graphos/delivery/contracts/#rules-for-tags-and-contracts':
    '/graphos/delivery/contract-reference#rules-for-tags-and-contracts',
  '/graphos/delivery/contracts/#valid-tag-locations':
    '/graphos/delivery/contract-reference#valid-tag-locations',
  '/graphos/delivery/contracts/#valid-tag-names':
    '/graphos/delivery/contract-reference#valid-tag-names',
  '/graphos/delivery/contracts/#dependent-tags':
    '/graphos/delivery/contract-reference#dependent-tags',
  '/graphos/delivery/contracts/#special-cases-for-filtering':
    '/graphos/delivery/contract-reference#special-cases-for-filtering',
  '/graphos/delivery/contracts/#error-types':
    '/graphos/delivery/contract-reference#errors'
};

const normalizeUrl = url => {
  // Remove the trailing slash before the hash
  return url.replace(/\/#/, '#');
};

const normalizedRedirects = Object.fromEntries(
  Object.entries(redirects).map(([from, to]) => [
    normalizeUrl(withPrefix(from)),
    withPrefix(to)
  ])
);

export const onRouteUpdate = ({location}) => {
  if (location.hash.length > 0) {
    const normalizedPath = normalizeUrl(location.pathname + location.hash);
    if (normalizedPath in normalizedRedirects) {
      const redirectURL =
        location.origin + normalizedRedirects[normalizedPath] + location.search;
      window.location.replace(redirectURL);
    }
  }
};
