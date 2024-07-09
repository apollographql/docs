import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Code,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList
} from '@chakra-ui/react';
import {Note} from '../../components/Note';

export const HttpConnection = ({type}) => {
  return (
    <Box>
      <Text mb="6">The router supports {type} connections over:</Text>
      <UnorderedList mb="6" spacing={4}>
        <ListItem>HTTP/1.1</ListItem>
        <ListItem>HTTP/1.1 with TLS</ListItem>
        <ListItem>HTTP/2 with TLS</ListItem>
        <ListItem>
          HTTP/2 Cleartext protocol (h2c). This uses HTTP/2 over plaintext
          connections.
        </ListItem>
      </UnorderedList>
      <Text mb="6">
        Use the table below to look up the resulting protocol of a {type}{' '}
        connection, based on the {type === 'subgraph' ? 'subgraph' : ''} URL and
        the <Code>experimental_http2</Code> configuration:
      </Text>
      <Table variant="simple" mb="6">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>
              URL with <Code>http://</Code>
            </Th>
            <Th>
              URL with <Code>https://</Code>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Code>experimental_http2:</Code>
              <Code> disable</Code>
            </Td>
            <Td>HTTP/1.1</Td>
            <Td>HTTP/1.1 with TLS</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>experimental_http2:</Code>
              <Code> enable</Code>
            </Td>
            <Td>HTTP/1.1</Td>
            <Td>
              Either HTTP/1.1 or HTTP/2 with TLS, as determined by the TLS
              handshake
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>experimental_http2:</Code>
              <Code> http2only</Code>
            </Td>
            <Td>h2c</Td>
            <Td>HTTP/2 with TLS</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>experimental_http2</Code>
              <br />
              not set
            </Td>
            <Td>HTTP/1.1</Td>
            <Td>
              Either HTTP/1.1 or HTTP/2 with TLS, as determined by the TLS
              handshake
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Note>
        <Text>
          Configuring <Code>experimental_http2: http2only</Code> for a{' '}
          {type === 'coprocessor' ? 'network' : 'subgraph'} that doesn&apos;t
          support HTTP/2 results in a failed {type} connection.
        </Text>
      </Note>
    </Box>
  );
};

HttpConnection.propTypes = {
  type: PropTypes.string.isRequired
};
