import {withPrefix} from 'gatsby';
export {wrapPageElement} from './gatsby-ssr';

// The redirects object contains key-value pairs
// where the key is the old URL and the value is the new URL
// e.g.   '/graphos/explorer/connecting-authenticating#scripting': '/graphos/explorer/scripting'

const redirects = {};

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
