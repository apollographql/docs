import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { ApolloExplorerReact } from "@apollo/explorer";

const EmbeddableExplorer = ({
  graphRef = "Apollo-Fullstack-Demo-o3tsz8@current",
  endpointUrl = "https://apollo-fullstack-tutorial.herokuapp.com/graphql",
  initialDocument = `query GetLaunches {
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
  }`,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      w="full"
      h={450}
      border="none"
      rounded="md"
      sx={{
        ".embed": {
          width: "100%",
          height: "100%",
        },
      }}
    >
      <ApolloExplorerReact
        className="embed"
        endpointUrl={endpointUrl}
        graphRef={graphRef}
        persistExplorerState={false}
        initialState={{
          displayOptions: {
            theme: colorMode,
          },
          document: initialDocument,
        }}
      />
    </Box>
  );
};

export default EmbeddableExplorer;