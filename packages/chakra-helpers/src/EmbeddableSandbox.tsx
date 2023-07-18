import React from 'react';
import {ApolloSandbox} from '@apollo/sandbox/react';
import {Box, useColorMode} from '@chakra-ui/react';
import {outdent} from 'outdent';

type EmbeddableSandboxProps = {
  initialEndpoint?: string;
  document?: string;
  height?: number;
};

export const EmbeddableSandbox = ({
  initialEndpoint = 'http://localhost:4000',
  document = outdent`
    query MyQuery {
    }
  `,
  height = 450
}: EmbeddableSandboxProps): JSX.Element => {
  const {colorMode} = useColorMode();
  return (
    <Box
      h={height}
      rounded="md"
      sx={{
        '.embed': {
          boxSize: 'full'
        }
      }}
    >
      <ApolloSandbox
        // give the component a key or else multiple explorers get rendered when
        // the color mode changes
        key={colorMode}
        className="embed"
        initialEndpoint={initialEndpoint}
        initialState={{
          document
        }}
      />
    </Box>
  );
};
