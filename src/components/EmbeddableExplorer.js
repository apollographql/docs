import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {Box, useColorMode} from '@chakra-ui/react';

export default function EmbeddableExplorer({
  graphRef = 'Apollo-Fullstack-Demo-o3tsz8@current',
  endpointUrl = 'https://apollo-fullstack-tutorial.herokuapp.com/graphql',
  document = `
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
    }
  `
}) {
  const containerRef = useRef();
  const {colorMode} = useColorMode();

  useEffect(() => {
    // create a script element whose src = external script src from Explorer embed
    // TODO: check if there's already an embed explorer script so we don't add extra ones unnecessarily
    const script = document.createElement('script');
    script.src =
      'https://embeddable-explorer.cdn.apollographql.com/_latest/embeddable-explorer.umd.production.min.js';
    script.async = true;

    // add the script to the body
    document.body.appendChild(script);

    // create new instance of EmbeddedExplorer
    const target = containerRef.current;
    const onLoad = () =>
      new window.EmbeddedExplorer({
        graphRef,
        endpointUrl,
        initialState: {
          document,
          theme: colorMode
        },
        target
      });

    // we need to wait for the external script to load first before configuring our instance of EmbeddedExplorer
    script.addEventListener('load', onLoad);

    // clean up script tag and event listener
    return () => {
      // remove iframe that Studio Explorer appends to our div w/ an `id` attribute
      // to prevent additional iframes from being added (i.e. in local dev w/ hot reloading)
      target.firstChild.remove();

      script.removeEventListener('load', onLoad);
      document.body.removeChild(script);
    };
  }, [graphRef, endpointUrl, document, colorMode]);

  return <Box ref={containerRef} w="full" h={450} border="none" rounded="md" />;
}

EmbeddableExplorer.propTypes = {
  graphRef: PropTypes.string,
  endpointUrl: PropTypes.string,
  document: PropTypes.string
};
