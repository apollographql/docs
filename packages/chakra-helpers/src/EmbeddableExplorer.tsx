import PropTypes from 'prop-types';
import React from 'react';
import {ApolloExplorer} from '@apollo/explorer/react';
import {Box, useColorMode} from '@chakra-ui/react';
import {outdent} from 'outdent';

type EmbeddableExplorerProps = {
  graphRef?: string;
  document?: string;
};

export const EmbeddableExplorer = ({
  graphRef = 'Apollo-Fullstack-Demo-o3tsz8@current',
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
      <ApolloExplorer
        className="embed"
        graphRef={graphRef}
        persistExplorerState={false}
        initialState={{
          document,
          displayOptions: {
            theme: colorMode
          }
        }}
        //__testLocal__
      />
    </Box>
  );
};

EmbeddableExplorer.propTypes = {
  graphRef: PropTypes.string,
  document: PropTypes.string
};
