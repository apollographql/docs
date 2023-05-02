import PropTypes from 'prop-types';
import React from 'react';
import {ApolloExplorerReact} from '@apollo/explorer';
import {Box, useColorMode} from '@chakra-ui/react';
import {outdent} from 'outdent';

type EmbeddableExplorerProps = {
  graphRef?: string;
  endpointUrl?: string;
  document?: string;
};

export const EmbeddableExplorer = ({
  graphRef = 'Apollo-Fullstack-Demo-o3tsz8@current',
  endpointUrl = 'https://apollo-fullstack-tutorial.herokuapp.com/graphql',
  document = outdent`
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
}: EmbeddableExplorerProps): JSX.Element => {
  const {colorMode} = useColorMode();
  return (
    <Box
      h={450}
      rounded="md"
      sx={{
        '.embed': {
          boxSize: 'full'
        }
      }}
    >
      <ApolloExplorerReact
        // give the component a key or else multiple explorers get rendered when
        // the color mode changes
        key={colorMode}
        className="embed"
        endpointUrl={endpointUrl}
        graphRef={graphRef}
        persistExplorerState={false}
        initialState={{
          document,
          displayOptions: {
            theme: colorMode
          }
        }}
      />
    </Box>
  );
};

EmbeddableExplorer.propTypes = {
  graphRef: PropTypes.string,
  endpointUrl: PropTypes.string,
  document: PropTypes.string
};
