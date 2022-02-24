import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

const DEFAULT_OPTIONS = {
  graphRef: 'Apollo-Fullstack-Demo-o3tsz8@current',
  endpointUrl: 'https://apollo-fullstack-tutorial.herokuapp.com/',
  initialState: {
    document: `
    query GetLaunches {
      launches {
        launches {
          id
          site
          rocket {
            id
            name
          }
        }
      }
    }`
  }
};

export default function EmbeddableExplorer({
  id,
  explorerOptions = DEFAULT_OPTIONS
}) {
  useEffect(() => {
    // Step 1. Create a script element whose src = external script src from Studio Explorer embed
    // TODO: check if there's already an embed explorer script so we don't add extra ones unnecessarily
    const script = document.createElement('script');
    script.src =
      'https://embeddable-explorer.cdn.apollographql.com/_latest/embeddable-explorer.umd.production.min.js';
    script.async = true;

    // add the script to the body
    document.body.appendChild(script);

    // Step 2. Create new instance of EmbeddedExplorer
    // you can copy and paste the contents of the longer `script` tag from the Studio Explorer embed
    // in this example, we have extracted out the config options into a prop so we can reuse this component in other pages
    const onLoad = () => {
      new window.EmbeddedExplorer({...explorerOptions, target: `#${id}`});
    };

    // we need to wait for the external script to load first before configuring our instance of EmbeddedExplorer
    script.addEventListener('load', onLoad);

    // clean up script tag and event listener
    return () => {
      // remove iframe that Studio Explorer appends to our div w/ an `id` attribute
      // to prevent additional iframes from being added (i.e. in local dev w/ hot reloading)
      document.getElementById(id).firstChild.remove();

      script.removeEventListener('load', onLoad);
      document.body.removeChild(script);
    };
  }, [explorerOptions, id]);

  return (
    // Step 3. Paste div from Studio Explorer embed code here
    <div
      style={{
        width: '100%',
        height: '450px',
        border: '0px',
        borderRadius: '4px'
      }}
      id={id}
    ></div>
  );
}

EmbeddableExplorer.propTypes = {
  id: PropTypes.string.isRequired,
  explorerOptions: PropTypes.object
};
