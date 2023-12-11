import {withPrefix} from 'gatsby';
export {wrapPageElement} from './gatsby-ssr';

// The redirects object contains key-value pairs
// where the key is the old URL and the value is the new URL
// e.g.   '/graphos/explorer/connecting-authenticating#scripting': '/graphos/explorer/scripting'

const redirects = {};

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
