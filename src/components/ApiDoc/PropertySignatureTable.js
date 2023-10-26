import InlineCode from '../InlineCode';
import PropTypes from 'prop-types';
import React from 'react';
import {DocBlock, FunctionSignature, useApiDocContext} from '.';
import {Table, Tbody, Td, Th, Thead, Tr, chakra} from '@chakra-ui/react';

export function PropertySignatureTable({canonicalReference}) {
  const item = useApiDocContext(canonicalReference);

  return (
    <>
      <div>
        <chakra.h6
          mb="4"
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wider"
        >
          Properties
        </chakra.h6>
        <Table w="auto">
          <Thead>
            <Tr>
              <Th>
                Name /<br />
                Type
              </Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {item.properties.map(property => (
              <Tr key={property.id} fontSize="md">
                <Td sx={{code: {bg: 'none', p: 0}}}>
                  <chakra.h6 fontSize="lg" mb="1">
                    <InlineCode>
                      {property.kind === 'MethodSignature' ? (
                        <FunctionSignature
                          canonicalReference={property.canonicalReference}
                        />
                      ) : (
                        property.displayName
                      )}
                    </InlineCode>
                    {property.optional ? <em> (optional)</em> : null}
                  </chakra.h6>
                  <InlineCode color="tertiary">{property.type}</InlineCode>
                </Td>
                <Td lineHeight="base">
                  <DocBlock canonicalReference={property.canonicalReference} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </>
  );
}

PropertySignatureTable.propTypes = {
  canonicalReference: PropTypes.string.isRequired
};
