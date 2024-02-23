import PropTypes from 'prop-types';
import React, {createContext} from 'react';
import {Box, Table, Tbody, Th, Thead, Tr} from '@chakra-ui/react';

export const PropertyListContext = createContext();

export function PropertyList({kind, children}) {
  if (kind === 'fieldTable') {
    return (
      <PropertyListContext.Provider value={kind}>
        <Box borderRadius={4} borderWidth={1} overflow="auto">
          <Table class="field-table api-ref">
            <Thead>
              <Tr>
                <Th>
                  Name /<br />
                  Type
                </Th>
                <Th>Description</Th>
              </Tr>
            </Thead>

            <Tbody>{children}</Tbody>
          </Table>
        </Box>
      </PropertyListContext.Provider>
    );
  }
  if (kind === 'errCodes') {
    return (
      <PropertyListContext.Provider value={kind}>
        <Box borderRadius={4} borderWidth={1} overflow="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Code</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>

            <Tbody>{children}</Tbody>
          </Table>
        </Box>
      </PropertyListContext.Provider>
    );
  }
  return null;
}

PropertyList.propTypes = {
  kind: PropTypes.string,
  children: PropTypes.node
};
