export {wrapPageElement} from './gatsby-ssr';

// // gatsby-browser.js
export const onRouteUpdate = ({location}) => {
  // Client-side redirects for links with anchors
  if (location.hash.length > 0) {
    const path = location.pathname + location.hash;
    if (path in redirects) {
      const redirectURL = location.origin + redirects[path] + location.search;
      window.location.replace(redirectURL);
    }
  }
};

// The redirects object contains key-value pairs
// where the key is the old URL and the value is the new URL
// e.g.   '/graphos/explorer/connecting-authenticating#scripting': '/graphos/explorer/scripting'

const redirects = {};
