import React, { useEffect, useState, useMemo } from "react";
import { ApolloExplorerReact } from "@apollo/explorer";
import { gql, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { CodeBlock } from "@apollo/chakra-helpers";
import ExpansionPanel from "./ExpansionPanel";
import {
  Alert,
  FormLabel,
  AlertIcon,
  Switch,
  Stack,
  Text,
  Box,
  Select,
  Flex,
  Textarea,
} from "@chakra-ui/react";

const getViableVariants = (graphList) =>
  graphList.reduce(
    (agg, currGraph) => [
      ...agg,
      ...currGraph.variants
        .filter((v) => v.url)
        .map((v) => ({ ...v, displayName: `${currGraph.name} / ${v.name}` })),
    ],
    []
  );

export default function WYSIWYGExplorer() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapseDocs, setCollapseDocs] = useState(true);
  const [showHeaders, setShowHeaders] = useState(false);
  const [persistState, setPersistState] = useState(false);
  const [defaultQuery, setDefaultQuery] =
    useState(`query ExampleQuery($id: ID!) {
  user(id: $id) {
    id
  }
}`);
  const [defaultVariables, setDefaultVariables] = useState(`{
  "id": "user1"
}`);

  const { data, loading } = useQuery(gql`
    query ExplorerDocsWYSIWYG {
      me {
        ... on User {
          id
          memberships {
            account {
              id
              name
              graphs: services {
                id
                name
                variants {
                  id
                  name
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedGraph, setSelectedGraph] = useState();

  useEffect(() => {
    if (data && data.me && data.me.memberships.length > 0) {
      const selectedOrg = data.me.memberships[0].account;
      setSelectedOrg(selectedOrg);
      const vv = getViableVariants(selectedOrg.graphs);
      if (vv.length > 0) {
        setSelectedGraph(vv[0]);
      }
    }
  }, [data]);

  const viableVariants = useMemo(
    () => (selectedOrg ? getViableVariants(selectedOrg.graphs) : []),
    [selectedOrg]
  );

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : data && data.me ? (
        <>
          <Stack spacing="0">
            <Text fontWeight="600" mb="2">
              Studio Graph Selection
            </Text>

            <Flex>
              <FormLabel fontSize="md" htmlFor="organization" flex="1">
                Organization
              </FormLabel>
              <Select
                flex="2"
                id="organization"
                size="sm"
                value={selectedOrg ? selectedOrg.id : undefined}
                onChange={(e) => {
                  const membership = data.me.memberships.find(
                    (m) => m.account.id === e.target.value
                  );
                  const org = membership.account;
                  if (org) {
                    setSelectedOrg(org);
                    const vv = getViableVariants(org.graphs);
                    if (vv.length > 0) {
                      setSelectedGraph(vv[0]);
                    } else {
                      setSelectedGraph(undefined);
                    }
                  }
                }}
              >
                {data.me.memberships.map((m) => (
                  <option key={m.account.id} value={m.account.id}>
                    {m.account.name}
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex>
              <FormLabel fontSize="md" htmlFor="graph-ref" flex="1">
                Graph / Variant
              </FormLabel>
              <Select
                flex="2"
                id="graph=ref"
                size="sm"
                value={selectedGraph ? selectedGraph.id : undefined}
                onChange={(e) => {
                  const variant = viableVariants.find(
                    (v) => v.id === e.target.value
                  );
                  setSelectedGraph(variant);
                }}
                disabled={viableVariants.length === 0}
              >
                {viableVariants.length > 0 ? (
                  viableVariants.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.displayName}
                    </option>
                  ))
                ) : (
                  <option selected disabled>
                    This org has no graphs with the Explorer configured
                  </option>
                )}
              </Select>
            </Flex>
          </Stack>

          <Flex gap="8" mt="8">
            <Stack spacing="0" flex="1">
              <Text fontWeight="600" mb="2">
                Display Options
              </Text>

              <Flex>
                <FormLabel fontSize="md" htmlFor="dark-mode" flex="1">
                  Dark mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  size="md"
                  isChecked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                />
              </Flex>

              <Flex>
                <FormLabel fontSize="md" htmlFor="collapse-docs" flex="1">
                  Collapse docs panel
                </FormLabel>
                <Switch
                  size="md"
                  id="collapse-docs"
                  isChecked={collapseDocs}
                  onChange={() => setCollapseDocs(!collapseDocs)}
                />
              </Flex>

              <Flex>
                <FormLabel fontSize="md" htmlFor="hide-headers" flex="1">
                  Hide Headers and Environment Variables
                </FormLabel>
                <Switch
                  size="md"
                  id="hide-headers"
                  isChecked={!showHeaders}
                  onChange={() => setShowHeaders(!showHeaders)}
                />
              </Flex>
            </Stack>

            <Stack spacing="0" flex="1">
              <Text fontWeight="600" mb="2">
                Persist client-side state between page loads
              </Text>

              <Flex>
                <FormLabel fontSize="md" htmlFor="persist-state" flex="1">
                  Save client-side changes that a user makes in embedded
                  Explorer between page loads (via local storage).
                </FormLabel>
                <Switch
                  size="md"
                  id="persist-state"
                  isChecked={persistState}
                  onChange={() => setPersistState(!persistState)}
                />
              </Flex>
            </Stack>
          </Flex>

          <Flex gap="8" mt="8">
            <Stack spacing="0" flex="1">
              <Text fontWeight="600" mb="2">
                Default query
              </Text>

              <Textarea
                height="32"
                value={defaultQuery}
                onChange={(e) => setDefaultQuery(e.target.value)}
              />
            </Stack>

            <Stack spacing="0" flex="1">
              <Text fontWeight="600" mb="2">
                Default variables (JSON format)
              </Text>

              <Textarea
                height="32"
                defaultValue={defaultVariables}
                onChange={(e) => {
                  try {
                    if (e.target.value) {
                      JSON.parse(e.target.value);
                      setDefaultVariables(e.target.value);
                    } else {
                      setDefaultVariables(undefined);
                    }
                  } catch (err) {
                    // nothing
                  }
                }}
              />
            </Stack>
          </Flex>

          <Text fontWeight="600" mb="2" mt="8">
            Embedded Explorer Preview
          </Text>
          {selectedGraph ? (
            <Box
              h={500}
              borderColor="primary"
              sx={{
                ".embed": {
                  boxSize: "full",
                },
              }}
            >
              <ApolloExplorerReact
                className="embed"
                graphRef={selectedGraph.id}
                endpointUrl={selectedGraph.url}
                persistExplorerState={false}
                initialState={{
                  document: defaultQuery,
                  variables: defaultVariables
                    ? JSON.parse(defaultVariables)
                    : undefined,
                  headers: {},
                  persistExplorerState: persistState,
                  displayOptions: {
                    showHeadersAndEnvVars: showHeaders,
                    docsPanelState: collapseDocs ? "closed" : "open",
                    theme: isDarkMode ? "dark" : "light",
                  },
                }}
              />
            </Box>
          ) : (
            "Not available"
          )}

          <Text fontWeight="600" mb="2" mt="8">
            Embed Code
          </Text>

          <Text mb="4">
            The following sections contain code snippets for embedding the
            Explorer with the configuration you've specified above in different
            environments:
          </Text>

          {selectedGraph ? (
            <>
              <ExpansionPanel title="React">
                <CodeBlock
                  language="jsx"
                  showLineNumbers
                  code={`import { ApolloExplorerReact } from '@apollo/explorer';
  
function App() {
  return (
    <ApolloExplorerReact 
      graphRef='${selectedGraph.id}'
      endpointUrl='${selectedGraph.url}'
      persistExplorerState={false}
      initialState={{
        document: \`${defaultQuery}\`,
        variables: ${defaultVariables},
        headers: {},
        displayOptions: {
          showHeadersAndEnvVars: ${showHeaders}, 
          docsPanelState: '${collapseDocs ? "closed" : "open"}',
          theme: '${isDarkMode ? "dark" : "light"}',
        },
      }}
    />
  );
}`}
                ></CodeBlock>
              </ExpansionPanel>
              <ExpansionPanel title="HTML">
                <CodeBlock
                  language="html"
                  showLineNumbers
                  code={`<div style="position:absolute;left:0;right:0;top:0;bottom:0" id='root'></div>
<script src="https://embeddable-explorer.cdn.apollographql.com/_latest/embeddable-explorer.umd.production.min.js"></script>
<script>
new window.EmbeddedExplorer({
  target: "#root",
  graphRef: "${selectedGraph.id}",
  endpointUrl: "${selectedGraph.url}",
  persistExplorerState: ${persistState},
  initialState: {
    document: \`${defaultQuery}\`,
    variables: ${defaultVariables},
    headers: {},
    displayOptions: {
      showHeadersAndEnvVars: ${showHeaders},
      docsPanelState: "${collapseDocs ? "closed" : "open"}",
      theme: "${isDarkMode ? "dark" : "light"}",
    },
  },
});
</script>`}
                ></CodeBlock>
              </ExpansionPanel>
              <ExpansionPanel title="JavaScript">
                <CodeBlock
                  language="javascript"
                  showLineNumbers
                  code={`import { ApolloExplorer } from '@apollo/explorer';
// ...

new ApolloExplorer({
  target: '#root',
  graphRef: '${selectedGraph.id}',
  endpointUrl: '${selectedGraph.url}',
  persistExplorerState: ${persistState},
  initialState: {
    document: \`${defaultQuery}\`,
    variables: ${defaultVariables},
    headers: {},
    displayOptions: {
      showHeadersAndEnvVars: ${showHeaders}, 
      docsPanelState: '${collapseDocs ? "closed" : "open"}', 
      theme: '${isDarkMode ? "dark" : "light"}',
    },
  },
});

// ...
<div id="root"/>`}
                ></CodeBlock>
              </ExpansionPanel>
            </>
          ) : (
            "Not available"
          )}
        </>
      ) : (
        <>
          <Alert status="warning" mb="8">
            <AlertIcon />
            You are not logged into Studio. Please log in and then come back
            here to use the WYSIWYG wizard.
          </Alert>
          <Button
            size="md"
            colorScheme="indigo"
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            href="https://studio.apollographql.com/"
          >
            Log Into Studio
          </Button>
        </>
      )}
    </div>
  );
}
