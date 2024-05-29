import React, {useState} from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Stack,
  Text
} from '@chakra-ui/react';
import {CodeBlock} from '@apollo/chakra-helpers';
import {Tip} from '../Tip';

const CONFIG_WITH_PLACEHOLDERS = `
resources:
  requests:
    memory: '{{memory}}mb'
    cpu: '{{cpu}}m'
  limits:
    memory: '{{memory_limit}}mb'
    # no CPU limit to avoid throttling
`.trim();

const RouterResourceEstimator = () => {
  const [requestRatePerSecond, setRequestRatePerSecond] = useState('');
  const [peakRequestRatePerSecond, setPeakRequestRatePerSecond] = useState('');
  const [baselineSubgraphLatency, setBaselineSubgraphLatency] = useState('100');
  const [clientRequestSize, setClientRequestSize] = useState('0.1');
  const [averageQueryPlanFetchNodes, setAverageQueryPlanFetchNodes] = useState('1');
  const [clientResponseSize, setClientResponseSize] = useState('0.1');
  const [numberOfInstances, setNumberOfInstances] = useState('3');
  const [baseMemory, setBaseMemory] = useState('100');
  const [queryPlannerMemory, setQueryPlannerMemory] = useState('20');

  // Math: Variables and Calculations
  const R = parseFloat(requestRatePerSecond);
  const Rpeak = parseFloat(peakRequestRatePerSecond);
  const Ls = parseFloat(baselineSubgraphLatency) / 1000;
  const Sreq = parseFloat(clientRequestSize);
  const Sres = parseFloat(clientResponseSize);
  // If you average more than 2 subgraphs fetches add a multiplier
  const Sqp = parseFloat(averageQueryPlanFetchNodes) / 2 + 1;
  const I = parseFloat(numberOfInstances);
  const Mb = parseFloat(baseMemory);
  const Mq = parseFloat(queryPlannerMemory);
  const json_deser_rate = 500;
  const json_ser_rate = 900;
  const response_formatting_rate = 900;

  // Latency
  const L =
    Ls +
    Sreq / json_deser_rate +
    Sres / json_deser_rate +
    Sreq / json_ser_rate +
    Sres / json_ser_rate +
    Sres / response_formatting_rate;
  // Rate per vcpu, assuming 80% utilization
  const Rc = 0.8 / (L - Ls);
  // Memory usage per vcpu
  const Mc = (Sreq * Sqp + Sres) * Rc * L;
  // Number of vCPUs needed
  const vBaseline = Math.max(Math.round(R / Rc), 1);
  // Number of vCPUs needed for peak traffic
  const vPeak = Math.max(Math.round(Rpeak / Rc), 1);
  // Double it and add some room for telemetry
  const vBaselineSafe = vBaseline * 2.2;
  // Double it and add some room for telemetry
  const vPeakSafe = vPeak * 2.2;
  // Memory usage for one router instance
  const M = Mb + 2 * Mq + vBaselineSafe * Mc;
  // Memory usage for one router instance at peak traffic
  const Mpeak = Mb + 2 * Mq + vPeakSafe * Mc;

  return (
    <>
      <Flex gap={10} direction={{base: 'column-reverse', lg: 'row'}}>
        <Stack flex={1} spacing={10} width={'100%'} maxW={'500px'}>
          <Heading as="h3" size="lg">
            Parameters
          </Heading>
          // Request Rate per Second
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Request Rate per Second</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    value={requestRatePerSecond}
                    onChange={value => setRequestRatePerSecond(value)}
                    w="100%"
                  >
                    <NumberInputField placeholder={500} />
                  </NumberInput>
                  <InputRightAddon children="RPS" />
                </InputGroup>
                <FormHelperText>
                  Average number of requests per second (RPS) you expect the
                  router to receive
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Peak Request Rate per Second
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Peak Request Rate per Second</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    value={peakRequestRatePerSecond}
                    onChange={value => setPeakRequestRatePerSecond(value)}
                    w="100%"
                  >
                    <NumberInputField placeholder={1000} />
                  </NumberInput>
                  <InputRightAddon children="RPS" />
                </InputGroup>
                <FormHelperText>
                  The highest estimated number of requests per second (RPS) you
                  expect the router to receive
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Baseline Subgraph Latency
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Baseline Subgraph Latency</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    w="100%"
                    value={baselineSubgraphLatency}
                    onChange={value => setBaselineSubgraphLatency(value)}
                  >
                    <NumberInputField placeholder={500} />
                  </NumberInput>
                  <InputRightAddon children="ms" />
                </InputGroup>
                <FormHelperText>
                  The baseline response time of a typical end-to-end response
                  from your graph in milliseconds (ms)
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Client Request Size
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Client Request Size</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    precision={1}
                    step={0.1}
                    min={0.1}
                    w="100%"
                    value={clientRequestSize}
                    onChange={value => setClientRequestSize(value)}
                  >
                    <NumberInputField placeholder={0.1} />
                  </NumberInput>
                  <InputRightAddon children="MB" />
                </InputGroup>
                <FormHelperText>
                  The size of a typical client request in Megabytes (MB)
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Client Request Query Plan Size
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Average Request Query Plan Size</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    precision={1}
                    step={1}
                    min={1}
                    w="100%"
                    value={averageQueryPlanFetchNodes}
                    onChange={value => setAverageQueryPlanFetchNodes(value)}
                  >
                    <NumberInputField placeholder={1} />
                  </NumberInput>
                  <InputRightAddon children="Fetch nodes" />
                </InputGroup>
                <FormHelperText>
                  The average number of fetch nodes (subgraph calls) in your query plans
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Client Response Size
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Client Response Size</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    precision={1}
                    step={0.1}
                    min={0.1}
                    w="100%"
                    value={clientResponseSize}
                    onChange={value => setClientResponseSize(value)}
                  >
                    <NumberInputField placeholder={0.1} />
                  </NumberInput>
                  <InputRightAddon children="MB" />
                </InputGroup>
                <FormHelperText>
                  The size of a typical client response in Megabytes (MB)
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Number of Instances
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Number of Instances</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    w="100%"
                    value={numberOfInstances}
                    onChange={value => setNumberOfInstances(value)}
                  >
                    <NumberInputField placeholder={3} />
                  </NumberInput>
                </InputGroup>
                <FormHelperText>
                  Number of router instances running in parallel
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          <Heading as="h2">Assumptions</Heading>
          // Base Memory
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Base Memory</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    w="100%"
                    value={baseMemory}
                    onChange={value => setBaseMemory(value)}
                  >
                    <NumberInputField placeholder={100} />
                  </NumberInput>
                  <InputRightAddon children="MB" />
                </InputGroup>
                <FormHelperText>
                  The amount of memory a router is configured with in Megabytes
                  (MB)
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
          // Query Planner Memory
          <FormControl>
            <Flex w="100%">
              <FormLabel flex="1">Query Planner Memory</FormLabel>
              <Box flex="1">
                <InputGroup size="sm">
                  <NumberInput
                    min={1}
                    w="100%"
                    value={queryPlannerMemory}
                    onChange={value => setQueryPlannerMemory(value)}
                  >
                    <NumberInputField placeholder={20} />
                  </NumberInput>
                  <InputRightAddon children="MB" />
                </InputGroup>
                <FormHelperText>
                  The amount of memory allocated to the query planner in
                  Megabytes (MB)
                </FormHelperText>
              </Box>
            </Flex>
          </FormControl>
        </Stack>
        <Box flex={1}>
          <Stack
            position={'sticky'}
            top="100px"
            spacing={5}
            width={'100%'}
            maxW={'500px'}
          >
            <Heading as="h3" size="lg">
              Results
            </Heading>
            {(!requestRatePerSecond ||
              !peakRequestRatePerSecond ||
              !baselineSubgraphLatency ||
              !clientRequestSize ||
              !clientResponseSize ||
              !numberOfInstances ||
              !baseMemory ||
              !queryPlannerMemory) && (
              <Tip>Enter parameters to see results.</Tip>
            )}
            <>
              <Text>
                Based on the provided parameters and assumptions, each router
                instance likely requires a minimum of{' '}
                <strong>{vBaselineSafe || '__'} vCPUs</strong> for average
                traffic and a minimum of{' '}
                <strong>{vPeakSafe || '__'} vCPUs</strong> for peak traffic.
              </Text>
              <Text>
                We also recommend <strong>{Math.ceil(M) || '__'}MB</strong> of
                memory per router instance with a limit of{' '}
                <strong>{Math.ceil(Mpeak) || '__'}MB</strong> of memory.
              </Text>
              <Box>
                <br />
                <Heading as="h4" size="md">
                  Kubernetes configuration for a single instance:
                </Heading>
                <br />
                <CodeBlock
                  code={CONFIG_WITH_PLACEHOLDERS.replace(
                    '{{memory}}',
                    Math.ceil(M) || '__'
                  )
                    .replace(
                      '{{cpu}}',
                      Math.ceil(vBaselineSafe / I) * 1000 || '__'
                    )
                    .replace('{{memory_limit}}', Math.ceil(Mpeak) || '__')}
                  showLineNumbers="true"
                  language="yaml"
                ></CodeBlock>
              </Box>
            </>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default RouterResourceEstimator;
